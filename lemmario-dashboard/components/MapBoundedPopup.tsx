'use client';

import { useState, useMemo } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface MapBoundedPopupProps {
  lemmaGroups: Map<string, any[]>;
  locationName: string;
  onClose: () => void;
}

export function MapBoundedPopup({ lemmaGroups, locationName, onClose }: MapBoundedPopupProps) {
  // Stati
  const [expandedLemmi, setExpandedLemmi] = useState<Set<string>>(new Set());

  // Calcola numero di colonne dinamicamente (max 3)
  const numColumns = useMemo(() => {
    const totalLemmi = lemmaGroups.size;
    if (totalLemmi === 1) return 1;
    if (totalLemmi === 2) return 2;
    return 3;
  }, [lemmaGroups]);

  // Dividi lemmi in colonne (responsive)
  const columns = useMemo(() => {
    const lemmiArray = Array.from(lemmaGroups.entries());
    const cols: Array<Array<[string, any[]]>> = Array.from({ length: numColumns }, () => []);

    lemmiArray.forEach(([name, lemmi], idx) => {
      cols[idx % numColumns].push([name, lemmi]);
    });

    return cols;
  }, [lemmaGroups, numColumns]);

  // Calcola larghezza dinamica del popup basata sul contenuto
  const popupWidth = useMemo(() => {
    // Per 1 lemma: larghezza minima compatta
    if (numColumns === 1) return 'auto';
    // Per 2 lemmi: larghezza media
    if (numColumns === 2) return '520px';
    // Per 3+ lemmi: larghezza completa
    return '840px';
  }, [numColumns]);

  const toggleLemma = (lemmaName: string) => {
    setExpandedLemmi(prev => {
      const next = new Set(prev);
      next.has(lemmaName) ? next.delete(lemmaName) : next.add(lemmaName);
      return next;
    });
  };

  // Rendering accordion item
  const renderAccordionItem = ([lemmaName, lemmi]: [string, any[]]) => {
    const isExpanded = expandedLemmi.has(lemmaName);
    const categoria = lemmi[0]?.Categoria || '';
    
    return (
      <div key={lemmaName} className="border-b last:border-0">
        <button
          onClick={() => toggleLemma(lemmaName)}
          className="w-full flex items-start justify-between p-2 hover:bg-gray-50 transition-colors text-left"
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? 'Chiudi' : 'Espandi'} dettagli per ${lemmaName}`}
        >
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{lemmaName}</h4>
          </div>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            <span className="text-xs text-gray-400 px-1.5 py-0.5 bg-gray-100 rounded">
              {lemmi.length}
            </span>
            <ChevronDownIcon
              className={`w-3 h-3 text-gray-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {isExpanded && (
          <div className="px-3 pb-2 bg-gray-50 border-t animate-fadeIn">
            <ul className="space-y-0.5 text-[13px] mt-1">
              {lemmi.map((lemma: any, idx: number) => (
                <li key={idx} className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-gray-400 text-xs">•</span>
                  <em className="truncate">{lemma.Forma}</em>
                  <span className="text-gray-600 shrink-0">
                    ({lemma.Datazione || 'n.d.'})
                  </span>
                  {lemma.Frequenza && (
                    <span className="text-blue-600 shrink-0 text-xs">
                      freq.:{lemma.Frequenza}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="bg-white rounded-lg shadow-xl"
      style={{
        width: popupWidth,
        minWidth: numColumns === 1 ? '240px' : undefined,
        maxWidth: '90vw'
      }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-t-lg border-b">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg">{locationName}</h3>
          <p className="text-sm text-gray-600">
            {lemmaGroups.size} {lemmaGroups.size === 1 ? 'lemma' : 'lemmi'}
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-200 rounded transition-colors ml-3"
          title="Chiudi"
          aria-label="Chiudi popup"
        >
          <XMarkIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* CONTENT - COLONNE DINAMICHE */}
      <div className="overflow-y-auto max-h-[300px]">
        <div
          className="gap-3 p-4"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${numColumns}, 1fr)`
          }}
        >
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="space-y-2">
              {col.map(renderAccordionItem)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
