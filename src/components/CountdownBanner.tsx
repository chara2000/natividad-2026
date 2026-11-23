import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar } from 'lucide-react';

export const CountdownBanner: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 34, hours: 11, minutes: 5, seconds: 31 });

  useEffect(() => {
    // Target is Christmas Eve 2026: Dec 24, 2026, 18:00
    const targetDate = new Date('2026-12-24T18:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-berry-900/90 via-emerald-950/90 to-pine-900/90 border border-gold-400/30 p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Background festive glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-berry-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-pine-950 shadow-lg shadow-amber-500/30 flex-shrink-0 animate-bounce-soft">
            <Sparkles className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xs uppercase tracking-widest font-semibold text-amber-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Cuenta Regresiva Oficial
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-berry-600/60 text-rose-100 border border-rose-400/30">
                24 de Diciembre
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-cinzel text-white tracking-wide">
              ¡La Magia de la Navidad está por comenzar! 🎄
            </h2>
          </div>
        </div>

        {/* Live Timer Boxes */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full md:w-auto">
          {[
            { label: 'DÍAS', value: timeLeft.days },
            { label: 'HORAS', value: timeLeft.hours },
            { label: 'MIN', value: timeLeft.minutes },
            { label: 'SEG', value: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center px-2.5 sm:px-4 py-2 rounded-xl bg-black/40 border border-amber-400/25 shadow-inner min-w-[62px] sm:min-w-[72px]"
            >
              <span className="text-xl sm:text-2xl font-black font-mono text-amber-300 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-emerald-200/80 uppercase">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
