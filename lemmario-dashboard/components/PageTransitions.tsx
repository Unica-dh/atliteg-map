'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ReactNode } from 'react';
import { motionConfig } from '@/lib/motion-config';

/**
 * Crossfade transition component
 * Smooth opacity transition between content changes
 */
interface CrossfadeProps {
  children: ReactNode;
  transitionKey: string | number;
  className?: string;
}

export const Crossfade = ({ children, transitionKey, className = '' }: CrossfadeProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={motionConfig.transitions.medium}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Slide transition component
 * Content slides in from specified direction
 */
interface SlideTransitionProps {
  children: ReactNode;
  transitionKey: string | number;
  direction?: 'left' | 'right' | 'up' | 'down';
  className?: string;
}

export const SlideTransition = ({ 
  children, 
  transitionKey, 
  direction = 'right',
  className = '' 
}: SlideTransitionProps) => {
  const directions = {
    left: { initial: { x: -100, opacity: 0 }, exit: { x: 100, opacity: 0 } },
    right: { initial: { x: 100, opacity: 0 }, exit: { x: -100, opacity: 0 } },
    up: { initial: { y: -100, opacity: 0 }, exit: { y: 100, opacity: 0 } },
    down: { initial: { y: 100, opacity: 0 }, exit: { y: -100, opacity: 0 } }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial={directions[direction].initial}
        animate={{ x: 0, y: 0, opacity: 1 }}
        exit={directions[direction].exit}
        transition={motionConfig.spring.soft}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Scale transition component
 * Content scales in/out with optional fade
 */
interface ScaleTransitionProps {
  children: ReactNode;
  transitionKey: string | number;
  scaleFrom?: number;
  className?: string;
}

export const ScaleTransition = ({ 
  children, 
  transitionKey, 
  scaleFrom = 0.9,
  className = '' 
}: ScaleTransitionProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial={{ scale: scaleFrom, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: scaleFrom, opacity: 0 }}
        transition={motionConfig.spring.fast}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Page transition variants for full page changes
 */
export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    y: 20
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: motionConfig.durations.medium,
      ease: motionConfig.easing.easeOut,
      when: 'beforeChildren',
      staggerChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -20,
    transition: {
      duration: motionConfig.durations.fast,
      ease: motionConfig.easing.easeIn
    }
  }
};

/**
 * Page transition wrapper component
 */
interface PageTransitionProps {
  children: ReactNode;
  transitionKey: string;
  className?: string;
}

export const PageTransition = ({ children, transitionKey, className = '' }: PageTransitionProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        variants={pageTransitionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Shared element transition config
 * Use with motion.div layoutId prop
 */
export const sharedElementTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8
};

/**
 * Modal/Drawer backdrop variants
 */
export const backdropVariants: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: 'blur(0px)'
  },
  visible: {
    opacity: 1,
    backdropFilter: 'blur(8px)',
    transition: {
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: {
      duration: 0.2
    }
  }
};

/**
 * Modal content variants
 */
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

/**
 * Drawer variants (slide from side)
 */
export const drawerVariants = (side: 'left' | 'right' | 'top' | 'bottom' = 'right'): Variants => {
  const positions = {
    left: { x: '-100%', y: 0 },
    right: { x: '100%', y: 0 },
    top: { x: 0, y: '-100%' },
    bottom: { x: 0, y: '100%' }
  };

  return {
    hidden: positions[side],
    visible: {
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      ...positions[side],
      transition: {
        duration: 0.25
      }
    }
  };
};

/**
 * List item stagger variants
 * For use with motion components in lists
 */
export const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionConfig.durations.fast
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: motionConfig.durations.fast
    }
  }
};

/**
 * Card hover variants
 * For interactive cards that lift on hover
 */
export const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: {
      duration: 0.1
    }
  }
};
