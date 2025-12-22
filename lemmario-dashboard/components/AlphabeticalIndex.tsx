'use client';

import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { useHighlight } from '@/context/HighlightContext';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StaggerContainer, StaggerItem } from '@/components/MotionWrapper';
import { motionConfig } from '@/lib/motion-config';

interface AlphabeticalIndexProps {
  onClose?: () => void;
}

export function AlphabeticalIndex({ onClose }: AlphabeticalIndexProps = {}) {
  const { lemmi, filteredLemmi, filters, setFilters } = useApp();
  const { highlightMultiple, clearHighlight, isLetterHighlighted, isLemmaHighlighted } = useHighlight();

  // Genera alfabeto completo
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Determina quali lettere hanno lemmi
  const lettersWithLemmi = useMemo(() => {
    const letters = new Set<string>();
    lemmi.forEach(lemma => {
      if (lemma.Lemma) {
        letters.add(lemma.Lemma[0].toUpperCase());
      }
    });
    return letters;
  }, [lemmi]);

  // Lemmi visualizzati per la lettera selezionata (usa lemmi originali, non filteredLemmi)
  const displayedLemmi = useMemo(() => {
    if (!filters.selectedLetter) return [];

    // Usa lemmi originali per evitare che selectedLemmaId filtri l'indice stesso
    const lemmiForLetter = lemmi.filter(lemma =>
      lemma.Lemma.toLowerCase().startsWith(filters.selectedLetter!.toLowerCase())
    );

    // Ordina alfabeticamente e raggruppa per lemma
    const grouped = lemmiForLetter.reduce((acc, lemma) => {
      if (!acc[lemma.Lemma]) {
        acc[lemma.Lemma] = [];
      }
      acc[lemma.Lemma].push(lemma);
      return acc;
    }, {} as Record<string, typeof lemmi>);

    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, [lemmi, filters.selectedLetter]);

  const handleLetterClick = (letter: string) => {
    if (filters.selectedLetter === letter) {
      setFilters({ selectedLetter: null });
      clearHighlight();
    } else {
      setFilters({ selectedLetter: letter });
      
      // Evidenzia tutti i lemmi che iniziano con questa lettera
      const lemmiIds = lemmi
        .filter(l => l.Lemma.toLowerCase().startsWith(letter.toLowerCase()))
        .map(l => l.IdLemma);
      
      const geoAreas = [...new Set(
        lemmi
          .filter(l => l.Lemma.toLowerCase().startsWith(letter.toLowerCase()))
          .map(l => l.CollGeografica)
      )];
      
      const years = [...new Set(
        lemmi
          .filter(l => l.Lemma.toLowerCase().startsWith(letter.toLowerCase()))
          .map(l => parseInt(l.Anno))
          .filter(y => !isNaN(y))
      )];
      
      highlightMultiple({
        lemmaIds: lemmiIds,
        geoAreaIds: geoAreas,
        years,
        letters: [letter],
        source: 'index',
        type: 'select'
      });
    }
  };

  const handleLetterHover = (letter: string | null) => {
    if (!letter) {
      clearHighlight();
      return;
    }
    
    // Evidenzia temporaneamente al hover
    const lemmiIds = lemmi
      .filter(l => l.Lemma.toLowerCase().startsWith(letter.toLowerCase()))
      .map(l => l.IdLemma);
    
    highlightMultiple({
      lemmaIds: lemmiIds,
      letters: [letter],
      source: 'index',
      type: 'hover'
    });
  };

  const handleLemmaClick = (lemma: string, idLemma: string) => {
    setFilters({ selectedLemmaId: idLemma, searchQuery: lemma });
    // Chiude l'indice dopo la selezione (opzionale)
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="card p-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-text-primary">Indice Alfabetico</h2>
          {filters.selectedLetter && (
            <span className="text-xs text-text-muted">
              {displayedLemmi.length} lemmi con "{filters.selectedLetter}"
            </span>
          )}
        </div>
        <AnimatePresence>
          {onClose && (
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 hover:bg-background-muted rounded transition-fast text-text-muted hover:text-text-primary"
              aria-label="Chiudi indice"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Alfabeto inline - single row */}
      <StaggerContainer staggerDelay={0.02}>
        <div className="flex flex-wrap gap-1 mb-4">
          {alphabet.map((letter, index) => {
            const hasLemmi = lettersWithLemmi.has(letter);
            const isSelected = filters.selectedLetter === letter;

            return (
              <StaggerItem key={letter}>
                <motion.button
                  onClick={() => hasLemmi && handleLetterClick(letter)}
                  onMouseEnter={() => hasLemmi && !filters.selectedLetter && handleLetterHover(letter)}
                  onMouseLeave={() => !filters.selectedLetter && clearHighlight()}
                  disabled={!hasLemmi}
                  whileHover={hasLemmi ? { scale: 1.15, y: -2 } : {}}
                  whileTap={hasLemmi ? { scale: 0.95 } : {}}
                  animate={isSelected || isLetterHighlighted(letter) ? { scale: [1, 1.2, 1] } : {}}
                  transition={motionConfig.spring.fast}
                  className={`
                    w-7 h-7 text-center font-medium text-xs rounded transition-fast
                    ${hasLemmi ? 'cursor-pointer' : 'cursor-not-allowed opacity-20'}
                    ${isSelected
                      ? 'bg-primary text-white shadow-md'
                      : isLetterHighlighted(letter)
                        ? 'bg-primary-light text-primary shadow-sm ring-2 ring-primary ring-opacity-30'
                        : hasLemmi
                          ? 'bg-background-muted text-primary hover:bg-primary-light'
                          : 'bg-background-muted text-text-muted'
                    }
                  `}
                  aria-label={`Lettera ${letter}${hasLemmi ? '' : ' (nessun lemma)'}`}
                >
                  {letter}
                </motion.button>
              </StaggerItem>
            );
          })}
        </div>
      </StaggerContainer>

      {/* Elenco lemmi compatto - grid layout */}
      <AnimatePresence mode="wait">
        {filters.selectedLetter && displayedLemmi.length > 0 && (
          <motion.div 
            className="border-t border-border pt-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={motionConfig.transitions.medium}
          >
            <StaggerContainer staggerDelay={0.03}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                {displayedLemmi.map(([lemma, occorrenze]) => (
                  <StaggerItem key={lemma}>
                    <motion.button
                      layoutId={`lemma-card-${occorrenze[0].IdLemma}`}
                      onClick={() => handleLemmaClick(lemma, occorrenze[0].IdLemma)}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        bg-background-muted rounded p-2 hover:bg-primary-light transition-fast text-left cursor-pointer hover:shadow-md
                        ${isLemmaHighlighted(occorrenze[0].IdLemma) ? 'ring-2 ring-primary ring-opacity-50 bg-primary-light shadow-lg' : ''}
                      `}
                    >
                      <h4 className="font-medium text-text-primary text-sm truncate">{lemma}</h4>
                      <p className="text-xs text-text-muted">
                        {occorrenze.length} {occorrenze.length === 1 ? 'occ.' : 'occ.'}
                      </p>
                      <div className="text-[10px] text-text-muted truncate">
                        {[...new Set(occorrenze.map(o => o.CollGeografica))].slice(0, 2).join(', ')}
                      </div>
                    </motion.button>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
