'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Lemma } from '@/types/lemma';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

// Funzione per convertire anno in quarto di secolo
const getQuartCentury = (year: number): string => {
  const century = Math.floor(year / 100);
  const quarterInCentury = Math.floor((year % 100) / 25);
  const quarters = ['I', 'II', 'III', 'IV'];
  return `${century}${quarters[quarterInCentury]}`;
};

// Funzione per ottenere range anni da quarto di secolo
const getYearRangeFromQuartCentury = (quartCentury: string): [number, number] => {
  const century = parseInt(quartCentury.slice(0, -1));
  const quarter = quartCentury.slice(-1);
  const quarterIndex = ['I', 'II', 'III', 'IV'].indexOf(quarter);
  const start = century * 100 + quarterIndex * 25;
  const end = start + 24;
  return [start, end];
};

export const Timeline: React.FC = () => {
  const { lemmi, filteredLemmi, filters, setFilters } = useApp();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8; // Ridotto per mostrare quarti di secolo

  // Raggruppa per quarti di secolo
  const quartCenturies = useMemo(() => {
    if (lemmi.length === 0) return [];

    const quartData = new Map<string, {
      years: Set<number>;
      lemmas: Set<string>;
      locations: Set<string>;
      attestazioni: number;
    }>();

    filteredLemmi.forEach((lemma: Lemma) => {
      const year = lemma.Anno ? parseInt(lemma.Anno) : null;
      if (year && !isNaN(year)) {
        const quart = getQuartCentury(year);

        if (!quartData.has(quart)) {
          quartData.set(quart, {
            years: new Set(),
            lemmas: new Set(),
            locations: new Set(),
            attestazioni: 0
          });
        }

        const data = quartData.get(quart)!;
        data.years.add(year);
        data.lemmas.add(lemma.Lemma);
        data.locations.add(lemma.CollGeografica);
        data.attestazioni++;
      }
    });

    return Array.from(quartData.entries())
      .map(([quart, data]) => ({
        quartCentury: quart,
        hasData: data.years.size > 0,
        years: Array.from(data.years).sort((a, b) => a - b),
        lemmas: Array.from(data.lemmas),
        locations: Array.from(data.locations),
        attestazioni: data.attestazioni
      }))
      .sort((a, b) => {
        const [startA] = getYearRangeFromQuartCentury(a.quartCentury);
        const [startB] = getYearRangeFromQuartCentury(b.quartCentury);
        return startA - startB;
      });
  }, [lemmi, filteredLemmi]);

  const totalPages = Math.ceil(quartCenturies.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleQuarts = quartCenturies.slice(startIndex, startIndex + itemsPerPage);

  const totalAttestazioni = quartCenturies.reduce((sum, q) => sum + q.attestazioni, 0);

  const [selectedQuart, setSelectedQuart] = useState<string | null>(null);

  const handleQuartClick = (quart: string) => {
    if (selectedQuart === quart) {
      setSelectedQuart(null);
    } else {
      setSelectedQuart(quart);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (quartCenturies.length === 0) {
    return (
      <div className="card p-8">
        <div className="text-center text-gray-500">
          Nessun dato temporale disponibile
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Linea del tempo</h2>
        <div className="text-sm text-text-secondary bg-background-muted px-3 py-1.5 rounded-md">
          <span className="font-semibold text-primary">{quartCenturies.length}</span> quarti di secolo •{' '}
          <span className="font-semibold text-primary">{totalAttestazioni}</span> anni con attestazioni
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Pulsanti navigazione */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="p-2 rounded-md bg-background-muted hover:bg-primary-light transition-normal disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Periodo precedente"
        >
          <ChevronLeft className="w-5 h-5 text-primary" />
        </button>

        {/* Timeline con scroll minimale */}
        <div className="flex-1">
          <div className="flex items-start gap-4 overflow-x-auto px-2">
            {visibleQuarts.map((quartItem) => {
              const [startYear, endYear] = getYearRangeFromQuartCentury(quartItem.quartCentury);
              const isSelected = selectedQuart === quartItem.quartCentury;

              return (
                <div
                  key={quartItem.quartCentury}
                  className="flex flex-col items-center min-w-[120px]"
                >
                  <button
                    onClick={() => handleQuartClick(quartItem.quartCentury)}
                    className={`rounded-lg transition-all px-4 py-3 border-2 ${
                      isSelected
                        ? 'bg-primary text-white border-primary-hover scale-105 shadow-md'
                        : 'bg-white border-accent hover:bg-primary-light hover:border-primary'
                    }`}
                  >
                    <div className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-primary'}`}>
                      {quartItem.quartCentury}
                    </div>
                    <div className={`text-xs mt-1 ${isSelected ? 'text-white opacity-90' : 'text-text-muted'}`}>
                      {startYear}-{endYear}
                    </div>
                  </button>

                  {/* Info quarto selezionato */}
                  {isSelected && (
                    <div className="text-[10px] text-text-muted mt-2 text-center max-w-[140px] space-y-1">
                      <div className="font-medium text-primary">
                        {quartItem.attestazioni} attestazioni
                      </div>
                      <div className="text-text-muted">
                        {quartItem.years.length} anni • {quartItem.locations.length} località
                      </div>
                      <div className="truncate" title={quartItem.lemmas.join(', ')}>
                        {quartItem.lemmas.slice(0, 3).join(', ')}
                        {quartItem.lemmas.length > 3 && '...'}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages - 1}
          className="p-2 rounded-md bg-background-muted hover:bg-primary-light transition-normal disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Periodo successivo"
        >
          <ChevronRight className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Slider minimale per navigazione rapida */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          onClick={() => setCurrentPage(0)}
          disabled={currentPage === 0}
          className="p-1 disabled:opacity-30"
          aria-label="Prima pagina"
        >
          <ChevronsLeft className="w-4 h-4 text-primary" />
        </button>

        {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
          const pageIndex = totalPages <= 10 ? i : Math.floor((i / 10) * totalPages);
          return (
            <button
              key={i}
              onClick={() => setCurrentPage(pageIndex)}
              className={`h-2 rounded-full transition-normal ${
                currentPage === pageIndex ? 'bg-primary w-6' : 'bg-border-divider w-2 hover:bg-border'
              }`}
              aria-label={`Pagina ${pageIndex + 1}`}
            />
          );
        })}

        <button
          onClick={() => setCurrentPage(totalPages - 1)}
          disabled={currentPage >= totalPages - 1}
          className="p-1 disabled:opacity-30"
          aria-label="Ultima pagina"
        >
          <ChevronsRight className="w-4 h-4 text-primary" />
        </button>
      </div>
    </div>
  );
};
