'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  opacity: number;
  hue: number;
}

interface DataFlowVisualizerProps {
  active: boolean;
  fromElement?: HTMLElement | null;
  toElement?: HTMLElement | null;
  color?: string;
  particleCount?: number;
  duration?: number;
}

export const DataFlowVisualizer: React.FC<DataFlowVisualizerProps> = ({
  active,
  fromElement,
  toElement,
  color = '#3B82F6',
  particleCount = 15,
  duration = 1000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Calcola posizioni elementi
  const positions = useMemo(() => {
    if (!fromElement || !toElement) return null;

    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();

    return {
      from: {
        x: fromRect.left + fromRect.width / 2,
        y: fromRect.top + fromRect.height / 2,
      },
      to: {
        x: toRect.left + toRect.width / 2,
        y: toRect.top + toRect.height / 2,
      },
    };
  }, [fromElement, toElement, active]);

  useEffect(() => {
    if (!active || !positions || !canvasRef.current) {
      particlesRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Imposta dimensioni canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Crea particelle
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
      id: `particle-${i}`,
      x: positions.from.x,
      y: positions.from.y,
      targetX: positions.to.x,
      targetY: positions.to.y,
      progress: 0,
      opacity: 0,
      hue: 210 + (i % 30), // Variazione blu
    }));

    let startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Disegna linea di base (path sottile)
      ctx.strokeStyle = `${color}33`; // 20% opacity
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(positions.from.x, positions.from.y);
      ctx.lineTo(positions.to.x, positions.to.y);
      ctx.stroke();

      // Aggiorna e disegna particelle
      let allCompleted = true;

      particlesRef.current.forEach((particle, index) => {
        // Delay scaglionato per effetto stagger
        const delay = (index / particleCount) * (duration * 0.3);
        const particleElapsed = Math.max(0, elapsed - delay);
        const particleProgress = Math.min(1, particleElapsed / duration);

        // Easing out cubic
        const eased = 1 - Math.pow(1 - particleProgress, 3);

        particle.progress = eased;
        particle.opacity = Math.sin(particleProgress * Math.PI); // Fade in-out

        // Posizione corrente con curve bezier-like
        const controlPointOffset = 50; // Curvatura
        const midX = (positions.from.x + positions.to.x) / 2;
        const midY = (positions.from.y + positions.to.y) / 2 - controlPointOffset;

        // Quadratic bezier
        const t = eased;
        particle.x =
          Math.pow(1 - t, 2) * positions.from.x +
          2 * (1 - t) * t * midX +
          Math.pow(t, 2) * positions.to.x;

        particle.y =
          Math.pow(1 - t, 2) * positions.from.y +
          2 * (1 - t) * t * midY +
          Math.pow(t, 2) * positions.to.y;

        // Disegna particella
        if (particle.opacity > 0.01) {
          const size = 4 + Math.sin(particleProgress * Math.PI) * 2; // Pulsazione
          
          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
          ctx.fillStyle = `hsla(${particle.hue}, 80%, 60%, ${particle.opacity})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        if (particleProgress < 1) {
          allCompleted = false;
        }
      });

      // Continua animazione se non completata
      if (!allCompleted) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Riavvia loop per effetto continuo
        startTime = Date.now();
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [active, positions, color, particleCount, duration]);

  if (!active || !positions) return null;

  return (
    <AnimatePresence>
      <motion.canvas
        ref={canvasRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 pointer-events-none z-40"
        style={{
          mixBlendMode: 'screen', // Effetto luminoso
        }}
      />
    </AnimatePresence>
  );
};

// Componente alternativo: Flow Lines (più leggero, CSS-based)
interface FlowLineProps {
  active: boolean;
  fromElement?: HTMLElement | null;
  toElement?: HTMLElement | null;
  color?: string;
  duration?: number;
}

export const FlowLine: React.FC<FlowLineProps> = ({
  active,
  fromElement,
  toElement,
  color = '#3B82F6',
  duration = 800,
}) => {
  const positions = useMemo(() => {
    if (!fromElement || !toElement) return null;

    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();

    const from = {
      x: fromRect.left + fromRect.width / 2,
      y: fromRect.top + fromRect.height / 2,
    };

    const to = {
      x: toRect.left + toRect.width / 2,
      y: toRect.top + toRect.height / 2,
    };

    // Calcola angolo e lunghezza
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const length = Math.sqrt(dx * dx + dy * dy);

    return { from, to, angle, length };
  }, [fromElement, toElement, active]);

  if (!active || !positions) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 pointer-events-none z-40"
      >
        {/* Linea di base */}
        <motion.div
          className="absolute"
          style={{
            left: positions.from.x,
            top: positions.from.y,
            width: positions.length,
            height: 2,
            background: `linear-gradient(90deg, ${color}00 0%, ${color}88 50%, ${color}00 100%)`,
            transformOrigin: '0 50%',
            transform: `rotate(${positions.angle}deg)`,
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: duration / 1000, ease: 'easeOut' }}
        />

        {/* Particella che viaggia */}
        <motion.div
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color} 0%, ${color}88 50%, transparent 100%)`,
            boxShadow: `0 0 10px ${color}`,
          }}
          initial={{
            left: positions.from.x - 6,
            top: positions.from.y - 6,
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            left: positions.to.x - 6,
            top: positions.to.y - 6,
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.2, 1.2, 0.5],
          }}
          transition={{
            duration: duration / 1000,
            ease: 'easeInOut',
            times: [0, 0.2, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};
