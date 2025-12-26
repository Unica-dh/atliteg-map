'use client';

import { useApp } from '@/context/AppContext';
import { getUniqueCategorie, getUniquePeriodi } from '@/services/dataLoader';
import { useMemo, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, Search, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StaggerContainer, StaggerItem } from '@/components/MotionWrapper';
import { motionConfig } from '@/lib/motion-config';

interface MultiSelectProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  color?: 'blue' | 'purple';
}

function MultiSelect({ label, options, selectedValues, onChange, placeholder, color = 'blue' }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Ensure component is mounted before using Portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Update dropdown position when opened or on scroll/resize
  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        // Minimum dropdown width for usability
        const minDropdownWidth = 280;
        const dropdownWidth = Math.max(rect.width, minDropdownWidth);
        
        // Calculate initial left position
        let leftPosition = rect.left + window.scrollX;
        
        // Check if dropdown would overflow right edge of viewport
        const wouldOverflowRight = (rect.left + dropdownWidth) > viewportWidth;
        
        // On mobile or when would overflow, align to right edge of button
        if (wouldOverflowRight || viewportWidth < 768) {
          // Align dropdown's right edge with button's right edge
          leftPosition = rect.right + window.scrollX - dropdownWidth;
          
          // Ensure dropdown doesn't go off left edge
          leftPosition = Math.max(8, leftPosition);
        }
        
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 8,
          left: leftPosition,
          width: dropdownWidth
        });
      }
    };

    updatePosition();

    if (isOpen) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  // Chiudi dropdown quando si clicca fuori
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter(opt => 
      opt.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const toggleOption = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const selectAll = () => {
    onChange(filteredOptions);
  };

  const clearAll = () => {
    onChange([]);
  };

  const colorClasses = {
    blue: {
      button: 'border-primary hover:border-primary-hover focus:ring-accent',
      badge: 'bg-primary text-white',
      checkbox: 'text-primary focus:ring-accent',
      hover: 'hover:bg-primary-light',
      selectBtn: 'text-primary hover:text-primary-hover'
    },
    purple: {
      button: 'border-accent hover:border-accent-hover focus:ring-accent',
      badge: 'bg-accent text-white',
      checkbox: 'text-accent focus:ring-accent',
      hover: 'hover:bg-primary-light',
      selectBtn: 'text-accent hover:text-accent-hover'
    }
  };

  const colors = colorClasses[color];


  return (
    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 w-full md:w-auto">
      <label className="text-xs font-medium text-text-secondary whitespace-nowrap">
        {label}:
      </label>

      <div className="relative w-full md:w-auto">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full md:w-auto px-3 py-1.5 flex items-center gap-2 border ${colors.button} rounded-md transition-fast focus:outline-none bg-white text-xs`}
        >
          <span className="text-text-secondary">
            {selectedValues.length === 0 ? (
              placeholder
            ) : (
              `${selectedValues.length}`
            )}
          </span>

          <ChevronDown className={`w-3 h-3 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {mounted && createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={motionConfig.transitions.fast}
                style={{
                  position: 'fixed',
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                  width: `${dropdownPosition.width}px`,
                  zIndex: 9999
                }}
                className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
              >
            {/* Barra di ricerca */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cerca..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Azioni rapide */}
            <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 flex gap-2 text-xs">
              <button
                type="button"
                onClick={selectAll}
                className={`${colors.selectBtn} font-medium hover:underline`}
              >
                Seleziona tutti
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={clearAll}
                className="text-gray-600 hover:text-gray-700 font-medium hover:underline"
              >
                Deseleziona tutti
              </button>
            </div>

            {/* Lista opzioni */}
            <StaggerContainer staggerDelay={0.02}>
              <div className="max-h-[32rem] overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-500">
                    Nessun risultato trovato
                  </div>
                ) : (
                  filteredOptions.map(option => {
                    const isSelected = selectedValues.includes(option);
                    return (
                      <StaggerItem key={option}>
                        <motion.label
                          whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0`}
                        >
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleOption(option)}
                              className={`w-4 h-4 rounded border-gray-300 ${colors.checkbox} focus:ring-offset-0`}
                            />
                            <AnimatePresence>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: 180 }}
                                  transition={motionConfig.spring.fast}
                                >
                                  <Check className="absolute w-3 h-3 text-white pointer-events-none left-0.5" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <span className="text-sm text-gray-700 flex-1">{option}</span>
                        </motion.label>
                      </StaggerItem>
                    );
                  })
                )}
              </div>
            </StaggerContainer>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </div>
  );
}

export function Filters() {
  const { lemmi, filters, setFilters, resetFilters } = useApp();

  const categorie = useMemo(() => getUniqueCategorie(lemmi), [lemmi]);
  const periodi = useMemo(() => getUniquePeriodi(lemmi), [lemmi]);

  const toggleCategoria = (cat: string) => {
    const newCategorie = filters.categorie.includes(cat)
      ? filters.categorie.filter(c => c !== cat)
      : [...filters.categorie, cat];
    setFilters({ categorie: newCategorie });
  };

  const togglePeriodo = (per: string) => {
    const newPeriodi = filters.periodi.includes(per)
      ? filters.periodi.filter(p => p !== per)
      : [...filters.periodi, per];
    setFilters({ periodi: newPeriodi });
  };

  const hasActiveFilters = filters.categorie.length > 0 || filters.periodi.length > 0;

  return (
    <div className="bg-white/70 backdrop-blur-md border-b border-border">
      <div className="max-w-container mx-auto px-3 md:px-lg py-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <MultiSelect
            label="Categoria"
            options={categorie}
            selectedValues={filters.categorie}
            onChange={(values) => setFilters({ categorie: values })}
            placeholder="Seleziona..."
            color="blue"
          />

          <MultiSelect
            label="Periodo"
            options={periodi}
            selectedValues={filters.periodi}
            onChange={(values) => setFilters({ periodi: values })}
            placeholder="Seleziona..."
            color="purple"
          />

          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetFilters}
                className="flex items-center gap-2 px-3 py-2 bg-accent text-white rounded-md hover:bg-accent-hover transition-fast text-xs font-medium"
                aria-label="Reset filtri"
              >
                <X className="w-3 h-3" />
                Reset
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div 
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <StaggerContainer staggerDelay={0.05}>
                  {filters.categorie.map(cat => (
                    <StaggerItem key={cat}>
                      <motion.span
                        layout
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary-light text-primary rounded-sm text-xs font-medium"
                      >
                        {cat}
                        <motion.button
                          whileHover={{ rotate: 90 }}
                          whileTap={{ scale: 0.8 }}
                          onClick={() => toggleCategoria(cat)}
                          className="hover:bg-primary/10 rounded-sm p-0.5 transition-fast"
                          aria-label={`Rimuovi ${cat}`}
                        >
                          <X className="w-3 h-3" />
                        </motion.button>
                      </motion.span>
                    </StaggerItem>
                  ))}
                  {filters.periodi.map(per => (
                    <StaggerItem key={per}>
                      <motion.span
                        layout
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary-light text-accent rounded-sm text-xs font-medium"
                      >
                        {per}
                        <motion.button
                          whileHover={{ rotate: 90 }}
                          whileTap={{ scale: 0.8 }}
                          onClick={() => togglePeriodo(per)}
                          className="hover:bg-accent/10 rounded-sm p-0.5 transition-fast"
                          aria-label={`Rimuovi ${per}`}
                        >
                          <X className="w-3 h-3" />
                        </motion.button>
                      </motion.span>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
