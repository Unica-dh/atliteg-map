# 🧪 Come Testare la Visualizzazione Regioni

## 🚀 Avvio Rapido

```bash
cd /home/ale/docker/atliteg-map/lemmario-dashboard
npm run dev
```

Apri il browser su: **http://localhost:3000**

## 🎯 Test 1: Lemma "aggiazzata" (Solo Regione)

### Passaggi:
1. Nella barra di ricerca, scrivi: **aggiazzata**
2. Premi Invio o clicca sulla lente

### Risultato Atteso:
✅ **Confine Sicilia** visibile sulla mappa in colore **giallo/arancione**
✅ **Nessun marker** (il lemma ha coordinate #N/A)
✅ **Counter** in alto a destra: "1 locations • 1 lemmas"

### Interazione:
- **Click sul confine** → Popup con:
  - Titolo: "Sicilia (Regione)"
  - Lista dei lemmi: aggiazzata con forme (aggiazzate, aggiazziata, aggiazzata)
  - Dettagli: Anno, Periodo, Categoria, Frequenza

### Screenshot Atteso:
```
┌─────────────────────────────────────┐
│  🔍 aggiazzata        [Search]      │
├─────────────────────────────────────┤
│                                     │
│          🗺️  MAPPA                  │
│                                     │
│       ╔═════════════╗               │
│       ║             ║  ← Confine    │
│       ║  Sicilia    ║     Sicilia   │
│       ║   (giallo)  ║               │
│       ╚═════════════╝               │
│                                     │
│          1 locations • 1 lemmas     │
└─────────────────────────────────────┘
```

---

## 🎯 Test 2: Lemma "agliata" (Regioni + Città)

### Passaggi:
1. Scrivi: **agliata**
2. Premi Invio

### Risultato Atteso:
✅ **3 confini regionali** visibili:
  - **Lazio** (giallo)
  - **Toscana** (giallo)
  - **Lombardia** (giallo)

✅ **19 marker blu** per le città:
  - Napoli
  - Firenze
  - Genova
  - Roma
  - Venezia
  - Bologna
  - Ferrara
  - etc.

✅ **Counter**: "22 locations • 24 lemmas"
   (19 città + 3 regioni = 22 locations)

### Interazione:
- **Click sui marker città** → Popup con lemmi di quella città
- **Click sui confini regionali** → Popup con lemmi della regione

---

## 🎯 Test 3: Verificare Console Browser

### Passaggi:
1. Apri DevTools (F12)
2. Vai su tab "Console"
3. Cerca "aggiazzata"

### Log Attesi:
```
✅ Regioni caricate: 20 regioni
✅ Dati JSON caricati: 6236 record in XXms
```

### Verifica Dati:
Nel console, digita:
```javascript
// Verifica lemmi con regione
const lemmi = document.querySelector('[data-lemmi]'); // o accedi ai dati
console.log(lemmi.filter(l => l.RegionIstatCode));
```

---

## 🎯 Test 4: Stili Visivi

### Verifica Colori:

| Elemento | Colore Fill | Colore Bordo | Dove Testare |
|----------|-------------|--------------|--------------|
| **Marker Città** | Blu (#3b82f6) | Blu scuro (#1e40af) | Cerca "pasta" |
| **Poligoni** | Blu (#3b82f6) | Blu (#2563eb) | Cerca con IdAmbito |
| **Regioni** | **Giallo (#fbbf24)** | **Arancione (#f59e0b)** | **Cerca "aggiazzata"** |
| **Regioni (hover)** | Arancione (#f59e0b) | Arancione scuro (#d97706) | Passa mouse su regione |

---

## 🎯 Test 5: Tutte le Regioni

### Lemmi per testare ogni regione:

| Regione | Codice ISTAT | Lemma da Cercare | Record |
|---------|--------------|------------------|--------|
| **Lombardia** | 03 | agliata | 140 |
| **Veneto** | 05 | vino (filtra) | 8 |
| **Toscana** | 09 | agliata | 200 |
| **Lazio** | 12 | agliata | 181 |
| **Sicilia** | 19 | **aggiazzata** | **70** |

### Come Testare Tutte:
```bash
# Cerca ogni lemma e verifica che il confine appaia
1. agliata     → Vedi Lombardia, Toscana, Lazio
2. aggiazzata  → Vedi Sicilia
3. (filtra con filtri per vedere Veneto se presente)
```

---

## 🐛 Troubleshooting

### Problema: Non vedo i confini regionali

**Possibili cause:**

1. **GeoJSON non caricato**
   - Console error: "Failed to load regions"
   - **Fix**: Verifica che `/public/data/limits_IT_regions.geojson` esista

2. **Lemmi senza RegionIstatCode**
   - **Fix**: Verifica che `lemmi.json` contenga il campo
   ```bash
   grep -o "RegionIstatCode" public/data/lemmi.json | wc -l
   # Deve essere > 0
   ```

3. **Campo non mappato**
   - **Fix**: Verifica in `scripts/preprocess-data.js` linea 42:
   ```javascript
   'reg_istat_code': 'RegionIstatCode',  // Deve esistere
   ```

### Problema: Confini non gialli ma blu

**Causa**: Stile non applicato correttamente

**Fix**: Verifica in `GeographicalMap.tsx` righe 463-468:
```typescript
style={{
  fillColor: isHighlighted ? '#f59e0b' : '#fbbf24',  // Giallo!
  fillOpacity: isHighlighted ? 0.4 : 0.25,
  color: isHighlighted ? '#d97706' : '#f59e0b',      // Arancione!
  weight: isHighlighted ? 3 : 2,
}}
```

### Problema: Counter sbagliato

**Causa**: `regionBoundaries.length` non incluso nel totale

**Fix**: Verifica linea 324:
```typescript
const totalLocations = markers.length + polygons.length + regionBoundaries.length;
```

---

## ✅ Checklist Test Completa

Prima di considerare completato:

- [ ] Server avviato senza errori
- [ ] Console mostra "✅ Regioni caricate: 20 regioni"
- [ ] Cerca "aggiazzata" → Vedo confine Sicilia **giallo**
- [ ] Click su confine → Popup con "Sicilia (Regione)"
- [ ] Cerca "agliata" → Vedo 3 confini + marker città
- [ ] Confini hanno colore diverso dai marker (giallo vs blu)
- [ ] Hover su confine → Opacità aumenta
- [ ] Popup regione mostra tutti i lemmi corretti
- [ ] Counter aggiornato correttamente
- [ ] Nessun errore in console

---

## 📸 Screenshot di Successo

### Test "aggiazzata" OK:
```
✅ 1 confine giallo (Sicilia)
✅ 0 marker blu
✅ Click confine → Popup "Sicilia (Regione)"
✅ Console: "✅ Regioni caricate: 20 regioni"
```

### Test "agliata" OK:
```
✅ 3 confini gialli (Lazio, Toscana, Lombardia)
✅ 19 marker blu (città)
✅ Counter: "22 locations • 24 lemmas"
✅ Click confine Lombardia → 14 lemmi visualizzati
```

---

## 🎓 Comandi Utili

### Verificare dati:
```bash
# Contare lemmi con regione
node -e "const d=require('./public/data/lemmi.json'); \
  console.log('Con regione:', d.filter(l=>l.RegionIstatCode).length)"

# Vedere regioni uniche
node -e "const d=require('./public/data/lemmi.json'); \
  const r=new Set(d.filter(l=>l.RegionIstatCode).map(l=>l.RegionIstatCode)); \
  console.log('Regioni:', Array.from(r).sort())"

# Verificare "aggiazzata"
node -e "const d=require('./public/data/lemmi.json'); \
  console.log(d.find(l=>l.Lemma==='aggiazzata'))"
```

### Rigenerare dati se necessario:
```bash
# Se modifichi il CSV
cp ../data/Lemmi_forme_atliteg_updated.csv public/data/
node scripts/preprocess-data.js
```

---

## 🚀 Pronto per Testare!

```bash
cd lemmario-dashboard
npm run dev
```

Buon test! 🎉

---

**Nota**: Se tutti i test passano, il sistema è completamente funzionante e pronto per la produzione.
