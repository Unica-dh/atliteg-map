/**
 * useReducedMotion Hook
 * 
 * Hook per rispettare le preferenze di accessibilità dell'utente
 * riguardo alle animazioni ridotte (prefers-reduced-motion)
 * 
 * Conforme a WCAG 2.1 - Criterio 2.3.3 (Level AAA)
 * 
 * @returns {boolean} true se l'utente preferisce animazioni ridotte
 * 
 * @example
 * const MotionComponent = () => {
 *   const prefersReducedMotion = useReducedMotion();
 *   
 *   return (
 *     <motion.div
 *       animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
 *       transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
 *     >
 *       Content
 *     </motion.div>
 *   );
 * };
 */

import { useState, useEffect } from 'react';

export const useReducedMotion = (): boolean => {
  // Default a false per SSR
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Verifica se siamo nel browser
    if (typeof window === 'undefined') {
      return;
    }

    // Crea media query per prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Imposta valore iniziale
    setPrefersReducedMotion(mediaQuery.matches);

    // Handler per cambiamenti nella preferenza
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(event.matches);
    };

    // Ascolta cambiamenti (supporto browser moderni e legacy)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback per browser più vecchi
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback per browser più vecchi
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
};

/**
 * Hook per ottenere transition config basata su reduced motion
 * 
 * @returns Oggetto di configurazione transizione
 * 
 * @example
 * const MotionComponent = () => {
 *   const transition = useMotionTransition();
 *   
 *   return (
 *     <motion.div
 *       animate={{ opacity: 1, y: 0 }}
 *       transition={transition}
 *     >
 *       Content
 *     </motion.div>
 *   );
 * };
 */
export const useMotionTransition = (normalDuration = 0.3) => {
  const prefersReducedMotion = useReducedMotion();
  
  return prefersReducedMotion 
    ? { duration: 0.01 } 
    : { duration: normalDuration };
};

/**
 * Hook per ottenere varianti animate basate su reduced motion
 * 
 * @param normalVariants - Varianti normali con animazioni
 * @returns Varianti appropriate (animate o statiche)
 * 
 * @example
 * const MotionComponent = () => {
 *   const variants = useMotionVariants({
 *     hidden: { opacity: 0, y: 20 },
 *     visible: { opacity: 1, y: 0 }
 *   });
 *   
 *   return (
 *     <motion.div
 *       variants={variants}
 *       initial="hidden"
 *       animate="visible"
 *     >
 *       Content
 *     </motion.div>
 *   );
 * };
 */
export const useMotionVariants = <T extends Record<string, any>>(
  normalVariants: T
): T | false => {
  const prefersReducedMotion = useReducedMotion();
  
  return prefersReducedMotion ? false : normalVariants;
};

export default useReducedMotion;
