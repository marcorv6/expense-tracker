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
  if (typeof window !== 'undefined' && window.innerWidth < 640) return null;

  const steps = [
    {
      title: 'Welcome to SpendFlow',
      subtitle: 'Next-Gen Financial Management',
      icon: Wallet,
      color: 'bg-emerald-500 text-white',
      content: (
        <div className="space-y-2 text-xs text-slate-600">
          <p>
            SpendFlow is a full-stack personal finance platform for real-time liquidity tracking and multi-currency budgeting.
          </p>
          <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1 font-mono text-[11px]">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Recruiter Demo Mode Included
            </div>
            <p className="text-emerald-700/80">
              Guest sessions run in client memory with pre-populated financial data.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Cashflow Dynamics Chart',
      subtitle: 'Interactive Wave Analytics',
      icon: Activity,
      color: 'bg-cyan-500 text-white',
      content: (
        <div className="space-y-2 text-xs text-slate-600">
          <p>
            Visualize net income vs expense velocity over custom audit windows (Week, Month, Year).
          </p>
          <ul className="space-y-1.5 font-mono text-[11px]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              Click any month node to inspect spend volumes.
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              Share button copies report links to clipboard.
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Transaction Register & Batching',
      subtitle: 'Audit Control',
      icon: Receipt,
      color: 'bg-indigo-500 text-white',
      content: (
        <div className="space-y-2 text-xs text-slate-600">
          <p>
            Log income & expenses with payment channels and status tags (Cleared vs Pending).
          </p>
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 space-y-1 font-mono text-[11px]">
            <span className="font-bold block">Batch Toolbar:</span>
            <p className="text-slate-500">
              Select entries with checkboxes to bulk delete or update clearing statuses.
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
        <div className="space-y-2 text-xs text-slate-600">
          <p>
            Set monthly spending limits for each category to maintain discipline.
          </p>
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold">
              ⚠️ Warning at 80%
            </div>
            <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold">
              🚨 Alert Exceeded Caps
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
        <div className="space-y-2 text-xs text-slate-600">
          <p>
            Switch between 8 currencies and 5 languages with real-time number formatting.
          </p>
          <p className="font-mono text-[11px] text-slate-500">
            Export ledger anytime to <span className="font-bold text-slate-900">.CSV</span> or <span className="font-bold text-slate-900">.JSON</span> files.
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
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 space-y-4 animate-in slide-in-from-bottom-5 fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${step.color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
              {step.title}
            </h4>
            <span className="text-[10px] font-mono text-slate-400 font-semibold block">
              {step.subtitle} • Step {currentStep + 1} of {steps.length}
            </span>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div>{step.content}</div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        {/* Progress indicators */}
        <div className="flex items-center gap-1">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentStep === idx ? 'w-4 bg-slate-900' : 'w-1.5 bg-slate-200'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold text-slate-500 hover:text-slate-900 cursor-pointer flex items-center gap-0.5"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold transition-all shadow-sm cursor-pointer"
          >
            <span>{currentStep === steps.length - 1 ? 'Done' : 'Next'}</span>
            {currentStep < steps.length - 1 && <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
