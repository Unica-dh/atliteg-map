import { useState } from 'react';
import { Lemma } from '../data/mockData';

interface AlphabeticalIndexProps {
  lemmas: Lemma[];
  onLemmaSelect: (lemma: Lemma) => void;
  onLetterChange: (letter: string | null) => void;
}

export function AlphabeticalIndex({ lemmas, onLemmaSelect, onLetterChange }: AlphabeticalIndexProps) {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  // Get all unique first letters from lemmas
  const availableLetters = Array.from(
    new Set(
      lemmas.map(lemma => lemma.Lemma.charAt(0).toUpperCase())
    )
  ).sort();

  // Generate all alphabet letters
  const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Handle letter selection
  const handleLetterClick = (letter: string | null) => {
    setSelectedLetter(letter);
    onLetterChange(letter);
  };

  // Filter lemmas by selected letter (for display in this component only)
  const displayedLemmas = lemmas;

  // Group lemmas by name to show unique lemmas with all their forms
  const groupedLemmas = displayedLemmas.reduce((acc, lemma) => {
    const lemmaName = lemma.Lemma.toLowerCase();
    if (!acc[lemmaName]) {
      acc[lemmaName] = [];
    }
    acc[lemmaName].push(lemma);
    return acc;
  }, {} as Record<string, Lemma[]>);

  const uniqueLemmas = Object.entries(groupedLemmas).map(([name, group]) => ({
    name: group[0].Lemma,
    lemma: group[0], // Representative lemma for clicking
    forms: Array.from(new Set(group.map(l => l.Forma))),
    count: group.length
  })).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-4">
      <h2 className="text-gray-900">Indice Alfabetico</h2>

      {/* Alphabet buttons */}
      <div className="flex flex-wrap gap-2">
        {/* "Tutti" button */}
        <button
          onClick={() => handleLetterClick(null)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedLetter === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tutti
        </button>

        {/* Letter buttons */}
        {allLetters.map(letter => {
          const isAvailable = availableLetters.includes(letter);
          const isSelected = selectedLetter === letter;

          return (
            <button
              key={letter}
              onClick={() => isAvailable && handleLetterClick(letter)}
              disabled={!isAvailable}
              className={`px-4 py-2 rounded-lg transition-colors min-w-[44px] ${
                isSelected
                  ? 'bg-blue-600 text-white'
                  : isAvailable
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <div className="text-gray-600">
        {uniqueLemmas.length} lemmi trovati
      </div>

      {/* Lemmas list */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {uniqueLemmas.map(({ name, lemma, forms }) => (
          <button
            key={lemma.IdLemma}
            onClick={() => onLemmaSelect(lemma)}
            className="text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm"
            title={`Forme: ${forms.join(', ')}`}
          >
            <span className="text-blue-600">{name}</span>
            <span className="text-gray-400 ml-1">s.m.</span>
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