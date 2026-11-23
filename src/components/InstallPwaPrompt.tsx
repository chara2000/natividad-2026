import React, { useState, useEffect } from 'react';
import { Download, Sparkles, X, Smartphone } from 'lucide-react';
import { soundFX } from '../utils/audio';

export const InstallPwaPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    soundFX.playJingleBell();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instructions for iOS or desktop
      alert('🎄 Para instalar en iPhone o Android: Presiona el botón "Compartir" en tu navegador y selecciona "Agregar a la pantalla de inicio".');
    }
  };

  if (isInstalled || !showBanner) return null;

  return (
    <div className="fixed bottom-16 lg:bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 glass-card border border-amber-400/40 rounded-2xl p-4 shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-berry-600 to-amber-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              Instalar Natividad PWA
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h4>
            <p className="text-xs text-emerald-200/80">
              Acceso directo desde tu celular, sin Play Store y con modo offline.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="text-emerald-400/70 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          onClick={() => setShowBanner(false)}
          className="px-3 py-1.5 text-xs text-emerald-200 hover:text-white"
        >
          Ahora no
        </button>
        <button
          onClick={handleInstall}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-pine-950 font-bold text-xs shadow-md shadow-amber-500/30 transition-all active:scale-95"
        >
          <Download className="w-3.5 h-3.5" /> Instalar Aplicación
        </button>
      </div>
    </div>
  );
};
