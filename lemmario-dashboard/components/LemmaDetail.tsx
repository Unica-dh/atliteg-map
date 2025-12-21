'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Lemma } from '@/types/lemma';
import { FileText, MapPin, Calendar, Hash } from 'lucide-react';

export const LemmaDetail: React.FC = () => {
  const { filteredLemmi, filters } = useApp();

  const displayedLemmas = useMemo(() => {
    if (filters.selectedLemmaId !== null) {
      return filteredLemmi.filter(
        (lemma: Lemma) => lemma.IdLemma === filters.selectedLemmaId
      );
    }
    if (
      filters.searchQuery ||
      filters.categorie.length > 0 ||
      filters.periodi.length > 0 ||
      filters.selectedLetter !== null ||
      filters.selectedYear !== null
    ) {
      return filteredLemmi.slice().sort((a: Lemma, b: Lemma) => a.Lemma.localeCompare(b.Lemma));
    }
    return [];
  }, [filteredLemmi, filters]);

  const groupedByLemma = useMemo(() => {
    const groups = new Map<string, Lemma[]>();
    displayedLemmas.forEach((lemma: Lemma) => {
      if (!groups.has(lemma.Lemma)) {
        groups.set(lemma.Lemma, []);
      }
      groups.get(lemma.Lemma)!.push(lemma);
    });
    return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [displayedLemmas]);

  // Empty state - render after all hooks
  if (displayedLemmas.length === 0) {
    return (
      <div className="card p-8 h-full flex flex-col items-center justify-center text-center">
        <FileText className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Nessun lemma selezionato
        </h3>
        <p className="text-gray-500 max-w-sm">
          Seleziona un punto sulla mappa, effettua una ricerca o usa i filtri per
          visualizzare i dettagli dei lemmi
        </p>
      </div>
    );
  }

  return (
    <div className="card flex flex-col overflow-hidden p-0" style={{ height: '820px' }}>
      {/* Header Sticky */}
      <div className="px-md pt-md pb-3 border-b border-border mb-3 sticky top-0 bg-white z-10">
        <h2 className="text-lg font-semibold text-text-primary">Dettaglio Forme</h2>
        <p className="text-xs text-text-secondary">
          {groupedByLemma.length} forme • {displayedLemmas.length} occorrenze
        </p>
      </div>

      {/* Content con scroll interno */}
      <div className="flex-1 overflow-y-auto space-y-3 px-md pb-md">
        {groupedByLemma.map(([lemmaText, occurrences]) => (
          <div key={lemmaText} className="border border-border rounded-md p-3 bg-white hover:shadow-card transition-fast">
            <h3 className="text-base font-semibold text-text-primary mb-2 flex items-center gap-2 pb-2 border-b border-border">
              <FileText className="w-4 h-4 text-primary" />
              {lemmaText}
              <span className="text-xs font-normal text-text-muted bg-background-muted px-1.5 py-0.5 rounded">
                {occurrences.length}
              </span>
            </h3>

            <div className="space-y-2">
              {occurrences.map((lemma, idx) => (
                <div
                  key={`${lemma.IdLemma}-${idx}`}
                  className="bg-background-muted rounded p-2 text-xs"
                >
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                    <div className="flex items-center gap-1">
                      <span className="text-text-muted">Forma:</span>
                      <span className="font-medium text-text-primary truncate">{lemma.Forma}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-text-muted flex-shrink-0" />
                      <span className="font-medium text-text-primary truncate">{lemma.CollGeografica}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-text-muted flex-shrink-0" />
                      <span className="text-text-primary">{lemma.Anno || lemma.Periodo || 'N/D'}</span>
                    </div>

                    {lemma.Frequenza && (
                      <div className="flex items-center gap-1">
                        <Hash className="w-3 h-3 text-text-muted flex-shrink-0" />
                        <span className="text-text-primary">{lemma.Frequenza}</span>
                      </div>
                    )}

                    {lemma.IdAmbito && (
                      <div className="flex items-center gap-1 col-span-2">
                        <span className="text-text-muted">ID Ambito:</span>
                        <span className="text-text-primary">{lemma.IdAmbito}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
