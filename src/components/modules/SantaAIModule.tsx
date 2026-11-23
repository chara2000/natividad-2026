import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { useChristmas } from '../../context/ChristmasContext';
import { soundFX } from '../../utils/audio';

export const SantaAIModule: React.FC = () => {
  const {
    santaMessages,
    sendSantaAIMessage,
    isSantaTyping,
    currentUser,
    setActiveTab,
  } = useChristmas();

  const [inputPrompt, setInputPrompt] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const SUGGESTED_PILLS = [
    '📊 ¿Cuánto dinero nos falta por recaudar?',
    '🍗 Cena de Nochebuena para 25 personas y menú',
    '🎁 ¿Cuál es el estado del amigo secreto?',
    '📲 Redactar mensaje de invitación para WhatsApp',
    '🎉 Ideas de juegos y dinámicas para la novena',
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [santaMessages, isSantaTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim()) return;
    soundFX.playClick();
    sendSantaAIMessage(text);
    setInputPrompt('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Asistente Inteligente
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white flex items-center gap-2">
            Santa IA 🎅✨
          </h2>
          <p className="text-xs text-emerald-200/80 mt-0.5">
            Tu co-organizador navideño. Consulta presupuestos en tiempo real, menús, itinerarios e invitaciones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Conectado al Fondo Comunitario
          </span>
        </div>
      </div>

      {/* Suggested Quick Prompts Pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {SUGGESTED_PILLS.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pill)}
            className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-amber-500/20 border border-amber-400/25 text-emerald-200 hover:text-amber-200 text-xs font-semibold whitespace-nowrap transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Lightbulb className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span>{pill}</span>
          </button>
        ))}
      </div>

      {/* Main Chat Window */}
      <div className="glass-card rounded-3xl border border-amber-400/30 shadow-2xl overflow-hidden flex flex-col h-[520px]">
        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {santaMessages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                    isUser
                      ? 'bg-amber-500 text-pine-950 font-bold border border-amber-300'
                      : 'bg-gradient-to-tr from-berry-600 to-rose-600 text-white border border-rose-400/50 text-xl'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : '🎅'}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-md rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-amber-500/20 border border-amber-400/40 text-amber-100'
                      : 'bg-black/50 border border-white/10 text-emerald-50 shadow-inner'
                  }`}
                >
                  <div className="whitespace-pre-line space-y-1">
                    {msg.text}
                  </div>

                  {/* Optional Suggested Action Button */}
                  {msg.suggestedAction && (
                    <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-end">
                      <button
                        onClick={() => {
                          soundFX.playClick();
                          if (msg.suggestedAction?.type === 'view_finances') setActiveTab('finances');
                          else if (msg.suggestedAction?.type === 'create_activity') setActiveTab('activities');
                          else if (msg.suggestedAction?.type === 'secret_santa') setActiveTab('secretsanta');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-[11px] transition-all"
                      >
                        <span>{msg.suggestedAction.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <span className="text-[9px] text-emerald-300/50 mt-1 block text-right font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isSantaTyping && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-berry-600 to-rose-600 flex items-center justify-center text-xl shadow-md">
                🎅
              </div>
              <div className="bg-black/50 border border-white/10 rounded-2xl p-3 text-xs text-amber-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Santa está consultando los datos del grupo navideño...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-pine-950/80 border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            placeholder="Escribe tu pregunta a Santa IA (ej: ¿cuánto dinero nos falta? o receta de buñuelos)..."
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-black/60 border border-white/15 text-xs text-white placeholder-emerald-300/40 focus:border-amber-400 focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputPrompt.trim() || isSantaTyping}
            className={`p-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 font-bold transition-all shadow-md active:scale-95 ${
              !inputPrompt.trim() || isSantaTyping ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
