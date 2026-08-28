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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in"
      onClick={(e) => {
        if (!isLocked && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-slate-900/95 border border-white/10 shadow-2xl p-6 space-y-6 relative overflow-hidden">
        {/* Glow background */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              {isLocked && <Lock className="w-4 h-4 text-emerald-400" />}
              {isRegister ? 'Create Account' : 'Sign In Required'}
            </h3>
            {isLocked && (
              <p className="text-[11px] font-mono text-emerald-400">
                Please authenticate or click below to enter Demo mode.
              </p>
            )}
          </div>
          {!isLocked && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 1-Click Recruiter Demo Button */}
        <button
          onClick={handleDemoClick}
          disabled={isLoading}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-mono font-extrabold text-xs transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 relative z-10"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Instant 1-Click Recruiter Demo</span>
        </button>

        <div className="relative flex items-center justify-center relative z-10">
          <div className="border-t border-white/10 w-full" />
          <span className="absolute px-3 bg-slate-900 text-[10px] font-mono text-slate-400 uppercase font-semibold">
            Or Account Credentials
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">Full Name</label>
              <input
                type="text"
                required
                placeholder="Alex Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-white/10 bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400">Email Address</label>
            <input
              type="email"
              required
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-white/10 bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-white/10 bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>{isRegister ? 'Register' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center pt-1 relative z-10">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-slate-400 hover:text-white font-mono transition-colors cursor-pointer"
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
