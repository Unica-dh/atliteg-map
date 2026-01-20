#!/bin/bash

# ====================================================================
# Script di Test per Deployment Multi-Dominio AtLiTeG
# ====================================================================
# Testa l'accessibilità dell'applicazione su entrambi i domini:
# - https://atlante.atliteg.org
# - https://linguistica.dh.unica.it/atliteg
#
# Usage:
#   ./test-deployment.sh [--verbose]
#
# Exit codes:
#   0 = Tutti i test passati
#   1 = Uno o più test falliti
# ====================================================================

set -e

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Flag verbose
VERBOSE=0
if [[ "$1" == "--verbose" ]]; then
    VERBOSE=1
fi

# Contatori
TESTS_PASSED=0
TESTS_FAILED=0

# Domini da testare
DOMAINS=(
    "https://atlante.atliteg.org"
    "https://linguistica.dh.unica.it/atliteg"
)

# ====================================================================
# Funzioni di Utilità
# ====================================================================

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
    ((TESTS_PASSED++))
}

log_error() {
    echo -e "${RED}✗${NC} $1"
    ((TESTS_FAILED++))
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# ====================================================================
# Test Functions
# ====================================================================

test_http_status() {
    local url="$1"
    local expected_status="${2:-200}"

    log_info "Testing HTTP status for: $url"

    local response=$(curl -s -o /dev/null -w "%{http_code}" -L "$url" --max-time 10 2>&1)

    if [[ "$response" == "$expected_status" ]]; then
        log_success "HTTP $expected_status OK: $url"
        return 0
    else
        log_error "Expected HTTP $expected_status, got: $response for $url"
        return 1
    fi
}

test_content_type() {
    local url="$1"

    log_info "Testing Content-Type header for: $url"

    local content_type=$(curl -s -L -I "$url" --max-time 10 | grep -i "content-type" | awk '{print $2}' | tr -d '\r')

    if [[ "$content_type" == *"text/html"* ]]; then
        log_success "Content-Type is HTML: $url"
        return 0
    else
        log_error "Unexpected Content-Type: $content_type for $url"
        return 1
    fi
}

test_page_title() {
    local url="$1"
    local expected_title="AtLiTeG"

    log_info "Testing page title for: $url"

    local page_content=$(curl -s -L "$url" --max-time 10)

    if echo "$page_content" | grep -q "<title>.*${expected_title}.*</title>"; then
        log_success "Page title contains '$expected_title': $url"
        return 0
    else
        log_error "Page title does not contain '$expected_title': $url"
        [[ $VERBOSE -eq 1 ]] && echo "$page_content" | grep -i "<title>"
        return 1
    fi
}

test_meta_tags() {
    local url="$1"

    log_info "Testing meta tags for: $url"

    local page_content=$(curl -s -L "$url" --max-time 10)
    local meta_count=0

    # Test meta description
    if echo "$page_content" | grep -q '<meta name="description"'; then
        ((meta_count++))
    fi

    # Test Open Graph
    if echo "$page_content" | grep -q '<meta property="og:title"'; then
        ((meta_count++))
    fi

    # Test viewport
    if echo "$page_content" | grep -q '<meta name="viewport"'; then
        ((meta_count++))
    fi

    if [[ $meta_count -ge 3 ]]; then
        log_success "Meta tags present ($meta_count found): $url"
        return 0
    else
        log_error "Missing meta tags ($meta_count/3 found): $url"
        return 1
    fi
}

test_static_assets() {
    local base_url="$1"

    log_info "Testing static assets availability"

    local assets_ok=0
    local assets_total=0

    # Test favicon
    ((assets_total++))
    if curl -s -o /dev/null -w "%{http_code}" -L "${base_url}/favicon.ico" --max-time 5 | grep -q "200"; then
        ((assets_ok++))
    fi

    # Test health endpoint (se presente)
    ((assets_total++))
    if curl -s -o /dev/null -w "%{http_code}" -L "${base_url}/health" --max-time 5 | grep -q "200"; then
        ((assets_ok++))
    fi

    if [[ $assets_ok -ge 1 ]]; then
        log_success "Static assets accessible ($assets_ok/$assets_total): $base_url"
        return 0
    else
        log_warning "Some static assets not accessible ($assets_ok/$assets_total): $base_url"
        return 0  # Non bloccante
    fi
}

test_ssl_certificate() {
    local url="$1"
    local domain=$(echo "$url" | sed -E 's|https?://([^/]+).*|\1|')

    log_info "Testing SSL certificate for: $domain"

    # Estrai informazioni sul certificato
    local ssl_info=$(echo | timeout 5 openssl s_client -servername "$domain" -connect "${domain}:443" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)

    if [[ -n "$ssl_info" ]]; then
        local not_after=$(echo "$ssl_info" | grep "notAfter" | cut -d= -f2)
        log_success "SSL certificate valid until: $not_after"
        return 0
    else
        log_warning "Could not verify SSL certificate for: $domain"
        return 0  # Non bloccante
    fi
}

test_response_time() {
    local url="$1"
    local max_time=3  # secondi

    log_info "Testing response time for: $url"

    local response_time=$(curl -s -o /dev/null -w "%{time_total}" -L "$url" --max-time 10 2>&1)

    if (( $(echo "$response_time < $max_time" | bc -l) )); then
        log_success "Response time OK (${response_time}s < ${max_time}s): $url"
        return 0
    else
        log_warning "Slow response time (${response_time}s): $url"
        return 0  # Non bloccante
    fi
}

# ====================================================================
# Test Runner
# ====================================================================

run_tests_for_domain() {
    local domain="$1"

    echo ""
    echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}Testing: $domain${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════${NC}"

    test_http_status "$domain" 200
    test_content_type "$domain"
    test_page_title "$domain"
    test_meta_tags "$domain"
    test_static_assets "$domain"
    test_ssl_certificate "$domain"
    test_response_time "$domain"
}

# ====================================================================
# Main Execution
# ====================================================================

main() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  AtLiTeG Multi-Domain Deployment Test Suite       ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Testing domains:"
    for domain in "${DOMAINS[@]}"; do
        echo "  • $domain"
    done

    # Verifica prerequisiti
    command -v curl >/dev/null 2>&1 || {
        log_error "curl non trovato. Installare con: apt-get install curl"
        exit 1
    }

    command -v openssl >/dev/null 2>&1 || {
        log_warning "openssl non trovato. I test SSL saranno saltati."
    }

    # Esegui test per ogni dominio
    for domain in "${DOMAINS[@]}"; do
        run_tests_for_domain "$domain"
    done

    # Report finale
    echo ""
    echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}Test Summary${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}Tests passed: $TESTS_PASSED${NC}"
    echo -e "${RED}Tests failed: $TESTS_FAILED${NC}"
    echo ""

    if [[ $TESTS_FAILED -eq 0 ]]; then
        echo -e "${GREEN}✓ All tests passed! Deployment is healthy.${NC}"
        exit 0
    else
        echo -e "${RED}✗ Some tests failed. Please review the output above.${NC}"
        exit 1
    fi
}

# Esegui main
main
