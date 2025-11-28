import { useMemo } from 'react';
import type { Lemma } from '../types';
import { useAppContext } from '../context/AppContext';
import { Badge } from './ui/badge';

interface AlphabeticalIndexProps {
  lemmas: Lemma[];
  onLemmaSelect: (lemma: Lemma) => void;
  onLetterChange: (letter: string | null) => void;
}

export function AlphabeticalIndex({ lemmas, onLemmaSelect }: AlphabeticalIndexProps) {
  const { filters, setSelectedLetter } = useAppContext();

  // Get all unique first letters from lemmas
  const availableLetters = useMemo(() => 
    Array.from(
      new Set(
        lemmas.map(lemma => lemma.Lemma.charAt(0).toUpperCase())
      )
    ).sort(),
    [lemmas]
  );

  // Generate all alphabet letters
  const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Handle letter selection
  const handleLetterClick = (letter: string | null) => {
    setSelectedLetter(letter);
  };

  // Filter lemmas by selected letter if any
  const displayedLemmas = useMemo(() => {
    if (!filters.selectedLetter) return lemmas;
    return lemmas.filter(l => 
      l.Lemma.charAt(0).toUpperCase() === filters.selectedLetter
    );
  }, [lemmas, filters.selectedLetter]);

  // Group lemmas by name to show unique lemmas with all their forms
  const uniqueLemmas = useMemo(() => {
    const groupedLemmas = displayedLemmas.reduce((acc, lemma) => {
      const lemmaName = lemma.Lemma.toLowerCase();
      if (!acc[lemmaName]) {
        acc[lemmaName] = [];
      }
      acc[lemmaName].push(lemma);
      return acc;
    }, {} as Record<string, Lemma[]>);

    return Object.entries(groupedLemmas).map(([name, group]) => ({
      name: group[0].Lemma,
      lemma: group[0], // Representative lemma for clicking
      forms: Array.from(new Set(group.map(l => l.Forma))),
      locations: Array.from(new Set(group.map(l => l.CollGeografica))),
      count: group.length
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [displayedLemmas]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900 text-lg font-semibold">Indice Alfabetico</h2>
        {filters.selectedLetter && (
          <Badge variant="secondary">
            Lettera: {filters.selectedLetter}
          </Badge>
        )}
      </div>

      {/* Alphabet buttons */}
      <div className="flex flex-wrap gap-2">
        {/* "Tutti" button */}
        <button
          onClick={() => handleLetterClick(null)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filters.selectedLetter === null
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-label="Mostra tutti i lemmi"
          aria-pressed={filters.selectedLetter === null}
        >
          Tutti
        </button>

        {/* Letter buttons */}
        {allLetters.map(letter => {
          const isAvailable = availableLetters.includes(letter);
          const isSelected = filters.selectedLetter === letter;
          const letterCount = lemmas.filter(l => 
            l.Lemma.charAt(0).toUpperCase() === letter
          ).length;

          return (
            <button
              key={letter}
              onClick={() => isAvailable && handleLetterClick(letter)}
              disabled={!isAvailable}
              className={`px-4 py-2 rounded-lg transition-colors min-w-[44px] relative ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md'
                  : isAvailable
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
              aria-label={`Lettera ${letter}${isAvailable ? ` - ${letterCount} lemmi` : ' - nessun lemma'}`}
              aria-pressed={isSelected}
              title={isAvailable ? `${letterCount} lemmi` : 'Nessun lemma'}
            >
              {letter}
              {isAvailable && !isSelected && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {letterCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-3">
        <span>{uniqueLemmas.length} lemm{uniqueLemmas.length === 1 ? 'a' : 'i'} trovat{uniqueLemmas.length === 1 ? 'o' : 'i'}</span>
        {filters.selectedLetter && (
          <button
            onClick={() => handleLetterClick(null)}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Mostra tutti
          </button>
        )}
      </div>

      {/* Lemmas list - with max height and scroll */}
      <div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 max-h-[600px] overflow-y-auto pr-2"
        role="list"
        aria-label="Elenco lemmi"
      >
        {uniqueLemmas.map(({ name, lemma, forms, locations }) => (
          <button
            key={lemma.IdLemma}
            onClick={() => onLemmaSelect(lemma)}
            className="text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm group"
            title={`Forme: ${forms.join(', ')}\nLocalità: ${locations.join(', ')}`}
            role="listitem"
            aria-label={`Lemma ${name}`}
          >
            <div className="font-medium text-blue-600 group-hover:text-blue-700">
              {name}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {forms.length} form{forms.length === 1 ? 'a' : 'e'}
            </div>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {uniqueLemmas.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>Nessun lemma trovato per la lettera selezionata</p>
        </div>
      )}
    </div>
  );
}