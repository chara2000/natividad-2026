import React, { useState } from 'react';
import {
  CalendarCheck2,
  Sparkles,
  Lock,
  Gift,
  BookOpen,
  Music,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useChristmas } from '../../context/ChristmasContext';
import { AdventDay } from '../../types';
import { soundFX } from '../../utils/audio';

export const AdventModule: React.FC = () => {
  const { adventDays, unlockAdventDay } = useChristmas();
  const [selectedDay, setSelectedDay] = useState<AdventDay | null>(null);

  const handleOpenDoor = (day: AdventDay) => {
    if (!day.unlocked) {
      unlockAdventDay(day.dayNumber);
      setSelectedDay({ ...day, unlocked: true });
    } else {
      soundFX.playClick();
      setSelectedDay(day);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-amber-300 flex items-center gap-1.5">
            <CalendarCheck2 className="w-3.5 h-3.5" /> Cuenta Atrás Diaria
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
            Calendario de Adviento 🎄
          </h2>
          <p className="text-xs text-emerald-200/80 mt-0.5">
            Abre una casilla cada día del 1 al 24 de diciembre: reflexiones, villancicos y retos familiares.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
            {adventDays.filter(d => d.unlocked).length} de 24 puertas abiertas ✨
          </span>
        </div>
      </div>

      {/* 24 Days Grid (responsive 3 cols on mobile, 4 on sm, 6 on md/lg) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
        {adventDays.map(day => (
          <div
            key={day.dayNumber}
            onClick={() => handleOpenDoor(day)}
            className={`aspect-square rounded-2xl p-3 flex flex-col items-center justify-between cursor-pointer transition-all duration-300 border relative overflow-hidden group active:scale-95 ${
              day.unlocked
                ? 'bg-gradient-to-br from-emerald-950/80 to-pine-900/80 border-amber-400/60 shadow-lg shadow-amber-500/10'
                : 'bg-black/50 border-white/15 hover:border-amber-400/50 hover:bg-black/70'
            }`}
          >
            {/* Top row */}
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-300/80">
                DIC
              </span>
              {day.unlocked ? (
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              ) : (
                <Lock className="w-3 h-3 text-white/40" />
              )}
            </div>

            {/* Big Day Number */}
            <div className="my-auto text-center">
              <span
                className={`text-2xl sm:text-3xl font-black font-cinzel transition-transform group-hover:scale-110 ${
                  day.unlocked
                    ? 'text-amber-300 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]'
                    : 'text-white/80'
                }`}
              >
                {day.dayNumber}
              </span>
            </div>

            {/* Bottom Status */}
            <span className="text-[9px] font-semibold tracking-wide uppercase truncate w-full text-center">
              {day.unlocked ? (
                <span className="text-emerald-300">Abierto ✓</span>
              ) : (
                <span className="text-white/40">Tocar 🎁</span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Modal: Open Day Details */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in zoom-in-95">
          <div className="w-full max-w-md glass-card border border-amber-400/50 rounded-3xl p-6 sm:p-7 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedDay(null)}
              className="absolute top-4 right-4 text-emerald-300 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-berry-600 to-amber-500 flex items-center justify-center text-white font-black font-cinzel text-xl shadow-lg">
                {selectedDay.dayNumber}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                  Día {selectedDay.dayNumber} de Diciembre
                </span>
                <h3 className="text-base sm:text-lg font-bold font-cinzel text-white leading-tight">
                  {selectedDay.title}
                </h3>
              </div>
            </div>

            {/* Message/Surprise */}
            <div className="bg-black/40 p-4 rounded-2xl border border-white/10 text-xs text-emerald-100 leading-relaxed">
              <p className="font-medium">{selectedDay.surprise}</p>
            </div>

            {/* Carol / Quote */}
            <div className="bg-berry-950/30 p-3.5 rounded-2xl border border-rose-500/20 text-xs text-rose-200">
              <span className="text-[10px] font-bold text-rose-300 uppercase block mb-1 flex items-center gap-1">
                <Music className="w-3.5 h-3.5" /> Villancico o Cita del Día:
              </span>
              <p className="italic">"{selectedDay.carolOrQuote}"</p>
            </div>

            {/* Daily Mission / Aguinaldo */}
            <div className="bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-500/30 text-xs text-emerald-100">
              <span className="text-[10px] font-bold text-emerald-300 uppercase block mb-1 flex items-center gap-1">
                <Gift className="w-3.5 h-3.5" /> Reto Familiar de Hoy:
              </span>
              <p className="font-semibold">{selectedDay.mission}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDay(null)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 font-bold text-xs shadow-md"
              >
                ¡Cumplir Reto Navideño! ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
