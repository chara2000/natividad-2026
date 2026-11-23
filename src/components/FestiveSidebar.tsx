'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  WalletCards,
  Gift,
  Flame,
  Vote,
  Sparkles,
  Gamepad2,
  CalendarCheck2,
  Camera,
  Settings,
  Volume2,
  VolumeX,
  CloudSnow,
  Users,
  ChevronDown,
  CheckCircle2,
  X,
  Share2,
  LogOut,
  Crown,
  Wallet,
  Shield,
  Type,
} from 'lucide-react';
import { useChristmas } from '../context/ChristmasContext';
import { soundFX } from '../utils/audio';

interface FestiveSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenAuthModal?: () => void;
}

export const FestiveSidebar: React.FC<FestiveSidebarProps> = ({
  mobileOpen = false,
  onCloseMobile,
  onOpenAuthModal,
}) => {
  const {
    activeTab,
    setActiveTab,
    community,
    members,
    currentUser,
    setCurrentUser,
    logout,
    soundEnabled,
    toggleSound,
    snowEnabled,
    toggleSnow,
    largeFontMode,
    toggleLargeFont,
    financialStats,
    showAlert,
  } = useChristmas();

  const [mounted, setMounted] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard, badge: null },
    { id: 'activities', label: 'Actividades & Cenas', icon: CalendarDays, badge: 'Eventos' },
    {
      id: 'finances',
      label: 'Finanzas & Gastos',
      icon: WalletCards,
      badge: mounted ? `${financialStats.progressPercentage}%` : null,
      badgeColor: 'bg-emerald-500/25 text-emerald-300 border-emerald-400/50',
    },
    { id: 'secretsanta', label: 'Amigo Secreto', icon: Gift, badge: 'Sorteo' },
    { id: 'novena', label: 'Novena de Aguinaldos', icon: Flame, badge: '9 Días' },
    { id: 'polls', label: 'Encuestas & Votos', icon: Vote, badge: 'Votar' },
    { id: 'advent', label: 'Calendario de Adviento', icon: CalendarCheck2, badge: '24 Días' },
    { id: 'games', label: 'Juegos Navideños', icon: Gamepad2, badge: 'Ruleta & Bingo' },
    { id: 'memories', label: 'Álbum de Recuerdos', icon: Camera, badge: null },
    {
      id: 'santa-ai',
      label: 'Santa IA (Luna 5.6)',
      icon: Sparkles,
      highlight: true,
      badge: 'GPT 5.6',
      badgeColor: 'bg-amber-400/30 text-amber-200 border-amber-300/60 font-black',
    },
    { id: 'settings', label: 'Comunidad & Ajustes', icon: Settings, badge: null },
  ];

  const handleSelectTab = (tabId: string) => {
    soundFX.playClick();
    setActiveTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleCopyInvite = () => {
    soundFX.playJingleBell();
    const inviteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://natividad.app';
    const text = `🎄 *¡Te invito a celebrar la Navidad 2026 en comunidad!*\n\nPlataforma oficial: ${community.name}\nCódigo de Familia: *${community.inviteCode}*\n\nIngresa aquí: ${inviteUrl}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
      showAlert('¡Invitación copiada al portapapeles! Lista para pegar en el grupo de WhatsApp.', 'Invitación Lista', 'success');
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'organizer':
        return { label: 'Organizador General', color: 'text-amber-300', icon: Crown };
      case 'treasurer':
        return { label: 'Tesorero / Finanzas', color: 'text-emerald-300', icon: Wallet };
      case 'member':
        return { label: 'Miembro Familiar', color: 'text-blue-300', icon: Users };
      case 'guest':
        return { label: 'Invitado', color: 'text-purple-300', icon: Gift };
      default:
        return { label: 'Familiar', color: 'text-emerald-300', icon: Users };
    }
  };

  const roleInfo = getRoleLabel(currentUser?.role);
  const RoleIcon = roleInfo.icon;

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-5 overflow-y-auto">
      {/* 1. Brand Logo & Community Header */}
      <div>
        <div className="flex items-center justify-between gap-3 pb-5 border-b border-amber-500/25">
          <div
            onClick={() => handleSelectTab('dashboard')}
            className="flex items-center gap-3.5 cursor-pointer group flex-1"
          >
            {/* Logo Badge */}
            <div className="relative flex-shrink-0">
              <img
                src="/logo.png"
                alt="Natividad"
                className="w-14 h-14 rounded-2xl object-cover shadow-xl shadow-amber-900/60 border-2 border-amber-400/60 group-hover:scale-105 group-hover:rotate-2 transition-transform drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]"
              />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-pine-950"></span>
              </span>
            </div>

            <div className="flex-1 truncate">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black font-cinzel tracking-wider text-white">
                  NATIVIDAD
                </h1>
                <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-md bg-amber-500/25 text-amber-300 border border-amber-400/40">
                  PWA 2026
                </span>
              </div>
              <p suppressHydrationWarning className="text-xs sm:text-sm text-emerald-300 font-bold truncate mt-0.5">
                {community.name}
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-2 rounded-xl text-emerald-300 hover:text-white bg-black/50 border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 2. Mini Countdown & Progress Widget (Hydration safe) */}
        <div className="my-4 p-3.5 rounded-2xl bg-gradient-to-r from-berry-950/70 via-pine-950/70 to-emerald-950/70 border border-amber-400/35 shadow-md text-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-black text-amber-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 fill-current" />
              <span>Nochebuena 2026</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-berry-600/50 text-white font-mono text-[11px] border border-rose-400/30">
              24 de Diciembre
            </span>
          </div>
          <div className="flex items-center justify-between text-white font-mono text-xs">
            <span>
              Fondo:{' '}
              <strong className="text-emerald-300">
                {mounted ? `${financialStats.progressPercentage}%` : '0%'}
              </strong>
            </span>
            <span className="text-amber-300 font-bold">
              {mounted
                ? `Faltan $${financialStats.remainingToCollect.toLocaleString('es-CO')}`
                : 'Meta en curso'}
            </span>
          </div>
        </div>

        {/* 3. Navigation Links List */}
        <nav className="space-y-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-all duration-200 group text-left ${
                  isActive
                    ? item.highlight
                      ? 'bg-gradient-to-r from-berry-600 via-rose-600 to-amber-500 text-white shadow-xl shadow-rose-900/50 border-2 border-amber-400 scale-[1.02]'
                      : 'bg-amber-400/20 text-amber-200 border border-amber-400/50 shadow-md scale-[1.01]'
                    : 'text-emerald-100/85 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110 flex-shrink-0 ${
                      isActive ? 'text-amber-300' : 'text-emerald-400'
                    }`}
                  />
                  <span className="text-sm sm:text-[15px] tracking-tight">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                      item.badgeColor || (isActive ? 'bg-amber-500/30 text-amber-100 border-amber-300/40' : 'bg-black/40 text-emerald-200/90 border-white/10')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 4. Bottom Controls: Sound, Snow, Invite & User Profile Card */}
      <div className="pt-5 border-t border-amber-500/25 space-y-3.5">
        {/* Quick Toggles Row */}
        <div className="flex items-center justify-between gap-2.5">
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Silenciar sonidos festivos' : 'Activar campanitas navideñas'}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
              soundEnabled
                ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                : 'bg-black/40 border-white/10 text-emerald-300/60 hover:text-white'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Sonido' : 'Mute'}</span>
          </button>

          <button
            onClick={toggleSnow}
            title={snowEnabled ? 'Pausar nieve' : 'Activar nieve'}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
              snowEnabled
                ? 'bg-emerald-800/40 border-amber-400/40 text-cyan-200'
                : 'bg-black/40 border-white/10 text-emerald-300/60 hover:text-white'
            }`}
          >
            <CloudSnow className="w-4 h-4" />
            <span>{snowEnabled ? 'Nieve' : 'Sin nieve'}</span>
          </button>

          <button
            onClick={handleCopyInvite}
            title="Copiar invitación WhatsApp"
            className="p-2.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 active:scale-95"
          >
            {copiedCode ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Accessibility: Large Font Toggle */}
        <button
          onClick={toggleLargeFont}
          title={largeFontMode ? 'Desactivar texto grande' : 'Activar texto grande (accesibilidad)'}
          className={`w-full flex items-center justify-center gap-2.5 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
            largeFontMode
              ? 'bg-purple-600/25 border-purple-400/50 text-purple-200'
              : 'bg-black/30 border-white/10 text-white/50 hover:text-white hover:border-white/20'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>{largeFontMode ? '🔤 Texto Grande (ON)' : '🔤 Texto Grande'}</span>
        </button>

        {/* User Profile Card & Switcher / Login */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-black/60 hover:bg-black/80 border border-amber-500/35 text-left transition-all active:scale-95 shadow-lg"
            >
              <div className="flex items-center gap-3 truncate">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-2xl object-cover border-2 border-amber-400 shadow-md flex-shrink-0"
                />
                <div className="truncate">
                  <h5 className="text-sm font-bold text-white truncate leading-tight">
                    {currentUser.name}
                  </h5>
                  <span className={`text-xs font-semibold flex items-center gap-1 mt-0.5 ${roleInfo.color}`}>
                    <RoleIcon className="w-3.5 h-3.5 inline" />
                    <span>{roleInfo.label}</span>
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-emerald-300/80 flex-shrink-0 ml-2" />
            </button>

            {/* Switch User Dropdown */}
            {userDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl glass-card border border-amber-500/40 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2 bg-pine-950/95">
                <div className="px-3 py-2 border-b border-white/10 mb-1 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-4 h-4" /> Cuenta y Familia
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="flex items-center gap-1 text-[11px] text-rose-300 hover:text-rose-100 font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Salir
                  </button>
                </div>

                {members.length > 1 && (
                  <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                    {members
                      .filter(m => m.id !== currentUser.id)
                      .map(m => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setCurrentUser(m);
                            setUserDropdownOpen(false);
                            soundFX.playJingleBell();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs text-emerald-200/80 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <img
                            src={m.avatar}
                            alt={m.name}
                            className="w-7 h-7 rounded-full object-cover border border-amber-400/40"
                          />
                          <div className="truncate">
                            <span className="font-bold block truncate">{m.name}</span>
                            <span className="text-[10px] text-emerald-400 block opacity-80">
                              {m.role === 'organizer' ? 'Organizador' : m.role === 'treasurer' ? 'Tesorero' : 'Familiar'}
                            </span>
                          </div>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Crown className="w-4 h-4" />
            <span>Iniciar Sesión / Registrarse</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Persistent Left Sidebar */}
      <aside className="hidden lg:block w-80 lg:w-[340px] h-screen sticky top-0 z-30 glass-panel border-r border-amber-500/20 backdrop-blur-2xl bg-pine-950/90 shadow-2xl">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Off-Canvas Sliding Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in"
          />
          <div className="relative w-84 max-w-[88vw] h-full glass-panel border-r border-amber-500/30 bg-pine-950/95 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
