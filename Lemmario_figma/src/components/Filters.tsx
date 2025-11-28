import { useState } from 'react';
import { Tag, Calendar, RotateCcw, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
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

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-[280px] justify-between"
                aria-label="Filtra per categoria"
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
            </PopoverTrigger>
            <PopoverContent className="w-[320px] max-h-[400px] overflow-y-auto">
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
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Period Filter */}
        <div className="flex items-center gap-2">
          <Popover open={periodOpen} onOpenChange={setPeriodOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-[280px] justify-between"
                aria-label="Filtra per periodo"
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
            </PopoverTrigger>
            <PopoverContent className="w-[320px] max-h-[400px] overflow-y-auto">
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
            </PopoverContent>
          </Popover>
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
