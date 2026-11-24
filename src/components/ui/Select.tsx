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
        <label className="block text-2xs font-mono uppercase tracking-wider text-slate-400 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            'w-full h-9 appearance-none rounded-panel bg-navy-900/90 border border-navy-700/80 px-3 pr-8 text-xs text-slate-100 transition-all duration-150',
            'focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30',
            'disabled:opacity-45 disabled:cursor-not-allowed',
            error && 'border-crimson-500',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-navy-900 text-slate-200">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="mt-1 text-2xs text-crimson-400">{error}</p>}
    </div>
  );
};
