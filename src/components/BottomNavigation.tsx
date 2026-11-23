'use client';

import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  WalletCards,
  Gift,
  Flame,
  Menu,
  Sparkles,
} from 'lucide-react';
import { useChristmas } from '../context/ChristmasContext';
import { soundFX } from '../utils/audio';

interface BottomNavigationProps {
  onOpenMenu: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ onOpenMenu }) => {
  const { activeTab, setActiveTab, financialStats } = useChristmas();

  const handleSelect = (id: string) => {
    soundFX.playClick();
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard, badge: null },
    { id: 'novena', label: 'Novena', icon: Flame, badge: '9 Días', badgeColor: 'bg-amber-400 text-pine-950 font-black' },
    { id: 'activities', label: 'Eventos', icon: CalendarDays, badge: null },
    {
      id: 'finances',
      label: 'Finanzas',
      icon: WalletCards,
      badge: `${financialStats.progressPercentage}%`,
      badgeColor: 'bg-emerald-500 text-pine-950',
    },
    { id: 'secretsanta', label: 'Amigo', icon: Gift, badge: null },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-pine-950/95 backdrop-blur-xl border-t border-amber-500/20 px-3 py-1.5 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`relative flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl text-center transition-all ${
                isActive
                  ? 'text-amber-300 font-bold scale-105'
                  : 'text-emerald-200/60 hover:text-emerald-100'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-amber-400/20 border border-amber-400/40 text-amber-300 shadow-md shadow-amber-500/20'
                    : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate font-medium">
                {item.label}
              </span>
              {item.badge && (
                <span className={`absolute top-0 right-1 text-[8px] font-black px-1 rounded-full font-mono ${item.badgeColor || 'bg-emerald-500 text-pine-950'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* 5th Tab: "Más" Button which opens the full drawer */}
        <button
          onClick={() => {
            soundFX.playClick();
            onOpenMenu();
          }}
          className="relative flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl text-center text-emerald-200/70 hover:text-amber-300 transition-all active:scale-95"
        >
          <div className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40">
            <Menu className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-bold text-amber-300">
            Más
          </span>
        </button>
      </div>
    </nav>
  );
};
