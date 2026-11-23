'use client';

import React, { useState } from 'react';
import { Phone, Users, ArrowRight, X, Sparkles } from 'lucide-react';
import { useChristmas } from '../../context/ChristmasContext';
import { soundFX } from '../../utils/audio';

const FAMILY_GROUPS = [
  'Abuelos',
  'Tíos',
  'Primos',
  'Familia Principal',
  'Visitantes',
  'Padrinos',
];

export const CompleteProfileModal: React.FC = () => {
  const { currentUser, updateUserProfile, setShowCompleteProfileModal } = useChristmas();

  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [familyGroup, setFamilyGroup] = useState(
    currentUser?.familyGroup && currentUser.familyGroup !== 'Familia'
      ? currentUser.familyGroup
      : ''
  );
  const [customGroup, setCustomGroup] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    soundFX.playJingleBell?.();

    const finalGroup = useCustom
      ? customGroup.trim() || 'Familia'
      : familyGroup || 'Familia';

    updateUserProfile(currentUser.id, {
      phone: phone.trim() || undefined,
      familyGroup: finalGroup,
    });

    setTimeout(() => {
      setIsSaving(false);
      setShowCompleteProfileModal(false);
    }, 600);
  };

  const handleSkip = () => {
    soundFX.playClick?.();
    setShowCompleteProfileModal(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-sm">
        {/* Glow */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative rounded-3xl border border-amber-400/40 bg-[#06160a]/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.9)]">
          {/* Skip button */}
          <button
            type="button"
            onClick={handleSkip}
            className="absolute top-4 right-4 text-emerald-400/50 hover:text-white transition-colors cursor-pointer"
            aria-label="Omitir"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center mb-5">
            <div className="text-4xl mb-2">🎄</div>
            <h3 className="text-lg font-black text-white font-cinzel tracking-wide">
              ¡Bienvenido(a), {currentUser.name.split(' ')[0]}!
            </h3>
            <p className="text-xs text-emerald-200/70 mt-1 leading-snug">
              Completa tu perfil familiar para participar plenamente en las novenas,
              aportes y el Amigo Secreto.
            </p>
          </div>

          {/* Google avatar preview */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-900/30 border border-emerald-500/20 mb-5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-xl object-cover border-2 border-amber-400/60 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[11px] text-emerald-300/60 truncate">{currentUser.email}</p>
            </div>
            <span className="ml-auto flex-shrink-0 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full border border-emerald-500/30">
              Google
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone */}
            <div>
              <label className="block text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-1">
                📱 Celular / WhatsApp
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-400/60 pointer-events-none" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+57 300 000 0000"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-sm text-white placeholder-emerald-400/40 focus:border-amber-400 focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-emerald-400/50 mt-0.5">
                Para coordinación de novenas y comprobantes Nequi/Daviplata.
              </p>
            </div>

            {/* Family Group */}
            <div>
              <label className="block text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-1.5">
                🏡 Rama Familiar
              </label>
              {!useCustom ? (
                <>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {FAMILY_GROUPS.map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => { setFamilyGroup(g); soundFX.playClick?.(); }}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold text-left border transition-all cursor-pointer ${
                          familyGroup === g
                            ? 'bg-amber-500/25 border-amber-400 text-amber-200'
                            : 'bg-black/30 border-white/10 text-emerald-200/70 hover:border-white/25'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => { setUseCustom(true); soundFX.playClick?.(); }}
                    className="text-[11px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    + Escribir un nombre personalizado
                  </button>
                </>
              ) : (
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-400/60 pointer-events-none" />
                  <input
                    type="text"
                    autoFocus
                    value={customGroup}
                    onChange={e => setCustomGroup(e.target.value)}
                    placeholder="Ej: Familia García Ríos, Primos del Norte…"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-sm text-white placeholder-emerald-400/40 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleSkip}
                className="flex-1 py-2.5 rounded-xl border border-white/15 text-xs text-emerald-300/70 hover:text-white hover:border-white/30 transition-all cursor-pointer"
              >
                Ahora no
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-[2] py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-pine-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Guardando…
                  </>
                ) : (
                  <>
                    Guardar Perfil
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
