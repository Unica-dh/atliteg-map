#!/bin/bash
set -e

echo "🚀 Inizializzazione Dev Container atliteg-map..."

# 1. Installa dipendenze root (CSV processing)
echo "📦 Installazione dipendenze root..."
npm ci --prefix . 2>/dev/null || echo "⚠️ Root package.json non ha dipendenze"

# 2. Installa dipendenze Next.js
echo "📦 Installazione dipendenze lemmario-dashboard..."
cd /workspaces/atliteg-map/lemmario-dashboard
npm ci

# 3. Preprocessing dati (converte CSV → JSON ottimizzato)
echo "🔄 Preprocessing dati..."
npm run preprocess || echo "⚠️ Preprocessamento non eseguito (verifica dati)"

# 4. Verifica struttura
echo "✅ Verifica struttura..."
if [ -f "public/data/lemmi.json" ]; then
  echo "✓ lemmi.json trovato ($(du -h public/data/lemmi.json | cut -f1))"
else
  echo "⚠️ lemmi.json non trovato - crea il file prima di eseguire build"
fi

echo ""
echo "=========================================="
echo "✨ Dev Container pronto!"
echo "=========================================="
echo ""
echo "📍 Comandi disponibili:"
echo "   cd lemmario-dashboard"
echo "   npm run dev      # Start dev server (localhost:3000)"
echo "   npm run build    # Build per Nginx"
echo "   npm run start    # Serve build statico"
echo ""
echo "🐳 Per testare Docker:"
echo "   docker compose up -d"
echo "   # App disponibile su localhost:9000"
echo ""
