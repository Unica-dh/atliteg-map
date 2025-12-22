/**
 * MotionWrapper Component
 * 
 * Wrapper component che rispetta automaticamente le preferenze
 * di accessibilità dell'utente per animazioni ridotte
 * 
 * Fornisce un'interfaccia semplificata per Framer Motion con
 * supporto automatico per prefers-reduced-motion
 */

'use client';

import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MotionWrapperProps extends MotionProps {
  children: React.ReactNode;
  /**
   * Se true, disabilita completamente le animazioni quando
   * l'utente preferisce movimento ridotto
   */
  respectReducedMotion?: boolean;
  /**
   * Classe CSS personalizzata
   */
  className?: string;
}

/**
 * Wrapper generico per animazioni con supporto reduced motion
 */
export const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  respectReducedMotion = true,
  initial,
  animate,
  exit,
  transition,
  variants,
  className,
  ...motionProps
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  // Se l'utente preferisce movimento ridotto e respectReducedMotion è true
  const shouldAnimate = !respectReducedMotion || !prefersReducedMotion;
  
  return (
    <motion.div
      className={className}
      initial={shouldAnimate ? initial : undefined}
      animate={shouldAnimate ? animate : undefined}
      exit={shouldAnimate ? exit : undefined}
      transition={shouldAnimate ? transition : { duration: 0.01 }}
      variants={shouldAnimate ? variants : undefined}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

/**
 * Wrapper specifico per fade-in animations
 */
export const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}> = ({ children, delay = 0, duration = 0.3, className }) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={
        prefersReducedMotion
          ? { duration: 0.01 }
          : { duration, delay, ease: [0.0, 0.0, 0.2, 1] }
      }
    >
      {children}
    </motion.div>
  );
};

/**
 * Wrapper specifico per slide-in animations
 */
export const SlideIn: React.FC<{
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
}> = ({ children, direction = 'up', delay = 0, duration = 0.3, className }) => {
  const prefersReducedMotion = useReducedMotion();
  
  const directionMap = {
    left: { x: -20, y: 0 },
    right: { x: 20, y: 0 },
    up: { x: 0, y: 20 },
    down: { x: 0, y: -20 }
  };
  
  const offset = directionMap[direction];
  
  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, ...offset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={
        prefersReducedMotion
          ? { duration: 0.01 }
          : { duration, delay, ease: [0.0, 0.0, 0.2, 1] }
      }
    >
      {children}
    </motion.div>
  );
};

/**
 * Wrapper specifico per scale animations
 */
export const ScaleIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}> = ({ children, delay = 0, duration = 0.3, className }) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={
        prefersReducedMotion
          ? { duration: 0.01 }
          : { 
              duration, 
              delay, 
              ease: [0.0, 0.0, 0.2, 1] 
            }
      }
    >
      {children}
    </motion.div>
  );
};

/**
 * Container per stagger animations (elementi che appaiono in sequenza)
 */
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  staggerDelay?: number;
  childDelay?: number;
  className?: string;
}> = ({ children, staggerDelay = 0.05, childDelay = 0, className }) => {
  const prefersReducedMotion = useReducedMotion();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
        delayChildren: prefersReducedMotion ? 0 : childDelay
      }
    }
  };
  
  return (
    <motion.div
      className={className}
      variants={prefersReducedMotion ? undefined : containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
};

/**
 * Item per StaggerContainer
 */
export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const prefersReducedMotion = useReducedMotion();
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div
      className={className}
      variants={prefersReducedMotion ? undefined : itemVariants}
      transition={
        prefersReducedMotion
          ? { duration: 0.01 }
          : { duration: 0.3, ease: [0.0, 0.0, 0.2, 1] }
      }
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
