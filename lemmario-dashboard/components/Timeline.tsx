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
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Timeline Storica</h2>
        <div className="text-sm text-text-secondary bg-background-muted px-3 py-1.5 rounded-md">
          <span className="font-semibold text-primary">{yearsWithData}</span> anni con lemmi •{' '}
          <span className="font-semibold text-primary">{years.length}</span> totali
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="p-2.5 rounded-md bg-background-muted hover:bg-primary-light transition-normal disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Anni precedenti"
        >
          <ChevronLeft className="w-5 h-5 text-primary" />
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
                  className={`rounded-full transition-normal shadow-sm ${
                    filters.selectedYear === yearItem.year.toString()
                      ? 'bg-primary w-6 h-6 border-2 border-primary-hover scale-110'
                      : yearItem.hasData
                      ? 'bg-timeline-dot w-5 h-5 border-2 border-accent-hover hover:scale-110'
                      : 'bg-white w-5 h-5 border-2 border-border hover:border-border-divider'
                  }`}
                  style={{
                    width: filters.selectedYear === yearItem.year.toString() ? '10px' : undefined,
                    height: filters.selectedYear === yearItem.year.toString() ? '10px' : undefined,
                  }}
                  aria-label={`Anno ${yearItem.year}${
                    yearItem.hasData ? ' con attestazioni' : ' senza attestazioni'
                  }`}
                  title={`${yearItem.year}${
                    yearItem.hasData
                      ? ` - ${yearItem.lemmas.length} lemmi`
                      : ' - nessuna attestazione'
                  }`}
                />
                <div className="text-xs text-text-primary mt-2 font-medium">
                  {yearItem.year}
                </div>
                {yearItem.hasData && (
                  <div className="text-[10px] text-text-muted mt-1 text-center max-w-[100px]">
                    <div className="truncate font-medium text-primary" title={yearItem.lemmas.join(', ')}>
                      {yearItem.lemmas.slice(0, 2).join(', ')}
                      {yearItem.lemmas.length > 2 && '...'}
                    </div>
                    <div className="text-text-muted font-medium">
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
          className="p-2.5 rounded-md bg-background-muted hover:bg-primary-light transition-normal disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Anni successivi"
        >
          <ChevronRight className="w-5 h-5 text-primary" />
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`h-2 rounded-full transition-normal ${
              currentPage === i ? 'bg-primary w-6' : 'bg-border-divider w-2 hover:bg-border'
            }`}
            aria-label={`Pagina ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
