#!/bin/bash

# Script di verifica rapida dell'installazione
# Controlla che tutto sia configurato correttamente

echo "════════════════════════════════════════════════════════"
echo "  VERIFICA INTEGRAZIONE CODICI REGIONALI"
echo "════════════════════════════════════════════════════════"
echo ""

# Colori
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contatori
CHECKS_PASSED=0
CHECKS_FAILED=0

# Funzione per check
check() {
    local name="$1"
    local command="$2"

    echo -n "  Checking $name... "

    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC}"
        ((CHECKS_FAILED++))
        return 1
    fi
}

echo -e "${BLUE}1. File necessari${NC}"
check "CSV aggiornato" "[ -f data/Lemmi_forme_atliteg_updated.csv ]"
check "Backup CSV" "[ -f data/Lemmi_forme_atliteg_updated.backup.csv ]"
check "GeoJSON regioni" "[ -f data/limits_IT_regions.geojson ]"
check "Script aggiornamento" "[ -f scripts/update-region-codes.js ]"
check "Script test" "[ -f scripts/test-region-codes.js ]"
check "Script demo" "[ -f scripts/e2e-demo.js ]"
echo ""

echo -e "${BLUE}2. Dipendenze Node.js${NC}"
check "csv-parser installato" "npm list csv-parser 2>&1 | grep -q csv-parser"
check "csv-writer installato" "npm list csv-writer 2>&1 | grep -q csv-writer"
echo ""

echo -e "${BLUE}3. Struttura CSV${NC}"
# Verifica che la colonna reg_istat_code esista
CSV_HEADER=$(head -1 data/Lemmi_forme_atliteg_updated.csv)
if echo "$CSV_HEADER" | grep -q "reg_istat_code"; then
    echo -e "  Colonna reg_istat_code... ${GREEN}✓${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "  Colonna reg_istat_code... ${RED}✗${NC}"
    ((CHECKS_FAILED++))
fi

# Conta righe con codice regionale (usando grep per evitare problemi con virgole)
REGION_CODES=$(grep ',Regione,' data/Lemmi_forme_atliteg_updated.csv | wc -l)
if [ "$REGION_CODES" -eq 599 ]; then
    echo -e "  Codici ISTAT assegnati (599)... ${GREEN}✓${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "  Codici ISTAT assegnati ($REGION_CODES)... ${RED}✗ (attesi 599)${NC}"
    ((CHECKS_FAILED++))
fi
echo ""

echo -e "${BLUE}4. Documentazione${NC}"
check "README principale" "[ -f README_INTEGRAZIONE_REGIONI.md ]"
check "Piano integrazione" "[ -f PIANO_INTEGRAZIONE_REGIONI.md ]"
check "Esempio frontend" "[ -f ESEMPIO_INTEGRAZIONE_FRONTEND.md ]"
check "Riepilogo progetto" "[ -f RIEPILOGO_PROGETTO_REGIONI.md ]"
check "README script" "[ -f scripts/README_REGION_CODES.md ]"
echo ""

echo "════════════════════════════════════════════════════════"
echo -e "  ${GREEN}Passed: $CHECKS_PASSED${NC}  ${RED}Failed: $CHECKS_FAILED${NC}"
echo "════════════════════════════════════════════════════════"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ TUTTO OK! L'integrazione è completa e funzionante.${NC}"
    echo ""
    echo "Prossimi passi:"
    echo "  • Esegui i test:  node scripts/test-region-codes.js"
    echo "  • Vedi la demo:   node scripts/e2e-demo.js"
    echo "  • Leggi il README: cat README_INTEGRAZIONE_REGIONI.md"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Alcuni controlli falliti. Verifica i file sopra.${NC}"
    echo ""
    echo "Per risolvere:"
    echo "  • Esegui: node scripts/update-region-codes.js"
    echo "  • Verifica con: node scripts/test-region-codes.js"
    echo ""
    exit 1
fi
