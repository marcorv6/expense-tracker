'use client';

import React, { useState } from 'react';
import { CategoryBreakdown } from '@/types/expense';
import { Activity, PieChart, Share2, DollarSign } from 'lucide-react';
import { usePreferences } from '@/context/PreferencesContext';

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
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(3); // Default index 3 (e.g. Sep)

  const activeTrend = monthlyTrends[hoveredPoint ?? monthlyTrends.length - 1] || monthlyTrends[0];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Smooth Bezier Spline Statistics Chart */}
      <div className="p-6 rounded-3xl glass-card space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-700" />
              {t.cashflowDynamics}
            </h3>
            <p className="text-xs text-slate-500">
              {t.cashflowDesc}
            </p>
          </div>
          <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Amount & Timeframe Segmented Switcher */}
        <div className="flex items-end justify-between pt-1">
          <div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
              {formatCurrency(activeTrend ? activeTrend.expense : 5480)}
            </div>
            <span className="text-[11px] font-mono text-slate-400 font-medium">Selected Expense Volume</span>
          </div>

          {/* Timeframe Pills */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-mono">
            {(['week', 'month', 'year'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-xl font-bold capitalize transition-all cursor-pointer ${
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

        {/* SVG Smooth Curve Wave Chart */}
        <div className="h-48 relative pt-6 flex flex-col justify-between">
          <svg className="w-full h-36 overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area Fill */}
            <path
              d="M 0,90 Q 66,40 133,70 T 266,30 T 400,60 L 400,120 L 0,120 Z"
              fill="url(#chartGradient)"
            />

            {/* Smooth Spline Curve Line */}
            <path
              d="M 0,90 Q 66,40 133,70 T 266,30 T 400,60"
              fill="none"
              stroke="#0f172a"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Interactive Data Nodes */}
            {monthlyTrends.map((trend, idx) => {
              const xPos = (idx / (monthlyTrends.length - 1)) * 400;
              const yPositions = [90, 45, 70, 30, 60];
              const yPos = yPositions[idx % yPositions.length];
              const isHovered = hoveredPoint === idx;

              return (
                <g key={trend.month} className="cursor-pointer" onClick={() => setHoveredPoint(idx)}>
                  {/* Dashed vertical indicator line */}
                  {isHovered && (
                    <line
                      x1={xPos}
                      y1={yPos}
                      x2={xPos}
                      y2={120}
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Active node dot */}
                  <circle
                    cx={xPos}
                    cy={yPos}
                    r={isHovered ? '6' : '4'}
                    fill={isHovered ? '#ffffff' : '#0f172a'}
                    stroke="#0f172a"
                    strokeWidth={isHovered ? '3' : '2'}
                    className="transition-all duration-200"
                  />

                  {/* Tooltip Badge */}
                  {isHovered && (
                    <g transform={`translate(${Math.max(25, Math.min(xPos - 35, 330))}, ${yPos - 28})`}>
                      <rect x="0" y="0" width="70" height="22" rx="11" fill="#0f172a" />
                      <text
                        x="35"
                        y="14"
                        fill="#ffffff"
                        fontSize="10"
                        fontFamily="JetBrains Mono"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        ${trend.expense}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Month Labels */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-semibold px-1">
            {monthlyTrends.map((item, idx) => (
              <button
                key={item.month}
                onClick={() => setHoveredPoint(idx)}
                className={`transition-colors cursor-pointer ${
                  hoveredPoint === idx ? 'text-slate-900 font-bold' : 'hover:text-slate-600'
                }`}
              >
                {item.month}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Expense Distribution */}
      <div className="p-6 rounded-3xl glass-card space-y-5">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-slate-700" />
            {t.expenditureShare}
          </h3>
          <p className="text-xs text-slate-500">
            {t.budgetComposition}
          </p>
        </div>

        {categoryBreakdown.length === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <DollarSign className="w-8 h-8 opacity-40 mb-2" />
            <p className="text-xs font-mono">{t.noExpenseRecords}</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
            {categoryBreakdown.map((cat) => (
              <div key={cat.categoryId} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-bold text-slate-900">
                    <span
                      className="w-3 h-3 rounded-full inline-block shadow-sm"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </span>
                  <span className="font-mono text-slate-600 tabular-nums font-semibold">
                    {formatCurrency(cat.total)} ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
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
      </div>
    </div>
  );
}
