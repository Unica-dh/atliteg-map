import { useState } from 'react';
import { GeographicalMap } from './components/GeographicalMap';
import { LemmaDetail } from './components/LemmaDetail';
import { Timeline } from './components/Timeline';
import { Filters } from './components/Filters';
import { AlphabeticalIndex } from './components/AlphabeticalIndex';
import { mockLemmas, Lemma } from './data/mockData';
import logo from 'figma:asset/91a8d45a51941a567b6deb4b10debbdad2d45792.png';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLemma, setSelectedLemma] = useState<Lemma | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const filteredLemmas = mockLemmas.filter(lemma => {
    const matchesCategory = !selectedCategory || lemma.Categoria === selectedCategory;
    const matchesTimePeriod = !selectedTimePeriod || lemma.Periodo === selectedTimePeriod;
    const matchesSearch = !searchQuery || 
      lemma.Lemma.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lemma.Forma.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLetter = !selectedLetter || lemma.Lemma.charAt(0).toUpperCase() === selectedLetter;
    
    return matchesCategory && matchesTimePeriod && matchesSearch && matchesLetter;
  });

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedTimePeriod(null);
    setSearchQuery('');
    setSelectedLetter(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-start gap-6">
          <img src={logo} alt="AtLiTeG Logo" className="w-24 h-24 flex-shrink-0" />
          <div className="flex flex-col gap-2">
            <h1 className="text-gray-900 text-2xl">
              Atlante della lingua e dei testi della cultura gastronomica italiana dall'età medievale all'Unità
            </h1>
            <p className="text-gray-600 text-sm">
              PRIN 2017XRCZTM - PI professoressa Giovanna Frosini, Università per Stranieri di Siena. Elaborato sui dati estrapolati dal "Vocabolario storico della lingua italiana della gastronomia (VoSLIG)", in collaborazione con il Labgeo "Giuseppe Caraci", Università Roma Tre.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <Filters
            selectedCategory={selectedCategory}
            selectedTimePeriod={selectedTimePeriod}
            onCategoryChange={setSelectedCategory}
            onTimePeriodChange={setSelectedTimePeriod}
            onReset={handleResetFilters}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Geographical Distribution */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <GeographicalMap
              lemmas={filteredLemmas}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onLocationSelect={setSelectedCategory}
              onLemmaSelect={setSelectedLemma}
              selectedLemma={selectedLemma}
            />
          </div>

          {/* Lemma Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <LemmaDetail lemma={selectedLemma} allLemmas={mockLemmas} />
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <Timeline 
            lemmas={filteredLemmas} 
            selectedLemma={selectedLemma}
            onLemmaSelect={setSelectedLemma}
          />
        </div>

        {/* Alphabetical Index */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <AlphabeticalIndex 
            lemmas={mockLemmas}
            onLemmaSelect={setSelectedLemma}
            onLetterChange={setSelectedLetter}
          />
        </div>
      </main>
    </div>
  );
}