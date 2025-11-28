import { AppProvider, useAppContext } from './context/AppContext';
import { useDataLoader, useFilteredData, useMetrics } from './hooks';
import { Header } from './components/Header';
import { GeographicalMap } from './components/GeographicalMap';
import { LemmaDetail } from './components/LemmaDetail';
import { Timeline } from './components/Timeline';
import { Filters } from './components/Filters';
import { AlphabeticalIndex } from './components/AlphabeticalIndex';
import { MetricsSummary } from './components/MetricsSummary';
import { SearchBar } from './components/SearchBar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { EmptyState } from './components/EmptyState';
import { extractUniqueCategories, extractUniquePeriods } from './services/dataLoader';

function AppContent() {
  const { lemmas, isLoading, error } = useDataLoader();
  const { filters, setCategorie, setPeriodi, setSelectedLemma, resetFilters } = useAppContext();
  
  const filteredLemmas = useFilteredData(lemmas, filters);
  const metrics = useMetrics(filteredLemmas);

  const availableCategories = extractUniqueCategories(lemmas);
  const availablePeriods = extractUniquePeriods(lemmas);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Caricamento dati del lemmario..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState 
          icon="alert"
          title="Errore nel caricamento"
          message={error}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="p-8">
        {/* Filters and Metrics Row - ALWAYS HORIZONTAL */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-row items-center gap-8">
            {/* Filters - left side */}
            <div className="flex-shrink-0">
              <Filters
                availableCategories={availableCategories}
                availablePeriods={availablePeriods}
                selectedCategories={filters.categorie}
                selectedPeriods={filters.periodi}
                onCategoriesChange={setCategorie}
                onPeriodsChange={setPeriodi}
                onReset={resetFilters}
              />
            </div>

            {/* Divider */}
            <div className="h-16 w-px bg-gray-200"></div>

            {/* Statistics - right side */}
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Statistiche</h2>
              <MetricsSummary metrics={metrics} />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar 
          lemmas={lemmas}
          onSelect={setSelectedLemma}
          className="mb-6"
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Geographical Distribution */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <GeographicalMap
              lemmas={filteredLemmas}
              searchQuery={filters.searchQuery}
              onSearchChange={() => {}}
              onLocationSelect={() => {}}
              onLemmaSelect={setSelectedLemma}
              selectedLemma={filters.selectedLemma}
            />
          </div>

          {/* Lemma Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <LemmaDetail lemma={filters.selectedLemma} allLemmas={filteredLemmas} />
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <Timeline 
            lemmas={filteredLemmas} 
            selectedLemma={filters.selectedLemma}
            onLemmaSelect={setSelectedLemma}
          />
        </div>

        {/* Alphabetical Index */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <AlphabeticalIndex 
            lemmas={filteredLemmas}
            onLemmaSelect={setSelectedLemma}
            onLetterChange={() => {}}
          />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}