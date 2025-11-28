import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Lemma, FilterState } from '../types';

interface AppContextType {
  filters: FilterState;
  setCategorie: (categorie: string[]) => void;
  setPeriodi: (periodi: string[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedLetter: (letter: string | null) => void;
  setSelectedYear: (year: number | null) => void;
  setSelectedLemma: (lemma: Lemma | null) => void;
  resetFilters: () => void;
}

const defaultFilterState: FilterState = {
  categorie: [],
  periodi: [],
  searchQuery: '',
  selectedLetter: null,
  selectedYear: null,
  selectedLemma: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);

  const setCategorie = useCallback((categorie: string[]) => {
    setFilters(prev => ({ ...prev, categorie }));
  }, []);

  const setPeriodi = useCallback((periodi: string[]) => {
    setFilters(prev => ({ ...prev, periodi }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters(prev => ({ ...prev, searchQuery }));
  }, []);

  const setSelectedLetter = useCallback((selectedLetter: string | null) => {
    setFilters(prev => ({ ...prev, selectedLetter }));
  }, []);

  const setSelectedYear = useCallback((selectedYear: number | null) => {
    setFilters(prev => ({ ...prev, selectedYear }));
  }, []);

  const setSelectedLemma = useCallback((selectedLemma: Lemma | null) => {
    setFilters(prev => ({ ...prev, selectedLemma }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilterState);
  }, []);

  const value: AppContextType = {
    filters,
    setCategorie,
    setPeriodi,
    setSearchQuery,
    setSelectedLetter,
    setSelectedYear,
    setSelectedLemma,
    resetFilters,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
