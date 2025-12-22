'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Lemma } from '@/types/lemma';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const itemsPerPage = 12; // Mostra 12 quarti di secolo per volta

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

  // Calcola statistiche corrette
  const totalOccorrenze = quartCenturies.reduce((sum, q) => sum + q.attestazioni, 0);
  const totalLemmi = new Set(quartCenturies.flatMap(q => q.lemmas)).size;
  const maxAttestazioni = Math.max(...quartCenturies.map(q => q.attestazioni), 1);

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
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">Linea del tempo</h2>
        <div className="text-xs text-gray-500">
          <span className="font-semibold text-blue-600">{totalLemmi}</span> lemmi •{' '}
          <span className="font-semibold text-blue-600">{totalOccorrenze}</span> occorrenze
        </div>
      </div>

      {/* Timeline con frecce */}
      <div className="flex items-end gap-3">
        {/* Freccia sinistra */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="flex-shrink-0 p-2 rounded-md bg-gray-100 hover:bg-blue-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Periodo precedente"
        >
          <ChevronLeft className="w-5 h-5 text-blue-600" />
        </button>

        {/* Barre verticali */}
        <div className="flex-1 flex items-end justify-around gap-1 h-24">
          {visibleQuarts.map((quartItem) => {
            const [startYear, endYear] = getYearRangeFromQuartCentury(quartItem.quartCentury);
            const isSelected = selectedQuart === quartItem.quartCentury;
            const heightPx = Math.max((quartItem.attestazioni / maxAttestazioni) * 80, 10);

            return (
              <div
                key={quartItem.quartCentury}
                className="flex flex-col items-center flex-1 min-w-0"
              >
                {/* Barra verticale */}
                <button
                  onClick={() => handleQuartClick(quartItem.quartCentury)}
                  className={`w-full rounded-t transition-all ${
                    isSelected
                      ? 'bg-blue-600 shadow-md'
                      : 'bg-blue-400 hover:bg-blue-500'
                  }`}
                  style={{ height: `${heightPx}px` }}
                  title={`${startYear}-${endYear}: ${quartItem.attestazioni} occorrenze`}
                />
                
                {/* Label con periodo */}
                <div className="mt-1 text-center">
                  <div className={`text-[10px] font-semibold ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
                    {quartItem.quartCentury}
                  </div>
                  <div className="text-[9px] text-gray-400">
                    {startYear}-{endYear}
                  </div>
                  {isSelected && (
                    <div className="text-[10px] font-medium text-blue-600 mt-0.5">
                      {quartItem.attestazioni} occ.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Freccia destra */}
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages - 1}
          className="flex-shrink-0 p-2 rounded-md bg-gray-100 hover:bg-blue-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Periodo successivo"
        >
          <ChevronRight className="w-5 h-5 text-blue-600" />
        </button>
      </div>
    </div>
  );
};
