'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface HighlightState {
  // Elementi evidenziati
  highlightedLemmaIds: Set<string>;
  highlightedGeoAreas: Set<string>;
  highlightedYears: Set<number>;
  highlightedLetters: Set<string>;
  
  // Sorgente dell'evidenziazione (per styling diverso)
  highlightSource: 'search' | 'filter' | 'index' | 'map' | 'timeline' | null;
  
  // Tipo di evidenziazione
  highlightType: 'hover' | 'select' | 'filter' | null;
}

interface HighlightContextValue {
  highlightState: HighlightState;
  
  // Metodi per impostare evidenziazione
  highlightLemmi: (lemmaIds: string[], source: HighlightState['highlightSource'], type: HighlightState['highlightType']) => void;
  highlightGeoAreas: (areaIds: string[], source: HighlightState['highlightSource'], type: HighlightState['highlightType']) => void;
  highlightYears: (years: number[], source: HighlightState['highlightSource'], type: HighlightState['highlightType']) => void;
  highlightLetters: (letters: string[], source: HighlightState['highlightSource'], type: HighlightState['highlightType']) => void;
  
  // Evidenziazione multipla (per correlazioni complesse)
  highlightMultiple: (params: {
    lemmaIds?: string[];
    geoAreaIds?: string[];
    years?: number[];
    letters?: string[];
    source: HighlightState['highlightSource'];
    type: HighlightState['highlightType'];
  }) => void;
  
  // Rimuove evidenziazione
  clearHighlight: () => void;
  
  // Utility per verificare se elemento è evidenziato
  isLemmaHighlighted: (lemmaId: string) => boolean;
  isGeoAreaHighlighted: (areaId: string) => boolean;
  isYearHighlighted: (year: number) => boolean;
  isLetterHighlighted: (letter: string) => boolean;
}

const HighlightContext = createContext<HighlightContextValue | undefined>(undefined);

const initialHighlightState: HighlightState = {
  highlightedLemmaIds: new Set(),
  highlightedGeoAreas: new Set(),
  highlightedYears: new Set(),
  highlightedLetters: new Set(),
  highlightSource: null,
  highlightType: null,
};

export function HighlightProvider({ children }: { children: ReactNode }) {
  const [highlightState, setHighlightState] = useState<HighlightState>(initialHighlightState);

  const highlightLemmi = useCallback((lemmaIds: string[], source: HighlightState['highlightSource'], type: HighlightState['highlightType']) => {
    setHighlightState({
      ...initialHighlightState,
      highlightedLemmaIds: new Set(lemmaIds),
      highlightSource: source,
      highlightType: type,
    });
  }, []);

  const highlightGeoAreas = useCallback((areaIds: string[], source: HighlightState['highlightSource'], type: HighlightState['highlightType']) => {
    setHighlightState({
      ...initialHighlightState,
      highlightedGeoAreas: new Set(areaIds),
      highlightSource: source,
      highlightType: type,
    });
  }, []);

  const highlightYears = useCallback((years: number[], source: HighlightState['highlightSource'], type: HighlightState['highlightType']) => {
    setHighlightState({
      ...initialHighlightState,
      highlightedYears: new Set(years),
      highlightSource: source,
      highlightType: type,
    });
  }, []);

  const highlightLetters = useCallback((letters: string[], source: HighlightState['highlightSource'], type: HighlightState['highlightType']) => {
    setHighlightState({
      ...initialHighlightState,
      highlightedLetters: new Set(letters),
      highlightSource: source,
      highlightType: type,
    });
  }, []);

  const highlightMultiple = useCallback((params: {
    lemmaIds?: string[];
    geoAreaIds?: string[];
    years?: number[];
    letters?: string[];
    source: HighlightState['highlightSource'];
    type: HighlightState['highlightType'];
  }) => {
    setHighlightState({
      highlightedLemmaIds: new Set(params.lemmaIds || []),
      highlightedGeoAreas: new Set(params.geoAreaIds || []),
      highlightedYears: new Set(params.years || []),
      highlightedLetters: new Set(params.letters || []),
      highlightSource: params.source,
      highlightType: params.type,
    });
  }, []);

  const clearHighlight = useCallback(() => {
    setHighlightState(initialHighlightState);
  }, []);

  const isLemmaHighlighted = useCallback((lemmaId: string) => {
    return highlightState.highlightedLemmaIds.has(lemmaId);
  }, [highlightState.highlightedLemmaIds]);

  const isGeoAreaHighlighted = useCallback((areaId: string) => {
    return highlightState.highlightedGeoAreas.has(areaId);
  }, [highlightState.highlightedGeoAreas]);

  const isYearHighlighted = useCallback((year: number) => {
    return highlightState.highlightedYears.has(year);
  }, [highlightState.highlightedYears]);

  const isLetterHighlighted = useCallback((letter: string) => {
    return highlightState.highlightedLetters.has(letter);
  }, [highlightState.highlightedLetters]);

  const value: HighlightContextValue = {
    highlightState,
    highlightLemmi,
    highlightGeoAreas,
    highlightYears,
    highlightLetters,
    highlightMultiple,
    clearHighlight,
    isLemmaHighlighted,
    isGeoAreaHighlighted,
    isYearHighlighted,
    isLetterHighlighted,
  };

  return (
    <HighlightContext.Provider value={value}>
      {children}
    </HighlightContext.Provider>
  );
}

export function useHighlight() {
  const context = useContext(HighlightContext);
  if (!context) {
    throw new Error('useHighlight must be used within HighlightProvider');
  }
  return context;
}
