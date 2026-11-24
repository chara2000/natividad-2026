import React, { useState } from 'react';
import {
  Vote,
  Plus,
  MessageCircle,
  Share2,
  CheckCircle2,
  Send,
  Calendar,
  Sparkles,
  Users,
  X,
  Trash2,
  Lock,
  Unlock,
  Check,
} from 'lucide-react';
import { useChristmas } from '../../context/ChristmasContext';
import { soundFX } from '../../utils/audio';
import {
  FilterBar,
  FilterPills,
  NativeFilterSelect,
  ChipGroup,
  SearchInput,
  SortDropdown,
} from '../ui/FilterBar';

export const PollsModule: React.FC = () => {
  const {
    polls,
    votePoll,
    createPoll,
    addPollComment,
    deletePoll,
    toggleClosePoll,
    currentUser,
    members,
    canCreatePolls,
    showAlert,
  } = useChristmas();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [commentInputs, setCommentInputs] = useState<{ [pollId: string]: string }>({});

  // Filter state
  const [pollSearch, setPollSearch] = useState('');
  const [pollStatusFilter, setPollStatusFilter] = useState('');
  const [pollSortBy, setPollSortBy] = useState('recientes');

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !option1.trim() || !option2.trim()) return;

    const options = [
      { id: `opt-${Date.now()}-1`, text: option1.trim(), votes: [] },
      { id: `opt-${Date.now()}-2`, text: option2.trim(), votes: [] },
    ];

    if (option3.trim()) {
      options.push({ id: `opt-${Date.now()}-3`, text: option3.trim(), votes: [] });
    }

    createPoll({
      communityId: 'comm-garcia-2026',
      question: newQuestion,
      description: newDescription,
      options,
      allowMultiple: false,
      createdBy: currentUser?.name || 'Familiar',
      closesAt: '2026-12-15',
    });

    setShowCreateModal(false);
    setNewQuestion('');
    setNewDescription('');
    setOption1('');
    setOption2('');
    setOption3('');
  };

  const handleSendComment = (pollId: string) => {
    const text = commentInputs[pollId];
    if (!text || !text.trim()) return;
    addPollComment(pollId, text);
    setCommentInputs(prev => ({ ...prev, [pollId]: '' }));
  };

  const sharePollToWhatsApp = (pollTitle: string) => {
    soundFX.playJingleBell();
    const text = `🗳️ *Encuesta Navideña Familia García:*\n"${pollTitle}"\n\n¡Ingresa a la plataforma y vota para decidir juntos! 🎄`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showAlert('¡Encuesta copiada para compartir en WhatsApp!', 'Encuesta Copiada', 'success');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-amber-300 flex items-center gap-1.5">
            <Vote className="w-3.5 h-3.5" /> Decisiones Grupales
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
            Encuestas y Votaciones
          </h2>
          <p className="text-xs text-emerald-200/80 mt-0.5">
            Decide democráticamente el menú de la cena, temáticas y presupuestos sin debates interminables de WhatsApp.
          </p>
        </div>

        {canCreatePolls ? (
          <button
            onClick={() => {
              soundFX.playClick();
              setShowCreateModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Crear Encuesta
          </button>
        ) : (
          <span className="text-[11px] text-amber-300/80 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 self-start sm:self-auto">
            ⭐ Solo Organizador/Tesorero pueden crear encuestas
          </span>
        )}
      </div>

      {/* ✨ Beautiful Filter Bar */}
      <FilterBar
        label="Filtrar Encuestas"
        activeFiltersCount={[pollSearch, pollStatusFilter].filter(Boolean).length}
        onClearAll={() => {
          setPollSearch('');
          setPollStatusFilter('');
          setPollSortBy('recientes');
        }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <SearchInput
            value={pollSearch}
            onChange={setPollSearch}
            placeholder="Buscar encuesta…"
          />
          <SortDropdown
            options={[
              { id: 'recientes', label: 'Más recientes' },
              { id: 'mas_votadas', label: 'Más votadas' },
              { id: 'menos_votadas', label: 'Menos votadas' },
            ]}
            value={pollSortBy}
            onChange={setPollSortBy}
            label="Ordenar"
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap pt-1 border-t border-white/5">
          <FilterPills
            label="Estado"
            allLabel="Todas las encuestas"
            options={[
              { id: 'activa', label: 'Abiertas para votar', emoji: '🟢' },
              { id: 'cerrada', label: 'Cerradas', emoji: '🔒' },
            ]}
            value={pollStatusFilter}
            onChange={setPollStatusFilter}
          />
        </div>
      </FilterBar>

      {/* Polls List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {polls
          .filter(p => {
            if (pollSearch && !p.question.toLowerCase().includes(pollSearch.toLowerCase())) return false;
            if (pollStatusFilter === 'cerrada') {
              const now = new Date().toISOString().split('T')[0];
              return p.closesAt && p.closesAt < now;
            }
            if (pollStatusFilter === 'activa') {
              const now = new Date().toISOString().split('T')[0];
              return !p.closesAt || p.closesAt >= now;
            }
            return true;
          })
          .sort((a, b) => {
            if (pollSortBy === 'mas_votadas') {
              return b.options.reduce((s, o) => s + o.votes.length, 0) - a.options.reduce((s, o) => s + o.votes.length, 0);
            }
            if (pollSortBy === 'menos_votadas') {
              return a.options.reduce((s, o) => s + o.votes.length, 0) - b.options.reduce((s, o) => s + o.votes.length, 0);
            }
            return 0; // recientes: keep original order
          })
          .map(poll => {
          const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
          const now = new Date().toISOString().split('T')[0];
          const isClosed = poll.closesAt ? poll.closesAt < now : false;

          return (
            <div
              key={poll.id}
              className={`glass-card rounded-3xl p-5 sm:p-6 border shadow-xl flex flex-col justify-between transition-all ${
                isClosed
                  ? 'border-white/10 opacity-80 bg-black/40'
                  : 'border-amber-400/25 bg-emerald-950/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      {totalVotes} votos emitidos
                    </span>
                    {isClosed && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Cerrada
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {canCreatePolls && (
                      <>
                        <button
                          type="button"
                          onClick={() => toggleClosePoll(poll.id)}
                          title={isClosed ? 'Reabrir votación' : 'Cerrar votación'}
                          className="p-1 rounded-lg hover:bg-white/10 text-emerald-300 hover:text-white transition-colors"
                        >
                          {isClosed ? <Unlock className="w-3.5 h-3.5 text-amber-300" /> : <Lock className="w-3.5 h-3.5 text-emerald-300" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePoll(poll.id)}
                          title="Eliminar encuesta"
                          className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => sharePollToWhatsApp(poll.question)}
                      className="text-xs text-emerald-300 hover:text-white flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5"
                    >
                      <Share2 className="w-3.5 h-3.5" /> WhatsApp
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {poll.question}
                </h3>
                {poll.description && (
                  <p className="text-xs text-emerald-200/70 mt-1">
                    {poll.description}
                  </p>
                )}

                {/* Options */}
                <div className="mt-4 space-y-2.5">
                  {poll.options.map(opt => {
                    const hasMyVote = currentUser ? opt.votes.includes(currentUser.id) : false;
                    const percentage = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          if (isClosed) {
                            showAlert('Esta encuesta está cerrada y no acepta más votos.', 'Votación Finalizada', 'info');
                            return;
                          }
                          votePoll(poll.id, opt.id);
                        }}
                        className={`relative overflow-hidden p-3 rounded-2xl border transition-all ${
                          isClosed
                            ? 'cursor-not-allowed opacity-90 border-white/10'
                            : 'cursor-pointer hover:border-amber-400/40'
                        } ${
                          hasMyVote
                            ? 'border-amber-400 bg-amber-500/10 shadow-sm'
                            : 'border-white/10 bg-black/40'
                        }`}
                      >
                        {/* Percentage fill bar background */}
                        <div
                          className="absolute inset-y-0 left-0 bg-emerald-600/30 transition-all duration-500 pointer-events-none"
                          style={{ width: `${percentage}%` }}
                        />

                        <div className="relative z-10 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                hasMyVote
                                  ? 'bg-amber-400 border-amber-300 text-pine-950 font-black'
                                  : 'border-white/30'
                              }`}
                            >
                              {hasMyVote && '✓'}
                            </span>
                            <span className={`font-semibold ${hasMyVote ? 'text-amber-300' : 'text-white'}`}>
                              {opt.text}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Voters avatars preview */}
                            <div className="flex -space-x-1.5 overflow-hidden">
                              {opt.votes.slice(0, 3).map(uid => {
                                const u = members.find(m => m.id === uid);
                                if (!u) return null;
                                return (
                                  <img
                                    key={u.id}
                                    src={u.avatar}
                                    alt={u.name}
                                    className="w-4 h-4 rounded-full object-cover border border-black"
                                  />
                                );
                              })}
                            </div>
                            <span className="font-mono font-bold text-amber-300">
                              {percentage}% ({opt.votes.length})
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-5 pt-3 border-t border-white/10 space-y-2">
                <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                  {poll.comments.map(c => {
                    const u = members.find(m => m.id === c.userId);
                    return (
                      <div key={c.id} className="text-[11px] bg-black/30 p-2 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 mr-1.5">{u?.name || 'Familiar'}:</span>
                        <span className="text-emerald-100/90">{c.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Comment input */}
                <div className="flex items-center gap-1.5 pt-1">
                  <input
                    type="text"
                    placeholder="Opinar sobre esta encuesta..."
                    value={commentInputs[poll.id] || ''}
                    onChange={e =>
                      setCommentInputs({ ...commentInputs, [poll.id]: e.target.value })
                    }
                    onKeyDown={e => e.key === 'Enter' && handleSendComment(poll.id)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-emerald-400/40 focus:border-amber-400 focus:outline-none"
                  />
                  <button
                    onClick={() => handleSendComment(poll.id)}
                    className="p-1.5 rounded-xl bg-amber-500 text-pine-950 font-bold active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Crear Encuesta */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md glass-card border border-amber-400/40 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-base font-bold font-cinzel text-white flex items-center gap-2">
                <Vote className="w-5 h-5 text-amber-400" /> Crear Nueva Encuesta
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-emerald-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePoll} className="space-y-4 text-xs">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">
                  Pregunta de la Encuesta *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: ¿Dónde hacemos la cena navideña?"
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">
                  Descripción (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Para reservar el lugar con anticipación"
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-emerald-300 font-bold">Opciones para votar *</label>
                <input
                  type="text"
                  required
                  placeholder="Opción 1: Casa de la Abuela"
                  value={option1}
                  onChange={e => setOption1(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Opción 2: Finca en la Sabana"
                  value={option2}
                  onChange={e => setOption2(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
                <input
                  type="text"
                  placeholder="Opción 3 (Opcional): Salón Comunal del Conjunto"
                  value={option3}
                  onChange={e => setOption3(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-emerald-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-pine-950 font-bold shadow-md"
                >
                  Publicar Encuesta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
