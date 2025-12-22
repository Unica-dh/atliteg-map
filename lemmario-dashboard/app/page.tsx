'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { MetricsSummary } from '@/components/MetricsSummary';
import { CompactToolbar } from '@/components/CompactToolbar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AlphabeticalIndex } from '@/components/AlphabeticalIndex';
import { Timeline } from '@/components/Timeline';
import { LemmaDetail } from '@/components/LemmaDetail';
import dynamic from 'next/dynamic';

// Importa la mappa dinamicamente per evitare problemi SSR
const GeographicalMap = dynamic(
  () => import('@/components/GeographicalMap').then(mod => ({ default: mod.GeographicalMap })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[820px] w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-600">Caricamento mappa...</p>
      </div>
    )
  }
);

export default function Home() {
  const { isLoading, error } = useApp();
  const [isIndiceOpen, setIsIndiceOpen] = React.useState(false);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Errore</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Ricarica la pagina
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MetricsSummary />
      <CompactToolbar onToggleIndice={() => setIsIndiceOpen(!isIndiceOpen)} />

      <main className="w-full px-lg py-3 flex-1">
        {/* Layout principale: Mappa 80% + Dettaglio Forme 20% - Full Width */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-3 w-full">
          {/* Mappa - 4 colonne (80%) */}
          <div className="xl:col-span-4">
            <div className="card p-0 overflow-hidden">
              <GeographicalMap />
            </div>
          </div>

          {/* Dettaglio Forme - 1 colonna (20%) */}
          <div className="xl:col-span-1">
            <LemmaDetail />
          </div>
        </div>

        {/* Linea del tempo unificata - Full Width */}
        <div className="mt-3 w-full">
          <Timeline />
        </div>
      </main>

      {/* Indice alfabetico - Modal/Drawer */}
      {isIndiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsIndiceOpen(false)}>
          <div className="bg-white rounded-lg shadow-card-hover max-w-4xl w-full max-h-[80vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
            <AlphabeticalIndex onClose={() => setIsIndiceOpen(false)} />
            <div className="sticky bottom-0 bg-white border-t border-border p-3 flex justify-end">
              <button
                onClick={() => setIsIndiceOpen(false)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-fast text-sm font-medium"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-border px-lg py-1.5">
        <div className="max-w-container mx-auto text-center text-[10px] text-text-secondary">
          <p>© 2025 AtLiTeG - Atlante della Lingua e dei Testi della Cultura Gastronomica</p>
        </div>
      </footer>
    </div>
  );
}
