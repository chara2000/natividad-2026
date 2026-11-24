import React, { useState } from 'react';
import {
  Clock,
  CalendarDays,
  Plus,
  CheckCircle2,
  Users,
  AlertCircle,
  MapPin,
  Sparkles,
  Share2,
  Trash2,
} from 'lucide-react';
import { useChristmas } from '../../context/ChristmasContext';
import { soundFX } from '../../utils/audio';
import { FilterBar, FilterDropdown, ChipGroup } from '../ui/FilterBar';

export const ItinerariesModule: React.FC = () => {
  const {
    activities,
    members,
    currentUser,
    canManageActivities,
    toggleItineraryItem,
    deleteItineraryItem,
    updateActivity,
    showAlert,
  } = useChristmas();
  const [selectedActivityId, setSelectedActivityId] = useState<string>(activities[0]?.id || '');
  const [itinStatusFilter, setItinStatusFilter] = useState('');
  const [itinResponsibleFilter, setItinResponsibleFilter] = useState('');

  // Add Item Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemTime, setNewItemTime] = useState('21:00');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemResp, setNewItemResp] = useState(members[0]?.id || '');

  const activity = activities.find(a => a.id === selectedActivityId) || activities[0];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim() || !activity) return;

    const newItem = {
      id: `itin-${Date.now()}`,
      time: newItemTime,
      title: newItemTitle,
      description: newItemDesc,
      responsibleId: newItemResp,
      completed: false,
    };

    const updatedItinerary = [...activity.itinerary, newItem].sort((a, b) =>
      a.time.localeCompare(b.time)
    );

    updateActivity(activity.id, { itinerary: updatedItinerary });
    setShowAddModal(false);
    setNewItemTitle('');
    setNewItemDesc('');
    soundFX.playJingleBell();
  };

  const completedCount = activity?.itinerary.filter(i => i.completed).length || 0;
  const totalCount = activity?.itinerary.length || 0;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-amber-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Cronogramas y Horarios
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
            Itinerarios Navideños
          </h2>
          <p className="text-xs text-emerald-200/80 mt-0.5">
            Planifica cada momento para que la celebración fluya sin contratiempos.
          </p>
        </div>

        {canManageActivities ? (
          <button
            onClick={() => {
              soundFX.playClick();
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Agregar Momento / Hito
          </button>
        ) : (
          <span className="text-[11px] text-amber-300/80 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 self-start sm:self-auto">
            ⭐ Solo el Organizador puede agregar momentos al itinerario
          </span>
        )}
      </div>

      {/* ✨ Beautiful Activity & Itinerary Dropdown Selectors */}
      <FilterBar
        label="Seleccionar Actividad e Itinerario"
        activeFiltersCount={itinStatusFilter ? 1 : 0}
        onClearAll={() => { setItinStatusFilter(''); setItinResponsibleFilter(''); }}
        defaultOpen={true}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <FilterDropdown
            label="Actividad"
            options={activities.map(act => ({
              id: act.id,
              label: act.title,
              subtitle: `${act.date} · ${act.location || 'Familia'}`,
              emoji: act.type === 'novena' ? '🕯️' : act.type === 'dinner' ? '🍗' : '🎄',
              badge: act.time,
            }))}
            value={selectedActivityId || (activities[0]?.id || '')}
            onChange={id => {
              soundFX.playClick();
              setSelectedActivityId(id);
            }}
            icon={CalendarDays}
            placeholder="Seleccionar Actividad"
            className="flex-1 min-w-[240px]"
          />

          <FilterDropdown
            label="Estado"
            options={[
              { id: '', label: 'Todos los momentos', emoji: '📋' },
              { id: 'pending', label: 'Pendientes', emoji: '⏳' },
              { id: 'completed', label: 'Completados', emoji: '✅' },
            ]}
            value={itinStatusFilter}
            onChange={setItinStatusFilter}
            icon={Clock}
            placeholder="Todos"
          />
        </div>
      </FilterBar>

      {activity && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-400/30 shadow-2xl relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-300 font-mono">
                <CalendarDays className="w-3.5 h-3.5" /> {activity.date} · {activity.location}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-white mt-1">
                {activity.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                {completedCount} de {totalCount} momentos completados
              </span>
            </div>
          </div>

          {/* Timeline visualization */}
          <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-500/30 space-y-6">
            {activity.itinerary
              .filter(item => {
                if (itinStatusFilter === 'pending') return !item.completed;
                if (itinStatusFilter === 'completed') return item.completed;
                return true;
              })
              .map((item, idx) => {
              const resp = members.find(m => m.id === item.responsibleId);
                const canToggle = canManageActivities || (currentUser?.id && item.responsibleId === currentUser.id);

                return (
                  <div key={item.id} className="relative group">
                    {/* Timeline dot */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!canToggle) {
                          showAlert('Solo el organizador o la persona responsable puede marcar este momento como completado.', 'Permiso Requerido', 'info');
                          return;
                        }
                        toggleItineraryItem(activity.id, item.id);
                      }}
                      title={canToggle ? 'Alternar completado' : 'Solo organizador o responsable'}
                      className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                        item.completed
                          ? 'bg-emerald-500 border-emerald-300 text-pine-950 shadow-md shadow-emerald-500/30'
                          : 'bg-pine-950 border-amber-400 text-amber-300 hover:scale-110'
                      }`}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-4 h-4 fill-current" />
                      ) : (
                        <span className="text-[10px] font-black">{idx + 1}</span>
                      )}
                    </button>

                    {/* Card Content */}
                    <div
                      className={`p-4 rounded-2xl border transition-all ${
                        item.completed
                          ? 'bg-emerald-950/30 border-emerald-500/30 opacity-70'
                          : 'bg-black/40 border-white/10 hover:border-amber-400/40 shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-black font-mono text-amber-400">
                          {item.time}
                        </span>
                        <div className="flex items-center gap-2">
                          {resp && (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-200/80">
                              <img
                                src={resp.avatar}
                                alt={resp.name}
                                className="w-5 h-5 rounded-full object-cover border border-amber-400/40"
                              />
                              <span>Responsable: <strong>{resp.name}</strong></span>
                            </div>
                          )}
                          {canManageActivities && (
                            <button
                              type="button"
                              onClick={() => deleteItineraryItem(activity.id, item.id)}
                              title="Eliminar del itinerario"
                              className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer ml-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <h4 className={`text-sm font-bold ${item.completed ? 'line-through text-emerald-300/60' : 'text-white'}`}>
                        {item.title}
                      </h4>
                      <p className="text-xs text-emerald-200/70 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
            })}
          </div>
        </div>
      )}

      {/* Modal: Add Itinerary Item */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md glass-card border border-amber-400/40 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-bold font-cinzel text-white mb-3">
              Agregar Momento al Itinerario
            </h3>
            <form onSubmit={handleAddItem} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Hora *</label>
                  <input
                    type="time"
                    required
                    value={newItemTime}
                    onChange={e => setNewItemTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Responsable</label>
                  <select
                    value={newItemResp}
                    onChange={e => setNewItemResp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Título del Momento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cantada de villancicos con panderetas"
                  value={newItemTitle}
                  onChange={e => setNewItemTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Descripción</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre qué se necesita o qué sucederá..."
                  value={newItemDesc}
                  onChange={e => setNewItemDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-emerald-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-pine-950 font-bold shadow-md"
                >
                  Guardar Momento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
