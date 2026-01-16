# 🔄 Come Vedere i Dati Aggiornati Dopo Upload CSV

## ✅ L'upload funziona correttamente!

Il sistema processa correttamente il CSV e aggiorna i dati nel backend.
Il problema è che il **browser usa cache** e non mostra i dati aggiornati immediatamente.

## 🎯 Procedura Corretta per Vedere i Nuovi Dati

Dopo aver caricato un CSV con successo:

### Metodo 1: Hard Refresh (CONSIGLIATO) ⭐

1. Chiudi la pagina admin
2. Vai alla homepage (`http://localhost:9000`)
3. **Forza il refresh** del browser:
   - **Windows/Linux**: `Ctrl + Shift + R` oppure `Ctrl + F5`
   - **Mac**: `Cmd + Shift + R`
4. Attendi 2-3 secondi per il caricamento
5. ✅ I nuovi dati saranno visibili!

### Metodo 2: Cancella Cache Browser

1. Apri DevTools (`F12`)
2. Vai alla tab **Application** (Chrome) o **Storage** (Firefox)
3. Click destro su cache entries → **Clear**
4. Oppure: Settings → Privacy → Clear browsing data → Cached images and files
5. Ricarica la pagina

### Metodo 3: Modalità Incognito

1. Apri una nuova finestra in **modalità incognito/privata**
2. Vai a `http://localhost:9000`
3. I dati saranno freschi (no cache)

### Metodo 4: DevTools Network (Per Sviluppatori)

1. Apri DevTools (`F12`)
2. Vai alla tab **Network**
3. Spunta "**Disable cache**"
4. Tieni i DevTools aperti
5. Ricarica la pagina

## 🔍 Come Verificare che i Dati Siano Aggiornati

### Verifica Visuale
- Controlla il **numero di lemmi** nella dashboard
- Verifica i **marker sulla mappa**
- Cerca uno dei lemmi che hai caricato

### Verifica Tecnica (DevTools)

1. Apri DevTools (`F12`)
2. Vai alla tab **Network**
3. Filtra per `lemmi`
4. Ricarica la pagina
5. Click sulla richiesta `/api/lemmi`
6. Guarda il **Response**:
   ```json
   [
     {"Lemma": "tuo_lemma", ...},
     ...
   ]
   ```
7. Verifica che ci siano i **tuoi dati**

### Verifica da Terminale

```bash
# Quanti record ci sono ora?
curl -s "http://localhost:9000/api/lemmi" \
  -H "X-API-Key: default_dev_key" | \
  python3 -c "import sys,json; print(f'Record: {len(json.load(sys.stdin))}')"

# Quali sono i primi lemmi?
curl -s "http://localhost:9000/api/lemmi" \
  -H "X-API-Key: default_dev_key" | \
  python3 -c "import sys,json; data=json.load(sys.stdin); print('Lemmi:', ', '.join([d['Lemma'] for d in data[:10]]))"
```

## 🐛 Troubleshooting

### "Vedo ancora i vecchi dati dopo hard refresh"

**Causa**: Il backend potrebbe non essere aggiornato.

**Soluzione**:
```bash
# 1. Verifica i dati nel backend
docker compose exec backend node -e "
  const fs = require('fs');
  const data = JSON.parse(fs.readFileSync('/app/data/lemmi.json'));
  console.log('Record nel backend:', data.length);
  console.log('Primi lemmi:', data.slice(0,5).map(l => l.Lemma).join(', '));
"

# 2. Se i dati sono vecchi, riavvia il backend
docker compose restart backend

# 3. Aspetta 10 secondi
sleep 10

# 4. Riprova hard refresh nel browser
```

### "L'upload dice 'completed' ma i dati non cambiano"

**Causa**: Potrebbe esserci un problema con il volume Docker.

**Soluzione**:
```bash
# 1. Controlla l'ultima modifica del file
docker compose exec backend stat /app/data/lemmi.json

# 2. Se la data è vecchia, c'è un problema con il volume
# Riavvia completamente:
docker compose down
docker compose up -d

# 3. Rifai l'upload
```

### "Errore durante l'upload"

**Causa**: File CSV malformato o troppo grande.

**Soluzione**:
- Verifica che il CSV abbia tutte le colonne richieste
- Dimensione massima: 10 MB
- Encoding: UTF-8
- Formato: CSV con virgole come separatori

## 📋 Checklist Completa Upload → Visualizzazione

- [ ] 1. Login admin (`http://localhost:9000/admin/upload`)
- [ ] 2. Carica CSV
- [ ] 3. Attendi "Processamento completato"
- [ ] 4. Verifica numero record processati
- [ ] 5. Chiudi pagina admin
- [ ] 6. Vai alla homepage
- [ ] 7. **Hard refresh** (`Ctrl + Shift + R`)
- [ ] 8. Attendi caricamento (2-3 secondi)
- [ ] 9. Verifica numero lemmi nella dashboard
- [ ] 10. Verifica marker sulla mappa

## 🚀 Soluzione Permanente (Automatica)

Per evitare questo problema in futuro, puoi:

### Opzione 1: Usare sempre Modalità Incognito
```
- Apri sempre http://localhost:9000 in modalità incognito
- Nessuna cache, dati sempre freschi
```

### Opzione 2: Disabilita Cache Permanentemente (DevTools)
```
1. Apri DevTools (F12)
2. Settings (⚙️) → Preferences
3. Spunta "Disable cache (while DevTools is open)"
4. Tieni sempre i DevTools aperti
```

### Opzione 3: Riavvia Container Frontend (Più lento)
```bash
# Dopo ogni upload, se non vedi i dati:
docker compose restart lemmario-dashboard
# Aspetta 10 secondi, poi ricarica pagina
```

## 💡 Best Practice

1. **Sviluppo Locale**:
   - Usa sempre DevTools con cache disabilitata
   - Hard refresh frequenti
   
2. **Produzione**:
   - Implementare versioning degli asset
   - Service Worker per cache management
   - Header Cache-Control appropriati

3. **Workflow Consigliato**:
   ```
   Upload CSV → Verifica API (terminale) → Hard Refresh Browser
   ```

## ✅ Test Rapido

Per verificare che tutto funzioni:

```bash
# 1. Upload un CSV di test
cat > /tmp/quick_test.csv << 'EOF'
IdLemma,Lemma,Forma,CollGeografica,Latitudine,Longitudine,TipoCollGeografica,Anno,Periodo,IDPeriodo,Datazione,Categoria,Frequenza,URL,IdAmbito,RegionIstatCode
999,quicktest,quicktest,Roma,41.9,12.5,Città,2026,XXI secolo,21,Sec. XXI,Test,1,http://test,,
EOF

# 2. Fai login e upload
TOKEN=$(curl -s -X POST http://localhost:9000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' | \
  python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

curl -X POST http://localhost:9000/api/admin/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/tmp/quick_test.csv"

# 3. Aspetta 2 secondi
sleep 2

# 4. Verifica API
curl -s "http://localhost:9000/api/lemmi" \
  -H "X-API-Key: default_dev_key" | \
  python3 -c "import sys,json; data=json.load(sys.stdin); print('✅ Record:', len(data)); print('Lemma:', data[0]['Lemma'] if data else 'VUOTO')"

# 5. Se vedi "quicktest", funziona!
# Ora vai al browser e fai HARD REFRESH (Ctrl+Shift+R)
```

---

**Ricorda**: Il browser **ama la cache**! 😄  
Dopo ogni upload, il **hard refresh è tuo amico**! 💪
