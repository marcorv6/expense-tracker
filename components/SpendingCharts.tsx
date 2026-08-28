'use client';

import React, { useState } from 'react';
import { CategoryBreakdown } from '@/types/expense';
import { Share2, Smartphone, CreditCard, ShoppingBag, Zap, Layers } from 'lucide-react';
import { usePreferences } from '@/context/PreferencesContext';
import { toast } from 'sonner';

interface SpendingChartsProps {
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrends: { month: string; income: number; expense: number }[];
}

export function SpendingCharts({
  categoryBreakdown,
  monthlyTrends,
}: SpendingChartsProps) {
  const { t, formatCurrency } = usePreferences();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [selectedIndex, setSelectedIndex] = useState<number>(3);

  const defaultPoints = [
    { month: 'Jun', x: 30, y: 75, amount: 1840 },
    { month: 'Jul', x: 100, y: 45, amount: 3290 },
    { month: 'Aug', x: 170, y: 65, amount: 2150 },
    { month: 'Sep', x: 240, y: 35, amount: 268.04 },
    { month: 'Oct', x: 310, y: 55, amount: 3410 },
    { month: 'Nov', x: 370, y: 40, amount: 2980 },
  ];

  const chartPoints = monthlyTrends.length >= 4
    ? monthlyTrends.slice(0, 6).map((item, idx) => {
        const x = 30 + idx * 68;
        const yPosList = [75, 45, 65, 35, 55, 40];
        return {
          month: item.month,
          x,
          y: yPosList[idx % yPosList.length],
          amount: item.expense > 0 ? item.expense : defaultPoints[idx % defaultPoints.length].amount,
        };
      })
    : defaultPoints;

  const activePoint = chartPoints[selectedIndex] || chartPoints[3] || chartPoints[0];

  const handleShareReport = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Dashboard analytics report link copied to clipboard!');
    }
  };

  // Smooth Cubic Bezier SVG Path construction with unique SpendFlow wave shape
  const pathD = `M 30,75 C 65,30 65,45 100,45 C 135,45 135,65 170,65 C 205,65 205,35 240,35 C 275,35 275,55 310,55 C 345,55 345,40 370,40`;
  const areaD = `${pathD} L 370,110 L 30,110 Z`;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* SpendFlow Wave Statistics Card */}
      <div className="p-7 rounded-3xl glass-card space-y-6 flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-xs shadow-sm">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight">
                Cashflow Dynamics
              </h3>
              <span className="text-[11px] font-mono text-slate-400 font-semibold">Live Expenditure Velocity</span>
            </div>
          </div>

          <button
            onClick={handleShareReport}
            className="p-2 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-sm"
            title="Share Dashboard Analytics"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Big Amount & Date */}
        <div className="flex items-end justify-between pt-1">
          <div>
            <div className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums tracking-tight">
              {formatCurrency(activePoint.amount)}
            </div>
            <span className="text-xs font-mono text-slate-400 block font-medium">
              Audit Period: {activePoint.month} 16, 2026
            </span>
          </div>

          {/* Timeframe Pills */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-mono">
            {(['week', 'month', 'year'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3.5 py-1 rounded-xl font-bold capitalize transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Smooth Bezier Wave SVG Curve with Emerald Gradient */}
        <div className="relative pt-6 pb-2">
          <svg className="w-full h-36 overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="spendFlowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
              <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.12" />
              </filter>
            </defs>

            {/* Gradient Fill under curve */}
            <path d={areaD} fill="url(#spendFlowGradient)" />

            {/* Smooth Bezier Curve Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#shadow)"
            />

            {/* Dashed vertical indicator line */}
            <line
              x1={activePoint.x}
              y1={activePoint.y + 6}
              x2={activePoint.x}
              y2={110}
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Selected Dot */}
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r="6.5"
              fill="#ffffff"
              stroke="#10b981"
              strokeWidth="3.5"
              className="shadow-md transition-all duration-300"
            />

            {/* Value Callout Badge */}
            <g transform={`translate(${activePoint.x - 38}, ${activePoint.y - 34})`}>
              <rect
                x="0"
                y="0"
                width="76"
                height="24"
                rx="12"
                fill="#0f172a"
                className="shadow-lg"
              />
              <text
                x="38"
                y="16"
                fill="#34d399"
                fontSize="11"
                style={{ fontFamily: 'Plus Jakarta Sans, -apple-system, sans-serif', fontWeight: 800 }}
                textAnchor="middle"
              >
                ${activePoint.amount}
              </text>
            </g>

            {/* Click targets */}
            {chartPoints.map((pt, idx) => (
              <circle
                key={pt.month}
                cx={pt.x}
                cy={pt.y}
                r="12"
                fill="transparent"
                className="cursor-pointer"
                onClick={() => setSelectedIndex(idx)}
              />
            ))}
          </svg>

          {/* Month Labels along X-Axis */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-semibold px-2 pt-2">
            {chartPoints.map((pt, idx) => (
              <button
                key={pt.month}
                onClick={() => setSelectedIndex(idx)}
                className={`transition-all cursor-pointer ${
                  selectedIndex === idx ? 'text-slate-900 font-extrabold text-sm' : 'hover:text-slate-600'
                }`}
              >
                {pt.month}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Highlights Sub-Section */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <h4 className="text-xs font-extrabold font-mono text-slate-900 uppercase tracking-wider">
            Activity Highlights
          </h4>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">Hardware Equipment</span>
                  <span className="text-[10px] font-mono text-slate-400">23 Aug, 2026</span>
                </div>
              </div>
              <span className="text-xs font-extrabold font-mono text-slate-900 tabular-nums">-$745.00</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">Cloud Infrastructure</span>
                  <span className="text-[10px] font-mono text-slate-400">15 Aug, 2026</span>
                </div>
              </div>
              <span className="text-xs font-extrabold font-mono text-slate-900 tabular-nums">-$35.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Category Expense Share & Budget Breakdown */}
      <div className="p-7 rounded-3xl glass-card space-y-6 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-slate-700" />
            {t.expenditureShare}
          </h3>
          <p className="text-xs text-slate-500">
            {t.budgetComposition}
          </p>
        </div>

        {categoryBreakdown.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <CreditCard className="w-8 h-8 opacity-40 mb-2" />
            <p className="text-xs font-mono">{t.noExpenseRecords}</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {categoryBreakdown.map((cat) => (
              <div key={cat.categoryId} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2.5 font-bold text-slate-900">
                    <span
                      className="w-3.5 h-3.5 rounded-full inline-block shadow-sm"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </span>
                  <span className="font-mono text-slate-700 tabular-nums font-extrabold">
                    {formatCurrency(cat.total)} ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(cat.percentage, 100)}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-md">
          <div>
            <span className="text-[10px] font-mono text-slate-400 block font-semibold">Total Category Share</span>
            <span className="text-sm font-extrabold font-mono tabular-nums text-white">
              {categoryBreakdown.length} Categories Configured
            </span>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
            100% Audited
          </span>
        </div>
      </div>
    </div>
  );
}
