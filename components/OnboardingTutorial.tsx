'use client';

import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Wallet,
  Activity,
  Receipt,
  Target,
  Globe,
  CheckCircle2,
} from 'lucide-react';

interface OnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingTutorial({ isOpen, onClose }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to SpendFlow',
      subtitle: 'Next-Gen Financial Management',
      icon: Wallet,
      color: 'bg-emerald-500 text-white',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            SpendFlow is a full-stack personal finance platform designed for real-time liquidity tracking, multi-currency budgeting, and automated cashflow auditing.
          </p>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              1-Click Recruiter Demo Included
            </div>
            <p className="text-slate-500">
              No database configuration required! Guest sessions run in client memory with pre-populated financial data.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Cashflow Dynamics Chart',
      subtitle: 'Interactive Spline Analytics',
      icon: Activity,
      color: 'bg-cyan-500 text-white',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            Visualize your net income vs expense velocity over custom audit windows (Week, Month, Year).
          </p>
          <ul className="space-y-2 font-mono text-[11px]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              Click any month node along the wave curve to inspect exact spend volumes.
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              Use the Share button to copy dashboard analytics reports to your clipboard.
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Transaction Register & Batching',
      subtitle: 'Complete Audit Control',
      icon: Receipt,
      color: 'bg-indigo-500 text-white',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            Log income and expenses with payment channels, categories, and status tags (Cleared vs Pending).
          </p>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 font-mono text-[11px]">
            <span className="font-bold text-slate-900 block">Batch Operations Toolbar:</span>
            <p className="text-slate-500">
              Select multiple entries using checkboxes to bulk delete or update clearing statuses in a single click.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Budget Caps & Thresholds',
      subtitle: 'Prevent Over-spending',
      icon: Target,
      color: 'bg-amber-500 text-white',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            Set monthly spending limits for each category to maintain discipline.
          </p>
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold">
              ⚠️ Warning at 80% Usage
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold">
              🚨 Alert on Exceeded Caps
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Currencies, i18n & Export',
      subtitle: 'Global Portability',
      icon: Globe,
      color: 'bg-violet-500 text-white',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            Seamlessly switch between 8 currencies and 5 languages in real-time with automatic number formatting.
          </p>
          <p className="font-mono text-[11px] text-slate-500">
            Export your entire transaction ledger anytime to standardized <span className="font-bold text-slate-900">.CSV</span> or <span className="font-bold text-slate-900">.JSON</span> files.
          </p>
        </div>
      ),
    },
  ];

  const step = steps[currentStep] || steps[0];
  const Icon = step.icon;

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col justify-between">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${step.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                {step.title}
              </h3>
              <span className="text-[11px] font-mono text-slate-400 font-semibold">
                {step.subtitle}
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {step.content}
        </div>

        {/* Footer & Navigation Controls */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {/* Progress Indicators */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentStep === idx
                    ? 'w-6 bg-slate-900'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-2 rounded-xl text-xs font-mono font-bold text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}

            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold transition-all shadow-sm cursor-pointer"
            >
              <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
              {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
