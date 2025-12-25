#!/bin/bash

# Script diagnostico per verificare la visualizzazione dei layer regionali
# Uso: ./scripts/diagnose-regions.sh [SERVER_URL]

SERVER_URL="${1:-http://90.147.144.147:9000}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 DIAGNOSI LAYER REGIONALI - AtLiTeG Map"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Server: $SERVER_URL"
echo "📅 Data: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# Test 1: Verifica accessibilità server
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📡 TEST 1: Accessibilità Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SERVER_URL")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Server accessibile (HTTP $HTTP_CODE)"
else
    echo "❌ Server non accessibile (HTTP $HTTP_CODE)"
    exit 1
fi
echo ""

# Test 2: Verifica file limits_IT_regions.geojson
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🗺️  TEST 2: File GeoJSON Regioni"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

REGIONS_URL="$SERVER_URL/data/limits_IT_regions.geojson"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$REGIONS_URL")

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ File GeoJSON accessibile (HTTP $HTTP_CODE)"

    # Scarica e analizza il file
    REGIONS_DATA=$(curl -s "$REGIONS_URL")

    # Conta regioni usando node
    node -e "
        const data = $REGIONS_DATA;
        console.log('   📊 Totale regioni:', data.features.length);

        // Verifica Sicilia
        const sicilia = data.features.find(f => f.properties.reg_name === 'Sicilia');
        if (sicilia) {
            console.log('   ✅ Sicilia presente (codice ISTAT:', sicilia.properties.reg_istat_code + ')');
        } else {
            console.log('   ❌ Sicilia NON trovata');
        }

        // Elenca tutte le regioni
        console.log('   📋 Regioni presenti:');
        data.features.forEach(f => {
            console.log('      -', f.properties.reg_name, '(codice:', f.properties.reg_istat_code + ')');
        });
    "
else
    echo "❌ File GeoJSON NON accessibile (HTTP $HTTP_CODE)"
    echo "   URL: $REGIONS_URL"
fi
echo ""

# Test 3: Verifica file lemmi.json
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📄 TEST 3: File Lemmi JSON"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

LEMMI_URL="$SERVER_URL/data/lemmi.json"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$LEMMI_URL")

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ File lemmi.json accessibile (HTTP $HTTP_CODE)"

    # Analizza i dati
    LEMMI_DATA=$(curl -s "$LEMMI_URL")

    node -e "
        const data = $LEMMI_DATA;
        console.log('   📊 Totale lemmi:', data.length);

        // Conta lemmi con RegionIstatCode
        const lemmiConRegione = data.filter(l => l.RegionIstatCode && l.RegionIstatCode.trim() !== '');
        console.log('   📍 Lemmi con RegionIstatCode:', lemmiConRegione.length);

        // Conta lemmi per regione
        const regionCounts = {};
        lemmiConRegione.forEach(l => {
            const code = l.RegionIstatCode;
            regionCounts[code] = (regionCounts[code] || 0) + 1;
        });

        console.log('   📈 Distribuzione per regione:');
        Object.entries(regionCounts)
            .sort((a, b) => b[1] - a[1])
            .forEach(([code, count]) => {
                console.log('      - Codice', code + ':', count, 'lemmi');
            });

        // Verifica Sicilia (codice 19)
        const siciliaLemmi = data.filter(l => l.RegionIstatCode === '19');
        console.log('');
        if (siciliaLemmi.length > 0) {
            console.log('   ✅ Lemmi dalla Sicilia:', siciliaLemmi.length);
            console.log('   📝 Esempio:', siciliaLemmi[0].Lemma, '-', siciliaLemmi[0].CollGeografica);
        } else {
            console.log('   ❌ Nessun lemma dalla Sicilia trovato');
        }
    "
else
    echo "❌ File lemmi.json NON accessibile (HTTP $HTTP_CODE)"
fi
echo ""

# Test 4: Verifica componente React (hook useRegions)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚛️  TEST 4: Componente React - useRegions Hook"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "   ℹ️  Verifica nel codice sorgente..."
if grep -q "useRegions" lemmario-dashboard/components/GeographicalMap.tsx; then
    echo "   ✅ Hook useRegions importato in GeographicalMap.tsx"
else
    echo "   ❌ Hook useRegions NON trovato in GeographicalMap.tsx"
fi

if grep -q "regionBoundaries" lemmario-dashboard/components/GeographicalMap.tsx; then
    echo "   ✅ Variabile regionBoundaries presente"
else
    echo "   ❌ Variabile regionBoundaries NON trovata"
fi

if grep -q "getRegionCodesFromLemmas" lemmario-dashboard/components/GeographicalMap.tsx; then
    echo "   ✅ Funzione getRegionCodesFromLemmas utilizzata"
else
    echo "   ❌ Funzione getRegionCodesFromLemmas NON trovata"
fi
echo ""

# Test 5: Verifica build del progetto
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏗️  TEST 5: Verifica Build"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "lemmario-dashboard/out" ]; then
    echo "   ✅ Directory out/ esiste"

    # Verifica se il file è stato buildato
    if [ -f "lemmario-dashboard/out/index.html" ]; then
        echo "   ✅ index.html presente nel build"
    else
        echo "   ❌ index.html NON trovato nel build"
    fi
else
    echo "   ⚠️  Directory out/ non trovata (potrebbe essere una build diversa)"
fi
echo ""

# Test 6: Verifica console browser (istruzioni per l'utente)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 TEST 6: Verifica Console Browser (MANUALE)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Apri il browser su: $SERVER_URL"
echo ""
echo "Poi apri la Console del Browser (F12) e cerca:"
echo ""
echo "1️⃣  Cerca nel console log:"
echo "   '✅ Regioni caricate: XX regioni'"
echo ""
echo "2️⃣  Se NON vedi questo messaggio, cerca errori come:"
echo "   '❌ Errore caricamento regioni:'"
echo ""
echo "3️⃣  Verifica nella tab Network (F12 → Network):"
echo "   - Cerca la richiesta a: /data/limits_IT_regions.geojson"
echo "   - Verifica che lo status sia 200 OK"
echo "   - Verifica la dimensione del file (circa 2.8MB)"
echo ""
echo "4️⃣  Nella console, esegui questo comando per debug:"
echo "   localStorage.setItem('debug', 'true')"
echo "   Poi ricarica la pagina (F5)"
echo ""

# Test 7: Riepilogo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RIEPILOGO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Se tutti i test sopra sono ✅ ma i layer NON si vedono:"
echo ""
echo "1️⃣  Problema: Il componente React potrebbe non renderizzare"
echo "   Soluzione: Verifica console browser per errori JavaScript"
echo ""
echo "2️⃣  Problema: I filtri potrebbero nascondere i layer"
echo "   Soluzione: Rimuovi tutti i filtri attivi"
echo ""
echo "3️⃣  Problema: Cache del browser"
echo "   Soluzione: Svuota cache (Ctrl+Shift+Delete) e ricarica (Ctrl+F5)"
echo ""
echo "4️⃣  Problema: Il container Docker usa una versione vecchia"
echo "   Soluzione: Ricostruisci il container:"
echo "   ssh dhruby@90.147.144.147"
echo "   cd /path/to/atliteg-map"
echo "   docker compose build --no-cache"
echo "   docker compose up -d"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Diagnosi completata!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
