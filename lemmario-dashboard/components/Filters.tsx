'use client';

import { useApp } from '@/context/AppContext';
import { getUniqueCategorie, getUniquePeriodi } from '@/services/dataLoader';
import { useMemo } from 'react';
import { X } from 'lucide-react';

export function Filters() {
  const { lemmi, filters, setFilters, resetFilters } = useApp();

  const categorie = useMemo(() => getUniqueCategorie(lemmi), [lemmi]);
  const periodi = useMemo(() => getUniquePeriodi(lemmi), [lemmi]);

  const toggleCategoria = (cat: string) => {
    const newCategorie = filters.categorie.includes(cat)
      ? filters.categorie.filter(c => c !== cat)
      : [...filters.categorie, cat];
    setFilters({ categorie: newCategorie });
  };

  const togglePeriodo = (per: string) => {
    const newPeriodi = filters.periodi.includes(per)
      ? filters.periodi.filter(p => p !== per)
      : [...filters.periodi, per];
    setFilters({ periodi: newPeriodi });
  };

  const hasActiveFilters = filters.categorie.length > 0 || filters.periodi.length > 0;

  return (
    <div className="bg-white/70 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-start gap-6 flex-wrap">
          <div className="flex-1 min-w-[280px]">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Filtra per Categoria
            </label>
            <div className="card p-2">
              <select
                multiple
                className="w-full border-0 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                value={filters.categorie}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                  setFilters({ categorie: selected });
                }}
                size={5}
              >
                {categorie.map(cat => (
                  <option key={cat} value={cat} className="py-2 hover:bg-blue-50">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 min-w-[280px]">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Filtra per Periodo
            </label>
            <div className="card p-2">
              <select
                multiple
                className="w-full border-0 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                value={filters.periodi}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                  setFilters({ periodi: selected });
                }}
                size={5}
              >
                {periodi.map(per => (
                  <option key={per} value={per} className="py-2 hover:bg-purple-50">
                    {per}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg text-sm font-semibold self-end"
              aria-label="Reset filtri"
            >
              <X className="w-4 h-4" />
              Reset Filtri
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.categorie.map(cat => (
              <span
                key={cat}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 rounded-full text-sm font-medium shadow-sm hover:shadow transition-all"
              >
                {cat}
                <button
                  onClick={() => toggleCategoria(cat)}
                  className="hover:bg-blue-200 rounded-full p-1 transition-colors"
                  aria-label={`Rimuovi ${cat}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {filters.periodi.map(per => (
              <span
                key={per}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 rounded-full text-sm font-medium shadow-sm hover:shadow transition-all"
              >
                {per}
                <button
                  onClick={() => togglePeriodo(per)}
                  className="hover:bg-purple-200 rounded-full p-1 transition-colors"
                  aria-label={`Rimuovi ${per}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
