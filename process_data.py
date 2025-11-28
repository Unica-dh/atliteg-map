import json
import csv
import os

GEOJSON_FILE = 'data/Ambiti geolinguistici newline.json'
CSV_FILE = 'data/Lemmi_forme_atliteg.csv'
OUTPUT_FILE = 'data/Lemmi_forme_atliteg_updated.csv'

def load_area_mapping(geojson_path):
    """
    Loads the GeoJSON (NDJSON) file and creates a mapping from 'dialetto' to 'id'.
    """
    mapping = {}
    print(f"Loading GeoJSON from {geojson_path}...")
    try:
        with open(geojson_path, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                if not line:
                    continue
                try:
                    feature = json.loads(line)
                    props = feature.get('properties', {})
                    area_id = props.get('id')
                    area_name = props.get('dialetto')
                    
                    if area_id is not None and area_name:
                        mapping[area_name] = area_id
                except json.JSONDecodeError as e:
                    print(f"Warning: Could not parse line {line_num}: {e}")
    except FileNotFoundError:
        print(f"Error: File not found: {geojson_path}")
        return {}
        
    print(f"Loaded {len(mapping)} area mappings.")
    return mapping

def process_csv(csv_path, output_path, area_mapping):
    """
    Reads the CSV, adds 'IdAmbito' column based on 'Coll.Geografica' and area_mapping,
    and writes to output_path.
    """
    print(f"Processing CSV from {csv_path}...")
    
    try:
        with open(csv_path, 'r', encoding='utf-8', newline='') as f_in:
            # Detect dialect if possible, but standard csv usually works
            reader = csv.DictReader(f_in)
            fieldnames = reader.fieldnames
            
            if 'IdAmbito' not in fieldnames:
                fieldnames.append('IdAmbito')
            
            rows = []
            unmatched_areas = set()
            matched_count = 0
            
            for row in reader:
                geo_type = row.get('Tipo coll.Geografica')
                geo_coll = row.get('Coll.Geografica')
                
                # Default empty
                row['IdAmbito'] = ''
                
                if geo_type != 'Città':
                    if geo_coll in area_mapping:
                        row['IdAmbito'] = area_mapping[geo_coll]
                        matched_count += 1
                    else:
                        unmatched_areas.add(geo_coll)
                
                rows.append(row)
                
        print(f"Processed {len(rows)} rows.")
        print(f"Matched {matched_count} area rows.")
        if unmatched_areas:
            print(f"Warning: The following areas were not found in GeoJSON: {unmatched_areas}")
            
        print(f"Writing output to {output_path}...")
        with open(output_path, 'w', encoding='utf-8', newline='') as f_out:
            writer = csv.DictWriter(f_out, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
            
        print("Done.")
        
    except FileNotFoundError:
        print(f"Error: File not found: {csv_path}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    if not os.path.exists(GEOJSON_FILE):
        print(f"Error: GeoJSON file not found at {GEOJSON_FILE}")
    elif not os.path.exists(CSV_FILE):
        print(f"Error: CSV file not found at {CSV_FILE}")
    else:
        mapping = load_area_mapping(GEOJSON_FILE)
        process_csv(CSV_FILE, OUTPUT_FILE, mapping)
