'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Lemma } from '@/types/lemma';
import { FileText, MapPin, Calendar, Tag, Hash, ExternalLink } from 'lucide-react';

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
    <div className="card h-full flex flex-col overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Dettaglio Lemmi</h2>
        <p className="text-sm text-emerald-700 mt-1 font-medium">
          {displayedLemmas.length} occorrenze • {groupedByLemma.length} lemmi
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {groupedByLemma.map(([lemmaText, occurrences]) => (
          <div key={lemmaText} className="border border-gray-100 rounded-xl p-5 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b border-gray-100">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg shadow-md">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{lemmaText}</span>
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {occurrences.length} forme
              </span>
            </h3>

            <div className="space-y-3">
              {occurrences.map((lemma, idx) => (
                <div
                  key={`${lemma.IdLemma}-${idx}`}
                  className="bg-white rounded-lg p-4 border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-500">Forma</div>
                        <div className="font-semibold text-gray-900">
                          {lemma.Forma}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-500">Località</div>
                        <div className="font-medium text-gray-900">
                          {lemma.CollGeografica}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-500">Anno / Periodo</div>
                        <div className="font-medium text-gray-900">
                          {lemma.Anno || lemma.Periodo || 'N/D'}
                        </div>
                      </div>
                    </div>

                    {lemma.Frequenza && (
                      <div className="flex items-start gap-2">
                        <Hash className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-gray-500">Frequenza</div>
                          <div className="font-medium text-gray-900">
                            {lemma.Frequenza}
                          </div>
                        </div>
                      </div>
                    )}

                    {lemma.Categoria && (
                      <div className="flex items-start gap-2 md:col-span-2">
                        <Tag className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">Categorie</div>
                          <div className="flex flex-wrap gap-1">
                            {lemma.Categoria.split(',').map((cat, i) => (
                              <span
                                key={i}
                                className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {cat.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {lemma.URL && (
                      <div className="flex items-start gap-2 md:col-span-2">
                        <ExternalLink className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-gray-500">Risorsa</div>
                          <a
                            href={lemma.URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                            aria-label={`Apri risorsa esterna per ${lemma.Lemma}`}
                          >
                            {lemma.URL}
                          </a>
                        </div>
                      </div>
                    )}

                    {lemma.IdAmbito && (
                      <div className="flex items-start gap-2">
                        <div className="w-4 h-4 text-gray-400 mt-0.5">🗺️</div>
                        <div>
                          <div className="text-xs text-gray-500">ID Ambito</div>
                          <div className="font-medium text-gray-900">
                            {lemma.IdAmbito}
                          </div>
                        </div>
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
