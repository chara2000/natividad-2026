'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Calendar,
  ChevronDown,
  X,
  Filter,
  SlidersHorizontal,
  Check,
} from 'lucide-react';

// ───────────────────────────────────────────
// 1. SEARCH INPUT
// ───────────────────────────────────────────
interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}
export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Buscar…',
  className = '',
}) => (
  <div className={`relative flex-1 min-w-[180px] ${className}`}>
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-300/50 pointer-events-none" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm text-emerald-100 placeholder-emerald-300/40 focus:outline-none focus:border-amber-400/60 focus:bg-white/8 transition-all"
    />
    {value && (
      <button
        onClick={() => onChange('')}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-300/50 hover:text-white transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

// ───────────────────────────────────────────
// 2. CHIP / BADGE GROUP & FILTER PILLS (NO-SCROLL FLEX-WRAP)
// ───────────────────────────────────────────
export interface ChipOption {
  id: string;
  label: string;
  emoji?: string;
  color?: string; // Tailwind class string e.g. 'bg-amber-500/20 text-amber-300 border-amber-400/40'
  badge?: string;
}

interface ChipGroupProps {
  options: ChipOption[];
  value: string;        // single select
  onChange: (id: string) => void;
  label?: string;
  allLabel?: string;
}
export const ChipGroup: React.FC<ChipGroupProps> = ({ options, value, onChange, label, allLabel }) => (
  <div className="flex items-center gap-1.5 flex-wrap">
    {label && (
      <span className="text-[10px] uppercase font-bold text-emerald-300/60 tracking-widest shrink-0 mr-1">{label}:</span>
    )}
    {allLabel && (
      <button
        type="button"
        onClick={() => onChange('')}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
          value === ''
            ? 'bg-amber-400/25 text-amber-300 border-amber-400/50 shadow-sm shadow-amber-400/10 font-bold scale-[1.02]'
            : 'bg-white/5 text-emerald-200/70 border-white/10 hover:bg-white/10 hover:text-white'
        }`}
      >
        <span>🌟</span>
        <span>{allLabel}</span>
      </button>
    )}
    {options.map((opt) => {
      const isActive = value === opt.id;
      const activeColor = opt.color || 'bg-amber-400/25 text-amber-300 border-amber-400/50 shadow-sm shadow-amber-400/10';
      return (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(isActive ? '' : opt.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
            isActive
              ? `${activeColor} font-bold scale-[1.02]`
              : 'bg-white/5 text-emerald-200/70 border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          {opt.emoji && <span className="text-sm">{opt.emoji}</span>}
          <span>{opt.label}</span>
          {opt.badge && (
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono">
              {opt.badge}
            </span>
          )}
          {isActive && <Check className="w-3 h-3 ml-0.5 text-amber-400" />}
        </button>
      );
    })}
  </div>
);

export const FilterPills = ChipGroup;

// ───────────────────────────────────────────
// 3. MULTI-SELECT CHIP GROUP
// ───────────────────────────────────────────
interface MultiChipGroupProps {
  options: ChipOption[];
  value: string[];
  onChange: (ids: string[]) => void;
  label?: string;
}
export const MultiChipGroup: React.FC<MultiChipGroupProps> = ({ options, value, onChange, label }) => {
  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {label && (
        <span className="text-[10px] uppercase font-bold text-emerald-300/60 tracking-widest shrink-0">{label}</span>
      )}
      {options.map((opt) => {
        const isActive = value.includes(opt.id);
        const activeColor = opt.color || 'bg-amber-500/20 text-amber-300 border-amber-400/40';
        return (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold border whitespace-nowrap transition-all duration-200 ${
              isActive
                ? `${activeColor} shadow-sm scale-105`
                : 'bg-white/5 text-emerald-200/70 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {opt.emoji && <span>{opt.emoji}</span>}
            {opt.label}
            {isActive && <Check className="w-3 h-3 ml-0.5" />}
          </button>
        );
      })}
    </div>
  );
};

// ───────────────────────────────────────────
// 4. DATE RANGE PICKER
// ───────────────────────────────────────────
interface DateRangePickerProps {
  fromDate: string;
  toDate: string;
  onFromChange: (d: string) => void;
  onToChange: (d: string) => void;
  label?: string;
}
export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  fromDate,
  toDate,
  onFromChange,
  onToChange,
  label = 'Fecha',
}) => (
  <div className="flex items-center gap-2 flex-wrap">
    <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-300/60 tracking-widest shrink-0">
      <Calendar className="w-3 h-3" /> {label}
    </span>
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-400/60 pointer-events-none" />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => onFromChange(e.target.value)}
          className="pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-emerald-100 focus:outline-none focus:border-amber-400/60 transition-all [color-scheme:dark] min-w-[130px]"
        />
      </div>
      <span className="text-emerald-300/50 text-xs font-mono">→</span>
      <div className="relative">
        <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-400/60 pointer-events-none" />
        <input
          type="date"
          value={toDate}
          onChange={(e) => onToChange(e.target.value)}
          className="pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-emerald-100 focus:outline-none focus:border-amber-400/60 transition-all [color-scheme:dark] min-w-[130px]"
        />
      </div>
      {(fromDate || toDate) && (
        <button
          onClick={() => { onFromChange(''); onToChange(''); }}
          className="text-emerald-300/50 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  </div>
);

// ───────────────────────────────────────────
// 5. MONTH PICKER
// ───────────────────────────────────────────
const MONTHS_ES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];
interface MonthPickerProps {
  value: number | null; // 1-12 or null
  onChange: (m: number | null) => void;
  label?: string;
}
export const MonthPicker: React.FC<MonthPickerProps> = ({ value, onChange, label = 'Mes' }) => (
  <div className="flex items-center gap-2 flex-wrap">
    <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-300/60 tracking-widest shrink-0">
      <Calendar className="w-3 h-3" /> {label}
    </span>
    <div className="flex items-center gap-1 flex-wrap">
      {[11, 12].map((m) => (
        <button
          key={m}
          onClick={() => onChange(value === m ? null : m)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
            value === m
              ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-sm scale-105'
              : 'bg-white/5 text-emerald-200/70 border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          {MONTHS_ES[m - 1]}
        </button>
      ))}
    </div>
  </div>
);

// ───────────────────────────────────────────
// 6. SORT DROPDOWN
// ───────────────────────────────────────────
interface SortOption {
  id: string;
  label: string;
}
interface SortDropdownProps {
  options: SortOption[];
  value: string;
  onChange: (id: string) => void;
  label?: string;
}
export const SortDropdown: React.FC<SortDropdownProps> = ({ options, value, onChange, label = 'Ordenar' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.id === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-400/40 text-xs text-emerald-200 hover:text-white transition-all cursor-pointer"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400/70" />
        <span>{label}: <span className="text-amber-300 font-semibold">{current?.label || '—'}</span></span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 rounded-2xl border border-amber-400/30 bg-[#06180e]/95 backdrop-blur-xl shadow-2xl min-w-[180px] overflow-hidden p-1">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => { onChange(opt.id); setOpen(false); }}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between gap-2 cursor-pointer ${
                value === opt.id
                  ? 'text-amber-300 bg-amber-500/20 font-bold'
                  : 'text-emerald-200/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              {opt.label}
              {value === opt.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ───────────────────────────────────────────
// 6.1 GENERAL FILTER DROPDOWN
// ───────────────────────────────────────────
export interface DropdownOption {
  id: string;
  label: string;
  emoji?: string;
  subtitle?: string;
  badge?: string;
}

export interface FilterDropdownProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (id: string) => void;
  icon?: React.ElementType;
  placeholder?: string;
  className?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  icon: Icon,
  placeholder = 'Todos',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.id === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-400/40 text-xs text-emerald-100 hover:text-white transition-all cursor-pointer shadow-sm w-full sm:w-auto justify-between"
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon className="w-3.5 h-3.5 text-amber-400/80 flex-shrink-0" />}
          <span className="text-[10px] uppercase font-bold text-emerald-300/60 tracking-wider">
            {label}:
          </span>
          <span className="text-amber-300 font-bold truncate flex items-center gap-1">
            {current?.emoji && <span>{current.emoji}</span>}
            <span>{current ? current.label : placeholder}</span>
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-emerald-400/60 transition-transform duration-200 flex-shrink-0 ml-1.5 ${open ? 'rotate-180 text-amber-400' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 z-50 rounded-2xl border border-amber-400/30 bg-[#06180e]/95 backdrop-blur-xl shadow-2xl min-w-[220px] max-w-[320px] max-h-72 overflow-y-auto overflow-x-hidden p-1.5 space-y-0.5">
          {options.map((opt) => {
            const isSelected = value === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onChange(opt.id);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? 'text-amber-300 bg-amber-500/20 border border-amber-400/30 font-bold'
                    : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {opt.emoji && <span className="text-sm flex-shrink-0">{opt.emoji}</span>}
                  <div className="truncate">
                    <div className="truncate">{opt.label}</div>
                    {opt.subtitle && (
                      <div className="text-[10px] text-emerald-300/60 font-normal truncate">
                        {opt.subtitle}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {opt.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono">
                      {opt.badge}
                    </span>
                  )}
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ───────────────────────────────────────────
// 6.2 NATIVE FILTER SELECT (ZERO CLIPPING, 100% RELIABLE)
// ───────────────────────────────────────────
export interface NativeFilterSelectProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (id: string) => void;
  icon?: React.ElementType;
  placeholder?: string;
  className?: string;
}

export const NativeFilterSelect: React.FC<NativeFilterSelectProps> = ({
  label,
  options,
  value,
  onChange,
  icon: Icon,
  placeholder = 'Todos',
  className = '',
}) => {
  const current = options.find((o) => o.id === value);
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-400/40 text-xs text-emerald-100 transition-all shadow-sm w-full sm:w-auto justify-between pointer-events-none">
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon className="w-3.5 h-3.5 text-amber-400/80 flex-shrink-0" />}
          <span className="text-[10px] uppercase font-bold text-emerald-300/60 tracking-wider">
            {label}:
          </span>
          <span className="text-amber-300 font-bold truncate flex items-center gap-1">
            {current?.emoji && <span>{current.emoji}</span>}
            <span>{current ? current.label : placeholder}</span>
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-emerald-400/60 ml-2 flex-shrink-0" />
      </div>
      {/* Invisible native select overlaid: guarantees native OS menu without ANY clipping */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
        aria-label={label}
      >
        <option value="" className="bg-[#06180e] text-emerald-100">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id} className="bg-[#06180e] text-emerald-100">
            {opt.emoji ? `${opt.emoji} ` : ''}{opt.label} {opt.badge ? `(${opt.badge})` : ''}
          </option>
        ))}
      </select>
    </div>
  );
};

// ───────────────────────────────────────────
// 7. AMOUNT RANGE FILTER
// ───────────────────────────────────────────
interface AmountRangeProps {
  min: string;
  max: string;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
  currency?: string;
}
export const AmountRangeFilter: React.FC<AmountRangeProps> = ({
  min,
  max,
  onMinChange,
  onMaxChange,
  currency = '$',
}) => (
  <div className="flex items-center gap-1.5 flex-wrap">
    <span className="text-[10px] uppercase font-bold text-emerald-300/60 tracking-widest shrink-0">Monto</span>
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-emerald-300/50 font-bold">{currency}</span>
        <input
          type="number"
          value={min}
          onChange={(e) => onMinChange(e.target.value)}
          placeholder="Mín"
          className="pl-6 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-emerald-100 focus:outline-none focus:border-amber-400/60 transition-all w-24"
        />
      </div>
      <span className="text-emerald-300/50 text-xs">—</span>
      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-emerald-300/50 font-bold">{currency}</span>
        <input
          type="number"
          value={max}
          onChange={(e) => onMaxChange(e.target.value)}
          placeholder="Máx"
          className="pl-6 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-emerald-100 focus:outline-none focus:border-amber-400/60 transition-all w-24"
        />
      </div>
      {(min || max) && (
        <button
          onClick={() => { onMinChange(''); onMaxChange(''); }}
          className="text-emerald-300/50 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  </div>
);

// ───────────────────────────────────────────
// 8. COLLAPSIBLE FILTER BAR WRAPPER
// ───────────────────────────────────────────
interface FilterBarProps {
  children: React.ReactNode;
  activeFiltersCount?: number;
  onClearAll?: () => void;
  defaultOpen?: boolean;
  label?: string;
}
export const FilterBar: React.FC<FilterBarProps> = ({
  children,
  activeFiltersCount = 0,
  onClearAll,
  defaultOpen = true,
  label = 'Filtros',
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`glass-card rounded-3xl border border-white/10 transition-all ${open ? 'overflow-visible' : 'overflow-hidden'}`}>
      {/* Header toggle */}
      <div className="w-full flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-white/5 transition-all">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex-1 flex items-center gap-2 text-left cursor-pointer"
        >
          <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center flex-shrink-0">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">{label}</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-pine-950 text-[10px] font-black">
              {activeFiltersCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-[10px] text-rose-300 hover:text-rose-200 font-semibold px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer"
            >
              Limpiar todo
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="Alternar filtros"
            className="p-1 text-emerald-300/60 hover:text-emerald-100 transition-colors cursor-pointer"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div
        className={`transition-all duration-300 ${
          open ? 'max-h-[700px] opacity-100 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-5 pb-5 pt-1 space-y-4 border-t border-white/5">
          {children}
        </div>
      </div>
    </div>
  );
};
