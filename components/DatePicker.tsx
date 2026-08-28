'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (dateStr: string) => void;
  label?: string;
}

export function DatePicker({ value, onChange, label }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value + 'T00:00:00') : new Date();
  const [viewDate, setViewDate] = useState<Date>(selectedDate);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDisplay = (dStr: string) => {
    if (!dStr) return 'Select Date';
    const d = new Date(dStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(d);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === 7) return 'Next Week';

    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isFuture = React.useMemo(() => {
    if (!value) return false;
    const target = new Date(value + 'T00:00:00').getTime();
    const todayEnd = new Date().setHours(23, 59, 59, 999);
    return target > todayEnd;
  }, [value]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = () => {
    setViewDate(new Date(year, month - 1, 1));
  };
  const nextMonthDays = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    onChange(`${year}-${mStr}-${dStr}`);
    setIsOpen(false);
  };

  const handlePreset = (daysFromToday: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromToday);
    const yStr = target.getFullYear();
    const mStr = String(target.getMonth() + 1).padStart(2, '0');
    const dStr = String(target.getDate()).padStart(2, '0');
    const fullStr = `${yStr}-${mStr}-${dStr}`;
    onChange(fullStr);
    setViewDate(target);
    setIsOpen(false);
  };

  return (
    <div className="space-y-1 relative" ref={containerRef}>
      {label && <label className="text-xs font-mono font-bold text-slate-600 block">{label}</label>}

      {/* Main Trigger Input */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-slate-900 font-mono font-bold shadow-sm flex items-center justify-between cursor-pointer transition-all"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-slate-500" />
          <span>{formatDisplay(value)}</span>
          <span className="text-[10px] text-slate-400 font-semibold font-mono">({value})</span>
        </div>
        {isFuture && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-mono text-[10px] font-bold border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Future (Pending)</span>
          </span>
        )}
      </div>

      {/* Custom Popover Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-72 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xl space-y-3 animate-in fade-in">
          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => handlePreset(0)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-mono font-bold transition-colors cursor-pointer shrink-0"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handlePreset(1)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-mono font-bold transition-colors cursor-pointer shrink-0"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => handlePreset(7)}
              className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-mono font-bold transition-colors cursor-pointer shrink-0"
            >
              +1 Week
            </button>
            <button
              type="button"
              onClick={() => handlePreset(30)}
              className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-mono font-bold transition-colors cursor-pointer shrink-0"
            >
              +1 Month
            </button>
          </div>

          {/* Month Header */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={prevMonthDays}
              className="p-1 rounded-xl hover:bg-slate-100 text-slate-600 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-900">
              {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              type="button"
              onClick={nextMonthDays}
              className="p-1 rounded-xl hover:bg-slate-100 text-slate-600 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px]">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d} className="text-slate-400 font-bold py-1">
                {d}
              </span>
            ))}

            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <span key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const mStr = String(month + 1).padStart(2, '0');
              const dStr = String(dayNum).padStart(2, '0');
              const fullStr = `${year}-${mStr}-${dStr}`;
              const isSelected = value === fullStr;
              const isToday = new Date().toISOString().slice(0, 10) === fullStr;

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => handleSelectDay(dayNum)}
                  className={`py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm'
                      : isToday
                      ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                      : 'hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
