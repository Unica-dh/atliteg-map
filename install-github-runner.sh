#!/bin/bash

# ================================================================
# Script di Installazione GitHub Actions Self-Hosted Runner
# ================================================================
# Questo script installa e configura un GitHub Actions Runner
# sul server per permettere il deploy automatico.
#
# PREREQUISITI:
# - Accesso al repository GitHub come amministratore
# - Sudo privileges sul server
# - Docker e Docker Compose già installati
#
# USO:
#   1. Connettiti al server
#   2. Scarica questo script
#   3. chmod +x install-github-runner.sh
#   4. ./install-github-runner.sh
# ================================================================

set -e  # Exit on error

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================================"
echo "🚀 Installazione GitHub Actions Self-Hosted Runner"
echo "================================================================${NC}"
echo ""

# Verifica sistema operativo
echo -e "${BLUE}📋 Verifica sistema operativo...${NC}"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo -e "${GREEN}✅ Sistema Linux rilevato${NC}"
else
    echo -e "${RED}❌ Questo script supporta solo Linux${NC}"
    exit 1
fi

# Verifica architettura
ARCH=$(uname -m)
if [[ "$ARCH" == "x86_64" ]]; then
    RUNNER_ARCH="x64"
    echo -e "${GREEN}✅ Architettura x64 rilevata${NC}"
elif [[ "$ARCH" == "aarch64" ]] || [[ "$ARCH" == "arm64" ]]; then
    RUNNER_ARCH="arm64"
    echo -e "${GREEN}✅ Architettura ARM64 rilevata${NC}"
else
    echo -e "${RED}❌ Architettura non supportata: $ARCH${NC}"
    exit 1
fi

echo ""

# Richiedi informazioni
echo -e "${YELLOW}📝 Informazioni necessarie:${NC}"
echo ""
read -p "Inserisci l'owner del repository (es: Unica-dh): " REPO_OWNER
read -p "Inserisci il nome del repository (es: atliteg-map): " REPO_NAME
echo ""
echo -e "${YELLOW}⚠️  Ora devi ottenere il TOKEN dal repository GitHub:${NC}"
echo "1. Vai su: https://github.com/${REPO_OWNER}/${REPO_NAME}/settings/actions/runners/new"
echo "2. Copia il TOKEN che appare nella pagina"
echo ""
read -p "Inserisci il TOKEN: " RUNNER_TOKEN
echo ""

# Directory di installazione
RUNNER_HOME="/home/$(whoami)/actions-runner"
echo -e "${BLUE}📂 Directory di installazione: ${RUNNER_HOME}${NC}"

# Crea directory se non esiste
if [ -d "$RUNNER_HOME" ]; then
    echo -e "${YELLOW}⚠️  Directory già esistente. Rimuovo la vecchia installazione...${NC}"
    cd "$RUNNER_HOME"
    # Prova a rimuovere il runner se configurato
    if [ -f "./config.sh" ]; then
        ./config.sh remove --token "$RUNNER_TOKEN" || true
    fi
    cd ..
    rm -rf "$RUNNER_HOME"
fi

mkdir -p "$RUNNER_HOME"
cd "$RUNNER_HOME"

echo ""
echo -e "${BLUE}📥 Download GitHub Actions Runner...${NC}"

# Ottieni l'ultima versione disponibile
RUNNER_VERSION=$(curl -s https://api.github.com/repos/actions/runner/releases/latest | grep -oP '"tag_name": "\K(.*)(?=")')
echo "Versione: $RUNNER_VERSION"

# Download runner
RUNNER_FILE="actions-runner-linux-${RUNNER_ARCH}-${RUNNER_VERSION#v}.tar.gz"
DOWNLOAD_URL="https://github.com/actions/runner/releases/download/${RUNNER_VERSION}/${RUNNER_FILE}"

echo "Downloading: $DOWNLOAD_URL"
curl -o "$RUNNER_FILE" -L "$DOWNLOAD_URL"

echo -e "${GREEN}✅ Download completato${NC}"
echo ""

# Estrai archivio
echo -e "${BLUE}📦 Estrazione archivio...${NC}"
tar xzf "$RUNNER_FILE"
rm "$RUNNER_FILE"
echo -e "${GREEN}✅ Estrazione completata${NC}"
echo ""

# Configura runner
echo -e "${BLUE}⚙️  Configurazione runner...${NC}"
./config.sh --url "https://github.com/${REPO_OWNER}/${REPO_NAME}" --token "$RUNNER_TOKEN" --name "$(hostname)-runner" --work _work --labels "self-hosted,Linux,${RUNNER_ARCH}" --unattended

echo -e "${GREEN}✅ Configurazione completata${NC}"
echo ""

# Installa e avvia come servizio
echo -e "${BLUE}🔧 Installazione come servizio systemd...${NC}"
sudo ./svc.sh install $(whoami)
sudo ./svc.sh start

echo -e "${GREEN}✅ Servizio avviato${NC}"
echo ""

# Verifica stato
echo -e "${BLUE}🔍 Verifica stato del servizio...${NC}"
sudo ./svc.sh status

echo ""
echo -e "${GREEN}================================================================"
echo "✅ Installazione completata con successo!"
echo "================================================================${NC}"
echo ""
echo -e "${BLUE}📊 Informazioni runner:${NC}"
echo "  Repository: ${REPO_OWNER}/${REPO_NAME}"
echo "  Nome runner: $(hostname)-runner"
echo "  Directory: ${RUNNER_HOME}"
echo "  Labels: self-hosted, Linux, ${RUNNER_ARCH}"
echo ""
echo -e "${BLUE}🎯 Prossimi passi:${NC}"
echo "1. Verifica che il runner sia online su:"
echo "   https://github.com/${REPO_OWNER}/${REPO_NAME}/settings/actions/runners"
echo ""
echo "2. Configura il secret DEPLOY_PATH su GitHub:"
echo "   - Vai su: https://github.com/${REPO_OWNER}/${REPO_NAME}/settings/environments"
echo "   - Seleziona environment 'production'"
echo "   - Aggiungi secret: DEPLOY_PATH con valore: $(pwd | sed 's|/actions-runner||')/atliteg-map"
echo ""
echo "3. Testa il workflow:"
echo "   - Fai un commit su master o"
echo "   - Esegui manualmente da GitHub Actions"
echo ""
echo -e "${BLUE}📚 Comandi utili:${NC}"
echo "  Stato runner:    sudo ${RUNNER_HOME}/svc.sh status"
echo "  Stop runner:     sudo ${RUNNER_HOME}/svc.sh stop"
echo "  Start runner:    sudo ${RUNNER_HOME}/svc.sh start"
echo "  Restart runner:  sudo ${RUNNER_HOME}/svc.sh restart"
echo "  Log runner:      sudo journalctl -u actions.runner.${REPO_OWNER}-${REPO_NAME}.$(hostname)-runner.service -f"
echo ""
echo -e "${GREEN}🎉 Il runner è pronto per eseguire i deploy automatici!${NC}"
echo ""
