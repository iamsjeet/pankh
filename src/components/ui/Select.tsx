import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  label,
  error,
  className,
  value,
  onChange,
  disabled,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-2xs font-mono uppercase tracking-wider text-stone-500 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
          className={cn(
            'w-full h-10 appearance-none rounded-panel bg-sand-25 border border-obsidian-950/15 px-3 pr-8 text-xs font-medium text-obsidian-950 transition-all duration-150',
            'focus:outline-none focus:border-obsidian-950 focus:ring-2 focus:ring-lime-400/50 focus:bg-white',
            'disabled:opacity-45 disabled:cursor-not-allowed',
            error && 'border-crimson-500',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-sand-25 text-obsidian-950">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500 pointer-events-none" />
      </div>
      {error && <p className="mt-1 text-2xs text-crimson-600">{error}</p>}
    </div>
  );
};
