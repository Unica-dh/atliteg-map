'use client';

import { useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { Filters } from '@/components/Filters';
import { MetricsSummary } from '@/components/MetricsSummary';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AlphabeticalIndex } from '@/components/AlphabeticalIndex';
import { SearchBar } from '@/components/SearchBar';
import { Timeline } from '@/components/Timeline';
import { LemmaDetail } from '@/components/LemmaDetail';
import dynamic from 'next/dynamic';

// Importa la mappa dinamicamente per evitare problemi SSR
const GeographicalMap = dynamic(
  () => import('@/components/GeographicalMap').then(mod => ({ default: mod.GeographicalMap })),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-600">Caricamento mappa...</p>
      </div>
    )
  }
);

export default function Home() {
  const { isLoading, error } = useApp();

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
    <div className="min-h-screen">
      <Header />
      <Filters />
      <MetricsSummary />

      <main className="max-w-container mx-auto px-lg py-3xl space-y-3xl">
        {/* Barra di ricerca */}
        <div className="flex justify-center">
          <SearchBar />
        </div>

        {/* Layout principale: Mappa + Dettaglio Lemma */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-2xl">
          {/* Mappa - 2 colonne */}
          <div className="xl:col-span-2 space-y-2xl">
            <div className="card p-0 overflow-hidden">
              <GeographicalMap />
            </div>

            {/* Timeline */}
            <Timeline />
          </div>

          {/* Dettaglio Lemma - 1 colonna */}
          <div className="xl:col-span-1">
            <LemmaDetail />
          </div>
        </div>

        {/* Indice alfabetico - full width */}
        <div className="w-full">
          <AlphabeticalIndex />
        </div>
      </main>

      <footer className="bg-white border-t border-border mt-3xl px-lg py-2xl">
        <div className="max-w-container mx-auto text-center text-sm text-text-secondary">
          <p>© 2025 AtLiTeG - Atlante della Lingua e dei Testi della Cultura Gastronomica</p>
        </div>
      </footer>
    </div>
  );
}
