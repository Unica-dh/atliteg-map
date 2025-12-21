'use client';

import { useApp } from '@/context/AppContext';
import { getUniqueCategorie, getUniquePeriodi } from '@/services/dataLoader';
import { useMemo, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, Search, Check } from 'lucide-react';

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
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
          width: rect.width
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
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium text-text-secondary whitespace-nowrap">
        {label}:
      </label>

      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`px-3 py-1.5 flex items-center gap-2 border ${colors.button} rounded-md transition-fast focus:outline-none bg-white text-xs`}
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

        {isOpen && mounted && createPortal(
          <div
            ref={dropdownRef}
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
            <div className="max-h-[32rem] overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  Nessun risultato trovato
                </div>
              ) : (
                filteredOptions.map(option => {
                  const isSelected = selectedValues.includes(option);
                  return (
                    <label
                      key={option}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${colors.hover} transition-colors border-b border-gray-100 last:border-b-0`}
                    >
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleOption(option)}
                          className={`w-4 h-4 rounded border-gray-300 ${colors.checkbox} focus:ring-offset-0`}
                        />
                        {isSelected && (
                          <Check className="absolute w-3 h-3 text-white pointer-events-none left-0.5" />
                        )}
                      </div>
                      <span className="text-sm text-gray-700 flex-1">{option}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>,
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
      <div className="max-w-container mx-auto px-lg py-3">
        <div className="flex items-center gap-4 flex-wrap">
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

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-3 py-2 bg-accent text-white rounded-md hover:bg-accent-hover transition-fast text-xs font-medium"
              aria-label="Reset filtri"
            >
              <X className="w-3 h-3" />
              Reset
            </button>
          )}

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {filters.categorie.map(cat => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary-light text-primary rounded-sm text-xs font-medium"
                >
                  {cat}
                  <button
                    onClick={() => toggleCategoria(cat)}
                    className="hover:bg-primary/10 rounded-sm p-0.5 transition-fast"
                    aria-label={`Rimuovi ${cat}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.periodi.map(per => (
                <span
                  key={per}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary-light text-accent rounded-sm text-xs font-medium"
                >
                  {per}
                  <button
                    onClick={() => togglePeriodo(per)}
                    className="hover:bg-accent/10 rounded-sm p-0.5 transition-fast"
                    aria-label={`Rimuovi ${per}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
