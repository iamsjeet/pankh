import React from 'react';
import { Search, X, Command } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  shortcut?: string;
  onClear?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search incident reports, ICAO codes, callsigns...',
  shortcut = '⌘K',
  onClear,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative flex items-center w-full max-w-md h-10 rounded-panel bg-sand-25 border border-obsidian-950/15 px-3.5 transition-all duration-150 focus-within:border-obsidian-950 focus-within:ring-2 focus-within:ring-lime-400/50 focus-within:bg-white',
        className
      )}
    >
      <Search className="w-4 h-4 text-stone-500 shrink-0 mr-2.5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-xs sm:text-sm text-obsidian-950 placeholder:text-stone-400 focus:outline-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          className="text-stone-500 hover:text-obsidian-950 transition-colors p-0.5 ml-1"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      ) : shortcut ? (
        <div className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-sand-100 text-stone-600 border border-obsidian-950/10 text-2xs font-mono select-none">
          <Command className="w-2.5 h-2.5" />
          <span>{shortcut.replace('⌘', '')}</span>
        </div>
      ) : null}
    </div>
  );
};
