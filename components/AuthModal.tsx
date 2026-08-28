'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Sparkles, LogIn, UserPlus, Lock } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  forceAuth?: boolean;
}

export function AuthModal({ isOpen, onClose, forceAuth = false }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, register, loginAsDemoGuest, isLoading, isAuthenticated } = useAuth();

  const isLocked = forceAuth || !isAuthenticated;

  if (!isOpen && !isLocked) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register({ email, password, name });
      } else {
        await login({ email, password });
      }
      if (!isLocked) onClose();
    } catch {
      // Error toast handled by AuthContext
    }
  };

  const handleDemoClick = async () => {
    try {
      await loginAsDemoGuest();
      if (!isLocked) onClose();
    } catch {
      // Handled by AuthContext
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in"
      onClick={(e) => {
        if (!isLocked && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              {isLocked && <Lock className="w-4 h-4 text-emerald-600" />}
              {isRegister ? 'Create Account' : 'Sign In Required'}
            </h3>
            {isLocked && (
              <p className="text-[11px] font-mono text-emerald-700 font-semibold">
                Please authenticate or click below to enter Demo mode.
              </p>
            )}
          </div>
          {!isLocked && (
            <button
              onClick={onClose}
              className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 1-Click Recruiter Demo Button */}
        <button
          onClick={handleDemoClick}
          disabled={isLoading}
          className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-extrabold text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Instant 1-Click Recruiter Demo</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="absolute px-3 bg-white text-[10px] font-mono text-slate-400 uppercase font-bold">
            Or Account Credentials
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-slate-600">Full Name</label>
              <input
                type="text"
                required
                placeholder="Alex Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none shadow-sm"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-slate-600">Email Address</label>
            <input
              type="email"
              required
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none font-mono shadow-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-slate-600">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none font-mono shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs shadow-md shadow-slate-900/10 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>{isRegister ? 'Register' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center pt-1">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-slate-500 hover:text-slate-900 font-mono font-bold transition-colors cursor-pointer"
          >
            {isRegister
              ? 'Already have an account? Sign in'
              : "Don't have an account? Register here"}
          </button>
        </div>
      </div>
    </div>
  );
}
