# Motion System - Guida Sviluppatore

## Panoramica

Il sistema motion di AtLiTeG Map fornisce un'infrastruttura completa per animazioni fluide, performanti e accessibili, conforme a WCAG 2.1 AA.

## Componenti Principali

### 1. Motion Config (`lib/motion-config.ts`)

Configurazione centralizzata per tutte le animazioni.

#### Durate Standard

```tsx
import { motionDurations } from '@/lib/motion-config';

// Disponibili:
motionDurations.instant   // 0.1s - Feedback immediato
motionDurations.fast      // 0.15s - Micro-interazioni
motionDurations.medium    // 0.3s - Standard
motionDurations.slow      // 0.5s - Complesse
motionDurations.verySlow  // 0.8s - Molto elaborate
```

#### Easing Functions

```tsx
import { motionEasing } from '@/lib/motion-config';

// Curve di easing
motionEasing.easeOut    // Elementi che entrano
motionEasing.easeIn     // Elementi che escono
motionEasing.easeInOut  // Bidirezionali
```

#### Spring Configurations

```tsx
import { motionSpring } from '@/lib/motion-config';

motionSpring.default  // Bilanciato
motionSpring.fast     // Veloce
motionSpring.soft     // Morbido
motionSpring.bouncy   // Elastico
```

### 2. useReducedMotion Hook

Hook per rispettare le preferenze di accessibilità.

```tsx
import { useReducedMotion } from '@/hooks/useReducedMotion';

const MyComponent = () => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
    >
      Content
    </motion.div>
  );
};
```

### 3. Motion Wrappers

Componenti pre-configurati per animazioni comuni.

#### FadeIn

```tsx
import { FadeIn } from '@/components/MotionWrapper';

<FadeIn delay={0.1} duration={0.3}>
  <div>Contenuto che appare con fade</div>
</FadeIn>
```

#### SlideIn

```tsx
import { SlideIn } from '@/components/MotionWrapper';

<SlideIn direction="up" delay={0.1}>
  <div>Contenuto che slide dal basso</div>
</SlideIn>

// Direzioni disponibili: 'left' | 'right' | 'up' | 'down'
```

#### ScaleIn

```tsx
import { ScaleIn } from '@/components/MotionWrapper';

<ScaleIn delay={0.1}>
  <div>Contenuto che cresce</div>
</ScaleIn>
```

#### StaggerContainer & StaggerItem

Per liste con elementi che appaiono in sequenza:

```tsx
import { StaggerContainer, StaggerItem } from '@/components/MotionWrapper';

<StaggerContainer staggerDelay={0.05}>
  {items.map(item => (
    <StaggerItem key={item.id}>
      <div>{item.content}</div>
    </StaggerItem>
  ))}
</StaggerContainer>
```

## Pattern d'Uso Comuni

### 1. Modal/Drawer Animation

```tsx
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const Modal = ({ isOpen, onClose }) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
            transition={prefersReducedMotion ? { duration: 0 } : { 
              type: 'spring', 
              duration: 0.4 
            }}
          >
            {/* Contenuto modal */}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
```

### 2. Hover Effects

```tsx
import { motion } from 'framer-motion';

<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
>
  Clicca qui
</motion.button>
```

### 3. List Stagger Animation

```tsx
import { motion } from 'framer-motion';
import { motionStagger } from '@/lib/motion-config';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: motionStagger.medium
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

<motion.ul variants={container} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.li key={item.id} variants={item}>
      {item.content}
    </motion.li>
  ))}
</motion.ul>
```

### 4. Layout Animations

```tsx
import { motion } from 'framer-motion';

<motion.div layout transition={{ type: 'spring', duration: 0.4 }}>
  {/* Contenuto che cambia dimensione/posizione */}
</motion.div>
```

## CSS Utility Classes

### Transizioni

```html
<!-- Transizione veloce (150ms) -->
<div class="transition-fast hover:bg-blue-100">Fast transition</div>

<!-- Transizione media (300ms) - default -->
<div class="transition-medium hover:scale-105">Medium transition</div>

<!-- Transizione lenta (500ms) -->
<div class="transition-slow hover:opacity-80">Slow transition</div>
```

### GPU Acceleration

```html
<!-- Attiva GPU acceleration per performance -->
<div class="gpu-accelerated">Contenuto animato</div>

<!-- Rimuovi dopo animazione -->
<div class="gpu-accelerated animation-complete">Animazione completa</div>
```

### Skeleton Loading

```html
<div class="skeleton h-20 w-full"></div>
```

## Best Practices

### 1. Performance

✅ **DO**: Usa CSS transforms (GPU-accelerated)
```tsx
<motion.div animate={{ x: 100, scale: 1.2 }} />
```

❌ **DON'T**: Usa proprietà che triggherano layout/paint
```tsx
<motion.div animate={{ left: 100, width: 200 }} />
```

### 2. Accessibilità

✅ **DO**: Rispetta sempre `prefers-reduced-motion`
```tsx
const prefersReducedMotion = useReducedMotion();
```

✅ **DO**: Usa componenti wrapper che gestiscono automaticamente
```tsx
<FadeIn>Content</FadeIn>
```

### 3. Durate

- **Micro-interazioni** (hover, focus): 100-150ms
- **Transizioni standard**: 300ms
- **Animazioni complesse**: 400-600ms
- **Mai oltre 800ms** (utente perde pazienza)

### 4. Easing

- **Entrata elementi**: `easeOut` (decelerazione)
- **Uscita elementi**: `easeIn` (accelerazione)
- **Bidirezionali**: `easeInOut`
- **Naturali**: `spring` (effetto elastico)

### 5. Stagger

- Pochi elementi (2-5): 50ms delay
- Media lista (6-15): 100ms delay
- Lista lunga (16+): 150ms delay
- Mai oltre 200ms (troppo lento)

## Testing

### Test Manuale

1. Verifica con browser DevTools:
   - Frame rate (target 60 FPS)
   - Layout shifts
   - Paint operations

2. Test accessibilità:
   - Abilita "Reduce motion" nelle impostazioni OS
   - Verifica che animazioni siano ridotte/disabilitate
   - Test con screen reader

### Test Automatici

```tsx
import { render } from '@testing-library/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Mock reduced motion
Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockImplementation(query => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
});
```

## Troubleshooting

### Animazioni non fluide

1. Verifica frame rate in DevTools (Performance tab)
2. Controlla uso GPU acceleration
3. Riduci complessità animazione
4. Usa `will-change` con parsimonia

### Animazioni non rispettano reduced motion

1. Verifica uso hook `useReducedMotion`
2. Controlla che `@media (prefers-reduced-motion)` sia nel CSS
3. Test con OS settings abilitato

### Layout shifts durante animazioni

1. Usa `motion.div` con `layout` prop
2. Imposta dimensioni fisse quando possibile
3. Usa `transform` invece di `width/height`

## Risorse

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Material Design Motion](https://material.io/design/motion/)
- [WCAG 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
- [Web Animations Performance](https://web.dev/animations/)

---

**Versione**: 1.0  
**Ultimo aggiornamento**: 22 dicembre 2025
