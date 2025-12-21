'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Lemma } from '@/types/lemma';

export const MiniTimeline: React.FC = () => {
  const { lemmi, filteredLemmi, filters, setFilters } = useApp();

  const years = useMemo(() => {
    if (lemmi.length === 0) return [];

    const yearSet = new Set<number>();
    const yearData = new Map<number, { count: number }>();

    filteredLemmi.forEach((lemma: Lemma) => {
      const year = lemma.Anno ? parseInt(lemma.Anno) : null;
      if (year && !isNaN(year)) {
        yearSet.add(year);
        if (!yearData.has(year)) {
          yearData.set(year, { count: 0 });
        }
        yearData.get(year)!.count++;
      }
    });

    const sortedYears = Array.from(yearSet).sort((a, b) => a - b);
    if (sortedYears.length === 0) return [];

    const minYear = sortedYears[0];
    const maxYear = sortedYears[sortedYears.length - 1];

    // Create year range with data
    const allYears = [];
    for (let y = minYear; y <= maxYear; y++) {
      const data = yearData.get(y);
      allYears.push({
        year: y,
        count: data ? data.count : 0,
        hasData: yearSet.has(y),
      });
    }

    return allYears;
  }, [lemmi, filteredLemmi]);

  const handleYearClick = (year: number) => {
    if (filters.selectedYear === year.toString()) {
      setFilters({ selectedYear: null });
    } else {
      setFilters({ selectedYear: year.toString() });
    }
  };

  if (years.length === 0) {
    return null;
  }

  const maxCount = Math.max(...years.map(y => y.count));

  return (
    <div className="bg-background-muted rounded-md p-2 mt-2">
      <div className="flex items-center gap-1 mb-1">
        <span className="text-xs font-medium text-text-secondary">Timeline:</span>
        <span className="text-xs text-text-muted">
          {years[0].year} - {years[years.length - 1].year}
        </span>
      </div>

      <div className="flex items-end gap-0.5 h-12 overflow-x-auto">
        {years.map((yearItem) => {
          const height = yearItem.hasData ? Math.max((yearItem.count / maxCount) * 100, 10) : 5;
          const isSelected = filters.selectedYear === yearItem.year.toString();

          return (
            <button
              key={yearItem.year}
              onClick={() => handleYearClick(yearItem.year)}
              className={`flex-shrink-0 w-1 rounded-t transition-all ${
                isSelected
                  ? 'bg-primary'
                  : yearItem.hasData
                  ? 'bg-timeline-dot hover:bg-accent'
                  : 'bg-border opacity-30'
              }`}
              style={{ height: `${height}%` }}
              title={`${yearItem.year}${yearItem.hasData ? ` - ${yearItem.count} lemmi` : ''}`}
            />
          );
        })}
      </div>
    </div>
  );
};
