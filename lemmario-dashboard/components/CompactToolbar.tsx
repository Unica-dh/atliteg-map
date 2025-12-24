'use client';

import { useApp } from '@/context/AppContext';
import { Search, X, ListOrdered } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Lemma } from '@/types/lemma';
import { getUniqueCategorie, getUniquePeriodi } from '@/services/dataLoader';
import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motionConfig } from '@/lib/motion-config';

interface CompactToolbarProps {
  onToggleIndice?: () => void;
}

export function CompactToolbar({ onToggleIndice }: CompactToolbarProps) {
  const { lemmi, filters, setFilters, resetFilters } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Lemma[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const categorie = useMemo(() => getUniqueCategorie(lemmi), [lemmi]);
  const periodi = useMemo(() => getUniquePeriodi(lemmi), [lemmi]);

  const hasActiveFilters = filters.categorie.length > 0 || filters.periodi.length > 0 || !!filters.selectedLemmaId;

  // Trova il lemma selezionato per visualizzarlo come filtro attivo
  const selectedLemma = useMemo(() => {
    if (!filters.selectedLemmaId) return null;
    return lemmi.find(l => l.IdLemma === filters.selectedLemmaId);
  }, [filters.selectedLemmaId, lemmi]);

  // Search suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length > 0) {
        const filtered = lemmi.filter(
          (lemma: Lemma) =>
            lemma.Lemma.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lemma.Forma.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
        setIsSearchOpen(filtered.length > 0);
      } else {
        setSuggestions([]);
        setIsSearchOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, lemmi]);

  const handleSelectLemma = (lemma: Lemma) => {
    setFilters({ searchQuery: lemma.Lemma, selectedLemmaId: lemma.IdLemma });
    setSearchQuery(lemma.Lemma);
    setIsSearchOpen(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilters({ searchQuery: '', selectedLemmaId: null });
    setSuggestions([]);
    setIsSearchOpen(false);
  };

  const handleRemoveSelectedLemma = () => {
    setFilters({ selectedLemmaId: null, searchQuery: '' });
    setSearchQuery('');
  };

  return (
    <div className="bg-white border-b border-border">
      <div className="max-w-container mx-auto px-lg py-1">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Bar - Compatta */}
          <div className="relative flex-1 min-w-[300px]" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca lemma o forma..."
                className="w-full pl-9 pr-9 py-1.5 text-sm bg-background-muted border border-border rounded-md focus:outline-none focus:border-accent"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-accent transition-fast"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Search Suggestions - Compatte */}
            {isSearchOpen && suggestions.length > 0 && (
              <div className="absolute z-[1000] w-full mt-1 bg-white border border-border rounded-md shadow-card-hover max-h-[200px] overflow-y-auto">
                {suggestions.map((lemma, index) => (
                  <div
                    key={`${lemma.IdLemma}-${index}`}
                    onClick={() => handleSelectLemma(lemma)}
                    className="px-3 py-2 cursor-pointer border-b border-border last:border-b-0 hover:bg-background-muted transition-fast"
                  >
                    <div className="font-medium text-text-primary text-sm">{lemma.Lemma}</div>
                    <div className="text-xs text-text-muted">{lemma.Forma} • {lemma.CollGeografica}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Indice Alfabetico Button */}
          {onToggleIndice && (
            <button
              onClick={onToggleIndice}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-background-muted hover:bg-primary-light border border-border rounded-md transition-fast text-xs font-medium text-primary"
              aria-label="Apri indice alfabetico"
            >
              <ListOrdered className="w-3.5 h-3.5" />
              Indice
            </button>
          )}

          {/* Filtri Inline */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary">Filtri:</span>

            <select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  setFilters({ categorie: [...filters.categorie, e.target.value] });
                }
              }}
              className="relative z-50 px-2 py-1.5 text-xs border border-border rounded-md focus:outline-none focus:border-accent bg-white"
              style={{ position: 'relative', zIndex: 9999 }}
            >
              <option value="">Categoria</option>
              {categorie.filter(c => !filters.categorie.includes(c)).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  setFilters({ periodi: [...filters.periodi, e.target.value] });
                }
              }}
              className="relative z-50 px-2 py-1.5 text-xs border border-border rounded-md focus:outline-none focus:border-accent bg-white"
              style={{ position: 'relative', zIndex: 9999 }}
            >
              <option value="">Periodo</option>
              {periodi.filter(p => !filters.periodi.includes(p)).map(per => (
                <option key={per} value={per}>{per}</option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-2 py-1.5 bg-accent text-white rounded-md hover:bg-accent-hover transition-fast text-xs flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Active Filters Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-1 ml-auto">
              {/* Lemma selezionato dall'indice alfabetico */}
              {selectedLemma && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-light text-primary rounded-sm text-xs font-medium border border-primary/20"
                >
                  {selectedLemma.Lemma}
                  <button
                    onClick={handleRemoveSelectedLemma}
                    className="hover:bg-primary/10 rounded-sm"
                    aria-label={`Rimuovi filtro lemma ${selectedLemma.Lemma}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              )}
              {filters.categorie.map(cat => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-light text-primary rounded-sm text-xs"
                >
                  {cat}
                  <button
                    onClick={() => setFilters({ categorie: filters.categorie.filter(c => c !== cat) })}
                    className="hover:bg-primary/10 rounded-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.periodi.map(per => (
                <span
                  key={per}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-light text-accent rounded-sm text-xs"
                >
                  {per}
                  <button
                    onClick={() => setFilters({ periodi: filters.periodi.filter(p => p !== per) })}
                    className="hover:bg-accent/10 rounded-sm"
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
