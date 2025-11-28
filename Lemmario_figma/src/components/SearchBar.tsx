import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import type { Lemma } from '../types';
import { useDebounce } from '../hooks';

interface SearchBarProps {
  lemmas: Lemma[];
  onSelect: (lemma: Lemma) => void;
  className?: string;
}

export function SearchBar({ lemmas, onSelect, className = '' }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 300);

  const searchResults = useMemo(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) return [];

    const query = debouncedSearch.toLowerCase();
    const results = lemmas.filter(lemma => 
      lemma.Lemma.toLowerCase().includes(query) ||
      lemma.Forma.toLowerCase().includes(query)
    );

    // Limita risultati a 20 per performance
    return results.slice(0, 20);
  }, [debouncedSearch, lemmas]);

  const handleSelect = (lemma: Lemma) => {
    onSelect(lemma);
    setSearchValue('');
    setOpen(false);
  };

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Cerca lemma o forma..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setOpen(e.target.value.length >= 2);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Cerca lemma o forma"
              aria-expanded={open}
              aria-controls="search-results"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start" id="search-results">
          <Command>
            <CommandList>
              <CommandEmpty>Nessun risultato trovato.</CommandEmpty>
              {searchResults.length > 0 && (
                <CommandGroup heading="Risultati">
                  {searchResults.map((lemma, index) => (
                    <CommandItem
                      key={`${lemma.IdLemma}-${index}`}
                      value={lemma.Lemma}
                      onSelect={() => handleSelect(lemma)}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col w-full">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{lemma.Lemma}</span>
                          <span className="text-xs text-gray-500">{lemma.Anno}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Forma: {lemma.Forma} • {lemma.CollGeografica}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
