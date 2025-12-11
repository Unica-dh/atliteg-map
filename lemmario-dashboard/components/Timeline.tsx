'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Lemma } from '@/types/lemma';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Timeline: React.FC = () => {
  const { lemmi, filteredLemmi, filters, setFilters } = useApp();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20;

  const years = useMemo(() => {
    if (lemmi.length === 0) return [];

    const yearSet = new Set<number>();
    const yearData = new Map<number, { lemmas: Set<string>; locations: Set<string> }>();

    filteredLemmi.forEach((lemma: Lemma) => {
      const year = lemma.Anno ? parseInt(lemma.Anno) : null;
      if (year && !isNaN(year)) {
        yearSet.add(year);
        if (!yearData.has(year)) {
          yearData.set(year, { lemmas: new Set(), locations: new Set() });
        }
        yearData.get(year)!.lemmas.add(lemma.Lemma);
        yearData.get(year)!.locations.add(lemma.CollGeografica);
      }
    });

    const sortedYears = Array.from(yearSet).sort((a, b) => a - b);
    const minYear = sortedYears[0];
    const maxYear = sortedYears[sortedYears.length - 1];

    const allYears = [];
    for (let y = minYear; y <= maxYear; y++) {
      const data = yearData.get(y);
      allYears.push({
        year: y,
        hasData: yearSet.has(y),
        lemmas: data ? Array.from(data.lemmas) : [],
        locations: data ? Array.from(data.locations) : [],
      });
    }

    return allYears;
  }, [lemmi, filteredLemmi]);

  const totalPages = Math.ceil(years.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleYears = years.slice(startIndex, startIndex + itemsPerPage);

  const yearsWithData = years.filter((y) => y.hasData).length;

  const handleYearClick = (year: number) => {
    if (filters.selectedYear === year.toString()) {
      setFilters({ selectedYear: null });
    } else {
      setFilters({ selectedYear: year.toString() });
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

  if (years.length === 0) {
    return (
      <div className="card p-8">
        <div className="text-center text-gray-500">
          Nessun dato temporale disponibile
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">Timeline Storica</h2>
        <div className="text-sm text-gray-600 bg-purple-50 px-3 py-1.5 rounded-full">
          <span className="font-semibold text-purple-700">{yearsWithData}</span> anni con lemmi •{' '}
          <span className="font-semibold text-purple-700">{years.length}</span> totali
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="p-2.5 rounded-full bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
          aria-label="Anni precedenti"
        >
          <ChevronLeft className="w-5 h-5 text-purple-700" />
        </button>

        <div className="flex-1 overflow-x-auto">
          <div className="flex items-start gap-2 min-w-max px-2">
            {visibleYears.map((yearItem) => (
              <div
                key={yearItem.year}
                className="flex flex-col items-center min-w-[60px]"
              >
                <button
                  onClick={() => handleYearClick(yearItem.year)}
                  className={`w-5 h-5 rounded-full transition-all shadow-sm ${
                    filters.selectedYear === yearItem.year.toString()
                      ? 'bg-gradient-to-br from-purple-600 to-purple-700 border-2 border-purple-800 scale-125 shadow-lg shadow-purple-300'
                      : yearItem.hasData
                      ? 'bg-gradient-to-br from-purple-400 to-purple-500 border-2 border-purple-600 hover:scale-110 hover:shadow-md hover:shadow-purple-200'
                      : 'bg-white border-2 border-gray-300 hover:border-gray-400'
                  }`}
                  aria-label={`Anno ${yearItem.year}${
                    yearItem.hasData ? ' con attestazioni' : ' senza attestazioni'
                  }`}
                  title={`${yearItem.year}${
                    yearItem.hasData
                      ? ` - ${yearItem.lemmas.length} lemmi`
                      : ' - nessuna attestazione'
                  }`}
                />
                <div className="text-xs text-gray-700 mt-2 font-semibold">
                  {yearItem.year}
                </div>
                {yearItem.hasData && (
                  <div className="text-[10px] text-gray-500 mt-1 text-center max-w-[100px]">
                    <div className="truncate font-medium text-purple-700" title={yearItem.lemmas.join(', ')}>
                      {yearItem.lemmas.slice(0, 2).join(', ')}
                      {yearItem.lemmas.length > 2 && '...'}
                    </div>
                    <div className="text-gray-500 font-medium">
                      {yearItem.locations.length} loc.
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages - 1}
          className="p-2.5 rounded-full bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
          aria-label="Anni successivi"
        >
          <ChevronRight className="w-5 h-5 text-purple-700" />
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`h-2 rounded-full transition-all ${
              currentPage === i ? 'bg-gradient-to-r from-purple-500 to-purple-600 w-6 shadow-md' : 'bg-gray-300 w-2 hover:bg-gray-400'
            }`}
            aria-label={`Pagina ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
