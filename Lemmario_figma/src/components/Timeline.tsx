import { useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Lemma } from '../types';
import { Button } from './ui/button';
import { useAppContext } from '../context/AppContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface TimelineProps {
  lemmas: Lemma[];
  selectedLemma: Lemma | null;
  onLemmaSelect: (lemma: Lemma) => void;
}

export function Timeline({ lemmas, selectedLemma, onLemmaSelect }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const selectedYearRef = useRef<HTMLDivElement>(null);
  const { filters, setSelectedYear } = useAppContext();

  // Calculate dynamic year range based on lemmas
  const years = lemmas.map(l => l.Anno).filter(y => y > 0);
  const START_YEAR = years.length > 0 ? Math.min(...years) : 1300;
  const END_YEAR = years.length > 0 ? Math.max(...years) : 1500;
  const TOTAL_YEARS = END_YEAR - START_YEAR + 1;

  // Group lemmas by year
  const lemmasByYear = lemmas.reduce((acc, lemma) => {
    const year = lemma.Anno;
    if (year > 0 && year >= START_YEAR && year <= END_YEAR) {
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(lemma);
    }
    return acc;
  }, {} as Record<number, Lemma[]>);

  // Scroll to selected lemma's year or selected year
  useEffect(() => {
    const targetYear = filters.selectedYear || (selectedLemma ? selectedLemma.Anno : null);
    if (targetYear && selectedYearRef.current && timelineRef.current) {
      selectedYearRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedLemma, filters.selectedYear]);

  const scrollTimeline = (direction: 'left' | 'right') => {
    if (timelineRef.current) {
      const scrollAmount = 300;
      timelineRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Generate years array
  const yearsArray = Array.from({ length: TOTAL_YEARS }, (_, i) => START_YEAR + i);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Timeline Storica ({START_YEAR} - {END_YEAR})</h2>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>
            {Object.keys(lemmasByYear).length} anni con lemmi • {lemmas.length} totali
          </span>
        </div>
      </div>

      <div className="relative">
        {/* Scroll buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md"
          onClick={() => scrollTimeline('left')}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md"
          onClick={() => scrollTimeline('right')}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Timeline container */}
        <div
          ref={timelineRef}
          className="overflow-x-auto px-12 pb-4 scrollbar-hide"
        >
          <div className="relative" style={{ minWidth: `${TOTAL_YEARS * 60}px` }}>
            {/* Timeline line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-300" />

            {/* Year markers */}
            <div className="flex relative">
              {yearsArray.map((year) => {
                const yearLemmas = lemmasByYear[year] || [];
                const hasLemmas = yearLemmas.length > 0;
                const isSelectedByYear = filters.selectedYear === year;
                const isSelectedByLemma = selectedLemma && selectedLemma.Anno === year;
                const isSelectedYear = isSelectedByYear || isSelectedByLemma;
                const selectedLemmaIndex = selectedLemma
                  ? yearLemmas.findIndex((l) => l.IdLemma === selectedLemma.IdLemma)
                  : -1;

                const handleYearClick = () => {
                  if (hasLemmas) {
                    // Toggle year selection
                    if (filters.selectedYear === year) {
                      setSelectedYear(null);
                    } else {
                      setSelectedYear(year);
                    }
                  }
                };

                return (
                  <TooltipProvider key={year}>
                    <div
                      ref={isSelectedYear ? selectedYearRef : null}
                      className="flex flex-col items-center"
                      style={{ width: '60px', flexShrink: 0 }}
                    >
                      {/* Year label - show every 10 years or if has lemmas */}
                      {(year % 10 === 0 || hasLemmas) && (
                        <div
                          className={`text-xs mb-2 ${
                            isSelectedYear ? 'text-blue-600 font-semibold' : 'text-gray-600'
                          }`}
                        >
                          {year}
                        </div>
                      )}

                      {/* Marker dot */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={handleYearClick}
                            disabled={!hasLemmas}
                            className={`w-3 h-3 rounded-full border-2 transition-all ${
                              isSelectedYear
                                ? 'bg-blue-600 border-blue-600 scale-150 shadow-lg'
                                : hasLemmas
                                ? 'bg-blue-500 border-white cursor-pointer hover:scale-125'
                                : 'bg-gray-200 border-white cursor-not-allowed'
                            }`}
                            style={{ zIndex: isSelectedYear ? 10 : 1 }}
                            aria-label={`Anno ${year}${hasLemmas ? ` - ${yearLemmas.length} attestazioni` : ' - nessuna attestazione'}`}
                          />
                        </TooltipTrigger>
                        {hasLemmas && (
                          <TooltipContent>
                            <div className="text-xs">
                              <div className="font-semibold">Anno {year}</div>
                              <div>{yearLemmas.length} attestazion{yearLemmas.length > 1 ? 'i' : 'e'}</div>
                              <div className="text-gray-400 mt-1">Click per filtrare</div>
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>

                    {/* Lemmas for this year */}
                    {hasLemmas && (
                      <div className="mt-3 space-y-1 w-full">
                        <div className="text-xs text-gray-500 text-center mb-1">
                          {yearLemmas.length} lemma{yearLemmas.length > 1 ? 's' : ''}
                        </div>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {yearLemmas.map((lemma, index) => (
                            <button
                              key={lemma.IdLemma}
                              onClick={() => onLemmaSelect(lemma)}
                              className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                                selectedLemmaIndex === index
                                  ? 'bg-blue-600 text-white shadow-md'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                              title={`${lemma.Lemma} - ${lemma.Forma}`}
                            >
                              <div className="truncate">{lemma.Lemma}</div>
                              <div className="truncate text-xs opacity-75">
                                {lemma.CollGeografica}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-gray-600 pt-2 border-t">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
          <span>Anno con lemmi</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-200 border-2 border-white" />
          <span>Anno senza lemmi</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-blue-600" />
          <span>Anno selezionato</span>
        </div>
      </div>
    </div>
  );
}