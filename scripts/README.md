# Scripts Utility

Questa cartella contiene script di utilità per la gestione del progetto AtLiTeG Map.

## 📜 Script Disponibili

### `generate-password-hash.js`

Genera un hash bcrypt per la password admin in modo interattivo.

**Uso**:
```bash
npm run generate-password-hash
```

Lo script ti chiederà:
1. Inserisci la password desiderata
2. Genera automaticamente l'hash bcrypt
3. Ti mostra il codice già pronto da copiare nel `.env`

**Output esempio**:
```
🔐 Generatore Hash Password Admin

Inserisci la password da hashare: ********

⏳ Generazione hash in corso...

✅ Hash generato con successo!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aggiungi questa riga al tuo file .env:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ADMIN_PASSWORD_HASH=$$2b$$10$$abcdef...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Note**:
- L'hash è già escaped con `$$` per Docker Compose
- Basta copiarlo direttamente nel file `.env`
- Ricorda di commentare/rimuovere `ADMIN_PASSWORD` se usi l'hash

---

## 🚀 Quick Start

Prima di usare gli script, installa le dipendenze:

```bash
npm install
```

Poi puoi eseguire qualsiasi script:

```bash
npm run <nome-script>
```

## 📝 Note

Tutti gli script sono progettati per essere facili da usare e fornire feedback chiaro durante l'esecuzione.
