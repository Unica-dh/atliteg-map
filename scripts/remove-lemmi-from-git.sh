#!/bin/bash
# Script di Rimozione Sicura File Lemmi da Git
# ATTENZIONE: Eseguire SOLO dopo aver letto LEMMI_DATA_SECURITY_PLAN.md

set -e  # Exit on error

BACKUP_DIR="$HOME/atliteg-lemmi-backup-$(date +%Y%m%d-%H%M%S)"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🔐 RIMOZIONE SICURA FILE LEMMI DA GIT"
echo "======================================"
echo ""
echo "Questo script eseguirà:"
echo "  1. Backup file lemmi"
echo "  2. Aggiornamento .gitignore"
echo "  3. Rimozione file da git tracking"
echo "  4. Commit delle modifiche"
echo ""
echo "⚠️  NON rimuove dallo storico (Fase 5 - manuale)"
echo "⚠️  NON fa force push (Fase 6 - manuale)"
echo ""
read -p "Vuoi continuare? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ Operazione annullata"
    exit 1
fi

cd "$REPO_DIR"

# ===========================================
# FASE 1: BACKUP
# ===========================================
echo ""
echo "📦 FASE 1: Backup file lemmi"
echo "----------------------------"

mkdir -p "$BACKUP_DIR"
echo "✅ Directory backup: $BACKUP_DIR"

# Backup data/
if [ -f "data/lemmi.json" ]; then
    cp -v data/lemmi.json "$BACKUP_DIR/"
fi
cp -v data/*.csv "$BACKUP_DIR/" 2>/dev/null || true

# Backup server/data/
if [ -f "lemmario-dashboard/server/data/lemmi.json" ]; then
    cp -v lemmario-dashboard/server/data/lemmi.json "$BACKUP_DIR/lemmi-server.json"
fi

# Backup public/data/ (se ancora presenti)
cp -v lemmario-dashboard/public/data/lemmi.json "$BACKUP_DIR/lemmi-public.json" 2>/dev/null || true
cp -v lemmario-dashboard/public/data/Lemmi_*.csv "$BACKUP_DIR/" 2>/dev/null || true

echo ""
echo "📋 File nel backup:"
ls -lh "$BACKUP_DIR/"

# ===========================================
# FASE 2: .GITIGNORE
# ===========================================
echo ""
echo "📝 FASE 2: Aggiornamento .gitignore"
echo "-----------------------------------"

# Verifica se le regole esistono già
if grep -q "DATI SENSIBILI - NON TRACCIARE MAI" .gitignore 2>/dev/null; then
    echo "⚠️  Regole già presenti in .gitignore"
else
    cat >> .gitignore << 'EOF'

# ========================================
# DATI SENSIBILI - NON TRACCIARE MAI!
# ========================================

# File lemmi (dati sensibili)
**/lemmi.json
**/Lemmi_*.csv
**/*lemmi*.csv
**/*lemmi*.json

# Directory dati sensibili
data/*.csv
data/*.json
!data/*.geojson
!data/limits_IT_regions.geojson

# Backend data (solo server runtime)
lemmario-dashboard/server/data/*.json
lemmario-dashboard/server/data/*.csv
!lemmario-dashboard/server/data/.gitkeep
!lemmario-dashboard/server/data/geojson.json

# Public data (non dovrebbero esistere)
lemmario-dashboard/public/data/*.csv
lemmario-dashboard/public/data/lemmi.json
lemmario-dashboard/public/data/Lemmi_*.csv

# Upload e backup (runtime only)
lemmario-dashboard/server/uploads/*
!lemmario-dashboard/server/uploads/.gitkeep

# Build output con dati
lemmario-dashboard/out/data/

# Test files
test_*.csv
*_test.csv
*_TEST.csv
playwright_test.csv

# Deleted files
deleted/

EOF
    echo "✅ .gitignore aggiornato"
fi

# ===========================================
# FASE 3: RIMOZIONE DA GIT
# ===========================================
echo ""
echo "🗑️  FASE 3: Rimozione file da git tracking"
echo "------------------------------------------"

# Lista file da rimuovere
FILES_TO_REMOVE=(
    "data/lemmi.json"
    "data/Lemmi_forme_atliteg.csv"
    "data/Lemmi_forme_atliteg_updated.csv"
    "data/Lemmi_forme_atliteg_updated.backup.csv"
    "data/Lemmi_forme_atliteg_TEST.csv"
    "lemmario-dashboard/public/data/lemmi.json"
    "lemmario-dashboard/public/data/Lemmi_forme_atliteg.csv"
    "lemmario-dashboard/public/data/Lemmi_forme_atliteg_updated.csv"
    "lemmario-dashboard/server/data/lemmi.json"
    "test_10_lemmi.csv"
    "playwright_test.csv"
)

for file in "${FILES_TO_REMOVE[@]}"; do
    if git ls-files --error-unmatch "$file" >/dev/null 2>&1; then
        echo "Rimuovo: $file"
        git rm --cached "$file" 2>/dev/null || echo "  ⚠️  Non tracciato: $file"
    else
        echo "  ⏭️  Non in git: $file"
    fi
done

# ===========================================
# FASE 4: COMMIT
# ===========================================
echo ""
echo "💾 FASE 4: Commit delle modifiche"
echo "---------------------------------"

git add .gitignore

# Verifica cosa verrà committato
echo ""
echo "📋 File che saranno committati:"
git status --short

echo ""
read -p "Procedere con il commit? (yes/no): " CONFIRM_COMMIT

if [ "$CONFIRM_COMMIT" != "yes" ]; then
    echo "❌ Commit annullato"
    echo "⚠️  Usa 'git reset' per annullare le modifiche"
    exit 1
fi

git commit -m "security: remove sensitive lemmi data files from tracking

- Remove all lemmi.json and Lemmi_*.csv from git tracking
- Add comprehensive .gitignore rules for sensitive data
- Files remain on local filesystem but not in git
- BREAKING: Users must provide their own lemmi data files

SECURITY: These files contain sensitive research data and must not be in version control.

Affected files:
- data/lemmi.json
- data/Lemmi_*.csv
- lemmario-dashboard/public/data/lemmi.json
- lemmario-dashboard/public/data/Lemmi_*.csv
- lemmario-dashboard/server/data/lemmi.json
- test_10_lemmi.csv

Backup created in: $BACKUP_DIR"

echo ""
echo "✅ FASE 1-4 COMPLETATE!"
echo ""
echo "📍 PROSSIMI PASSI (MANUALI):"
echo ""
echo "1. Verifica commit:"
echo "   git log -1 --stat"
echo ""
echo "2. Verifica file rimossi:"
echo "   git ls-files | grep -i lemmi | grep -E '\.(csv|json)$'"
echo "   (dovrebbe essere vuoto o solo package*.json)"
echo ""
echo "3. FASE 5 - Rimuovere dallo storico (CRITICO):"
echo "   Leggi docs/security/LEMMI_DATA_SECURITY_PLAN.md"
echo "   Usa git-filter-repo o BFG Repo-Cleaner"
echo ""
echo "4. FASE 6 - Force push:"
echo "   git push origin UI-for-csv-upload --force"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Backup salvato in: $BACKUP_DIR"
echo "   - File ancora presenti su disco locale"
echo "   - NON ancora rimossi dallo storico git"
echo "   - Coordinate con il team prima del force push"
echo ""
