'use client';

import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { X } from 'lucide-react';

interface AlphabeticalIndexProps {
  onClose?: () => void;
}

export function AlphabeticalIndex({ onClose }: AlphabeticalIndexProps = {}) {
  const { lemmi, filteredLemmi, filters, setFilters } = useApp();

  // Genera alfabeto completo
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Determina quali lettere hanno lemmi
  const lettersWithLemmi = useMemo(() => {
    const letters = new Set<string>();
    lemmi.forEach(lemma => {
      if (lemma.Lemma) {
        letters.add(lemma.Lemma[0].toUpperCase());
      }
    });
    return letters;
  }, [lemmi]);

  // Lemmi visualizzati per la lettera selezionata
  const displayedLemmi = useMemo(() => {
    if (!filters.selectedLetter) return [];
    
    const lemmiForLetter = filteredLemmi.filter(lemma =>
      lemma.Lemma.toLowerCase().startsWith(filters.selectedLetter!.toLowerCase())
    );
    
    // Ordina alfabeticamente e raggruppa per lemma
    const grouped = lemmiForLetter.reduce((acc, lemma) => {
      if (!acc[lemma.Lemma]) {
        acc[lemma.Lemma] = [];
      }
      acc[lemma.Lemma].push(lemma);
      return acc;
    }, {} as Record<string, typeof lemmi>);
    
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredLemmi, filters.selectedLetter]);

  const handleLetterClick = (letter: string) => {
    if (filters.selectedLetter === letter) {
      setFilters({ selectedLetter: null });
    } else {
      setFilters({ selectedLetter: letter });
    }
  };

  return (
    <div className="card p-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-text-primary">Indice Alfabetico</h2>
          {filters.selectedLetter && (
            <span className="text-xs text-text-muted">
              {displayedLemmi.length} lemmi con "{filters.selectedLetter}"
            </span>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-background-muted rounded transition-fast text-text-muted hover:text-text-primary"
            aria-label="Chiudi indice"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Alfabeto inline - single row */}
      <div className="flex flex-wrap gap-1 mb-4">
        {alphabet.map(letter => {
          const hasLemmi = lettersWithLemmi.has(letter);
          const isSelected = filters.selectedLetter === letter;

          return (
            <button
              key={letter}
              onClick={() => hasLemmi && handleLetterClick(letter)}
              disabled={!hasLemmi}
              className={`
                w-7 h-7 text-center font-medium text-xs rounded transition-fast
                ${hasLemmi ? 'cursor-pointer' : 'cursor-not-allowed opacity-20'}
                ${isSelected
                  ? 'bg-primary text-white'
                  : hasLemmi
                    ? 'bg-background-muted text-primary hover:bg-primary-light'
                    : 'bg-background-muted text-text-muted'
                }
              `}
              aria-label={`Lettera ${letter}${hasLemmi ? '' : ' (nessun lemma)'}`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Elenco lemmi compatto - grid layout */}
      {filters.selectedLetter && displayedLemmi.length > 0 && (
        <div className="border-t border-border pt-3">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
            {displayedLemmi.map(([lemma, occorrenze]) => (
              <div key={lemma} className="bg-background-muted rounded p-2 hover:bg-primary-light transition-fast">
                <h4 className="font-medium text-text-primary text-sm truncate">{lemma}</h4>
                <p className="text-xs text-text-muted">
                  {occorrenze.length} {occorrenze.length === 1 ? 'occ.' : 'occ.'}
                </p>
                <div className="text-[10px] text-text-muted truncate">
                  {[...new Set(occorrenze.map(o => o.CollGeografica))].slice(0, 2).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
