'use client';

import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';

export function AlphabeticalIndex() {
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
    <div className="card p-6">
      <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">Indice Alfabetico</h2>
      
      {/* Griglia lettere alfabeto */}
      <div className="grid grid-cols-13 gap-2 mb-6">
        {alphabet.map(letter => {
          const hasLemmi = lettersWithLemmi.has(letter);
          const isSelected = filters.selectedLetter === letter;
          
          return (
            <button
              key={letter}
              onClick={() => hasLemmi && handleLetterClick(letter)}
              disabled={!hasLemmi}
              className={`
                p-3 text-center font-bold text-lg rounded-xl transition-all shadow-sm
                ${hasLemmi ? 'cursor-pointer' : 'cursor-not-allowed opacity-30'}
                ${isSelected 
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg scale-105' 
                  : hasLemmi 
                    ? 'bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-900 hover:from-blue-100 hover:to-indigo-100 hover:shadow-md hover:scale-105' 
                    : 'bg-gray-100 text-gray-400'
                }
              `}
              aria-label={`Lettera ${letter}${hasLemmi ? '' : ' (nessun lemma)'}`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Elenco lemmi per lettera selezionata */}
      {filters.selectedLetter && (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Lemmi che iniziano con "{filters.selectedLetter}" ({displayedLemmi.length})
          </h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {displayedLemmi.map(([lemma, occorrenze]) => (
              <div key={lemma} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-bold text-gray-900">{lemma}</h4>
                <p className="text-sm text-gray-600">
                  {occorrenze.length} {occorrenze.length === 1 ? 'occorrenza' : 'occorrenze'}
                </p>
                <div className="mt-2 text-sm text-gray-700">
                  <p><strong>Forme:</strong> {[...new Set(occorrenze.map(o => o.Forma))].join(', ')}</p>
                  <p><strong>Località:</strong> {[...new Set(occorrenze.map(o => o.CollGeografica))].join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
