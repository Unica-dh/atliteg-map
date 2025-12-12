#!/bin/bash

# ========================================
# Script di Test Connessione SSH
# ========================================
# Questo script serve per testare la connessione SSH al server remoto
# PRIMA di configurare GitHub Actions.
#
# IMPORTANTE: Questo file è solo un esempio.
# Crea una copia chiamata 'test-ssh-connection.local.sh' e personalizzala
# con i tuoi valori reali (il file .local.sh è già nel .gitignore)
#
# Uso:
#   cp test-ssh-connection.example.sh test-ssh-connection.local.sh
#   nano test-ssh-connection.local.sh  # Modifica con i tuoi valori
#   chmod +x test-ssh-connection.local.sh
#   ./test-ssh-connection.local.sh
# ========================================

# CONFIGURAZIONE - Sostituisci questi valori con i tuoi
SSH_HOST="your-server-ip-or-hostname"
SSH_USER="your-username"
DEPLOY_PATH="/path/to/your/project"
SSH_KEY_PATH="$HOME/.ssh/github_deploy_key"

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "================================================"
echo "🔍 Test Connessione SSH per Deploy Automatico"
echo "================================================"
echo ""

# Test 1: Verifica esistenza chiave SSH
echo "📝 Test 1: Verifica chiave SSH..."
if [ -f "$SSH_KEY_PATH" ]; then
    echo -e "${GREEN}✅ Chiave SSH trovata: $SSH_KEY_PATH${NC}"
else
    echo -e "${RED}❌ Chiave SSH non trovata: $SSH_KEY_PATH${NC}"
    echo "   Genera una nuova chiave con:"
    echo "   ssh-keygen -t ed25519 -C 'github-actions-deploy' -f $SSH_KEY_PATH"
    exit 1
fi
echo ""

# Test 2: Test connessione base
echo "📡 Test 2: Test connessione SSH..."
if ssh -i "$SSH_KEY_PATH" -o BatchMode=yes -o ConnectTimeout=5 "$SSH_USER@$SSH_HOST" "echo 'Connessione riuscita'" 2>/dev/null; then
    echo -e "${GREEN}✅ Connessione SSH funzionante${NC}"
else
    echo -e "${RED}❌ Impossibile connettersi al server${NC}"
    echo "   Verifica:"
    echo "   - Host: $SSH_HOST"
    echo "   - User: $SSH_USER"
    echo "   - Chiave pubblica aggiunta al server (cat ${SSH_KEY_PATH}.pub)"
    exit 1
fi
echo ""

# Test 3: Verifica directory progetto
echo "📂 Test 3: Verifica directory progetto..."
if ssh -i "$SSH_KEY_PATH" "$SSH_USER@$SSH_HOST" "[ -d '$DEPLOY_PATH' ]" 2>/dev/null; then
    echo -e "${GREEN}✅ Directory progetto esistente: $DEPLOY_PATH${NC}"
else
    echo -e "${RED}❌ Directory progetto non trovata: $DEPLOY_PATH${NC}"
    exit 1
fi
echo ""

# Test 4: Verifica Git
echo "🔍 Test 4: Verifica Git..."
GIT_VERSION=$(ssh -i "$SSH_KEY_PATH" "$SSH_USER@$SSH_HOST" "git --version" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Git installato: $GIT_VERSION${NC}"
else
    echo -e "${RED}❌ Git non trovato${NC}"
    exit 1
fi
echo ""

# Test 5: Verifica Docker
echo "🐋 Test 5: Verifica Docker..."
DOCKER_VERSION=$(ssh -i "$SSH_KEY_PATH" "$SSH_USER@$SSH_HOST" "docker --version" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker installato: $DOCKER_VERSION${NC}"
else
    echo -e "${RED}❌ Docker non trovato${NC}"
    exit 1
fi
echo ""

# Test 6: Verifica Docker Compose
echo "🔧 Test 6: Verifica Docker Compose..."
COMPOSE_VERSION=$(ssh -i "$SSH_KEY_PATH" "$SSH_USER@$SSH_HOST" "docker compose version" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker Compose installato: $COMPOSE_VERSION${NC}"
else
    echo -e "${YELLOW}⚠️  Tentativo con docker-compose...${NC}"
    COMPOSE_VERSION=$(ssh -i "$SSH_KEY_PATH" "$SSH_USER@$SSH_HOST" "docker-compose --version" 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Docker Compose installato: $COMPOSE_VERSION${NC}"
    else
        echo -e "${RED}❌ Docker Compose non trovato${NC}"
        exit 1
    fi
fi
echo ""

# Test 7: Verifica repository Git
echo "📦 Test 7: Verifica repository Git..."
IS_GIT_REPO=$(ssh -i "$SSH_KEY_PATH" "$SSH_USER@$SSH_HOST" "cd '$DEPLOY_PATH' && git rev-parse --is-inside-work-tree" 2>/dev/null)
if [ "$IS_GIT_REPO" = "true" ]; then
    echo -e "${GREEN}✅ Repository Git valido${NC}"
    CURRENT_BRANCH=$(ssh -i "$SSH_KEY_PATH" "$SSH_USER@$SSH_HOST" "cd '$DEPLOY_PATH' && git branch --show-current" 2>/dev/null)
    echo "   Branch corrente: $CURRENT_BRANCH"
    LAST_COMMIT=$(ssh -i "$SSH_KEY_PATH" "$SSH_USER@$SSH_HOST" "cd '$DEPLOY_PATH' && git log -1 --oneline" 2>/dev/null)
    echo "   Ultimo commit: $LAST_COMMIT"
else
    echo -e "${RED}❌ Directory non è un repository Git${NC}"
    exit 1
fi
echo ""

# Test 8: Verifica docker-compose.yml
echo "📋 Test 8: Verifica docker-compose.yml..."
if ssh -i "$SSH_KEY_PATH" "$SSH_USER@$SSH_HOST" "[ -f '$DEPLOY_PATH/docker-compose.yml' ]" 2>/dev/null; then
    echo -e "${GREEN}✅ File docker-compose.yml trovato${NC}"
else
    echo -e "${RED}❌ File docker-compose.yml non trovato${NC}"
    exit 1
fi
echo ""

# Test 9: Test esecuzione comandi Docker
echo "🚀 Test 9: Test permessi Docker..."
DOCKER_PS=$(ssh -i "$SSH_KEY_PATH" "$SSH_USER@$SSH_HOST" "docker ps" 2>&1)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Permessi Docker OK${NC}"
    echo "   Container in esecuzione:"
    echo "$DOCKER_PS" | tail -n +2 | while read line; do
        echo "   - $line"
    done
else
    echo -e "${YELLOW}⚠️  Problemi con i permessi Docker${NC}"
    echo "   Potrebbe essere necessario aggiungere l'utente al gruppo docker:"
    echo "   sudo usermod -aG docker $SSH_USER"
fi
echo ""

# Riepilogo
echo "================================================"
echo "📊 RIEPILOGO TEST"
echo "================================================"
echo "Host: $SSH_HOST"
echo "User: $SSH_USER"
echo "Path: $DEPLOY_PATH"
echo "SSH Key: $SSH_KEY_PATH"
echo ""
echo -e "${GREEN}✅ Tutti i test principali superati!${NC}"
echo ""
echo "📝 Prossimi passi:"
echo "1. Copia la chiave SSH privata:"
echo "   cat $SSH_KEY_PATH"
echo ""
echo "2. Vai su GitHub → Settings → Environments → production"
echo "   Aggiungi i seguenti secrets:"
echo "   - SSH_PRIVATE_KEY: [contenuto della chiave privata]"
echo "   - SSH_HOST: $SSH_HOST"
echo "   - SSH_USER: $SSH_USER"
echo "   - DEPLOY_PATH: $DEPLOY_PATH"
echo ""
echo "3. (Opzionale) Aggiungi la variabile PRODUCTION_URL:"
echo "   - PRODUCTION_URL: https://your-domain.com"
echo ""
echo "4. Consulta la documentazione completa:"
echo "   docs/GITHUB_ACTIONS_SETUP.md"
echo ""
echo "================================================"
