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
        'relative flex items-center w-full max-w-md h-9 rounded-panel bg-navy-900/90 border border-navy-700/80 px-3 transition-all duration-150 focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/30 focus-within:bg-navy-850',
        className
      )}
    >
      <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          className="text-slate-400 hover:text-slate-200 transition-colors p-0.5 ml-1"
        >
          <X className="w-3 h-3" />
        </button>
      ) : shortcut ? (
        <div className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-navy-800 text-slate-400 border border-navy-700 text-2xs font-mono select-none">
          <Command className="w-2.5 h-2.5" />
          <span>{shortcut.replace('⌘', '')}</span>
        </div>
      ) : null}
    </div>
  );
};
