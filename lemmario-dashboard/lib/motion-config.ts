/**
 * Motion Configuration
 * Configurazione centralizzata per tutte le animazioni dell'applicazione
 * Basato su Material Design Motion System e best practices
 */

// Durate standard per le animazioni
export const motionDurations = {
  instant: 0.1,      // 100ms - Feedback immediato (hover, focus)
  fast: 0.15,        // 150ms - Micro-interazioni rapide
  medium: 0.3,       // 300ms - Transizioni standard
  slow: 0.5,         // 500ms - Animazioni complesse
  verySlow: 0.8      // 800ms - Flyto mappa, transitions elaborate
} as const;

// Easing functions standard
export const motionEasing = {
  // Elementi che entrano (decelerazione)
  easeOut: [0.0, 0.0, 0.2, 1] as [number, number, number, number],
  
  // Elementi che escono (accelerazione)
  easeIn: [0.4, 0.0, 1, 1] as [number, number, number, number],
  
  // Transizioni bidirezionali
  easeInOut: [0.4, 0.0, 0.2, 1] as [number, number, number, number],
} as const;

// Spring configurations per effetti elastici
export const motionSpring = {
  // Spring standard - bilanciato
  default: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30
  },
  
  // Spring veloce - per feedback immediato
  fast: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 40
  },
  
  // Spring morbido - per elementi grandi
  soft: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25
  },
  
  // Spring elastico - per effetti wow
  bouncy: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 20
  }
} as const;

// Configurazione transizioni standard
export const motionTransitions = {
  // Transizione veloce (hover, focus)
  fast: {
    duration: motionDurations.fast,
    ease: motionEasing.easeOut
  },
  
  // Transizione media (default per la maggior parte delle animazioni)
  medium: {
    duration: motionDurations.medium,
    ease: motionEasing.easeInOut
  },
  
  // Transizione lenta (animazioni complesse)
  slow: {
    duration: motionDurations.slow,
    ease: motionEasing.easeOut
  },
  
  // Transizione con spring
  spring: motionSpring.default,
  
  // Transizione istantanea (per reduced motion)
  instant: {
    duration: 0.01
  }
} as const;

// Varianti di animazione comuni
export const motionVariants = {
  // Fade in/out
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  
  // Slide da sinistra
  slideFromLeft: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  },
  
  // Slide da destra
  slideFromRight: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  },
  
  // Slide dall'alto
  slideFromTop: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  },
  
  // Slide dal basso
  slideFromBottom: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  
  // Scale up (crescita)
  scaleUp: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  },
  
  // Scale down (riduzione)
  scaleDown: {
    hidden: { opacity: 0, scale: 1.05 },
    visible: { opacity: 1, scale: 1 }
  }
} as const;

// Stagger configurations per liste
export const motionStagger = {
  // Stagger veloce (per pochi elementi)
  fast: {
    staggerChildren: 0.05,
    delayChildren: 0
  },
  
  // Stagger medio (standard)
  medium: {
    staggerChildren: 0.1,
    delayChildren: 0.1
  },
  
  // Stagger lento (per molti elementi)
  slow: {
    staggerChildren: 0.15,
    delayChildren: 0.2
  }
} as const;

// Container variants per stagger animations
export const createStaggerContainer = (staggerConfig: keyof typeof motionStagger = 'medium') => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: motionStagger[staggerConfig]
  }
});

// Configurazione completa esportata
export const motionConfig = {
  durations: motionDurations,
  easing: motionEasing,
  spring: motionSpring,
  transitions: motionTransitions,
  variants: motionVariants,
  stagger: motionStagger,
  createStaggerContainer
} as const;

export default motionConfig;
