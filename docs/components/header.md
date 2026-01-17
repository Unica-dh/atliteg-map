# Componente Header

**Versione:** 1.0  
**Ultima Modifica:** 2024-01-15  
**Stato:** Stabile

---

## Panoramica

Il componente `Header` fornisce la navigazione principale del progetto AtLiTeG, con logo, titolo, menu a dropdown multi-livello per desktop e menu drawer per mobile. Include integrazione con risorse esterne del progetto (corpus, vocabolario, atlante, pubblicazioni).

## Funzionalità

- **Layout responsive**:
  - Desktop: Logo + titolo + menu orizzontale con dropdown
  - Mobile: Logo + hamburger menu → drawer laterale
- **Menu a dropdown** con 6 sezioni principali e 27 link totali
- **Sfondo gradiente** con immagine overlay semi-trasparente
- **Animazioni hover** e transizioni fluide
- **Link esterni** con `target="_blank"` e `rel="noopener noreferrer"`
- **Mobile drawer**: Menu scorrevole da sinistra (z-index 10001)
- **Accessibilità**: ARIA attributes per navigation e dropdown

## Props/API

Il componente `Header` non accetta props. La configurazione del menu è hardcoded internamente.

### Struttura Dati Menu

```typescript
interface MenuItem {
  label: string;           // Etichetta categoria menu
  items: {
    label: string;         // Etichetta link
    href: string;          // URL destinazione (esterno)
  }[];
}

const menuItems: MenuItem[] = [
  { label: 'Il progetto', items: [...] },
  { label: 'Corpus', items: [...] },
  { label: 'Vocabolario', items: [...] },
  { label: 'Atlante', items: [...] },
  { label: 'Attività e Pubblicazioni', items: [...] },
  { label: 'Terza missione', items: [...] },
];
```

### Stato Interno

```typescript
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);      // Stato drawer mobile
const [openDropdown, setOpenDropdown] = useState<number | null>(null); // Dropdown desktop attivo
const [openMobileDropdown, setOpenMobileDropdown] = useState<number | null>(null); // Accordion mobile aperto
```

## Implementazione

### Layout Desktop

Header con disposizione orizzontale:

```
┌─────────────────────────────────────────────────────────┐
│ [Logo]  [Titolo progetto]   [Menu Nav]        [Mobile] │
│  70px   max-660px           flex-center        (hidden) │
└─────────────────────────────────────────────────────────┘
```

- **Logo**: Next.js `<Image>` ottimizzato (70x77px)
- **Titolo**: Nascosto su mobile, visibile da `md:` breakpoint
- **Navigation**: Nascosta su mobile, visibile da `md:` breakpoint
- **Hamburger**: Visibile solo su mobile

### Dropdown Desktop (Hover)

Attivazione al hover con gestione stato:

```typescript
<li
  onMouseEnter={() => setOpenDropdown(index)}
  onMouseLeave={() => setOpenDropdown(null)}
>
  <button aria-expanded={openDropdown === index}>
    {item.label}
    <ChevronDown className={openDropdown === index ? 'rotate-180' : ''} />
  </button>
  
  <div className={`dropdown ${openDropdown === index ? 'visible' : 'invisible'}`}>
    {/* Link items */}
  </div>
</li>
```

### Mobile Drawer

Menu scorrevole da sinistra con backdrop overlay:

```typescript
// Drawer: z-[10001]
<div className={`fixed inset-y-0 left-0 w-80 ${
  isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
}`}>
  {/* Header con titolo */}
  {/* Accordion per ogni sezione */}
</div>

// Backdrop: z-[10000]
<div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
```

### Accordion Mobile

Ogni sezione menu è espandibile:

```typescript
<button onClick={() => setOpenMobileDropdown(
  openMobileDropdown === index ? null : index
)}>
  {item.label}
  <ChevronDown className={openMobileDropdown === index ? 'rotate-180' : ''} />
</button>

<div className={`overflow-hidden transition-all ${
  openMobileDropdown === index ? 'max-h-96' : 'max-h-0'
}`}>
  {/* Subitems */}
</div>
```

### Sfondo e Stile

```css
/* Gradiente primario */
background: linear-gradient(135deg, #0B5FA5 0%, #0D4A8F 100%);

/* Immagine overlay */
background-image: url(/immagine-testata.jpg);
opacity: 0.25;
```

### Link Esterni

Tutti i link puntano a domini esterni con attributi sicurezza:

```tsx
<a
  href={subItem.href}
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => setIsMobileMenuOpen(false)}  // Chiude drawer mobile
>
  {subItem.label}
</a>
```

## Hooks e Dipendenze

### Hook Utilizzati

- **`useState()`**: Gestione stato menu mobile e dropdown

### Dipendenze Esterne

- **Next.js Image**: `<Image>` ottimizzato per logo
- **Lucide React**: Icone Menu, X, ChevronDown
- **Tailwind CSS**: Utility classes per layout e responsive

### Asset

```
/public/AtLiTeG_logo.webp       # Logo progetto (WebP ottimizzato)
/public/immagine-testata.jpg    # Immagine sfondo header
```

## Esempi d'Uso

### Utilizzo Standard

```tsx
import { Header } from '@/components/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

### Personalizzazione Menu

Per aggiungere/modificare voci menu, editare l'array `menuItems`:

```typescript
const menuItems: MenuItem[] = [
  // ... voci esistenti
  {
    label: 'Nuova Sezione',
    items: [
      { label: 'Sottopagina 1', href: 'https://example.com/page1' },
      { label: 'Sottopagina 2', href: 'https://example.com/page2' },
    ],
  },
];
```

## Note

### Responsive Breakpoints

- **Mobile**: `< 768px` → Hamburger menu + drawer
- **Desktop**: `≥ 768px` → Menu orizzontale + dropdown hover

### Z-Index Hierarchy

```
10001: Mobile drawer menu
10000: Mobile backdrop overlay
9999:  Dropdown desktop (position: absolute, non conflitti)
```

### Performance

- **Image optimization**: Next.js `<Image>` con `priority` per logo (above-fold)
- **WebP format**: Logo in formato WebP per dimensioni ridotte
- **Lazy loading**: Immagine sfondo caricata normalmente (background-image)

### Accessibilità

- **ARIA attributes**:
  - `aria-expanded` su bottoni dropdown
  - `aria-haspopup="true"` su trigger menu
  - `aria-label` su toggle mobile menu
- **Keyboard navigation**: Supporto nativo browser per link
- **Focus management**: Nessun focus trap implementato su drawer

### SEO e Collegamenti

Tutti i link puntano a sottodomini/sezioni del progetto AtLiTeG:

- **www.atliteg.org**: Sito principale
- **corpus.atliteg.org**: Corpus opere e ricette
- **vocabolario.atliteg.org**: Lemmario e formario

### Limitazioni

- **Menu statico**: Non caricato da CMS/API
- **Nessun active state**: Link non evidenziano pagina corrente
- **Dropdown desktop hover-only**: No click alternativo
- **Drawer senza swipe**: Solo click per aprire/chiudere

### Stile Testata

Il titolo lungo è ottimizzato per leggibilità:

```tsx
<h1 className="text-[16px] lg:text-[17px] font-bold leading-[1.25]">
  Atlante della lingua e dei testi della cultura gastronomica italiana
  dall'età medievale all'Unità
</h1>
```

- Font size ridotto per adattarsi
- Leading tight (1.25) per compattezza
- Nascosto su mobile per risparmiare spazio

### Transizioni

```css
/* Drawer slide-in */
transition: transform 300ms ease-in-out;

/* Dropdown fade */
transition: opacity 200ms, visibility 200ms, transform 200ms;

/* ChevronDown rotation */
transition: transform 200ms;
```
