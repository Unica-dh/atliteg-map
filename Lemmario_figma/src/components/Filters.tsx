import { Tag, Calendar, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { categories, timePeriods } from '../data/mockData';

interface FiltersProps {
  selectedCategory: string | null;
  selectedTimePeriod: string | null;
  onCategoryChange: (category: string | null) => void;
  onTimePeriodChange: (period: string | null) => void;
  onReset: () => void;
}

export function Filters({
  selectedCategory,
  selectedTimePeriod,
  onCategoryChange,
  onTimePeriodChange,
  onReset,
}: FiltersProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-gray-500" />
          <Select
            value={selectedCategory || 'all'}
            onValueChange={(value) => onCategoryChange(value === 'all' ? null : value)}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time Period Filter */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <Select
            value={selectedTimePeriod || 'all'}
            onValueChange={(value) => onTimePeriodChange(value === 'all' ? null : value)}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Periods</SelectItem>
              {timePeriods.map((period) => (
                <SelectItem key={period} value={period}>
                  {period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reset Filters */}
      <Button variant="ghost" onClick={onReset} className="gap-2">
        <RotateCcw className="w-4 h-4" />
        <span>Reset Filters</span>
      </Button>
    </div>
  );
}
