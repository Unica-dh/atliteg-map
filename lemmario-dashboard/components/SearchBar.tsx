'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Lemma } from '@/types/lemma';
import { Search, X, MapPin, Calendar } from 'lucide-react';

export const SearchBar: React.FC = () => {
  const { lemmi, setFilters } = useApp();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Lemma[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length > 0) {
        const filtered = lemmi.filter(
          (lemma: Lemma) =>
            lemma.Lemma.toLowerCase().includes(query.toLowerCase()) ||
            lemma.Forma.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 10));
        setIsOpen(filtered.length > 0);
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
  };

  const handleClear = () => {
    setQuery('');
    setFilters({ searchQuery: '', selectedLemmaId: null });
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
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
      <div className="relative card overflow-hidden">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Cerca per lemma o forma..."
          className="w-full pl-12 pr-12 py-4 text-lg bg-transparent border-0 focus:outline-none focus:border-accent text-text-primary"
          style={{
            boxShadow: 'none'
          }}
          aria-label="Cerca lemmi o forme"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={isOpen}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-accent transition-fast p-1 hover:bg-background-muted rounded-md"
            aria-label="Cancella ricerca"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          id="search-suggestions"
          className="absolute z-[1000] w-full mt-3 card shadow-card-hover max-h-[500px] overflow-y-auto"
          role="listbox"
        >
          {suggestions.map((lemma, index) => (
            <div
              key={`${lemma.IdLemma}-${index}`}
              onClick={() => handleSelect(lemma)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`px-5 py-4 cursor-pointer border-b border-border last:border-b-0 transition-normal ${
                highlightedIndex === index
                  ? 'bg-primary-light border-l-4 border-l-primary'
                  : 'hover:bg-background-muted'
              }`}
              role="option"
              aria-selected={highlightedIndex === index}
            >
              <div className="font-semibold text-text-primary text-lg mb-1">
                {highlightText(lemma.Lemma, query)}
              </div>
              <div className="text-sm text-text-secondary mb-2">
                Forma: {highlightText(lemma.Forma, query)}
              </div>
              <div className="flex items-center gap-3 text-xs text-text-muted">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {lemma.CollGeografica}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {lemma.Anno || lemma.Periodo}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

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
