'use client';

import { motion } from 'framer-motion';
import { motionConfig } from '@/lib/motion-config';

/**
 * Skeleton loader generico con shimmer effect
 */
export const Skeleton = ({ 
  className = '', 
  rounded = 'md',
  animate = true 
}: { 
  className?: string; 
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  animate?: boolean;
}) => {
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0 } : {}}
      animate={animate ? { opacity: 1 } : {}}
      transition={motionConfig.transitions.medium}
      className={`bg-gray-200 ${roundedClasses[rounded]} ${className} skeleton-shimmer`}
    />
  );
};

/**
 * Skeleton per MetricsSummary
 */
export const SkeletonMetrics = () => {
  return (
    <div className="flex gap-4 flex-wrap">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...motionConfig.transitions.medium, delay: i * 0.1 }}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200"
        >
          <Skeleton className="w-8 h-8 mb-2" rounded="full" />
          <Skeleton className="w-16 h-6 mb-1" />
          <Skeleton className="w-20 h-4" />
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Skeleton per Timeline
 */
export const SkeletonTimeline = () => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-32 h-5" />
        <Skeleton className="w-40 h-4" />
      </div>

      {/* Timeline bars */}
      <div className="flex items-end gap-3">
        <Skeleton className="w-10 h-10 flex-shrink-0" rounded="md" />
        
        <div className="flex-1 flex items-end justify-around gap-1 h-24">
          {[40, 70, 50, 80, 60, 90, 45, 75, 55, 65, 85, 50].map((height, i) => (
            <motion.div
              key={i}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: `${height}px`, opacity: 1 }}
              transition={{ ...motionConfig.spring.soft, delay: i * 0.05 }}
              className="flex flex-col items-center flex-1 min-w-0"
            >
              <div className="w-full bg-gray-200 rounded-sm skeleton-shimmer" style={{ height: `${height}px` }} />
              <Skeleton className="w-8 h-3 mt-1" />
              <Skeleton className="w-12 h-2 mt-0.5" />
            </motion.div>
          ))}
        </div>

        <Skeleton className="w-10 h-10 flex-shrink-0" rounded="md" />
      </div>
    </div>
  );
};

/**
 * Skeleton per LemmaDetail
 */
export const SkeletonLemmaDetail = () => {
  return (
    <div className="card p-6">
      {/* Header */}
      <div className="mb-6">
        <Skeleton className="w-3/4 h-8 mb-3" />
        <Skeleton className="w-1/2 h-5 mb-2" />
        <Skeleton className="w-2/3 h-4" />
      </div>

      {/* Sections */}
      {[1, 2, 3].map((section) => (
        <motion.div
          key={section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...motionConfig.transitions.medium, delay: section * 0.15 }}
          className="mb-6"
        >
          <Skeleton className="w-32 h-5 mb-3" />
          <div className="space-y-2">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-5/6 h-4" />
            <Skeleton className="w-4/6 h-4" />
          </div>
        </motion.div>
      ))}

      {/* Occorrenze list */}
      <div className="mt-6">
        <Skeleton className="w-40 h-5 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...motionConfig.transitions.medium, delay: 0.5 + item * 0.1 }}
              className="p-3 bg-gray-50 rounded-lg"
            >
              <Skeleton className="w-1/3 h-4 mb-2" />
              <Skeleton className="w-1/4 h-3 mb-1" />
              <Skeleton className="w-1/2 h-3" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton per GeographicalMap
 */
export const SkeletonMap = () => {
  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      {/* Background pattern simulating map */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Pulsating markers */}
      {[
        { top: '20%', left: '30%' },
        { top: '40%', left: '60%' },
        { top: '60%', left: '45%' },
        { top: '70%', left: '25%' },
        { top: '35%', left: '75%' },
      ].map((pos, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: [0, 0.6, 0.4]
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.2,
            repeat: Infinity,
            repeatType: 'reverse',
            repeatDelay: 1
          }}
          className="absolute w-6 h-6 bg-blue-400 rounded-full"
          style={pos}
        />
      ))}

      {/* Loading overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full"
        />
      </div>
    </div>
  );
};

/**
 * Skeleton per AlphabeticalIndex
 */
export const SkeletonAlphabetIndex = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="card p-4">
      <Skeleton className="w-32 h-5 mb-4" />
      
      {/* Alfabeto */}
      <div className="flex flex-wrap gap-1 mb-4">
        {alphabet.map((letter, i) => (
          <motion.div
            key={letter}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ ...motionConfig.spring.fast, delay: i * 0.02 }}
          >
            <Skeleton className="w-7 h-7" />
          </motion.div>
        ))}
      </div>

      {/* Lista lemmi */}
      <div className="border-t border-border pt-3">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...motionConfig.transitions.medium, delay: i * 0.05 }}
              className="p-2 bg-background-muted rounded"
            >
              <Skeleton className="w-3/4 h-4 mb-1" />
              <Skeleton className="w-1/2 h-3 mb-1" />
              <Skeleton className="w-full h-2" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton generico per SearchBar suggestions
 */
export const SkeletonSearchSuggestions = () => {
  return (
    <div className="space-y-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...motionConfig.transitions.fast, delay: i * 0.05 }}
          className="px-4 py-2"
        >
          <Skeleton className="w-full h-4 mb-1" />
          <Skeleton className="w-3/4 h-3" />
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Skeleton per card lemma in lista
 */
export const SkeletonLemmaCard = () => {
  return (
    <div className="card p-4">
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 flex-shrink-0" rounded="full" />
        <div className="flex-1">
          <Skeleton className="w-2/3 h-5 mb-2" />
          <Skeleton className="w-full h-4 mb-1" />
          <Skeleton className="w-5/6 h-4 mb-3" />
          <div className="flex gap-2">
            <Skeleton className="w-16 h-6" rounded="full" />
            <Skeleton className="w-20 h-6" rounded="full" />
            <Skeleton className="w-24 h-6" rounded="full" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Loading spinner riutilizzabile
 */
export const Spinner = ({ 
  size = 'md',
  color = 'blue'
}: {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white' | 'gray';
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  const colorClasses = {
    blue: 'border-gray-200 border-t-blue-600',
    white: 'border-gray-400 border-t-white',
    gray: 'border-gray-300 border-t-gray-600'
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full`}
    />
  );
};
