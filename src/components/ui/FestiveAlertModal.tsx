'use client';

import React from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  HelpCircle,
  X,
  Bell,
} from 'lucide-react';
import { soundFX } from '../../utils/audio';

export interface AlertModalOptions {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error' | 'confirm';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const FestiveAlertModal: React.FC<AlertModalOptions> = ({
  isOpen,
  title,
  message,
  type = 'info',
  confirmText = 'Entendido',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/20">
            <AlertTriangle className="w-7 h-7" />
          </div>
        );
      case 'error':
        return (
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/50 flex items-center justify-center text-rose-300 shadow-lg shadow-rose-500/20">
            <XCircle className="w-7 h-7" />
          </div>
        );
      case 'confirm':
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/30 to-berry-600/30 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/20">
            <HelpCircle className="w-7 h-7" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/20">
            <Sparkles className="w-7 h-7 text-amber-400" />
          </div>
        );
    }
  };

  const handleConfirm = () => {
    soundFX.playClick();
    if (onConfirm) onConfirm();
  };

  const handleCancel = () => {
    soundFX.playClick();
    if (onCancel) onCancel();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-card rounded-3xl p-6 border-2 border-amber-400/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative bg-pine-950/95">
        {/* Top festive banner */}
        <div className="flex items-start gap-4 mb-4">
          {getIcon()}
          <div className="flex-1 pr-6">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-300/80 block">
              Plataforma Navideña
            </span>
            <h3 className="text-lg font-bold font-cinzel text-white leading-snug mt-0.5">
              {title}
            </h3>
          </div>
          {type !== 'confirm' && (
            <button
              onClick={handleConfirm}
              className="absolute top-4 right-4 text-emerald-300/60 hover:text-white p-1 rounded-xl hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Message body */}
        <div className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed bg-black/40 p-4 rounded-2xl border border-white/10 mb-6 whitespace-pre-line max-h-60 overflow-y-auto">
          {message}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          {type === 'confirm' && (
            <button
              onClick={handleCancel}
              className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-emerald-200/80 hover:text-white hover:bg-white/5 border border-white/10 transition-all active:scale-95"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-pine-950 shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
          >
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
