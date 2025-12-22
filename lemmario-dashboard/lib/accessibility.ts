/**
 * Keyboard Navigation Detection
 * Aggiunge la classe 'user-is-tabbing' al body quando l'utente naviga con Tab
 * Questo permette di mostrare i focus indicators solo durante la navigazione da tastiera
 */

export function initKeyboardNavigation() {
  if (typeof window === 'undefined') return;

  let isTabbing = false;

  function handleFirstTab(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
      isTabbing = true;
      window.removeEventListener('keydown', handleFirstTab);
      window.addEventListener('mousedown', handleMouseDown);
    }
  }

  function handleMouseDown() {
    document.body.classList.remove('user-is-tabbing');
    isTabbing = false;
    window.removeEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleFirstTab);
  }

  window.addEventListener('keydown', handleFirstTab);
}

/**
 * Skip Links
 * Aggiunge skip links per migliorare l'accessibilità
 */
export function createSkipLinks() {
  if (typeof window === 'undefined') return;

  const skipLinks = document.createElement('div');
  skipLinks.innerHTML = `
    <a href="#main-content" class="skip-link">
      Salta al contenuto principale
    </a>
    <a href="#filters" class="skip-link">
      Salta ai filtri
    </a>
    <a href="#map" class="skip-link">
      Salta alla mappa
    </a>
  `;

  document.body.insertBefore(skipLinks, document.body.firstChild);
}

/**
 * Ripple Effect
 * Aggiunge l'effetto ripple ai bottoni quando cliccati
 */
export function initRippleEffect() {
  if (typeof window === 'undefined') return;

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    
    // Trova il bottone più vicino
    const button = target.closest('button, .ripple');
    if (!button) return;

    // Crea l'elemento ripple
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple-effect');

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
}

/**
 * Shortcut da tastiera
 * Aggiunge shortcut utili per la navigazione
 */
export function initKeyboardShortcuts() {
  if (typeof window === 'undefined') return;

  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K per focus sulla searchbar
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="Cerca"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }

    // Escape per chiudere modal/dropdown
    if (e.key === 'Escape') {
      const closeButtons = document.querySelectorAll('[aria-label*="Chiudi"]');
      if (closeButtons.length > 0) {
        (closeButtons[closeButtons.length - 1] as HTMLElement).click();
      }
    }

    // Ctrl/Cmd + R per resettare filtri
    if ((e.ctrlKey || e.metaKey) && e.key === 'r' && e.shiftKey) {
      e.preventDefault();
      const resetButton = document.querySelector('[aria-label*="Reset"]') as HTMLElement;
      if (resetButton) {
        resetButton.click();
      }
    }
  });
}

/**
 * Inizializza tutti i sistemi di accessibilità
 */
export function initAccessibility() {
  initKeyboardNavigation();
  createSkipLinks();
  initRippleEffect();
  initKeyboardShortcuts();
}
