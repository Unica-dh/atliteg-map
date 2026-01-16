#!/bin/bash
# Script Rimozione File Lemmi dallo Storico Git
# ATTENZIONE: Questo script RISCRIVE la storia git!
# Eseguire SOLO dopo aver completato fasi 1-4

set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "⚠️  RIMOZIONE FILE DALLO STORICO GIT"
echo "====================================="
echo ""
echo "🔴 ATTENZIONE: Questo script RISCRIVE la storia git!"
echo ""
echo "Prerequisiti:"
echo "  ✅ Fase 1-4 completate (remove-lemmi-from-git.sh)"
echo "  ✅ Backup repository (.git.backup)"
echo "  ✅ Team coordinato e informato"
echo "  ✅ Nessun lavoro in sospeso"
echo ""
read -p "Hai completato tutti i prerequisiti? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ Operazione annullata"
    exit 1
fi

cd "$REPO_DIR"

# Verifica git-filter-repo
if ! command -v git-filter-repo &> /dev/null; then
    echo "❌ git-filter-repo non installato"
    echo ""
    echo "Installazione:"
    echo "  pip3 install git-filter-repo"
    echo "  oppure"
    echo "  brew install git-filter-repo (macOS)"
    echo ""
    exit 1
fi

# ===========================================
# BACKUP .GIT
# ===========================================
echo ""
echo "📦 Backup repository git"
echo "------------------------"

if [ -d ".git.backup" ]; then
    echo "⚠️  Backup già esistente (.git.backup)"
    read -p "Sovrascrivere? (yes/no): " OVERWRITE
    if [ "$OVERWRITE" == "yes" ]; then
        rm -rf .git.backup
    else
        echo "❌ Operazione annullata"
        exit 1
    fi
fi

cp -r .git .git.backup
echo "✅ Backup creato: .git.backup"
echo "   Dimensione: $(du -sh .git | cut -f1)"

# ===========================================
# ANALISI PRE-RIMOZIONE
# ===========================================
echo ""
echo "🔍 Analisi file da rimuovere"
echo "----------------------------"

echo "File lemmi nello storico git:"
git log --all --full-history --pretty=format: --name-only -- "*lemmi*.json" "*Lemmi_*.csv" | sort -u | grep -E "\.(csv|json)$" || echo "Nessuno trovato (già rimossi?)"

echo ""
echo "Dimensione repository prima:"
du -sh .git

# ===========================================
# RIMOZIONE CON git-filter-repo
# ===========================================
echo ""
echo "🗑️  Rimozione file dallo storico"
echo "--------------------------------"

# File patterns da rimuovere
PATTERNS=(
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

echo "Rimozione in corso..."
for pattern in "${PATTERNS[@]}"; do
    echo "  - $pattern"
    git filter-repo --path "$pattern" --invert-paths --force 2>/dev/null || echo "    ⚠️  Pattern non trovato"
done

# ===========================================
# CLEANUP
# ===========================================
echo ""
echo "🧹 Pulizia repository"
echo "--------------------"

git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "Dimensione repository dopo:"
du -sh .git

# ===========================================
# VERIFICA
# ===========================================
echo ""
echo "✅ Verifica rimozione"
echo "--------------------"

echo ""
echo "1. File lemmi ancora presenti nello storico:"
git log --all --full-history -- "*lemmi*.json" "*Lemmi_*.csv" 2>/dev/null || echo "   ✅ Nessuno (OK!)"

echo ""
echo "2. File attualmente tracciati:"
git ls-files | grep -i lemmi | grep -E "\.(csv|json)$" || echo "   ✅ Nessuno (OK! Solo package*.json sono OK)"

echo ""
echo "✅ FASE 5 COMPLETATA!"
echo ""
echo "📍 PROSSIMI PASSI:"
echo ""
echo "1. Verifica manuale:"
echo "   git log --all --oneline | head -20"
echo "   git log --all --full-history -- '*lemmi*'"
echo ""
echo "2. Test locale:"
echo "   git clone . ../test-clone"
echo "   cd ../test-clone && git log --all --full-history -- '*lemmi*'"
echo ""
echo "3. Se tutto OK, FASE 6 - Force push:"
echo "   git remote add origin <url>"
echo "   git push origin UI-for-csv-upload --force"
echo "   git push origin master --force  # se necessario"
echo ""
echo "⚠️  IMPORTANTE dopo force push:"
echo "   Tutti i collaboratori devono:"
echo "   - git fetch origin"
echo "   - git reset --hard origin/UI-for-csv-upload"
echo "   - git clean -fd"
echo ""
echo "💾 RECOVERY in caso di problemi:"
echo "   rm -rf .git && mv .git.backup .git"
echo ""
