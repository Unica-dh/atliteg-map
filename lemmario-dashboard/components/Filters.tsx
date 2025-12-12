'use client';

import { useApp } from '@/context/AppContext';
import { getUniqueCategorie, getUniquePeriodi } from '@/services/dataLoader';
import { useMemo, useState, useRef, useEffect } from 'react';
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      });
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
      button: 'border-blue-200 hover:border-blue-300 focus:ring-blue-500',
      badge: 'bg-blue-500 text-white',
      checkbox: 'text-blue-600 focus:ring-blue-500',
      hover: 'hover:bg-blue-50',
      selectBtn: 'text-blue-600 hover:text-blue-700'
    },
    purple: {
      button: 'border-purple-200 hover:border-purple-300 focus:ring-purple-500',
      badge: 'bg-purple-500 text-white',
      checkbox: 'text-purple-600 focus:ring-purple-500',
      hover: 'hover:bg-purple-50',
      selectBtn: 'text-purple-600 hover:text-purple-700'
    }
  };

  const colors = colorClasses[color];


  return (
    <div className="flex-1 min-w-[280px] relative">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {label}
      </label>
      
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full card px-4 py-3 flex items-center justify-between gap-2 border-2 ${colors.button} transition-all focus:outline-none focus:ring-2`}
        >
          <span className="text-sm text-gray-700 flex-1 text-left">
            {selectedValues.length === 0 ? (
              <span className="text-gray-500">{placeholder}</span>
            ) : (
              <span className="font-medium">
                {selectedValues.length} {selectedValues.length === 1 ? 'selezionato' : 'selezionati'}
              </span>
            )}
          </span>
          
          {selectedValues.length > 0 && (
            <span className={`${colors.badge} text-xs font-bold px-2.5 py-1 rounded-full`}>
              {selectedValues.length}
            </span>
          )}
          
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div 
            ref={dropdownRef}
            style={{
              position: 'fixed',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              zIndex: 10000
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
          </div>
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
    <div className="bg-white/70 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-start gap-6 flex-wrap">
          <MultiSelect
            label="Filtra per Categoria"
            options={categorie}
            selectedValues={filters.categorie}
            onChange={(values) => setFilters({ categorie: values })}
            placeholder="Seleziona categorie..."
            color="blue"
          />

          <MultiSelect
            label="Filtra per Periodo"
            options={periodi}
            selectedValues={filters.periodi}
            onChange={(values) => setFilters({ periodi: values })}
            placeholder="Seleziona periodi..."
            color="purple"
          />

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg text-sm font-semibold self-end"
              aria-label="Reset filtri"
            >
              <X className="w-4 h-4" />
              Reset Filtri
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.categorie.map(cat => (
              <span
                key={cat}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 rounded-full text-sm font-medium shadow-sm hover:shadow transition-all"
              >
                {cat}
                <button
                  onClick={() => toggleCategoria(cat)}
                  className="hover:bg-blue-200 rounded-full p-1 transition-colors"
                  aria-label={`Rimuovi ${cat}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {filters.periodi.map(per => (
              <span
                key={per}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 rounded-full text-sm font-medium shadow-sm hover:shadow transition-all"
              >
                {per}
                <button
                  onClick={() => togglePeriodo(per)}
                  className="hover:bg-purple-200 rounded-full p-1 transition-colors"
                  aria-label={`Rimuovi ${per}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
