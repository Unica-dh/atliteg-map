'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Lemma } from '@/types/lemma';
import { FileText, MapPin, Calendar, Hash, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StaggerContainer, StaggerItem, FadeIn } from '@/components/MotionWrapper';
import { motionConfig } from '@/lib/motion-config';

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
      <FadeIn>
        <div className="card p-8 h-full flex flex-col items-center justify-center text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          >
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Nessun lemma selezionato
          </h3>
          <p className="text-gray-500 max-w-sm">
            Seleziona un punto sulla mappa, effettua una ricerca o usa i filtri per
            visualizzare i dettagli dei lemmi
          </p>
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="card flex flex-col overflow-hidden" style={{ height: '580px' }}>
      {/* Header Sticky */}
      <div className="px-md pt-md pb-3 border-b border-border sticky top-0 bg-white z-10">
        <h2 className="text-lg font-semibold text-text-primary mb-1">Dettaglio Forme</h2>
        <div className="flex items-center gap-3 text-xs text-text-secondary">
          <span><strong>{groupedByLemma.length}</strong> forme</span>
          <span>•</span>
          <span><strong>{displayedLemmas.length}</strong> occorrenze</span>
        </div>
      </div>

      {/* Content con scroll interno */}
      <div className="flex-1 overflow-y-auto space-y-3 px-md pb-md pt-3">
        {groupedByLemma.map(([lemmaText, occurrences]) => {
          // Estrai proprietà comuni a livello Lemma
          const firstOccurrence = occurrences[0];
          const categoria = firstOccurrence.Categoria || '';
          const url = firstOccurrence.URL || '';

          return (
            <div key={lemmaText} className="border border-border rounded-md p-3 bg-white hover:shadow-card transition-fast">
              {/* Header Lemma con link esterno */}
              <div className="mb-2 pb-2 border-b border-border">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-primary" />
                  <h3 className="text-base font-semibold text-text-primary">{lemmaText}</h3>
                  <span className="text-xs font-normal text-text-muted bg-background-muted px-1.5 py-0.5 rounded">
                    {occurrences.length}
                  </span>
                  {url && url.trim() && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-primary hover:text-primary-dark transition-colors"
                      title="Vedi su vocabolario.atliteg.org"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Metadati a livello Lemma */}
                {categoria && (
                  <div className="text-xs text-text-secondary mt-1">
                    <span className="font-medium">Categoria:</span> {categoria}
                  </div>
                )}
              </div>

              {/* Lista Forme */}
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

                      <div className="flex items-center gap-1">
                        {lemma.Frequenza && lemma.Frequenza !== '1' ? (
                          <>
                            <Hash className="w-3 h-3 text-text-muted flex-shrink-0" />
                            <span className="text-text-primary">freq: {lemma.Frequenza}</span>
                          </>
                        ) : (
                          <span className="text-text-muted text-xs">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
