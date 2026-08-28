'use client';

import React, { useState } from 'react';
import { CategoryBreakdown, TransactionItem } from '@/types/expense';
import { Share2, CreditCard, ShoppingBag, Zap, ArrowDownLeft } from 'lucide-react';
import { usePreferences } from '@/context/PreferencesContext';
import { toast } from 'sonner';

interface SpendingChartsProps {
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrends: { month: string; income: number; expense: number }[];
  transactions?: TransactionItem[];
}

function generateBezierPath(points: { x: number; y: number }[]): { pathD: string; areaD: string } {
  if (!points || points.length === 0) return { pathD: '', areaD: '' };
  if (points.length === 1) return { pathD: `M ${points[0].x},${points[0].y}`, areaD: '' };

  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cp1x = p0.x + (p1.x - p0.x) / 2;
    const cp1y = p0.y;
    const cp2x = p0.x + (p1.x - p0.x) / 2;
    const cp2y = p1.y;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
  }
  const last = points[points.length - 1];
  const first = points[0];
  const areaD = `${d} L ${last.x},110 L ${first.x},110 Z`;
  return { pathD: d, areaD };
}

export function SpendingCharts({
  categoryBreakdown,
  monthlyTrends,
  transactions = [],
}: SpendingChartsProps) {
  const { t, formatCurrency } = usePreferences();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [selectedIndex, setSelectedIndex] = useState<number>(3);

  const getPointsForTimeframe = () => {
    if (timeframe === 'week') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return days.map((dayName) => {
        const dayTxs = transactions.filter((t) => {
          if (t.type !== 'expense') return false;
          const d = new Date(t.date);
          const name = d.toLocaleDateString('en-US', { weekday: 'short' });
          return name === dayName;
        });
        const expense = dayTxs.reduce((sum, t) => sum + t.amount, 0);
        return { month: dayName, expense };
      });
    }

    if (timeframe === 'year') {
      const years = ['2021', '2022', '2023', '2024', '2025', '2026'];
      return years.map((yStr) => {
        const yearTxs = transactions.filter((t) => {
          if (t.type !== 'expense') return false;
          return new Date(t.date).getFullYear().toString() === yStr;
        });
        const expense = yearTxs.reduce((sum, t) => sum + t.amount, 0);
        return { month: yStr, expense };
      });
    }

    // Default 'month'
    if (monthlyTrends && monthlyTrends.length > 0) {
      return monthlyTrends.slice(-6).map((item) => ({ month: item.month, expense: item.expense }));
    }

    return [
      { month: 'Jun', expense: 0 },
      { month: 'Jul', expense: 0 },
      { month: 'Aug', expense: 0 },
      { month: 'Sep', expense: 0 },
      { month: 'Oct', expense: 0 },
      { month: 'Nov', expense: 0 },
    ];
  };

  const sourceData = getPointsForTimeframe();
  const maxExpense = Math.max(...sourceData.map((d) => d.expense), 100);

  // Compute dynamic (x, y) coordinates proportional to actual expense data
  const chartPoints = sourceData.map((item, idx) => {
    const totalCount = sourceData.length;
    const x = 30 + idx * (340 / Math.max(totalCount - 1, 1));
    // High expense -> y near 30 (top of SVG), Low expense -> y near 95 (bottom of SVG)
    const ratio = item.expense === 0 ? 0 : Math.min(Math.max(item.expense / maxExpense, 0.15), 1.0);
    const y = item.expense === 0 ? 95 : Math.round(95 - ratio * 65);
    return {
      month: item.month,
      x,
      y,
      amount: item.expense,
    };
  });

  const activeIndex = Math.min(selectedIndex, chartPoints.length - 1);
  const activePoint = chartPoints[activeIndex] || chartPoints[0];

  const { pathD, areaD } = generateBezierPath(chartPoints);

  // Dynamic top expense transactions for Activity Highlights
  const topExpenses = transactions
    .filter((tx) => tx.type === 'expense')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 2);

  const handleShareReport = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Dashboard analytics report link copied to clipboard!');
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* SpendFlow Dynamic Wave Statistics Card */}
      <div className="p-7 rounded-3xl glass-card space-y-6 flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-xs shadow-sm">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight">
                {t.cashflowDynamics}
              </h3>
              <span className="text-[11px] font-mono text-slate-400 font-semibold">
                {t.cashflowDesc}
              </span>
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
              {t.auditPeriod}: {activePoint.month} 16, 2026
            </span>
          </div>

          {/* Timeframe Pills */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-mono">
            <button
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1 rounded-xl font-bold capitalize transition-all cursor-pointer ${
                timeframe === 'week' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.week}
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1 rounded-xl font-bold capitalize transition-all cursor-pointer ${
                timeframe === 'month' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.month}
            </button>
            <button
              onClick={() => setTimeframe('year')}
              className={`px-3 py-1 rounded-xl font-bold capitalize transition-all cursor-pointer ${
                timeframe === 'year' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.year}
            </button>
          </div>
        </div>

        {/* Dynamic Smooth Bezier Wave SVG Curve generated from actual data points */}
        <div className="relative pt-6 pb-2 overflow-hidden">
          <svg className="w-full h-36 overflow-hidden" viewBox="0 0 400 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="spendFlowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
              <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.12" />
              </filter>
            </defs>

            {/* Dynamic Area Fill */}
            <path d={areaD} fill="url(#spendFlowGradient)" />

            {/* Dynamic Smooth Bezier Curve Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#shadow)"
            />

            {/* Dashed vertical indicator line for selected point */}
            <line
              x1={activePoint.x}
              y1={activePoint.y + 6}
              x2={activePoint.x}
              y2={110}
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Selected Active Data Node Dot */}
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r="6.5"
              fill="#ffffff"
              stroke="#10b981"
              strokeWidth="3.5"
              className="shadow-md transition-all duration-300"
            />

            {/* Dynamic i18n Value Callout Badge */}
            <g transform={`translate(${Math.min(Math.max(activePoint.x - 45, 5), 305)}, ${Math.max(activePoint.y - 34, 4)})`}>
              <rect
                x="0"
                y="0"
                width="90"
                height="24"
                rx="12"
                fill="#0f172a"
                className="shadow-lg"
              />
              <text
                x="45"
                y="16"
                fill="#34d399"
                fontSize="11"
                style={{ fontFamily: 'Plus Jakarta Sans, -apple-system, sans-serif', fontWeight: 800 }}
                textAnchor="middle"
              >
                {formatCurrency(activePoint.amount)}
              </text>
            </g>

            {/* Clickable Data Nodes */}
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
                  activeIndex === idx ? 'text-slate-900 font-extrabold text-sm' : 'hover:text-slate-600'
                }`}
              >
                {pt.month}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Activity Highlights Sub-Section */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <h4 className="text-xs font-extrabold font-mono text-slate-900 uppercase tracking-wider">
            {t.activityHighlights}
          </h4>

          <div className="space-y-2.5">
            {topExpenses.length > 0 ? (
              topExpenses.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-2xl text-white flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: tx.categoryColor || '#0f172a' }}
                    >
                      <ArrowDownLeft className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        {tx.description}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(tx.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold font-mono text-slate-900 tabular-nums">
                    -{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-xs font-mono text-slate-400">
                  No recent activity highlights logged.
                </span>
              </div>
            )}
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
