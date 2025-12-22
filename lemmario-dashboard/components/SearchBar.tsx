'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { useHighlight } from '@/context/HighlightContext';
import { Lemma } from '@/types/lemma';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StaggerContainer, StaggerItem } from '@/components/MotionWrapper';
import { motionConfig } from '@/lib/motion-config';

export const SearchBar: React.FC = () => {
  const { lemmi, setFilters } = useApp();
  const { highlightMultiple, clearHighlight, isLemmaHighlighted } = useHighlight();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Lemma[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length > 0) {
        const uniqueResults = new Map<string, Lemma>();
        const lowerQuery = query.toLowerCase();
        
        for (const lemma of lemmi) {
          if (uniqueResults.size >= 10) break;
          
          const matches = 
            lemma.Lemma.toLowerCase().includes(lowerQuery) ||
            lemma.Forma.toLowerCase().includes(lowerQuery);
            
          if (matches) {
            const key = `${lemma.Lemma}|${lemma.Forma}`;
            if (!uniqueResults.has(key)) {
              uniqueResults.set(key, lemma);
            }
          }
        }
        
        setSuggestions(Array.from(uniqueResults.values()));
        setIsOpen(uniqueResults.size > 0);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, lemmi]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lemma: Lemma) => {
    setFilters({ searchQuery: lemma.Lemma, selectedLemmaId: lemma.IdLemma });
    setQuery(lemma.Lemma);
    setIsOpen(false);
    setHighlightedIndex(-1);
    
    // Evidenzia lemma selezionato e correlati
    highlightMultiple({
      lemmaIds: [lemma.IdLemma],
      geoAreaIds: [lemma.CollGeografica],
      years: [parseInt(lemma.Anno)],
      source: 'search',
      type: 'select'
    });
  };

  const handleClear = () => {
    setQuery('');
    setFilters({ searchQuery: '', selectedLemmaId: null });
    setSuggestions([]);
    setIsOpen(false);
    clearHighlight();
    inputRef.current?.focus();
  };

  const handleSuggestionHover = (lemma: Lemma, index: number) => {
    setHighlightedIndex(index);
    
    // Evidenzia temporaneamente al hover
    highlightMultiple({
      lemmaIds: [lemma.IdLemma],
      geoAreaIds: [lemma.CollGeografica],
      years: [parseInt(lemma.Anno)],
      source: 'search',
      type: 'hover'
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 text-gray-900">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative w-full max-w-3xl">
      <motion.div 
        className="relative card overflow-hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={motionConfig.transitions.medium}
      >
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Cerca per lemma o forma..."
          className="w-full pl-12 pr-12 py-4 text-lg bg-transparent border-0 focus:outline-none focus:border-accent text-text-primary focus:ring-2 focus:ring-accent/20 transition-all duration-200"
          style={{
            boxShadow: 'none'
          }}
          aria-label="Cerca lemmi o forme"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={isOpen}
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={motionConfig.transitions.fast}
              onClick={handleClear}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-accent transition-fast p-1 hover:bg-background-muted rounded-md"
              aria-label="Cancella ricerca"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            id="search-suggestions"
            className="absolute z-[1000] w-full mt-3 card shadow-card-hover max-h-[500px] overflow-y-auto"
            role="listbox"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={motionConfig.transitions.medium}
          >
            <StaggerContainer staggerDelay={0.05}>
              {suggestions.map((lemma, index) => (
                <StaggerItem key={`${lemma.IdLemma}-${index}`}>
                  <motion.div
                    layoutId={`lemma-card-${lemma.IdLemma}`}
                    onClick={() => handleSelect(lemma)}
                    onMouseEnter={() => handleSuggestionHover(lemma, index)}
                    onMouseLeave={() => clearHighlight()}
                    className={`px-5 py-4 cursor-pointer border-b border-border last:border-b-0 transition-normal ${
                      highlightedIndex === index || isLemmaHighlighted(lemma.IdLemma)
                        ? 'bg-primary-light border-l-4 border-l-primary'
                        : 'hover:bg-background-muted'
                    }`}
                    role="option"
                    aria-selected={highlightedIndex === index}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-semibold text-text-primary text-lg mb-1">
                      {highlightText(lemma.Lemma, query)}
                    </div>
                    <div className="text-sm text-text-secondary">
                      Forma: {highlightText(lemma.Forma, query)}
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </motion.div>
        )}
      </AnimatePresence>

      {query.length > 0 && suggestions.length === 0 && !isOpen && (
        <div className="absolute z-[1000] w-full mt-3 card shadow-card-hover p-6 text-center text-text-muted">
          <Search className="w-12 h-12 mx-auto mb-3 text-border-divider" />
          <p className="font-medium">Nessun risultato trovato</p>
          <p className="text-sm mt-1">Prova con un termine diverso</p>
        </div>
      )}
    </div>
  );
};
