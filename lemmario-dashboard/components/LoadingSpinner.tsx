'use client';

import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { motionConfig } from '@/lib/motion-config';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={motionConfig.transitions.medium}
      >
        {/* Spinner con pulsazione */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: 360
          }}
          transition={{
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            },
            rotate: {
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }
          }}
          className="mx-auto mb-4"
        >
          <Loader2 className="w-12 h-12 text-blue-600" />
        </motion.div>

        {/* Testo con fade in/out */}
        <motion.p 
          className="text-gray-600 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          Caricamento dati...
        </motion.p>

        {/* Barra di progresso animata */}
        <div className="mt-6 w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{ width: '50%' }}
          />
        </div>
      </motion.div>
    </div>
  );
}
