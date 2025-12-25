'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useHighlight } from '@/context/HighlightContext';
import { Lemma } from '@/types/lemma';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { motionConfig } from '@/lib/motion-config';

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
  const { highlightMultiple, clearHighlight, isYearHighlighted } = useHighlight();
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
        // Somma la frequenza invece di contare le righe
        const freq = parseInt(lemma.Frequenza) || 0;
        data.attestazioni += freq;
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
  const totalOccorrenze = useMemo(() => {
    return filteredLemmi.reduce((sum, lemma) => {
      const freq = parseInt(lemma.Frequenza) || 0;
      return sum + freq;
    }, 0);
  }, [filteredLemmi]);
  const totalForme = new Set(filteredLemmi.map(l => l.Forma)).size;
  const maxAttestazioni = Math.max(...quartCenturies.map(q => q.attestazioni), 1);

  const [selectedQuart, setSelectedQuart] = useState<string | null>(null);

  const handleQuartClick = (quart: string) => {
    if (selectedQuart === quart) {
      setSelectedQuart(null);
      clearHighlight();
    } else {
      setSelectedQuart(quart);
      
      // Evidenzia lemmi di questo periodo
      const quartData = quartCenturies.find(q => q.quartCentury === quart);
      if (quartData) {
        const lemmiIds = filteredLemmi
          .filter(l => {
            const year = parseInt(l.Anno);
            return quartData.years.includes(year);
          })
          .map(l => l.IdLemma);
        
        highlightMultiple({
          lemmaIds: lemmiIds,
          years: quartData.years,
          source: 'timeline',
          type: 'select'
        });
      }
    }
  };

  const handleQuartHover = (quart: string | null) => {
    if (!quart || selectedQuart) {
      // Non fare hover highlight se c'è una selezione attiva
      return;
    }
    
    const quartData = quartCenturies.find(q => q.quartCentury === quart);
    if (quartData) {
      highlightMultiple({
        years: quartData.years,
        source: 'timeline',
        type: 'hover'
      });
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-gray-700">Linea del tempo</h2>
        <div className="text-xs text-gray-500">
          <span className="font-semibold text-blue-600">{totalForme}</span> forme •{' '}
          <span className="font-semibold text-blue-600">{totalOccorrenze}</span> occorrenze
        </div>
      </div>

      {/* Timeline con frecce */}
      <div className="flex items-end gap-3">
        {/* Freccia sinistra */}
        <motion.button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          whileHover={currentPage > 0 ? { scale: 1.1, x: -2 } : {}}
          whileTap={currentPage > 0 ? { scale: 0.9 } : {}}
          className="flex-shrink-0 p-2 rounded-md bg-gray-100 hover:bg-blue-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Periodo precedente"
        >
          <ChevronLeft className="w-5 h-5 text-blue-600" />
        </motion.button>

        {/* Barre verticali */}
        <LayoutGroup>
          <div className="flex-1 flex items-end justify-around gap-1 h-24">
            <AnimatePresence mode="wait">
              {visibleQuarts.map((quartItem) => {
                const [startYear, endYear] = getYearRangeFromQuartCentury(quartItem.quartCentury);
                const isSelected = selectedQuart === quartItem.quartCentury;
                const isHighlighted = quartItem.years.some(year => isYearHighlighted(year));
                const heightPx = Math.max((quartItem.attestazioni / maxAttestazioni) * 80, 10);

                return (
                  <motion.div
                    key={quartItem.quartCentury}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={motionConfig.spring.soft}
                    className="flex flex-col items-center flex-1 min-w-0"
                  >
                    {/* Barra verticale */}
                    <motion.button
                      layout
                      onClick={() => handleQuartClick(quartItem.quartCentury)}
                      onMouseEnter={() => handleQuartHover(quartItem.quartCentury)}
                      onMouseLeave={() => !selectedQuart && clearHighlight()}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: `${heightPx}px`, opacity: 1 }}
                      whileHover={{ 
                        scale: 1.1, 
                        y: -4,
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        height: { ...motionConfig.spring.soft, delay: 0.1 },
                        scale: motionConfig.spring.fast,
                        y: motionConfig.spring.fast
                      }}
                      className={`w-full rounded-t transition-colors ${
                        isSelected
                          ? 'bg-blue-600 shadow-md'
                          : isHighlighted
                            ? 'bg-blue-500 shadow-sm ring-2 ring-blue-400 ring-opacity-50'
                            : 'bg-blue-400 hover:bg-blue-500'
                      }`}
                      title={`${startYear}-${endYear}: ${quartItem.attestazioni} occorrenze`}
                    />
                    
                    {/* Label con periodo */}
                    <div className="mt-1 text-center">
                      <div className={`text-[10px] font-bold ${isSelected || isHighlighted ? 'text-blue-600' : 'text-gray-600'}`}>
                        {startYear}-{endYear}
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[9px] font-medium text-blue-600 mt-0.5"
                        >
                          {quartItem.attestazioni} occ.
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </LayoutGroup>

        {/* Freccia destra */}
        <motion.button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages - 1}
          whileHover={currentPage < totalPages - 1 ? { scale: 1.1, x: 2 } : {}}
          whileTap={currentPage < totalPages - 1 ? { scale: 0.9 } : {}}
          className="flex-shrink-0 p-2 rounded-md bg-gray-100 hover:bg-blue-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Periodo successivo"
        >
          <ChevronRight className="w-5 h-5 text-blue-600" />
        </motion.button>
      </div>
    </div>
  );
};
