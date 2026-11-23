import React, { useState, useEffect } from 'react';
import {
  Menu,
  Sparkles,
  Share2,
  CheckCircle2,
  WifiOff,
  Download,
  Calendar,
} from 'lucide-react';
import { useChristmas } from '../context/ChristmasContext';
import { soundFX } from '../utils/audio';

interface TopBarHeaderProps {
  onOpenMobileMenu: () => void;
}

export const TopBarHeader: React.FC<TopBarHeaderProps> = ({ onOpenMobileMenu }) => {
  const { activeTab, community, showAlert } = useChristmas();
  const [isOnline, setIsOnline] = useState(true);
  const [copiedInvite, setCopiedInvite] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Panel Principal Navideño';
      case 'activities':
        return 'Actividades, Cenas y Novenas';
      case 'finances':
        return 'Gestión de Presupuesto y Gastos';
      case 'secretsanta':
        return 'Amigo Secreto 2026';
      case 'novena':
        return 'Novena Tradicional de Aguinaldos';
      case 'itineraries':
        return 'Itinerarios y Cronogramas';
      case 'polls':
        return 'Encuestas y Decisiones Grupales';
      case 'advent':
        return 'Calendario de Adviento';
      case 'games':
        return 'Juegos Navideños en Familia';
      case 'memories':
        return 'Álbum Colaborativo de Recuerdos';
      case 'santa-ai':
        return 'Santa IA (GPT Modelo Luna 5.6)';
      case 'settings':
        return 'Comunidad y Ajustes';
      default:
        return 'Natividad';
    }
  };

  const handleCopyInvite = () => {
    soundFX.playJingleBell();
    const shareText = `🎄 ¡Únete a ${community.name}! Código: ${community.inviteCode}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      showAlert('¡Código de invitación copiado para compartir en WhatsApp!', 'Invitación Lista', 'success');
    }
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  return (
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-pine-950/70 border-b border-amber-500/15 px-4 sm:px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger & Active Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-black/40 border border-white/10 text-amber-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo — visible on mobile only (sidebar hidden) */}
          <img
            src="/logo.png"
            alt="Natividad"
            className="lg:hidden w-9 h-9 rounded-xl object-cover border border-amber-400/50 shadow-md flex-shrink-0"
          />

          <div>
            <span suppressHydrationWarning className="text-[10px] font-bold uppercase tracking-widest text-amber-400/90 hidden sm:block">
              {community.name}
            </span>
            <h2 className="text-base sm:text-lg font-bold font-cinzel text-white leading-tight">
              {getTabTitle()}
            </h2>
          </div>
        </div>

        {/* Right: Status Badges & Quick Share */}
        <div className="flex items-center gap-2">
          {!isOnline && (
            <div
              title="Modo sin conexión. Tus datos están guardados en tu dispositivo."
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-bold animate-pulse"
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Offline (PWA)</span>
            </div>
          )}

          <button
            onClick={handleCopyInvite}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 text-xs font-bold active:scale-95 transition-all"
          >
            {copiedInvite ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Invitar WhatsApp</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
