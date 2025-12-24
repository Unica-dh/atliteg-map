# ⚡ Comandi Rapidi - Integrazione Regioni

## 🚀 Verifica Installazione

```bash
# Verifica che tutto sia configurato correttamente
./scripts/verify-installation.sh
```

**Output atteso:** ✅ TUTTO OK! (15/15 test passati)

## 🧪 Test e Validazione

```bash
# Eseguire tutti i test di validazione
node scripts/test-region-codes.js

# Output atteso:
# ✅ TUTTI I TEST SUPERATI!
# Regioni con dati: 5/20
# Record regionali totali: 599
```

## 🎮 Demo Interattiva

```bash
# Vedere come funziona il sistema end-to-end
node scripts/e2e-demo.js

# Mostra:
# - Ricerca di lemmi (es. "agliata", "pasta")
# - Estrazione codici regionali
# - Filtro GeoJSON
# - Preparazione dati per mappa
```

## 🔄 Rieseguire Aggiornamento

```bash
# Se necessario riprocessare il CSV
node scripts/update-region-codes.js

# Crea automaticamente:
# - Backup del CSV originale
# - CSV aggiornato con reg_istat_code
# - Statistiche di esecuzione
```

## 📊 Ispezione Dati

```bash
# Vedere l'header del CSV
head -1 data/Lemmi_forme_atliteg_updated.csv

# Vedere esempi di regioni con codice ISTAT
grep ',Regione,' data/Lemmi_forme_atliteg_updated.csv | head -10

# Contare lemmi per tipo
grep ',Regione,' data/Lemmi_forme_atliteg_updated.csv | wc -l

# Estrarre regioni uniche
grep ',Regione,' data/Lemmi_forme_atliteg_updated.csv | \
  cut -d',' -f4 | sort | uniq
```

## 🔧 Manutenzione

```bash
# Ripristinare il CSV originale
cp data/Lemmi_forme_atliteg_updated.backup.csv \
   data/Lemmi_forme_atliteg_updated.csv

# Reinstallare dipendenze
npm install csv-parser csv-writer

# Verificare file GeoJSON
head -50 data/limits_IT_regions.geojson | jq .
```

## 📚 Documentazione

```bash
# Leggere il README principale
cat README_INTEGRAZIONE_REGIONI.md

# Leggere il piano di integrazione
cat PIANO_INTEGRAZIONE_REGIONI.md

# Vedere esempi di integrazione frontend
cat ESEMPIO_INTEGRAZIONE_FRONTEND.md

# Vedere le statistiche complete
cat RIEPILOGO_PROGETTO_REGIONI.md
```

## 🎯 Workflow Tipico

### 1. Verifica Iniziale
```bash
./scripts/verify-installation.sh
```

### 2. Esegui Test
```bash
node scripts/test-region-codes.js
```

### 3. Vedi Demo
```bash
node scripts/e2e-demo.js
```

### 4. Leggi Documentazione
```bash
cat README_INTEGRAZIONE_REGIONI.md
```

## 🐛 Debug

```bash
# Se i test falliscono, controlla:

# 1. Numero di righe nel CSV
wc -l data/Lemmi_forme_atliteg_updated.csv
# Atteso: 6237 (6236 dati + 1 header)

# 2. Presenza colonna reg_istat_code
head -1 data/Lemmi_forme_atliteg_updated.csv | grep -o 'reg_istat_code'
# Atteso: reg_istat_code

# 3. Numero di regioni mappate
grep ',Regione,' data/Lemmi_forme_atliteg_updated.csv | wc -l
# Atteso: 599

# 4. Esistenza backup
ls -lh data/Lemmi_forme_atliteg_updated.backup.csv
# Deve esistere
```

## 📝 Script Disponibili

| Script | Descrizione | Comando |
|--------|-------------|---------|
| `verify-installation.sh` | Verifica installazione | `./scripts/verify-installation.sh` |
| `update-region-codes.js` | Aggiorna CSV | `node scripts/update-region-codes.js` |
| `test-region-codes.js` | Test validazione | `node scripts/test-region-codes.js` |
| `e2e-demo.js` | Demo interattiva | `node scripts/e2e-demo.js` |

## 💡 Tips

### Controllo Rapido
```bash
# One-liner per verificare tutto
./scripts/verify-installation.sh && \
node scripts/test-region-codes.js && \
echo "✅ Sistema funzionante!"
```

### Statistiche Rapide
```bash
# Mostra distribuzione regioni
grep ',Regione,' data/Lemmi_forme_atliteg_updated.csv | \
  cut -d',' -f4 | sort | uniq -c | sort -rn
```

### Cerca Lemma Specifico
```bash
# Trova un lemma e mostra se ha codice regionale
grep -i "agliata" data/Lemmi_forme_atliteg_updated.csv | \
  grep ',Regione,'
```

## ❓ FAQ Commands

**Q: Come verifico che il CSV sia aggiornato?**
```bash
head -1 data/Lemmi_forme_atliteg_updated.csv | \
  grep -q 'reg_istat_code' && echo "✅ Aggiornato" || echo "❌ Non aggiornato"
```

**Q: Quanti lemmi hanno un codice regionale?**
```bash
grep ',Regione,' data/Lemmi_forme_atliteg_updated.csv | wc -l
# Output: 599
```

**Q: Quali regioni sono coperte?**
```bash
grep ',Regione,' data/Lemmi_forme_atliteg_updated.csv | \
  cut -d',' -f4 | sort | uniq
# Output: Lazio, Lombardia, Sicilia, Toscana, Veneto
```

**Q: Il backup esiste?**
```bash
ls data/Lemmi_forme_atliteg_updated.backup.csv && \
  echo "✅ Backup presente"
```

## 🎓 Esempi Pratici

### Trovare tutti i lemmi della Lombardia
```bash
grep ',Lombardia,.*,Regione,' data/Lemmi_forme_atliteg_updated.csv
```

### Contare lemmi per regione
```bash
for region in Lombardia Veneto Toscana Lazio Sicilia; do
  count=$(grep ",$region,.*,Regione," data/Lemmi_forme_atliteg_updated.csv | wc -l)
  echo "$region: $count lemmi"
done
```

### Verificare codici ISTAT assegnati
```bash
grep ',Regione,' data/Lemmi_forme_atliteg_updated.csv | \
  grep -o ',[0-9][0-9]$' | sort | uniq -c
```

---

**Nota:** Tutti i comandi assumono che tu sia nella directory principale del progetto (`/home/ale/docker/atliteg-map`)
