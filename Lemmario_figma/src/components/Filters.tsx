import { useState, useRef, useEffect } from 'react';
import { Tag, Calendar, RotateCcw, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

interface FiltersProps {
  availableCategories: string[];
  availablePeriods: string[];
  selectedCategories: string[];
  selectedPeriods: string[];
  onCategoriesChange: (categories: string[]) => void;
  onPeriodsChange: (periods: string[]) => void;
  onReset: () => void;
}

export function Filters({
  availableCategories,
  availablePeriods,
  selectedCategories,
  selectedPeriods,
  onCategoriesChange,
  onPeriodsChange,
  onReset,
}: FiltersProps) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [periodOpen, setPeriodOpen] = useState(false);
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const handlePeriodToggle = (period: string) => {
    if (selectedPeriods.includes(period)) {
      onPeriodsChange(selectedPeriods.filter(p => p !== period));
    } else {
      onPeriodsChange([...selectedPeriods, period]);
    }
  };

  const activeFiltersCount = selectedCategories.length + selectedPeriods.length;
  const categoryRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLDivElement>(null);
  const categoryButtonRef = useRef<HTMLButtonElement>(null);
  const periodButtonRef = useRef<HTMLButtonElement>(null);
  const [categoryDropdownPos, setCategoryDropdownPos] = useState({ top: 0, left: 0 });
  const [periodDropdownPos, setPeriodDropdownPos] = useState({ top: 0, left: 0 });

  // Calculate dropdown position
  useEffect(() => {
    if (categoryOpen && categoryButtonRef.current) {
      const rect = categoryButtonRef.current.getBoundingClientRect();
      setCategoryDropdownPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX
      });
    }
  }, [categoryOpen]);

  useEffect(() => {
    if (periodOpen && periodButtonRef.current) {
      const rect = periodButtonRef.current.getBoundingClientRect();
      setPeriodDropdownPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX
      });
    }
  }, [periodOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setCategoryOpen(false);
      }
      if (periodRef.current && !periodRef.current.contains(event.target as Node)) {
        setPeriodOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Category Filter */}
        <div className="flex items-center gap-2" ref={categoryRef}>
          <Button 
            ref={categoryButtonRef}
            variant="outline" 
            className="w-[280px] justify-between"
            aria-label="Filtra per categoria"
            onClick={() => setCategoryOpen(!categoryOpen)}
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <span>
                {selectedCategories.length > 0
                  ? `${selectedCategories.length} categorie`
                  : 'Tutte le categorie'}
              </span>
            </div>
            {selectedCategories.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedCategories.length}
              </Badge>
            )}
          </Button>
          
          {categoryOpen && (
            <div 
              className="fixed w-[320px] max-h-[400px] overflow-y-auto bg-white rounded-md border border-gray-200 shadow-lg p-4 z-[9999]"
              style={{ top: `${categoryDropdownPos.top}px`, left: `${categoryDropdownPos.left}px` }}
            >
              <div className="space-y-2">
                <h4 className="font-medium text-sm mb-3">Seleziona categorie</h4>
                {availableCategories.length === 0 ? (
                  <p className="text-sm text-gray-500">Nessuna categoria disponibile</p>
                ) : (
                  availableCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <Label
                        htmlFor={`cat-${category}`}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {category}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Time Period Filter */}
        <div className="flex items-center gap-2" ref={periodRef}>
          <Button 
            ref={periodButtonRef}
            variant="outline" 
            className="w-[280px] justify-between"
            aria-label="Filtra per periodo"
            onClick={() => setPeriodOpen(!periodOpen)}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>
                {selectedPeriods.length > 0
                  ? `${selectedPeriods.length} periodi`
                  : 'Tutti i periodi'}
              </span>
            </div>
            {selectedPeriods.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedPeriods.length}
              </Badge>
            )}
          </Button>
          
          {periodOpen && (
            <div 
              className="fixed w-[320px] max-h-[400px] overflow-y-auto bg-white rounded-md border border-gray-200 shadow-lg p-4 z-[9999]"
              style={{ top: `${periodDropdownPos.top}px`, left: `${periodDropdownPos.left}px` }}
            >
              <div className="space-y-2">
                <h4 className="font-medium text-sm mb-3">Seleziona periodi</h4>
                {availablePeriods.length === 0 ? (
                  <p className="text-sm text-gray-500">Nessun periodo disponibile</p>
                ) : (
                  availablePeriods.map((period) => (
                    <div key={period} className="flex items-center space-x-2">
                      <Checkbox
                        id={`period-${period}`}
                        checked={selectedPeriods.includes(period)}
                        onCheckedChange={() => handlePeriodToggle(period)}
                      />
                      <Label
                        htmlFor={`period-${period}`}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {period}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Active filters display */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {selectedCategories.map(cat => (
              <Badge 
                key={cat} 
                variant="secondary" 
                className="gap-1 cursor-pointer hover:bg-secondary/80"
                onClick={() => handleCategoryToggle(cat)}
              >
                {cat}
                <X className="w-3 h-3" />
              </Badge>
            ))}
            {selectedPeriods.map(period => (
              <Badge 
                key={period} 
                variant="secondary" 
                className="gap-1 cursor-pointer hover:bg-secondary/80"
                onClick={() => handlePeriodToggle(period)}
              >
                {period}
                <X className="w-3 h-3" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Reset Filters */}
      {activeFiltersCount > 0 && (
        <Button 
          variant="ghost" 
          onClick={onReset} 
          className="gap-2"
          aria-label="Azzera tutti i filtri"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Azzera filtri</span>
        </Button>
      )}
    </div>
  );
}
