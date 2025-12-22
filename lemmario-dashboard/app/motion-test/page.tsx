/**
 * Motion System Test Page
 * Pagina di test per verificare tutte le funzionalità del sistema motion
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FadeIn, 
  SlideIn, 
  ScaleIn, 
  StaggerContainer, 
  StaggerItem,
  MotionWrapper 
} from '@/components/MotionWrapper';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { motionConfig } from '@/lib/motion-config';

export default function MotionTestPage() {
  const [showModal, setShowModal] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const testCards = [
    { id: 1, title: 'Card 1', color: 'bg-blue-100' },
    { id: 2, title: 'Card 2', color: 'bg-green-100' },
    { id: 3, title: 'Card 3', color: 'bg-purple-100' },
    { id: 4, title: 'Card 4', color: 'bg-orange-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <FadeIn>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Motion System Test
          </h1>
          <p className="text-gray-600 mb-8">
            Test delle funzionalità di animazione - 
            <span className={prefersReducedMotion ? 'text-orange-600 font-semibold' : 'text-green-600 font-semibold'}>
              {prefersReducedMotion ? ' Reduced Motion ATTIVO' : ' Animazioni ATTIVE'}
            </span>
          </p>
        </div>
      </FadeIn>

      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Test 1: Fade In */}
        <section>
          <SlideIn direction="left">
            <h2 className="text-2xl font-semibold mb-4">1. Fade In Animation</h2>
          </SlideIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FadeIn delay={0}>
              <div className="p-6 bg-white rounded-lg shadow">
                <p className="font-medium">Delay 0s</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="p-6 bg-white rounded-lg shadow">
                <p className="font-medium">Delay 0.2s</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="p-6 bg-white rounded-lg shadow">
                <p className="font-medium">Delay 0.4s</p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Test 2: Slide In Directions */}
        <section>
          <SlideIn direction="left">
            <h2 className="text-2xl font-semibold mb-4">2. Slide In Directions</h2>
          </SlideIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SlideIn direction="left">
              <div className="p-6 bg-blue-100 rounded-lg text-center">
                <p className="font-medium">← Left</p>
              </div>
            </SlideIn>
            <SlideIn direction="right">
              <div className="p-6 bg-green-100 rounded-lg text-center">
                <p className="font-medium">Right →</p>
              </div>
            </SlideIn>
            <SlideIn direction="up">
              <div className="p-6 bg-purple-100 rounded-lg text-center">
                <p className="font-medium">↑ Up</p>
              </div>
            </SlideIn>
            <SlideIn direction="down">
              <div className="p-6 bg-orange-100 rounded-lg text-center">
                <p className="font-medium">Down ↓</p>
              </div>
            </SlideIn>
          </div>
        </section>

        {/* Test 3: Scale Animation */}
        <section>
          <SlideIn direction="left">
            <h2 className="text-2xl font-semibold mb-4">3. Scale In Animation</h2>
          </SlideIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ScaleIn delay={0}>
              <div className="p-6 bg-indigo-100 rounded-lg">
                <p className="font-medium">Scale 1</p>
              </div>
            </ScaleIn>
            <ScaleIn delay={0.1}>
              <div className="p-6 bg-pink-100 rounded-lg">
                <p className="font-medium">Scale 2</p>
              </div>
            </ScaleIn>
            <ScaleIn delay={0.2}>
              <div className="p-6 bg-yellow-100 rounded-lg">
                <p className="font-medium">Scale 3</p>
              </div>
            </ScaleIn>
          </div>
        </section>

        {/* Test 4: Stagger Animation */}
        <section>
          <SlideIn direction="left">
            <h2 className="text-2xl font-semibold mb-4">4. Stagger List Animation</h2>
          </SlideIn>
          <StaggerContainer staggerDelay={0.1}>
            {testCards.map((card) => (
              <StaggerItem key={card.id}>
                <div className={`p-6 ${card.color} rounded-lg mb-3`}>
                  <p className="font-medium">{card.title}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Test 5: Hover Effects */}
        <section>
          <SlideIn direction="left">
            <h2 className="text-2xl font-semibold mb-4">5. Hover & Tap Effects</h2>
          </SlideIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              className="p-6 bg-white rounded-lg shadow cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={motionConfig.spring.default}
            >
              <p className="font-medium">Hover & Click Me!</p>
              <p className="text-sm text-gray-600 mt-2">Scale effect</p>
            </motion.div>

            <motion.div
              className="p-6 bg-white rounded-lg shadow cursor-pointer"
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              transition={motionConfig.transitions.fast}
            >
              <p className="font-medium">Hover Me!</p>
              <p className="text-sm text-gray-600 mt-2">Lift effect</p>
            </motion.div>

            <motion.div
              className="p-6 bg-white rounded-lg shadow cursor-pointer"
              whileHover={{ rotate: 2 }}
              whileTap={{ rotate: -2 }}
              transition={motionConfig.spring.bouncy}
            >
              <p className="font-medium">Hover & Click!</p>
              <p className="text-sm text-gray-600 mt-2">Rotate effect</p>
            </motion.div>
          </div>
        </section>

        {/* Test 6: Modal Animation */}
        <section>
          <SlideIn direction="left">
            <h2 className="text-2xl font-semibold mb-4">6. Modal Animation</h2>
          </SlideIn>
          <motion.button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Open Modal
          </motion.button>

          <AnimatePresence>
            {showModal && (
              <>
                {/* Backdrop */}
                <motion.div
                  className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowModal(false)}
                />
                
                {/* Modal */}
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={motionConfig.spring.default}
                >
                  <div 
                    className="bg-white rounded-xl shadow-2xl p-8 max-w-md pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-2xl font-bold mb-4">Modal Test</h3>
                    <p className="text-gray-600 mb-6">
                      Questo modal appare con animazione di scale e fade.
                      Il backdrop ha fade in/out.
                    </p>
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Chiudi
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </section>

        {/* Test 7: CSS Transitions */}
        <section>
          <SlideIn direction="left">
            <h2 className="text-2xl font-semibold mb-4">7. CSS Utility Classes</h2>
          </SlideIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-white rounded-lg shadow transition-fast hover:bg-blue-50 cursor-pointer">
              <p className="font-medium">.transition-fast</p>
              <p className="text-sm text-gray-600">150ms</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow transition-medium hover:bg-green-50 cursor-pointer">
              <p className="font-medium">.transition-medium</p>
              <p className="text-sm text-gray-600">300ms</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow transition-slow hover:bg-purple-50 cursor-pointer">
              <p className="font-medium">.transition-slow</p>
              <p className="text-sm text-gray-600">500ms</p>
            </div>
          </div>
        </section>

        {/* Test 8: Loading Skeleton */}
        <section className="pb-12">
          <SlideIn direction="left">
            <h2 className="text-2xl font-semibold mb-4">8. Skeleton Loading</h2>
          </SlideIn>
          <div className="space-y-3">
            <div className="skeleton h-12 w-full rounded-lg"></div>
            <div className="skeleton h-12 w-3/4 rounded-lg"></div>
            <div className="skeleton h-12 w-1/2 rounded-lg"></div>
          </div>
        </section>

      </div>
    </div>
  );
}
