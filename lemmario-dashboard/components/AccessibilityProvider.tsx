'use client';

import { useEffect } from 'react';
import { initAccessibility } from '@/lib/accessibility';

/**
 * Componente che inizializza i sistemi di accessibilità lato client
 */
export function AccessibilityProvider() {
  useEffect(() => {
    initAccessibility();
  }, []);

  return null;
}
