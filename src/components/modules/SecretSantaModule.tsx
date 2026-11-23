'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Gift,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  Heart,
  Shuffle,
  AlertTriangle,
  UserX,
  Share2,
  Calendar,
  DollarSign,
  PackageCheck,
  Edit3,
  RefreshCw,
  Plus,
  Trash2,
  Sliders,
  MessageCircle,
  X,
  Clock,
  UserCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useChristmas } from '../../context/ChristmasContext';
import { soundFX } from '../../utils/audio';
import { fireCelebrationCannons, fireHolidayConfetti } from '../../utils/confetti';
import { SecretSantaWishlist, UserProfile } from '../../types';

export const SecretSantaModule: React.FC = () => {
  const {
    currentUser,
    community,
    members,
    secretSanta,
    runSecretSantaDraw,
    resetSecretSantaDraw,
    updateSecretSantaSettings,
    addSecretSantaExclusion,
    removeSecretSantaExclusion,
    updateWishlist,
    toggleGiftPurchased,
    canRunSecretSanta,
    showAlert,
    showConfirm,
  } = useChristmas();

  const [revealed, setRevealed] = useState(false);
  const [activeTab, setActiveTab] = useState<'my_assignment' | 'my_wishlist' | 'all_participants' | 'admin'>('my_assignment');
  const [selectedParticipantModal, setSelectedParticipantModal] = useState<UserProfile | null>(null);

  // Participants pool (all non-guest members)
  const participants = useMemo(() => {
    return members.filter(m => m.role !== 'guest');
  }, [members]);

  // Wishlist editing state for logged-in user
  const userId = currentUser?.id || 'usr-anon';

  const [wishSuggestions, setWishSuggestions] = useState('');
  const [wishSizes, setWishSizes] = useState('');
  const [wishColors, setWishColors] = useState('');
  const [wishDislikes, setWishDislikes] = useState('');
  const [wishHints, setWishHints] = useState('');
  const [savedWishlistSuccess, setSavedWishlistSuccess] = useState(false);

  // Sync wishlist form & reset revealed when currentUser changes
  useEffect(() => {
    setRevealed(false);
    if (!currentUser) return;
    const currentList = secretSanta.wishlists?.[currentUser.id];
    if (currentList) {
      setWishSuggestions((currentList.suggestions || []).join('\n'));
      setWishSizes(currentList.sizes || '');
      setWishColors((currentList.favoriteColors || []).join(', '));
      setWishDislikes(currentList.dislikes || '');
      setWishHints(currentList.hints || '');
    } else {
      setWishSuggestions('Un buen libro o novela\nBufanda cálida o prenda navideña\nChocolates finos o dulces típicos');
      setWishSizes('Talla M / Calzado 38');
      setWishColors('Verde esmeralda, Dorado, Vino tinto');
      setWishDislikes('Cosas con aromas muy fuertes o dulces con licor');
      setWishHints('Amo el café colombiano y la música navideña.');
    }
  }, [currentUser?.id, secretSanta.wishlists]);

  // Exclusion form state (admin)
  const [exclGiver, setExclGiver] = useState('');
  const [exclForbidden, setExclForbidden] = useState('');

  // Settings form state (admin)
  const [cfgMin, setCfgMin] = useState(secretSanta.budgetMin || 30000);
  const [cfgMax, setCfgMax] = useState(secretSanta.budgetMax || 60000);
  const [cfgDate, setCfgDate] = useState(secretSanta.deliveryDate || '2026-12-24');

  // Keep settings form in sync with context
  useEffect(() => {
    setCfgMin(secretSanta.budgetMin || 30000);
    setCfgMax(secretSanta.budgetMax || 60000);
    setCfgDate(secretSanta.deliveryDate || '2026-12-24');
  }, [secretSanta.budgetMin, secretSanta.budgetMax, secretSanta.deliveryDate]);

  // Find who I give to
  const myAssignment = secretSanta.assignments?.find(a => a.giverId === currentUser?.id);
  const receiverUser = myAssignment ? members.find(m => m.id === myAssignment.receiverId) : null;
  const receiverWishlist = receiverUser ? secretSanta.wishlists?.[receiverUser.id] : null;

  const isDrawn = secretSanta.status === 'drawn' && (secretSanta.assignments?.length || 0) > 0;

  // Shopping progress stats (admin confidential view)
  const shoppingStats = useMemo(() => {
    const total = secretSanta.assignments?.length || 0;
    const purchased = secretSanta.assignments?.filter(a => a.giftPurchased).length || 0;
    const percentage = total > 0 ? Math.round((purchased / total) * 100) : 0;
    return { total, purchased, percentage };
  }, [secretSanta.assignments]);

  const handleRevealToggle = () => {
    if (!revealed) {
      soundFX.playMagicReveal?.();
      fireCelebrationCannons?.();
      setRevealed(true);
    } else {
      soundFX.playClick?.();
      setRevealed(false);
    }
  };

  const handleSaveWishlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showAlert('Debes iniciar sesión para guardar tu lista de deseos.', 'Inicio de Sesión Requerido', 'warning');
      return;
    }

    const suggestionsArray = wishSuggestions
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const colorsArray = wishColors
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);

    updateWishlist(currentUser.id, {
      userId: currentUser.id,
      suggestions: suggestionsArray.length > 0 ? suggestionsArray : ['Un detalle sorpresa'],
      sizes: wishSizes,
      favoriteColors: colorsArray,
      dislikes: wishDislikes,
      hints: wishHints,
    });

    setSavedWishlistSuccess(true);
    soundFX.playJingleBell?.();
    setTimeout(() => setSavedWishlistSuccess(false), 3000);
  };

  const handleTriggerDraw = () => {
    if (participants.length < 2) {
      showAlert('Se requieren al menos 2 familiares registrados para realizar el sorteo.', 'Familiares Insuficientes', 'warning');
      return;
    }

    showConfirm(
      `¿Deseas realizar el sorteo navideño entre los ${participants.length} familiares participantes? Cada persona recibirá un amigo secreto al azar respetando las exclusiones configuradas.`,
      () => {
        const result = runSecretSantaDraw();
        if (result.success) {
          setTimeout(() => setActiveTab('my_assignment'), 800);
        }
      },
      'Realizar Sorteo Navideño 🎁'
    );
  };

  const handleAddExclusion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exclGiver || !exclForbidden) {
      showAlert('Selecciona ambos familiares para crear la regla de exclusión.', 'Campos Requeridos', 'warning');
      return;
    }
    if (exclGiver === exclForbidden) {
      showAlert('No puedes seleccionar al mismo familiar en ambos lados.', 'Regla Inválida', 'warning');
      return;
    }
    addSecretSantaExclusion(exclGiver, exclForbidden);
    setExclGiver('');
    setExclForbidden('');
    showAlert('Regla de exclusión guardada exitosamente.', 'Exclusión Agregada', 'success');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSecretSantaSettings({
      budgetMin: Number(cfgMin),
      budgetMax: Number(cfgMax),
      deliveryDate: cfgDate,
    });
    showAlert('Parámetros de Amigo Secreto actualizados.', 'Configuración Guardada', 'success');
  };

  // WhatsApp share helpers
  const shareDrawAnnouncement = () => {
    const inviteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://natividad.app';
    const text = `🎄 *¡Sorteo de Amigo Secreto Listo!* 🎁\n\nEn nuestra plataforma familiar *${community.name}*, ya se realizó el sorteo navideño.\n\n🤫 *Ingresa en privado para descubrir a quién le regalas:*\n${inviteUrl}\n\n💰 *Presupuesto sugerido:* $${secretSanta.budgetMin.toLocaleString('es-CO')} - $${secretSanta.budgetMax.toLocaleString('es-CO')} COP\n📅 *Entrega de regalos:* ${secretSanta.deliveryDate || '24 de Diciembre'}\n\n¡No le cuentes a nadie quién te tocó! 🤫✨`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareMyWishlist = () => {
    const list = secretSanta.wishlists?.[currentUser?.id || ''];
    const suggestions = (list?.suggestions || []).map(s => `• ${s}`).join('\n') || '• Un detalle sorpresa con amor';
    const text = `🎁 *Mi Lista de Deseos — Amigo Secreto 2026* ✨\n\nDe parte de: *${currentUser?.name || 'Familiar'}*\n\n📝 *Ideas que me gustaría recibir:*\n${suggestions}\n\n👕 *Tallas:* ${list?.sizes || 'No especificada'}\n🎨 *Colores favoritos:* ${(list?.favoriteColors || []).join(', ') || 'Cualquiera'}\n🚫 *Evitar:* ${list?.dislikes || 'Ninguno en especial'}\n💡 *Pistas:* ${list?.hints || '¡Lo que sea con cariño!'}\n\n🎄 ¡Nos vemos en la celebración!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const sharePurchaseReminder = () => {
    const text = `🎁 *Recordatorio Navideño — Amigo Secreto 2026* 🎄\n\n¡Hola familia! Recuerden que la entrega de regalos es el *${secretSanta.deliveryDate || '24 de Diciembre'}*.\n\nPor favor ingresen a la app para revisar la lista de deseos de su amigo secreto y marcar su regalo como comprado cuando lo tengan listo. ¡Que no nos coja la tarde con las compras navideñas! 🎅🛒✨`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Festive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-rose-300 flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5" /> Tradición Navideña Familiar
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
            Amigo Secreto 2026 🎁
          </h2>
          <p className="text-xs text-emerald-200/80 mt-0.5">
            Sorteo privado, reglas de exclusión, listas de deseos y seguimiento confidencial de regalos.
          </p>
        </div>

        {/* Action Buttons for Organizer */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {canRunSecretSanta && isDrawn && (
            <button
              type="button"
              onClick={shareDrawAnnouncement}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold text-xs shadow-md shadow-green-900/30 transition-all active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> Anunciar en WhatsApp
            </button>
          )}

          {canRunSecretSanta && (
            <>
              {isDrawn ? (
                <button
                  type="button"
                  onClick={resetSecretSantaDraw}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300 font-bold text-xs transition-all active:scale-95 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> Reiniciar Sorteo
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleTriggerDraw}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-berry-600 via-rose-600 to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-900/40 hover:scale-102 transition-all active:scale-95 cursor-pointer"
                >
                  <Shuffle className="w-4 h-4" /> Realizar Sorteo ({participants.length})
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* 2. Key Rules Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-card p-4 rounded-2xl border border-rose-500/20 bg-berry-950/40">
          <span className="text-[10px] uppercase font-bold text-rose-300 block">Presupuesto Sugerido</span>
          <span className="text-lg font-bold font-cinzel text-amber-300">
            ${secretSanta.budgetMin.toLocaleString('es-CO')} - ${secretSanta.budgetMax.toLocaleString('es-CO')} COP
          </span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/40">
          <span className="text-[10px] uppercase font-bold text-emerald-300 block">Fecha de Entrega</span>
          <span className="text-lg font-bold font-cinzel text-white">
            {secretSanta.deliveryDate || '24 de Diciembre'} · Cena Navideña
          </span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-amber-500/20 bg-amber-950/30">
          <span className="text-[10px] uppercase font-bold text-amber-300 block">Participantes Activos</span>
          <span className="text-lg font-bold font-cinzel text-amber-200">
            {participants.length} Familiares
          </span>
        </div>
      </div>

      {/* 3. Sub Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'my_assignment', label: '🤫 Mi Amigo Secreto', icon: Gift },
          { id: 'my_wishlist', label: '📝 Mi Lista de Deseos', icon: Edit3 },
          { id: 'all_participants', label: `Participantes (${participants.length})`, icon: Heart },
          ...(canRunSecretSanta ? [{ id: 'admin', label: '⚙️ Panel Organizador', icon: UserX }] : []),
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                soundFX.playClick?.();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-berry-600 to-rose-700 text-white shadow-md border border-rose-400/40'
                  : 'text-emerald-200/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════
          TAB 1: MI TARJETA SECRETA
      ══════════════════════════════════════════════ */}
      {activeTab === 'my_assignment' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {!currentUser ? (
            <div className="glass-card p-8 rounded-3xl border border-amber-400/30 bg-black/40 text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-3xl">
                🔒
              </div>
              <h3 className="text-xl font-bold font-cinzel text-white">
                Inicia Sesión para ver tu Amigo Secreto
              </h3>
              <p className="text-xs text-emerald-200/80 max-w-md mx-auto">
                Selecciona tu perfil familiar o inicia sesión desde la barra lateral izquierda para descubrir a quién te corresponde regalarle en esta Navidad.
              </p>
            </div>
          ) : !isDrawn ? (
            /* Sorteo Pendiente Banner */
            <div className="glass-card p-8 rounded-3xl border border-amber-400/30 bg-black/40 text-center space-y-4 shadow-xl">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-400 text-pine-950 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20 animate-bounce">
                🎲
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black font-cinzel text-white">
                  ¡El Sorteo Navideño está Pendiente!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-200/80 max-w-md mx-auto">
                  El Organizador realizará el sorteo oficial una vez que todos los familiares participantes completen su registro.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20 max-w-sm mx-auto text-xs text-amber-200 space-y-1 text-left">
                <span className="font-bold block flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-400" /> Mientras tanto:
                </span>
                <p className="text-[11px] text-emerald-200/80">
                  Ve a la pestaña <strong>"📝 Mi Lista de Deseos"</strong> y escribe tus gustos, tallas y colores para que tu amigo secreto no sufra buscando tu regalo.
                </p>
              </div>

              {canRunSecretSanta && (
                <button
                  type="button"
                  onClick={handleTriggerDraw}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 font-black text-xs shadow-lg shadow-amber-500/30 hover:scale-105 transition-all cursor-pointer"
                >
                  🎲 Realizar Sorteo Ahora ({participants.length} participantes)
                </button>
              )}
            </div>
          ) : !revealed ? (
            /* Unrevealed Secret Box */
            <div
              onClick={handleRevealToggle}
              className="group cursor-pointer relative overflow-hidden rounded-3xl glass-card border-2 border-dashed border-amber-400/50 p-8 sm:p-12 text-center transition-all duration-300 hover:scale-[1.02] hover:border-amber-400 bg-gradient-to-b from-emerald-950/60 to-berry-950/60 shadow-2xl"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-berry-600 via-rose-500 to-amber-500 flex items-center justify-center text-4xl shadow-xl shadow-rose-900/50 group-hover:rotate-12 transition-transform">
                🎁
              </div>

              <div className="mt-5 space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <Lock className="w-3.5 h-3.5" /> Asignación Secreta Protegida
                </span>
                <h4 className="text-xl sm:text-2xl font-black font-cinzel text-white">
                  ¡Toca aquí para descubrir a quién le regalas!
                </h4>
                <p className="text-xs text-emerald-200/80 max-w-md mx-auto">
                  Asegúrate de que nadie esté mirando tu pantalla. Al tocar se revelará el nombre de tu amigo secreto y su lista de deseos.
                </p>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 font-black text-xs shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-all cursor-pointer"
                >
                  ✨ Revelar mi Amigo Secreto ✨
                </button>
              </div>
            </div>
          ) : (
            /* Revealed Receiver Box */
            <div className="relative overflow-hidden rounded-3xl glass-card border-2 border-amber-400 p-6 sm:p-8 shadow-2xl bg-gradient-to-b from-emerald-950/80 via-pine-900/80 to-berry-950/80 animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Tu Amigo Secreto es:
                </span>
                <button
                  type="button"
                  onClick={handleRevealToggle}
                  className="flex items-center gap-1.5 text-xs text-emerald-300 hover:text-white px-3 py-1 rounded-xl bg-black/40 border border-white/10 cursor-pointer"
                >
                  <EyeOff className="w-3.5 h-3.5" /> Ocultar de nuevo
                </button>
              </div>

              {receiverUser ? (
                <div className="space-y-6">
                  {/* Receiver identity */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left bg-black/40 p-4 rounded-2xl border border-amber-400/20">
                    <img
                      src={receiverUser.avatar}
                      alt={receiverUser.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-amber-400 shadow-xl"
                    />
                    <div>
                      <h3 className="text-2xl font-black font-cinzel text-white">
                        {receiverUser.name}
                      </h3>
                      <p className="text-xs text-amber-300 font-semibold mt-0.5">
                        {receiverUser.familyGroup || 'Familia'}
                      </p>
                      <p className="text-[11px] text-emerald-200/80 mt-1">
                        Presupuesto sugerido: ${secretSanta.budgetMin.toLocaleString('es-CO')} - ${secretSanta.budgetMax.toLocaleString('es-CO')} COP
                      </p>
                    </div>
                  </div>

                  {/* Wishlist breakdown */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      📝 Lista de Deseos & Preferencias de {receiverUser.name.split(' ')[0]}
                    </h4>

                    {receiverWishlist ? (
                      <div className="space-y-2.5 text-xs">
                        {/* Suggestions */}
                        <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10">
                          <span className="font-bold text-emerald-300 block mb-1">
                            Ideas de regalo deseadas:
                          </span>
                          <ul className="space-y-1 pl-4 list-disc text-emerald-100">
                            {receiverWishlist.suggestions.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Sizes and Colors */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div className="bg-black/30 p-3 rounded-xl border border-white/10">
                            <span className="font-bold text-emerald-300 block">Tallas:</span>
                            <span className="text-white">{receiverWishlist.sizes || 'No especificada'}</span>
                          </div>
                          <div className="bg-black/30 p-3 rounded-xl border border-white/10">
                            <span className="font-bold text-emerald-300 block">Colores favoritos:</span>
                            <span className="text-white">
                              {(receiverWishlist.favoriteColors || []).join(', ') || 'Cualquiera'}
                            </span>
                          </div>
                        </div>

                        {/* Dislikes & Hints */}
                        {receiverWishlist.dislikes && (
                          <div className="bg-rose-950/30 p-3 rounded-xl border border-rose-500/20 text-rose-200">
                            <span className="font-bold text-rose-300 block">No le gusta / Evitar:</span>
                            <span>{receiverWishlist.dislikes}</span>
                          </div>
                        )}

                        {receiverWishlist.hints && (
                          <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-500/20 text-amber-200">
                            <span className="font-bold text-amber-300 block">Pista especial:</span>
                            <span>"{receiverWishlist.hints}"</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center p-4 bg-black/20 rounded-2xl text-xs text-emerald-300/70">
                        {receiverUser.name} aún no ha completado su lista de deseos detallada.
                      </div>
                    )}
                  </div>

                  {/* Gift Purchased Toggle */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">
                        ¿Ya compraste el regalo?
                      </span>
                      <span className="text-[11px] text-emerald-300/70">
                        Solo tú verás esta marca privada de control.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => currentUser && toggleGiftPurchased(currentUser.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                        myAssignment?.giftPurchased
                          ? 'bg-emerald-500 text-pine-950 shadow-md'
                          : 'bg-white/10 text-emerald-200 hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      <PackageCheck className="w-4 h-4" />
                      {myAssignment?.giftPurchased ? '¡Regalo Listo! ✓' : 'Marcar como comprado'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-rose-300">
                  No se encontró asignación para tu cuenta. Pídele al Organizador que realice el sorteo o reinicie el proceso para incluirte.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB 2: MI LISTA DE DESEOS
      ══════════════════════════════════════════════ */}
      {activeTab === 'my_wishlist' && (
        <div className="max-w-2xl mx-auto glass-card p-6 sm:p-7 rounded-3xl border border-amber-400/30 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-bold font-cinzel text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" /> Mi Lista de Deseos Navideña
              </h3>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Escribe lo que te gustaría recibir para ayudar a tu amigo secreto a elegir el mejor detalle.
              </p>
            </div>

            {currentUser && (
              <button
                type="button"
                onClick={shareMyWishlist}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-600/30 hover:bg-green-600/50 border border-green-400/40 text-green-200 font-semibold text-xs cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" /> Compartir en WhatsApp
              </button>
            )}
          </div>

          <form onSubmit={handleSaveWishlist} className="space-y-4 text-xs">
            <div>
              <label className="block text-emerald-300 font-bold mb-1">
                ¿Qué te gustaría recibir? (Una sugerencia por línea) *
              </label>
              <textarea
                rows={3}
                required
                value={wishSuggestions}
                onChange={e => setWishSuggestions(e.target.value)}
                placeholder="Ej: Bufanda de lana suave&#10;Juego de cartas familiar&#10;Café especial colombiano"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">
                  Tallas (Camiseta, Pantalón o Calzado)
                </label>
                <input
                  type="text"
                  value={wishSizes}
                  onChange={e => setWishSizes(e.target.value)}
                  placeholder="Ej: Talla M / Calzado 39"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">
                  Colores favoritos
                </label>
                <input
                  type="text"
                  value={wishColors}
                  onChange={e => setWishColors(e.target.value)}
                  placeholder="Ej: Verde bosque, Vino tinto, Azul marino"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-emerald-300 font-bold mb-1">
                Cosas que NO te gustan (Para evitar sorpresas incómodas)
              </label>
              <input
                type="text"
                value={wishDislikes}
                onChange={e => setWishDislikes(e.target.value)}
                placeholder="Ej: Nada con olor a vainilla, no chocolates con licor..."
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-bold mb-1">
                Pistas sobre tus pasatiempos o gustos
              </label>
              <input
                type="text"
                value={wishHints}
                onChange={e => setWishHints(e.target.value)}
                placeholder="Ej: Me encanta salir a caminar los domingos y escuchar salsa"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedWishlistSuccess ? (
                <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> ¡Lista actualizada con éxito!
                </span>
              ) : <span />}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 font-bold shadow-lg shadow-amber-500/30 cursor-pointer"
              >
                Guardar mi lista 🎁
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB 3: TODOS LOS PARTICIPANTES
      ══════════════════════════════════════════════ */}
      {activeTab === 'all_participants' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-emerald-200/80">
              Toca la tarjeta de cualquier familiar para ver sus gustos, tallas y preferencias.
            </p>
            <span className="text-[11px] text-amber-300 font-mono">
              {participants.length} participantes registrados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {participants.map(user => {
              const hasWishlist = !!secretSanta.wishlists?.[user.id];

              return (
                <div
                  key={user.id}
                  onClick={() => setSelectedParticipantModal(user)}
                  className="glass-card p-3.5 rounded-2xl border border-white/10 hover:border-amber-400/40 hover:bg-white/5 cursor-pointer transition-all flex items-center gap-3 group"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-11 h-11 rounded-full object-cover border border-amber-400/40 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 truncate">
                    <h5 className="text-xs font-bold text-white truncate">{user.name}</h5>
                    <span className="text-[10px] text-emerald-300/70 truncate block">
                      {user.familyGroup || 'Familia'}
                    </span>
                    <span
                      className={`text-[9px] font-semibold mt-0.5 block ${
                        hasWishlist ? 'text-emerald-400' : 'text-amber-300/70'
                      }`}
                    >
                      {hasWishlist ? '✓ Ver lista de deseos' : '⏳ Lista de deseos pendiente'}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-300/50 group-hover:text-amber-300 transition-colors" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB 4: PANEL ORGANIZADOR (ADMIN)
      ══════════════════════════════════════════════ */}
      {activeTab === 'admin' && canRunSecretSanta && (
        <div className="max-w-2xl mx-auto space-y-6">

          {/* 1. Seguimiento Confidencial de Compras */}
          {isDrawn && (
            <div className="glass-card p-6 rounded-3xl border border-emerald-400/30 bg-black/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-cinzel text-white flex items-center gap-2">
                    <PackageCheck className="w-5 h-5 text-emerald-400" /> Monitoreo Confidencial de Regalos
                  </h3>
                  <p className="text-xs text-emerald-200/80 mt-0.5">
                    Supervisa cuántos familiares ya tienen listo su regalo sin romper el misterio del sorteo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={sharePurchaseReminder}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-600/30 hover:bg-green-600/50 border border-green-400/40 text-green-200 text-xs font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Enviar Recordatorio
                </button>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-white">
                  <span>Progreso de Compras</span>
                  <span className="font-bold text-emerald-300">
                    {shoppingStats.purchased} de {shoppingStats.total} listos ({shoppingStats.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500"
                    style={{ width: `${shoppingStats.percentage}%` }}
                  />
                </div>
              </div>

              {/* List of participants with their purchase status */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {participants.map(p => {
                  const ass = secretSanta.assignments?.find(a => a.giverId === p.id);
                  const isPurchased = ass?.giftPurchased;

                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-white font-medium">{p.name}</span>
                      </div>
                      <span
                        className={`text-[11px] font-semibold flex items-center gap-1 ${
                          isPurchased ? 'text-emerald-400' : 'text-amber-400/80'
                        }`}
                      >
                        {isPurchased ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Regalo listo
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5" /> Pendiente
                          </>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Reglas de Exclusión */}
          <div className="glass-card p-6 rounded-3xl border border-rose-500/30 space-y-4">
            <div className="flex items-center gap-2">
              <UserX className="w-5 h-5 text-rose-400" />
              <h3 className="text-lg font-bold font-cinzel text-white">
                Reglas de Exclusión Inteligente
              </h3>
            </div>
            <p className="text-xs text-emerald-200/80">
              Evita que parejas, esposos o familiares que conviven se regalen entre sí en el sorteo.
            </p>

            {/* Formulario para agregar exclusión */}
            <form onSubmit={handleAddExclusion} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-xs">
              <span className="font-bold text-amber-300 block">Agregar nueva exclusión:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 mb-1">Familiar que regala:</label>
                  <select
                    value={exclGiver}
                    onChange={e => setExclGiver(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white"
                  >
                    <option value="">(Selecciona familiar)</option>
                    {participants.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-emerald-300 mb-1">NO puede regalarle a:</label>
                  <select
                    value={exclForbidden}
                    onChange={e => setExclForbidden(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white"
                  >
                    <option value="">(Selecciona familiar a bloquear)</option>
                    {participants
                      .filter(m => m.id !== exclGiver)
                      .map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-200 font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Bloquear Emparejamiento
                </button>
              </div>
            </form>

            {/* Lista de exclusiones activas */}
            <div className="space-y-2">
              <h5 className="font-bold text-amber-300 text-xs">Exclusiones activas:</h5>
              {Object.entries(secretSanta.exclusions || {}).length === 0 ? (
                <p className="text-xs text-emerald-300/50 italic py-2">
                  No hay exclusiones configuradas. El sorteo será 100% aleatorio.
                </p>
              ) : (
                <div className="space-y-1.5 text-xs">
                  {Object.entries(secretSanta.exclusions).map(([giverId, forbiddenList]) => {
                    const giver = members.find(m => m.id === giverId);
                    if (!giver || forbiddenList.length === 0) return null;

                    return forbiddenList.map(forbiddenId => {
                      const forbidden = members.find(m => m.id === forbiddenId);
                      if (!forbidden) return null;

                      return (
                        <div
                          key={`${giverId}-${forbiddenId}`}
                          className="p-2.5 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between"
                        >
                          <span className="text-white">
                            <strong>{giver.name}</strong> 🚫 no puede regalarle a <strong>{forbidden.name}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => removeSecretSantaExclusion(giverId, forbiddenId)}
                            title="Eliminar regla"
                            className="p-1 text-rose-400 hover:text-rose-200 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    });
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 3. Parámetros del Sorteo */}
          <div className="glass-card p-6 rounded-3xl border border-amber-400/30 space-y-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold font-cinzel text-white">
                Parámetros del Sorteo
              </h3>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Presupuesto Mínimo (COP)</label>
                  <input
                    type="number"
                    step="5000"
                    value={cfgMin}
                    onChange={e => setCfgMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Presupuesto Máximo (COP)</label>
                  <input
                    type="number"
                    step="5000"
                    value={cfgMax}
                    onChange={e => setCfgMax(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Fecha de Entrega de Regalos</label>
                <input
                  type="date"
                  value={cfgDate}
                  onChange={e => setCfgDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-pine-950 font-bold shadow-md cursor-pointer hover:bg-amber-400 transition-colors"
                >
                  Guardar Parámetros
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          MODAL: VER LISTA DE DESEOS DE UN PARTICIPANTE
      ══════════════════════════════════════════════ */}
      {selectedParticipantModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-amber-400/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedParticipantModal.avatar}
                  alt={selectedParticipantModal.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
                />
                <div>
                  <h3 className="text-base font-bold font-cinzel text-white">
                    {selectedParticipantModal.name}
                  </h3>
                  <span className="text-[11px] text-emerald-300">
                    {selectedParticipantModal.familyGroup || 'Familia'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedParticipantModal(null)}
                className="p-1 rounded-lg text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const list = secretSanta.wishlists?.[selectedParticipantModal.id];
              if (!list) {
                return (
                  <div className="text-center py-6 text-xs text-emerald-300/70 space-y-2">
                    <p>Este familiar aún no ha registrado su lista de deseos detallada.</p>
                    <p className="text-[11px] text-amber-300">¡Sugiérele que la llene para que sea más fácil elegir su regalo!</p>
                  </div>
                );
              }

              return (
                <div className="space-y-3 text-xs">
                  <div className="bg-black/40 p-3 rounded-2xl border border-white/10">
                    <span className="font-bold text-emerald-300 block mb-1">Ideas de regalo sugeridas:</span>
                    <ul className="space-y-1 pl-4 list-disc text-white">
                      {list.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/10">
                      <span className="font-bold text-emerald-300 block">Tallas:</span>
                      <span className="text-white">{list.sizes || 'No indicada'}</span>
                    </div>
                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/10">
                      <span className="font-bold text-emerald-300 block">Colores favoritos:</span>
                      <span className="text-white">{(list.favoriteColors || []).join(', ') || 'Cualquiera'}</span>
                    </div>
                  </div>

                  {list.dislikes && (
                    <div className="bg-rose-950/30 p-2.5 rounded-xl border border-rose-500/20 text-rose-200">
                      <span className="font-bold text-rose-300 block">Evitar:</span>
                      <span>{list.dislikes}</span>
                    </div>
                  )}

                  {list.hints && (
                    <div className="bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/20 text-amber-200">
                      <span className="font-bold text-amber-300 block">Pista especial:</span>
                      <span>"{list.hints}"</span>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedParticipantModal(null)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-pine-950 font-bold text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
