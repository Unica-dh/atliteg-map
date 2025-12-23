'use client';

import { useState, useMemo } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface MapBoundedPopupProps {
  lemmaGroups: Map<string, any[]>;
  locationName: string;
  onClose: () => void;
}

export function MapBoundedPopup({ lemmaGroups, locationName, onClose }: MapBoundedPopupProps) {
  // Stati
  const [expandedLemmi, setExpandedLemmi] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filterCategoria, setFilterCategoria] = useState<string>('');
  const [filterPeriodo, setFilterPeriodo] = useState<string>('');

  // Estrai categorie e periodi unici
  const { categorie, periodi } = useMemo(() => {
    const cats = new Set<string>();
    const pers = new Set<string>();
    
    lemmaGroups.forEach(lemmi => {
      lemmi.forEach(l => {
        if (l.Categoria) cats.add(l.Categoria);
        if (l.Periodo) pers.add(l.Periodo);
      });
    });
    
    return {
      categorie: Array.from(cats).sort(),
      periodi: Array.from(pers).sort()
    };
  }, [lemmaGroups]);

  // Filtra lemmi
  const filteredLemmaGroups = useMemo(() => {
    if (!filterCategoria && !filterPeriodo) return lemmaGroups;
    
    const filtered = new Map<string, any[]>();
    
    lemmaGroups.forEach((lemmi, lemmaName) => {
      const filteredLemmi = lemmi.filter(l => {
        const matchCategoria = !filterCategoria || l.Categoria === filterCategoria;
        const matchPeriodo = !filterPeriodo || l.Periodo === filterPeriodo;
        return matchCategoria && matchPeriodo;
      });
      
      if (filteredLemmi.length > 0) {
        filtered.set(lemmaName, filteredLemmi);
      }
    });
    
    return filtered;
  }, [lemmaGroups, filterCategoria, filterPeriodo]);

  // Dividi lemmi in 3 colonne (responsive)
  const columns = useMemo(() => {
    const lemmiArray = Array.from(filteredLemmaGroups.entries());
    const numCols = 3;
    const cols: Array<Array<[string, any[]]>> = [[], [], []];
    
    lemmiArray.forEach(([name, lemmi], idx) => {
      cols[idx % numCols].push([name, lemmi]);
    });
    
    return cols;
  }, [filteredLemmaGroups]);

  const toggleLemma = (lemmaName: string) => {
    setExpandedLemmi(prev => {
      const next = new Set(prev);
      next.has(lemmaName) ? next.delete(lemmaName) : next.add(lemmaName);
      return next;
    });
  };

  const resetFilters = () => {
    setFilterCategoria('');
    setFilterPeriodo('');
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
            <h4 className="font-semibold text-xs truncate">{lemmaName}</h4>
            <p className="text-[10px] text-gray-500 truncate">{categoria}</p>
          </div>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            <span className="text-[10px] text-gray-400 px-1.5 py-0.5 bg-gray-100 rounded">
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
            <ul className="space-y-0.5 text-[11px] mt-1">
              {lemmi.map((lemma: any, idx: number) => (
                <li key={idx} className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-gray-400 text-[10px]">•</span>
                  <em className="truncate">{lemma.Forma}</em>
                  <span className="text-gray-600 shrink-0">
                    ({lemma.Anno || lemma.Periodo || 'n.d.'})
                  </span>
                  {lemma.Frequenza && lemma.Frequenza !== '1' && (
                    <span className="text-blue-600 shrink-0 text-[10px]">
                      f:{lemma.Frequenza}
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

  const activeFiltersCount = [filterCategoria, filterPeriodo].filter(Boolean).length;

  return (
    <>
      {/* Overlay quando in fullscreen */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 animate-fadeIn"
          onClick={() => setIsFullscreen(false)}
        />
      )}

      {/* Popup Container */}
      <div 
        className={`bg-white rounded-lg shadow-xl transition-all duration-300 ${
          isFullscreen 
            ? 'fixed top-16 left-4 right-4 bottom-4 z-50 flex flex-col' 
            : 'w-[840px] max-w-full'
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-3 border-b bg-gray-50 sticky top-0 z-10 rounded-t-lg">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm truncate">{locationName}</h3>
            <p className="text-xs text-gray-600">
              {filteredLemmaGroups.size} {filteredLemmaGroups.size === 1 ? 'lemma' : 'lemmi'}
              {activeFiltersCount > 0 && (
                <span className="ml-1 text-blue-600">
                  (filtrati)
                </span>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-2 ml-3">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
              title={isFullscreen ? "Riduci" : "Espandi"}
              aria-label={isFullscreen ? "Riduci popup" : "Espandi popup a schermo intero"}
            >
              <ArrowsPointingOutIcon className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
              title="Chiudi"
              aria-label="Chiudi popup"
            >
              <XMarkIcon className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* FILTRI */}
        <div className="p-3 border-b bg-white sticky top-[57px] z-10">
          <div className="flex items-center gap-2 mb-2">
            <FunnelIcon className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-700">Filtri</span>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="ml-auto text-xs text-blue-600 hover:underline"
                aria-label="Reset filtri"
              >
                Reset
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <select
              value={filterCategoria}
              onChange={e => setFilterCategoria(e.target.value)}
              className="px-2 py-1.5 text-xs border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Filtra per categoria"
            >
              <option value="">Tutte le categorie</option>
              {categorie.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <select
              value={filterPeriodo}
              onChange={e => setFilterPeriodo(e.target.value)}
              className="px-2 py-1.5 text-xs border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Filtra per periodo"
            >
              <option value="">Tutti i periodi</option>
              {periodi.map(per => (
                <option key={per} value={per}>{per}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CONTENT - 3 COLONNE RESPONSIVE */}
        <div 
          className={`overflow-y-auto ${
            isFullscreen ? 'flex-1 p-3' : 'max-h-[320px] p-3 pt-2'
          }`}
        >
          {filteredLemmaGroups.size === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              <FunnelIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Nessun lemma corrisponde ai filtri selezionati</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {columns.map((col, colIdx) => (
                <div key={colIdx} className="space-y-2">
                  {col.map(renderAccordionItem)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-2 border-t bg-gray-50 text-center rounded-b-lg">
          <p className="text-[10px] text-gray-500">
            {expandedLemmi.size > 0 && `${expandedLemmi.size} espanso • `}
            Click sui lemmi per espandere i dettagli
          </p>
        </div>
      </div>
    </>
  );
}
