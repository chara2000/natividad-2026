'use client';

import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  Users,
  DollarSign,
  CheckCircle2,
  Circle,
  ListTodo,
  UtensilsCrossed,
  Sparkles,
  Calendar,
  X,
  Share2,
  Trash2,
  Edit3,
  Check,
  UserCheck,
  AlertCircle,
  Crown,
  Wallet,
  Receipt as ReceiptIcon,
} from 'lucide-react';
import { useChristmas } from '../../context/ChristmasContext';
import { Activity, ActivityType } from '../../types';
import { soundFX } from '../../utils/audio';
import {
  FilterBar,
  FilterDropdown,
  NativeFilterSelect,
  FilterPills,
  ChipGroup,
  ChipOption,
  DateRangePicker,
  SearchInput,
  SortDropdown,
} from '../ui/FilterBar';

export interface NovenaScheduleItem {
  id: string;
  dayNum?: number;
  label: string;
  emoji: string;
  dateStr: string;
  subtitle: string;
}

export const NOVENA_SCHEDULE: NovenaScheduleItem[] = [
  { id: 'all', label: 'Todas las Fechas', emoji: '🎄', dateStr: '', subtitle: 'Ver calendario completo' },
  { id: 'dia-1', dayNum: 1, label: 'Día 1 · Novena', emoji: '🕯️', dateStr: '2026-12-16', subtitle: '16 Dic · Inicio' },
  { id: 'dia-2', dayNum: 2, label: 'Día 2 · Novena', emoji: '🕯️', dateStr: '2026-12-17', subtitle: '17 Dic' },
  { id: 'dia-3', dayNum: 3, label: 'Día 3 · Novena', emoji: '🕯️', dateStr: '2026-12-18', subtitle: '18 Dic' },
  { id: 'dia-4', dayNum: 4, label: 'Día 4 · Novena', emoji: '🕯️', dateStr: '2026-12-19', subtitle: '19 Dic' },
  { id: 'dia-5', dayNum: 5, label: 'Día 5 · Novena', emoji: '🕯️', dateStr: '2026-12-20', subtitle: '20 Dic' },
  { id: 'dia-6', dayNum: 6, label: 'Día 6 · Novena', emoji: '🕯️', dateStr: '2026-12-21', subtitle: '21 Dic' },
  { id: 'dia-7', dayNum: 7, label: 'Día 7 · Novena', emoji: '🕯️', dateStr: '2026-12-22', subtitle: '22 Dic' },
  { id: 'dia-8', dayNum: 8, label: 'Día 8 · Novena', emoji: '🕯️', dateStr: '2026-12-23', subtitle: '23 Dic' },
  { id: 'dia-9', dayNum: 9, label: 'Día 9 · Novena', emoji: '🕯️', dateStr: '2026-12-24', subtitle: '24 Dic · Cierre' },
  { id: 'cena', label: 'Cena Nochebuena', emoji: '🍗', dateStr: '2026-12-24', subtitle: '24 Dic · Banquete' },
  { id: 'navidad', label: 'Navidad', emoji: '🎁', dateStr: '2026-12-25', subtitle: '25 Dic · Regalos' },
  { id: 'fin-ano', label: 'Fin de Año', emoji: '🎆', dateStr: '2026-12-31', subtitle: '31 Dic · Fiesta' },
];

export const ActivitiesModule: React.FC = () => {
  const {
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    currentUser,
    members,
    toggleItineraryItem,
    addItineraryItem,
    deleteItineraryItem,
    toggleActivityTask,
    addActivityTask,
    deleteActivityTask,
    claimPotluckDish,
    addPotluckDish,
    deletePotluckDish,
    toggleAttendance,
    submitActivityRsvp,
    receipts,
    registerPaymentReceipt,
    canManageActivities,
    isGuest,
    showAlert,
    showConfirm,
  } = useChristmas();

  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [activeActivityId, setActiveActivityId] = useState<string>(
    activities[0]?.id || ''
  );
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'itinerary' | 'tasks' | 'potluck' | 'budget'>('info');

  // Filter state
  const [novenaTimelineFilter, setNovenaTimelineFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('date_asc');

  // Modal State for new Activity
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ActivityType>('novena');
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState('2026-12-16');
  const [newTime, setNewTime] = useState('19:00');
  const [newLocation, setNewLocation] = useState('');
  const [newBudget, setNewBudget] = useState(150000);
  const [newMaxParticipants, setNewMaxParticipants] = useState(25);
  const [novenaDay, setNovenaDay] = useState(1);

  // Modal State for EDIT Activity
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState<ActivityType>('novena');
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editBudget, setEditBudget] = useState(0);
  const [editMaxParticipants, setEditMaxParticipants] = useState(25);
  const [editNovenaDay, setEditNovenaDay] = useState(1);

  // Modal State for Add Itinerary Item
  const [showAddItineraryModal, setShowAddItineraryModal] = useState(false);
  const [itinTime, setItinTime] = useState('19:30');
  const [itinTitle, setItinTitle] = useState('');
  const [itinDesc, setItinDesc] = useState('');
  const [itinRespId, setItinRespId] = useState<string>('');

  // Modal State for Add Task
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'alta' | 'media' | 'baja'>('media');
  const [taskAssignedId, setTaskAssignedId] = useState<string>('');

  // Modal State for Add Dish
  const [showAddDish, setShowAddDish] = useState(false);
  const [dishName, setDishName] = useState('');
  const [dishCategory, setDishCategory] = useState<'plato' | 'bebida' | 'postre' | 'pasaboca' | 'desechable'>('postre');
  const [dishServings, setDishServings] = useState(20);

  // Modal State for Abono a la Actividad
  const [showAporteModal, setShowAporteModal] = useState(false);
  const [aporteAmount, setAporteAmount] = useState(50000);
  const [aporteMethod, setAporteMethod] = useState<'nequi' | 'daviplata' | 'efectivo' | 'transferencia' | 'tarjeta'>('nequi');
  const [aporteNotes, setAporteNotes] = useState('');

  // RSVP Modal State
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<'confirmed' | 'declined'>('confirmed');
  const [rsvpGuests, setRsvpGuests] = useState(0);
  const [rsvpDish, setRsvpDish] = useState('');
  const [rsvpNote, setRsvpNote] = useState('');

  const selectedActivity = activities.find(a => a.id === activeActivityId) || activities[0];

  // Activity finance stats
  const activityReceipts = useMemo(() => {
    if (!selectedActivity) return [];
    return receipts.filter(r => r.activityId === selectedActivity.id);
  }, [receipts, selectedActivity]);

  const activityTotalCollected = useMemo(() => {
    return activityReceipts
      .filter(r => r.status === 'approved')
      .reduce((sum, r) => sum + r.amount, 0);
  }, [activityReceipts]);

  const activityProgress = selectedActivity?.estimatedBudget
    ? Math.min(100, Math.round((activityTotalCollected / selectedActivity.estimatedBudget) * 100))
    : 0;

  const activityTypeChips: ChipOption[] = [
    { id: 'all', label: 'Todas', emoji: '🎄', color: 'bg-white/15 text-white border-white/30' },
    { id: 'novena', label: 'Novenas', emoji: '🕯️', color: 'bg-amber-500/20 text-amber-300 border-amber-400/40' },
    { id: 'dinner', label: 'Cena', emoji: '🍗', color: 'bg-rose-500/20 text-rose-300 border-rose-400/40' },
    { id: 'velitas', label: 'Velitas', emoji: '🕯️', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40' },
    { id: 'charity', label: 'Solidaria', emoji: '🤝', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' },
    { id: 'party', label: 'Fiesta', emoji: '🥳', color: 'bg-purple-500/20 text-purple-300 border-purple-400/40' },
    { id: 'trip', label: 'Paseo', emoji: '🚌', color: 'bg-blue-500/20 text-blue-300 border-blue-400/40' },
  ];

  const statusChips: ChipOption[] = [
    { id: 'upcoming', label: 'Próximas', emoji: '📅', color: 'bg-blue-500/20 text-blue-300 border-blue-400/40' },
    { id: 'completed', label: 'Realizadas', emoji: '✅', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' },
  ];

  const sortOptions = [
    { id: 'date_asc', label: 'Fecha más próxima' },
    { id: 'date_desc', label: 'Fecha más lejana' },
    { id: 'budget_desc', label: 'Mayor presupuesto' },
    { id: 'title_asc', label: 'Nombre A-Z' },
  ];

  const activeFiltersCount = [
    selectedTypeFilter && selectedTypeFilter !== 'all',
    novenaTimelineFilter && novenaTimelineFilter !== 'all',
    dateFrom,
    dateTo,
    statusFilter,
    searchQuery,
  ].filter(Boolean).length;

  const filteredActivities = activities
    .filter(act => {
      if (selectedTypeFilter && selectedTypeFilter !== 'all' && act.type !== selectedTypeFilter) return false;
      if (statusFilter && act.status !== statusFilter) return false;
      if (dateFrom && act.date < dateFrom) return false;
      if (dateTo && act.date > dateTo) return false;

      // Novena & Key Dates Filter
      if (novenaTimelineFilter !== 'all') {
        const item = NOVENA_SCHEDULE.find(n => n.id === novenaTimelineFilter);
        if (item) {
          if (item.dayNum) {
            const matchesDay = act.novenaDay === item.dayNum;
            const matchesDate = act.date === item.dateStr;
            if (!matchesDay && !matchesDate) return false;
          } else if (item.id === 'cena') {
            if (act.type !== 'dinner' && act.date !== '2026-12-24') return false;
          } else if (item.dateStr && act.date !== item.dateStr) {
            return false;
          }
        }
      }

      if (
        searchQuery &&
        !act.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !act.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date_desc') return b.date.localeCompare(a.date);
      if (sortBy === 'budget_desc') return b.estimatedBudget - a.estimatedBudget;
      if (sortBy === 'title_asc') return a.title.localeCompare(b.title);
      return a.date.localeCompare(b.date);
    });

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addActivity({
      communityId: 'comm-garcia-2026',
      title: newTitle,
      type: newType,
      description: newDescription || 'Actividad navideña familiar.',
      date: newDate,
      time: newTime,
      location: newLocation || 'Casa de la Familia',
      estimatedBudget: Number(newBudget),
      maxParticipants: Number(newMaxParticipants),
      organizerId: currentUser?.id || 'usr-org',
      attendees: currentUser ? [currentUser.id] : [],
      status: 'upcoming',
      novenaDay: newType === 'novena' ? novenaDay : undefined,
      itinerary: [
        {
          id: `itin-${Date.now()}-1`,
          time: newTime,
          title: 'Bienvenida y Apertura',
          description: 'Llegada de invitados y música navideña',
          responsibleId: currentUser?.id || 'usr-org',
          completed: false,
        },
      ],
      tasks: [
        {
          id: `task-${Date.now()}-1`,
          title: 'Confirmar lista de asistentes',
          assignedToId: currentUser?.id || 'usr-org',
          completed: false,
          priority: 'alta',
        },
      ],
      potluckDishes: [
        {
          id: `pot-${Date.now()}-1`,
          name: 'Buñuelos o Pasabocas',
          category: 'pasaboca',
          servings: 20,
        },
      ],
    });

    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
    soundFX.playJingleBell();
  };

  const openEditModal = (act: Activity) => {
    setEditTitle(act.title);
    setEditType(act.type);
    setEditDescription(act.description);
    setEditDate(act.date);
    setEditTime(act.time);
    setEditLocation(act.location);
    setEditBudget(act.estimatedBudget);
    setEditMaxParticipants(act.maxParticipants || 25);
    setEditNovenaDay(act.novenaDay || 1);
    setShowEditModal(true);
  };

  const handleUpdateActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity || !editTitle.trim()) return;

    updateActivity(selectedActivity.id, {
      title: editTitle,
      type: editType,
      description: editDescription,
      date: editDate,
      time: editTime,
      location: editLocation,
      estimatedBudget: Number(editBudget),
      maxParticipants: Number(editMaxParticipants),
      novenaDay: editType === 'novena' ? editNovenaDay : undefined,
    });

    setShowEditModal(false);
    soundFX.playJingleBell();
    showAlert('Actividad actualizada exitosamente.', '¡Guardado!', 'success');
  };

  const handleDeleteActivityClick = (actId: string, title: string) => {
    showConfirm(
      `¿Estás seguro de eliminar la actividad "${title}"? Se borrará todo su itinerario, platos y tareas asociadas.`,
      () => {
        deleteActivity(actId);
        if (activeActivityId === actId) {
          const remaining = activities.filter(a => a.id !== actId);
          setActiveActivityId(remaining[0]?.id || '');
        }
      },
      'Eliminar Actividad'
    );
  };

  const handleToggleStatus = (act: Activity) => {
    if (!canManageActivities) {
      showAlert('Solo el organizador puede cambiar el estado de la actividad.', 'Acceso Restringido', 'warning');
      return;
    }
    const nextStatus = act.status === 'completed' ? 'upcoming' : 'completed';
    updateActivity(act.id, { status: nextStatus });
    soundFX.playJingleBell();
    showAlert(
      nextStatus === 'completed' ? '¡Actividad marcada como Realizada! 🎉' : 'Actividad marcada como Próxima 🗓️',
      'Estado Actualizado',
      'success'
    );
  };

  // Itinerary handlers — strictly for organizer
  const handleAddItinerarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itinTitle.trim() || !selectedActivity) return;
    if (!canManageActivities) {
      showAlert('Solo el organizador puede agregar momentos al cronograma.', 'Acceso Restringido', 'warning');
      return;
    }
    addItineraryItem(selectedActivity.id, {
      time: itinTime,
      title: itinTitle,
      description: itinDesc,
      responsibleId: itinRespId || currentUser?.id,
    });
    setItinTitle('');
    setItinDesc('');
    setShowAddItineraryModal(false);
  };

  // Task handlers
  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !selectedActivity) return;
    addActivityTask(selectedActivity.id, {
      title: taskTitle,
      priority: taskPriority,
      assignedToId: taskAssignedId || currentUser?.id,
    });
    setTaskTitle('');
    setShowAddTaskModal(false);
  };

  // Potluck handlers
  const handleAddDishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim() || !selectedActivity) return;
    addPotluckDish(selectedActivity.id, {
      name: dishName,
      category: dishCategory,
      servings: Number(dishServings),
    });
    setDishName('');
    setShowAddDish(false);
  };

  // Activity Aporte Handler
  const handleAporteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity || !currentUser || aporteAmount <= 0) return;

    registerPaymentReceipt({
      userId: currentUser.id,
      amount: Number(aporteAmount),
      activityId: selectedActivity.id,
      method: aporteMethod,
      notes: aporteNotes || `Aporte para ${selectedActivity.title}`,
    });

    setShowAporteModal(false);
    setAporteNotes('');
    soundFX.playJingleBell();
    showAlert(
      `¡Aporte de $${aporteAmount.toLocaleString('es-CO')} registrado para ${selectedActivity.title}!`,
      'Aporte Registrado',
      'success'
    );
  };

  const getTypeBadge = (type: ActivityType) => {
    switch (type) {
      case 'novena':
        return { label: '🕯️ Novena', color: 'bg-amber-500/20 text-amber-300 border-amber-400/40' };
      case 'dinner':
        return { label: '🍗 Cena Navideña', color: 'bg-berry-600/20 text-rose-300 border-rose-400/40' };
      case 'velitas':
        return { label: '🕯️ Día de Velitas', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40' };
      case 'charity':
        return { label: '🤝 Navidad Solidaria', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' };
      case 'party':
        return { label: '🥳 Fiesta Navideña', color: 'bg-purple-500/20 text-purple-300 border-purple-400/40' };
      case 'trip':
        return { label: '🚌 Paseo de Alumbrados', color: 'bg-blue-500/20 text-blue-300 border-blue-400/40' };
      default:
        return { label: '🎄 Tradición', color: 'bg-white/10 text-white border-white/20' };
    }
  };

  const isAttending = selectedActivity && currentUser ? selectedActivity.attendees.includes(currentUser.id) : false;

  const userRsvp = useMemo(() => {
    if (!selectedActivity || !currentUser) return null;
    return selectedActivity.rsvps?.find(r => r.userId === currentUser.id) || null;
  }, [selectedActivity, currentUser]);

  const getActivityHeadcount = (act: Activity) => {
    if (!act.rsvps || act.rsvps.length === 0) return act.attendees.length;
    const confirmed = act.rsvps.filter(r => r.status === 'confirmed');
    const additional = confirmed.reduce((acc, r) => acc + (r.guestCount || 0), 0);
    return confirmed.length + additional;
  };

  const handleOpenRsvpModal = () => {
    if (!currentUser) {
      showAlert('Debes iniciar sesión para confirmar tu asistencia.', 'Acceso Requerido', 'warning');
      return;
    }
    if (userRsvp) {
      setRsvpStatus(userRsvp.status);
      setRsvpGuests(userRsvp.guestCount || 0);
      setRsvpDish(userRsvp.dishContribution || '');
      setRsvpNote(userRsvp.note || '');
    } else {
      setRsvpStatus(isAttending ? 'confirmed' : 'confirmed');
      setRsvpGuests(0);
      setRsvpDish('');
      setRsvpNote('');
    }
    setShowRsvpModal(true);
  };

  const handleSubmitRsvpForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity) return;
    submitActivityRsvp(selectedActivity.id, {
      status: rsvpStatus,
      guestCount: rsvpGuests,
      dishContribution: rsvpDish,
      note: rsvpNote,
    });
    setShowRsvpModal(false);
  };

  const handleShareWhatsApp = () => {
    if (!selectedActivity) return;
    soundFX.playJingleBell();
    const shareMsg = `🎄 *${selectedActivity.title}*\n📅 Fecha: ${selectedActivity.date} a las ${selectedActivity.time}\n📍 Lugar: ${selectedActivity.location}\n💰 Presupuesto estimado: $${selectedActivity.estimatedBudget.toLocaleString('es-CO')} COP\n${selectedActivity.description}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareMsg);
      showAlert('¡Detalles de la actividad copiados al portapapeles! Pégalos en el grupo de WhatsApp.', 'Actividad Copiada', 'success');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Agenda y Celebraciones
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
            Actividades Navideñas
          </h2>
          <p className="text-xs text-emerald-200/80 mt-0.5">
            Organiza las 9 novenas, la cena del 24, aportes por evento, platos y tareas.
          </p>
        </div>

        {canManageActivities ? (
          <button
            type="button"
            onClick={() => {
              soundFX.playJingleBell();
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 font-bold text-xs shadow-lg shadow-amber-500/30 hover:scale-102 transition-all active:scale-95 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Crear Nueva Actividad
          </button>
        ) : (
          <span className="text-[11px] text-amber-300/80 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 self-start sm:self-auto">
            ⭐ Solo el Organizador puede crear actividades
          </span>
        )}
      </div>

      {/* ── Selector Rápido de Días de Novena y Fechas Clave (Dropdown) ── */}
      <div className="glass-card rounded-2xl p-4 border border-amber-400/25 bg-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-base flex-shrink-0">
            🕯️
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">
              Calendario Navideño
            </span>
            <span className="text-xs sm:text-sm font-bold text-white font-cinzel">
              {NOVENA_SCHEDULE.find(s => s.id === novenaTimelineFilter)?.label || 'Todas las fechas'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <NativeFilterSelect
            label="Fecha / Novena"
            options={NOVENA_SCHEDULE.map(item => ({
              id: item.id,
              label: item.label,
              subtitle: item.subtitle,
              emoji: item.emoji,
              badge: item.dateStr || undefined,
            }))}
            value={novenaTimelineFilter}
            onChange={id => {
              soundFX.playClick();
              setNovenaTimelineFilter(id);
              if (id !== 'all') {
                const match = activities.find(a => {
                  const item = NOVENA_SCHEDULE.find(s => s.id === id);
                  if (!item) return false;
                  if (item.dayNum && a.novenaDay === item.dayNum) return true;
                  if (item.dateStr && a.date === item.dateStr) return true;
                  if (item.id === 'cena' && a.type === 'dinner') return true;
                  return false;
                });
                if (match) setActiveActivityId(match.id);
              }
            }}
            icon={CalendarDays}
            placeholder="Todas las fechas"
          />

          {novenaTimelineFilter !== 'all' && (
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setNovenaTimelineFilter('all');
              }}
              className="text-[11px] text-rose-300 hover:text-rose-200 px-2.5 py-2 rounded-xl bg-rose-500/10 border border-rose-400/20 font-semibold cursor-pointer whitespace-nowrap"
            >
              Restablecer
            </button>
          )}
        </div>
      </div>

      {/* ✨ Filter Bar */}
      <FilterBar
        label="Filtros de Actividades"
        activeFiltersCount={activeFiltersCount}
        onClearAll={() => {
          setSelectedTypeFilter('all');
          setStatusFilter('');
          setDateFrom('');
          setDateTo('');
          setSearchQuery('');
          setSortBy('date_asc');
        }}
      >
        {/* Row 1: Search + Sort + Date Range */}
        <div className="flex items-center gap-3 flex-wrap">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar por nombre, lugar o temática…"
          />
          <SortDropdown
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            label="Ordenar"
          />
          <DateRangePicker
            fromDate={dateFrom}
            toDate={dateTo}
            onFromChange={setDateFrom}
            onToChange={setDateTo}
            label="Fechas"
          />
        </div>

        {/* Row 2: Type Filters as Wrapped Pills (Zero clipping, full visibility) */}
        <div className="pt-2 border-t border-white/5 space-y-1">
          <FilterPills
            label="Tipo"
            allLabel="Todos"
            options={activityTypeChips}
            value={selectedTypeFilter === 'all' ? '' : selectedTypeFilter}
            onChange={val => setSelectedTypeFilter(val === '' ? 'all' : (val as ActivityType))}
          />
        </div>

        {/* Row 3: Status Filters as Wrapped Pills */}
        <div className="pt-2 border-t border-white/5">
          <FilterPills
            label="Estado"
            allLabel="Cualquiera"
            options={statusChips}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
      </FilterBar>

      {/* Main Grid: Activities List & Detailed View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Activities Cards List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-emerald-200/80 px-1">
            <span>
              Mostrando <strong>{filteredActivities.length}</strong> actividades
            </span>
            {activeFiltersCount > 0 && (
              <span className="text-amber-300 font-semibold">
                ({activeFiltersCount} filtros activos)
              </span>
            )}
          </div>

          {filteredActivities.length === 0 && (
            <div className="glass-card p-8 rounded-3xl text-center border border-white/10 space-y-2">
              <Calendar className="w-8 h-8 text-emerald-400 mx-auto opacity-50" />
              <p className="text-sm font-semibold text-white">No hay actividades que coincidan</p>
              <p className="text-xs text-emerald-200/70">
                Prueba ajustando los filtros o crea una nueva actividad.
              </p>
            </div>
          )}

          {filteredActivities.map(act => {
            const isSelected = act.id === activeActivityId;
            const badge = getTypeBadge(act.type);

            // Budget & Merma calculations for this activity
            const actReceipts = receipts.filter(r => r.activityId === act.id && r.status === 'approved');
            const actCollected = actReceipts.reduce((sum, r) => sum + r.amount, 0);
            const actRemaining = Math.max(0, act.estimatedBudget - actCollected);
            const actPercent = act.estimatedBudget > 0 ? Math.min(100, Math.round((actCollected / act.estimatedBudget) * 100)) : 100;
            const actFunded = actCollected >= act.estimatedBudget;

            return (
              <div
                key={act.id}
                onClick={() => {
                  soundFX.playClick();
                  setActiveActivityId(act.id);
                }}
                className={`glass-card p-4 rounded-3xl cursor-pointer transition-all border relative group ${
                  isSelected
                    ? 'border-amber-400 bg-gradient-to-br from-emerald-950/90 via-pine-950/90 to-pine-900/90 shadow-xl shadow-amber-500/15 scale-[1.01]'
                    : 'border-white/10 hover:border-amber-400/40 bg-black/40 hover:bg-black/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                    {act.novenaDay && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                        🕯️ Día {act.novenaDay}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-emerald-300/80 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> {act.date} · {act.time}
                    </span>
                    {canManageActivities && (
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(act);
                          }}
                          title="Editar actividad"
                          className="p-1 rounded-lg hover:bg-white/10 text-amber-300 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteActivityClick(act.id, act.title);
                          }}
                          title="Eliminar actividad"
                          className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug line-clamp-1">
                  {act.title}
                </h3>
                <p className="text-xs text-emerald-200/70 mt-1 line-clamp-2">
                  {act.description}
                </p>

                {/* ── Barra de Merma del Presupuesto ── */}
                <div className="mt-2.5 p-2 rounded-xl bg-black/50 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-amber-300 font-bold">
                      Abonado: ${actCollected.toLocaleString('es-CO')} ({actPercent}%)
                    </span>
                    {actFunded ? (
                      <span className="text-emerald-400 font-black flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-amber-400" /> ¡100% Cubierto!
                      </span>
                    ) : (
                      <span className="text-rose-300 font-semibold">
                        Merma: -${actRemaining.toLocaleString('es-CO')}
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        actFunded
                          ? 'bg-gradient-to-r from-emerald-400 to-amber-300'
                          : 'bg-gradient-to-r from-amber-400 to-emerald-400'
                      }`}
                      style={{ width: `${actPercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-300/80">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    <span className="truncate">{act.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-emerald-300/70 flex items-center gap-1" title="Personas confirmadas">
                      <Users className="w-3 h-3 text-amber-300" /> {getActivityHeadcount(act)}
                    </span>
                    <span className="font-bold text-amber-300 font-mono">
                      ${act.estimatedBudget.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Detailed Activity View */}
        {selectedActivity ? (
          <div className="lg:col-span-7 glass-card rounded-3xl p-5 sm:p-7 border border-amber-400/30 shadow-2xl relative space-y-5">
            {/* 1. Header info */}
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getTypeBadge(selectedActivity.type).color}`}>
                  {getTypeBadge(selectedActivity.type).label}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    selectedActivity.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                  }`}
                >
                  {selectedActivity.status === 'completed' ? '✓ Realizada' : '🗓️ Programada'}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-white">
                {selectedActivity.title}
              </h3>

              {/* ── CLEAN ORGANIZED ACTION TOOLBAR ── */}
              {/* Row 1: Public / Family Actions */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <button
                  type="button"
                  onClick={handleOpenRsvpModal}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isAttending
                      ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-white/10 hover:bg-white/20 border border-white/15 text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {isAttending
                    ? `✓ Asistiré ${userRsvp?.guestCount ? `(+${userRsvp.guestCount})` : ''}`
                    : '📅 Confirmar Asistencia (RSVP)'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAporteAmount(Math.min(50000, selectedActivity.estimatedBudget || 50000));
                    setShowAporteModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 shadow-md shadow-amber-500/20 hover:scale-102 transition-all cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  Abonar a esta Actividad
                </button>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-400/30 text-emerald-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Compartir
                </button>
              </div>

              {/* Row 2: Organizer Control Panel (Admin only) */}
              {canManageActivities && (
                <div className="mt-3.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                      Panel del Organizador
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => openEditModal(selectedActivity)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(selectedActivity)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        selectedActivity.status === 'completed'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-400/30 hover:bg-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30 hover:bg-emerald-500/30'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      {selectedActivity.status === 'completed' ? 'Marcar Pendiente' : 'Marcar Realizada'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteActivityClick(selectedActivity.id, selectedActivity.title)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Details Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/40 p-3 rounded-2xl border border-white/5 text-xs">
              <div>
                <span className="text-[10px] text-emerald-300/70 block uppercase font-bold">Fecha</span>
                <span className="font-semibold text-white">{selectedActivity.date}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300/70 block uppercase font-bold">Hora</span>
                <span className="font-semibold text-amber-300">{selectedActivity.time}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300/70 block uppercase font-bold">Lugar</span>
                <span className="font-semibold text-white truncate block">{selectedActivity.location}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300/70 block uppercase font-bold">Presupuesto</span>
                <span className="font-semibold text-emerald-300">${selectedActivity.estimatedBudget.toLocaleString('es-CO')}</span>
              </div>
            </div>

            {/* ── Barra de Merma y Presupuesto de la Actividad ── */}
            {(() => {
              const selRemaining = Math.max(0, selectedActivity.estimatedBudget - activityTotalCollected);
              const selFunded = activityTotalCollected >= selectedActivity.estimatedBudget;

              return (
                <div className="glass-card p-4 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/10 via-emerald-950/40 to-pine-950/80 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-amber-300 flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5" /> Presupuesto y Merma del Saldo Pendiente
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-xl font-bold font-mono text-white">
                          ${activityTotalCollected.toLocaleString('es-CO')}
                        </span>
                        <span className="text-xs text-emerald-300/80 font-mono">
                          recaudados de ${selectedActivity.estimatedBudget.toLocaleString('es-CO')} COP ({activityProgress}%)
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      {selFunded ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-400/50 shadow-md">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> ¡Presupuesto 100% Cubierto! 🏆
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-300 bg-berry-950/80 px-3 py-1 rounded-xl border border-rose-400/40 font-mono">
                          Saldo por cubrir: ${selRemaining.toLocaleString('es-CO')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        selFunded
                          ? 'bg-gradient-to-r from-emerald-400 to-amber-300'
                          : 'bg-gradient-to-r from-amber-400 to-emerald-400'
                      }`}
                      style={{ width: `${activityProgress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-emerald-200/70 pt-0.5">
                    <span>
                      {activityReceipts.length} aporte{activityReceipts.length === 1 ? '' : 's'} registrado{activityReceipts.length === 1 ? '' : 's'} para este evento
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAporteAmount(selRemaining > 0 ? selRemaining : 50000);
                        setShowAporteModal(true);
                      }}
                      className="text-amber-300 hover:text-amber-200 font-bold underline cursor-pointer"
                    >
                      Abonar a esta actividad →
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Sub-tabs for Details */}
            <div className="flex items-center gap-1.5 border-b border-white/10 pb-2 overflow-x-auto">
              {[
                { id: 'info', label: 'Descripción & Asistentes', icon: Users },
                { id: 'itinerary', label: `Itinerario (${selectedActivity.itinerary.length})`, icon: Clock },
                { id: 'tasks', label: `Tareas (${selectedActivity.tasks.length})`, icon: ListTodo },
                { id: 'potluck', label: `Comidas / Potluck (${selectedActivity.potluckDishes.length})`, icon: UtensilsCrossed },
                { id: 'budget', label: `💰 Presupuesto & Aportes (${activityReceipts.length})`, icon: Wallet },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeDetailTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      setActiveDetailTab(tab.id as any);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm'
                        : 'text-emerald-200/70 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Info & Attendees */}
            {activeDetailTab === 'info' && (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed bg-black/20 p-4 rounded-2xl border border-white/5">
                  {selectedActivity.description}
                </p>

                {/* Attendees list */}
                <div>
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> Asistencia Confirmada ({getActivityHeadcount(selectedActivity)} personas)
                    </h4>
                    {(() => {
                      const confirmed = selectedActivity.rsvps?.filter(r => r.status === 'confirmed') || [];
                      const totalGuests = confirmed.reduce((acc, r) => acc + (r.guestCount || 0), 0);
                      return totalGuests > 0 ? (
                        <span className="text-[11px] text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20 font-medium">
                          {selectedActivity.attendees.length} familiares + {totalGuests} acompañantes
                        </span>
                      ) : null;
                    })()}
                  </div>
                  {selectedActivity.attendees.length === 0 ? (
                    <p className="text-xs text-emerald-300/50 italic bg-black/20 p-3 rounded-xl border border-white/5">
                      Aún nadie ha confirmado asistencia. ¡Sé el primero en confirmar arriba!
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedActivity.attendees.map(userId => {
                        const user = members.find(m => m.id === userId);
                        const rsvp = selectedActivity.rsvps?.find(r => r.userId === userId && r.status === 'confirmed');
                        if (!user) return null;
                        return (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-7 h-7 rounded-full object-cover border border-amber-400 flex-shrink-0"
                              />
                              <div className="truncate">
                                <span className="text-white font-medium block truncate">{user.name}</span>
                                {rsvp?.dishContribution && (
                                  <span className="text-[10px] text-amber-300/90 block truncate font-medium">
                                    🍲 {rsvp.dishContribution}
                                  </span>
                                )}
                                {rsvp?.note && (
                                  <span className="text-[10px] text-emerald-300/70 block truncate italic">
                                    "{rsvp.note}"
                                  </span>
                                )}
                              </div>
                            </div>
                            {rsvp && rsvp.guestCount > 0 ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold flex-shrink-0 ml-2">
                                +{rsvp.guestCount} {rsvp.guestCount === 1 ? 'invitado' : 'invitados'}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 text-[10px] font-semibold flex-shrink-0 ml-2">
                                Solo(a)
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Interactive Itinerary (Organizador exclusivo para agregar/eliminar) */}
            {activeDetailTab === 'itinerary' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-emerald-200/80">
                    Cronograma de la celebración. Creado por el organizador; tachable por el responsable.
                  </p>
                  {canManageActivities && (
                    <button
                      type="button"
                      onClick={() => setShowAddItineraryModal(true)}
                      className="flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Agregar Ítem
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {selectedActivity.itinerary.length === 0 && (
                    <p className="text-xs text-emerald-300/50 italic text-center py-4">
                      No hay momentos en el itinerario aún.
                    </p>
                  )}
                  {selectedActivity.itinerary.map(item => {
                    const resp = members.find(m => m.id === item.responsibleId);
                    const canToggle =
                      canManageActivities || (currentUser?.id && item.responsibleId === currentUser.id);

                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                          item.completed
                            ? 'bg-emerald-950/40 border-emerald-500/40 opacity-75'
                            : 'bg-black/30 border-white/10'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            type="button"
                            onClick={() => toggleItineraryItem(selectedActivity.id, item.id)}
                            title={canToggle ? 'Alternar completado' : 'Solo organizador o responsable'}
                            className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                              item.completed
                                ? 'bg-emerald-500 border-emerald-400 text-pine-950'
                                : 'border-amber-400/50 hover:border-amber-300'
                            }`}
                          >
                            {item.completed && <CheckCircle2 className="w-4 h-4 fill-current" />}
                          </button>

                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-amber-300 font-mono">
                                {item.time}
                              </span>
                              {resp && (
                                <span className="text-[10px] text-emerald-300/80 flex items-center gap-1">
                                  Resp: {resp.name}
                                </span>
                              )}
                            </div>
                            <h5
                              className={`text-xs font-bold ${
                                item.completed ? 'line-through text-emerald-300/60' : 'text-white'
                              }`}
                            >
                              {item.title}
                            </h5>
                            {item.description && (
                              <p className="text-[11px] text-emerald-200/70 mt-0.5">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {canManageActivities && (
                          <button
                            type="button"
                            onClick={() => deleteItineraryItem(selectedActivity.id, item.id)}
                            title="Eliminar del itinerario"
                            className="p-1 text-rose-400/60 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 3: Tasks */}
            {activeDetailTab === 'tasks' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-emerald-200/80">
                    Tareas y preparativos. Solo el organizador o el familiar asignado puede marcarlas.
                  </p>
                  {canManageActivities && (
                    <button
                      type="button"
                      onClick={() => setShowAddTaskModal(true)}
                      className="flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Agregar Tarea
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {selectedActivity.tasks.length === 0 && (
                    <p className="text-xs text-emerald-300/50 italic text-center py-4">
                      No hay tareas asignadas para esta actividad.
                    </p>
                  )}
                  {selectedActivity.tasks.map(task => {
                    const assigned = members.find(m => m.id === task.assignedToId);
                    const canToggle =
                      canManageActivities || (currentUser?.id && task.assignedToId === currentUser.id);

                    return (
                      <div
                        key={task.id}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          task.completed
                            ? 'bg-emerald-950/40 border-emerald-500/40 opacity-70'
                            : 'bg-black/30 border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            type="button"
                            onClick={() => toggleActivityTask(selectedActivity.id, task.id)}
                            title={canToggle ? 'Alternar tarea' : 'Solo organizador o responsable'}
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                              task.completed
                                ? 'bg-emerald-500 border-emerald-400 text-pine-950'
                                : 'border-amber-400/50 hover:border-amber-300'
                            }`}
                          >
                            {task.completed && <CheckCircle2 className="w-4 h-4" />}
                          </button>
                          <div>
                            <p
                              className={`text-xs font-semibold ${
                                task.completed ? 'line-through text-emerald-300/60' : 'text-white'
                              }`}
                            >
                              {task.title}
                            </p>
                            {assigned && (
                              <span className="text-[10px] text-emerald-300/70">
                                Asignado a: {assigned.name}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                              task.priority === 'alta'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                                : task.priority === 'media'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                            }`}
                          >
                            {task.priority}
                          </span>

                          {canManageActivities && (
                            <button
                              type="button"
                              onClick={() => deleteActivityTask(selectedActivity.id, task.id)}
                              title="Eliminar tarea"
                              className="p-1 text-rose-400/60 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 4: Potluck / Organizador de Comidas */}
            {activeDetailTab === 'potluck' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-emerald-200/80">
                    Evita que 5 personas lleven lo mismo. ¡Aparta tu plato o sugiere uno nuevo!
                  </p>
                  {!isGuest && (
                    <button
                      type="button"
                      onClick={() => setShowAddDish(true)}
                      className="flex items-center gap-1 text-xs font-bold text-amber-300 hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Agregar Plato
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedActivity.potluckDishes.length === 0 && (
                    <div className="col-span-full text-center py-6 text-xs text-emerald-300/50 italic">
                      Aún no hay platos sugeridos en la lista. ¡Agrega el primero!
                    </div>
                  )}

                  {selectedActivity.potluckDishes.map(dish => {
                    const assigned = members.find(m => m.id === dish.assignedToId);
                    const isMine = currentUser ? dish.assignedToId === currentUser.id : false;

                    return (
                      <div
                        key={dish.id}
                        className={`p-3 rounded-2xl border transition-all ${
                          dish.assignedToId
                            ? 'bg-emerald-950/40 border-emerald-500/30'
                            : 'bg-black/40 border-dashed border-amber-400/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wide">
                              {dish.category} · {dish.servings} porciones
                            </span>
                            <h5 className="text-xs font-bold text-white mt-0.5">
                              {dish.name}
                            </h5>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xl">
                              {dish.category === 'postre'
                                ? '🍮'
                                : dish.category === 'bebida'
                                ? '🍷'
                                : dish.category === 'pasaboca'
                                ? '🥟'
                                : dish.category === 'desechable'
                                ? '🍽️'
                                : '🍗'}
                            </span>
                            {canManageActivities && (
                              <button
                                type="button"
                                onClick={() => deletePotluckDish(selectedActivity.id, dish.id)}
                                title="Eliminar plato"
                                className="p-1 text-rose-400/60 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                          <span className="text-[11px] text-emerald-200/70">
                            {assigned ? (
                              <span className="text-emerald-300 font-semibold flex items-center gap-1">
                                ✓ Lleva: {isMine ? 'Tú (Apartado)' : assigned.name}
                              </span>
                            ) : (
                              <span className="text-rose-300 font-medium">⚠️ Nadie lo lleva aún</span>
                            )}
                          </span>

                          <button
                            type="button"
                            onClick={() => claimPotluckDish(selectedActivity.id, dish.id)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all active:scale-95 cursor-pointer ${
                              isMine
                                ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-400/30'
                                : assigned
                                ? 'bg-white/5 text-emerald-200/60 hover:bg-white/10'
                                : 'bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 shadow-sm'
                            }`}
                          >
                            {isMine ? 'Soltar plato' : assigned ? 'Cambiar' : '¡Yo lo llevo! 🙋‍♂️'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 5: Presupuesto & Aportes de la Actividad (NUEVO SISTEMA) */}
            {activeDetailTab === 'budget' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/40 p-4 rounded-2xl border border-amber-400/20">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-300 block">
                      Recaudación para esta celebración
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-xl sm:text-2xl font-bold font-cinzel text-amber-300">
                        ${activityTotalCollected.toLocaleString('es-CO')}
                      </span>
                      <span className="text-xs text-emerald-300/80">
                        de ${selectedActivity.estimatedBudget.toLocaleString('es-CO')} COP estimados
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAporteAmount(50000);
                      setShowAporteModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:scale-102 transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <DollarSign className="w-4 h-4" /> Registrar Abono a este Evento
                  </button>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-emerald-200/80">
                    <span>Meta financiada</span>
                    <span className="text-amber-300 font-mono">{activityProgress}%</span>
                  </div>
                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${activityProgress}%` }}
                    />
                  </div>
                </div>

                {/* Receipts list for this activity */}
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ReceiptIcon className="w-3.5 h-3.5" /> Aportes Realizados para {selectedActivity.title} ({activityReceipts.length})
                  </h5>

                  {activityReceipts.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-black/20 border border-white/5 text-center text-xs text-emerald-300/60">
                      Aún no hay aportes asignados a esta actividad. ¡Sé el primero en abonar!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activityReceipts.map(rec => (
                        <div
                          key={rec.id}
                          className="glass-card p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{rec.userName}</span>
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                                {rec.method}
                              </span>
                            </div>
                            <span className="text-[10px] text-emerald-300/60 font-mono">
                              {rec.date} {rec.notes && `· ${rec.notes}`}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="font-bold font-cinzel text-amber-300 block">
                              +${rec.amount.toLocaleString('es-CO')}
                            </span>
                            <span
                              className={`text-[10px] font-semibold ${
                                rec.status === 'approved'
                                  ? 'text-emerald-400'
                                  : rec.status === 'pending'
                                  ? 'text-amber-300'
                                  : 'text-rose-400'
                              }`}
                            >
                              {rec.status === 'approved' ? '✓ Aprobado' : rec.status === 'pending' ? '⏳ Pendiente' : '✗ Rechazado'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Modal: Crear Actividad */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg glass-card border border-amber-400/40 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-lg font-bold font-cinzel text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> Crear Actividad Navideña
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-emerald-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-4 text-xs">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">
                  Nombre de la Actividad *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Novena Día 2 & Chocolate caliente"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white placeholder-emerald-400/40 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">
                    Tipo de Evento
                  </label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as ActivityType)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="novena">🕯️ Novena</option>
                    <option value="dinner">🍗 Cena Navideña</option>
                    <option value="velitas">🕯️ Día de Velitas</option>
                    <option value="charity">🤝 Navidad Solidaria</option>
                    <option value="trip">🚌 Paseo / Alumbrados</option>
                    <option value="party">🥳 Fiesta de Fin de Año</option>
                    <option value="custom">🎄 Tradición Personalizada</option>
                  </select>
                </div>

                {newType === 'novena' && (
                  <div>
                    <label className="block text-emerald-300 font-bold mb-1">
                      Día de la Novena
                    </label>
                    <select
                      value={novenaDay}
                      onChange={e => setNovenaDay(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
                        <option key={d} value={d}>Día {d} ({15 + d} de Dic)</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Fecha</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Hora</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Lugar / Ubicación</label>
                  <input
                    type="text"
                    placeholder="Casa de Tía Sofía, Salón comunal..."
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Presupuesto Estimado (COP)</label>
                  <input
                    type="number"
                    step="10000"
                    value={newBudget}
                    onChange={e => setNewBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Descripción</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre lecturas, música, código de vestimenta..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-emerald-300 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 font-bold shadow-lg shadow-amber-500/30 cursor-pointer"
                >
                  Guardar Actividad 🎄
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Actividad */}
      {showEditModal && selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg glass-card border border-amber-400/40 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-lg font-bold font-cinzel text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" /> Editar Actividad Navideña
              </h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-emerald-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateActivitySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">
                  Nombre de la Actividad *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">
                    Tipo de Evento
                  </label>
                  <select
                    value={editType}
                    onChange={e => setEditType(e.target.value as ActivityType)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="novena">🕯️ Novena</option>
                    <option value="dinner">🍗 Cena Navideña</option>
                    <option value="velitas">🕯️ Día de Velitas</option>
                    <option value="charity">🤝 Navidad Solidaria</option>
                    <option value="trip">🚌 Paseo / Alumbrados</option>
                    <option value="party">🥳 Fiesta de Fin de Año</option>
                    <option value="custom">🎄 Tradición Personalizada</option>
                  </select>
                </div>

                {editType === 'novena' && (
                  <div>
                    <label className="block text-emerald-300 font-bold mb-1">
                      Día de la Novena
                    </label>
                    <select
                      value={editNovenaDay}
                      onChange={e => setEditNovenaDay(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
                        <option key={d} value={d}>Día {d} ({15 + d} de Dic)</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Fecha</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={e => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Hora</label>
                  <input
                    type="time"
                    value={editTime}
                    onChange={e => setEditTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Lugar / Ubicación</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={e => setEditLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Presupuesto Estimado (COP)</label>
                  <input
                    type="number"
                    step="10000"
                    value={editBudget}
                    onChange={e => setEditBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl text-emerald-300 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 font-bold shadow-lg shadow-amber-500/30 cursor-pointer"
                >
                  Guardar Cambios 💾
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Agregar Ítem al Itinerario (SOLO ORGANIZADOR) */}
      {showAddItineraryModal && selectedActivity && canManageActivities && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm glass-card border border-amber-400/40 rounded-3xl p-5 shadow-2xl">
            <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Nuevo Ítem de Itinerario
            </h4>
            <form onSubmit={handleAddItinerarySubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Hora</label>
                  <input
                    type="time"
                    required
                    value={itinTime}
                    onChange={e => setItinTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Responsable</label>
                  <select
                    value={itinRespId}
                    onChange={e => setItinRespId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white"
                  >
                    <option value="">(Sin asignar)</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Título del momento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Rezo de los Gozos, Reparto de Natilla..."
                  value={itinTitle}
                  onChange={e => setItinTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Detalle o Notas</label>
                <input
                  type="text"
                  placeholder="Instrucciones breves..."
                  value={itinDesc}
                  onChange={e => setItinDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddItineraryModal(false)}
                  className="px-3 py-1.5 text-emerald-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-500 text-pine-950 font-bold cursor-pointer"
                >
                  Agregar al Cronograma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Agregar Tarea */}
      {showAddTaskModal && selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm glass-card border border-amber-400/40 rounded-3xl p-5 shadow-2xl">
            <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-amber-400" /> Nueva Tarea
            </h4>
            <form onSubmit={handleAddTaskSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">Descripción de la Tarea *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Comprar velitas de colores, Traer equipo de sonido..."
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Prioridad</label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta ⚠️</option>
                  </select>
                </div>
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Asignar a</label>
                  <select
                    value={taskAssignedId}
                    onChange={e => setTaskAssignedId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white"
                  >
                    <option value="">(Sin asignar)</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-3 py-1.5 text-emerald-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-500 text-pine-950 font-bold cursor-pointer"
                >
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Agregar Plato Potluck */}
      {showAddDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm glass-card border border-amber-400/40 rounded-3xl p-5 shadow-2xl">
            <h4 className="text-base font-bold text-white mb-3">Agregar Plato o Insumo</h4>
            <form onSubmit={handleAddDishSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">Nombre del plato o elemento</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Bandeja de natilla, 40 buñuelos, gaseosas..."
                  value={dishName}
                  onChange={e => setDishName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>
              <div>
                <label className="block text-emerald-300 font-bold mb-1">Categoría</label>
                <select
                  value={dishCategory}
                  onChange={e => setDishCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white"
                >
                  <option value="postre">🍮 Postre / Dulce</option>
                  <option value="pasaboca">🥟 Pasabocas / Buñuelos</option>
                  <option value="plato">🍗 Plato Fuerte / Ensalada</option>
                  <option value="bebida">🍷 Bebidas / Vino</option>
                  <option value="desechable">🍽️ Desechables / Menaje</option>
                </select>
              </div>
              <div>
                <label className="block text-emerald-300 font-bold mb-1">Porciones estimadas</label>
                <input
                  type="number"
                  value={dishServings}
                  onChange={e => setDishServings(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDish(false)}
                  className="px-3 py-1.5 text-emerald-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-500 text-pine-950 font-bold cursor-pointer"
                >
                  Agregar a la lista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Abonar a esta Actividad / Cena */}
      {showAporteModal && selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm glass-card border border-amber-400/50 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                Abonar a: {selectedActivity.title}
              </h4>
              <button
                type="button"
                onClick={() => setShowAporteModal(false)}
                className="text-emerald-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAporteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">
                  Monto a Abonar (COP) *
                </label>
                <input
                  type="number"
                  step="5000"
                  required
                  value={aporteAmount}
                  onChange={e => setAporteAmount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white font-mono font-bold text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">
                  Método de Pago
                </label>
                <select
                  value={aporteMethod}
                  onChange={e => setAporteMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white"
                >
                  <option value="nequi">🟣 Nequi</option>
                  <option value="daviplata">🔴 Daviplata</option>
                  <option value="efectivo">💵 Efectivo al Tesorero</option>
                  <option value="transferencia">🏦 Transferencia Bancaria</option>
                  <option value="tarjeta">💳 Tarjeta / Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">
                  Nota o Concepto
                </label>
                <input
                  type="text"
                  placeholder={`Ej: Cuota de ${currentUser?.name || 'Familiar'} para ${selectedActivity.title}`}
                  value={aporteNotes}
                  onChange={e => setAporteNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAporteModal(false)}
                  className="px-3 py-1.5 text-emerald-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 font-bold shadow-md cursor-pointer"
                >
                  Confirmar Abono 🎁
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Confirmación de Asistencia (RSVP) Familiar */}
      {showRsvpModal && selectedActivity && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card max-w-md w-full rounded-3xl p-6 border border-amber-400/40 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Confirmación de Asistencia (RSVP)
                </span>
                <h3 className="text-lg font-bold font-cinzel text-white">
                  {selectedActivity.title}
                </h3>
                <p className="text-xs text-emerald-300/80">
                  {selectedActivity.date} · {selectedActivity.time} · {selectedActivity.location}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRsvpModal(false)}
                className="text-white/60 hover:text-white text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitRsvpForm} className="space-y-4 text-xs">
              {/* Asistencia Toggle */}
              <div>
                <label className="block text-emerald-300 font-bold mb-2">
                  ¿Estarás presente en esta celebración? *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRsvpStatus('confirmed')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      rsvpStatus === 'confirmed'
                        ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200 font-bold shadow-lg shadow-emerald-500/10'
                        : 'bg-black/30 border-white/10 text-white/70 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xl block mb-1">🎅</span>
                    <span>¡Sí, asistiré!</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpStatus('declined')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      rsvpStatus === 'declined'
                        ? 'bg-rose-600/30 border-rose-400 text-rose-200 font-bold shadow-lg shadow-rose-500/10'
                        : 'bg-black/30 border-white/10 text-white/70 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xl block mb-1">😢</span>
                    <span>No podré asistir</span>
                  </button>
                </div>
              </div>

              {rsvpStatus === 'confirmed' && (
                <>
                  {/* Guest count selector */}
                  <div>
                    <label className="block text-emerald-300 font-bold mb-1">
                      ¿Cuántos acompañantes vienen contigo?
                    </label>
                    <p className="text-[11px] text-white/60 mb-2">
                      (No te cuentes a ti; indícanos cuántos familiares, hijos o invitados adicionales te acompañan)
                    </p>
                    <div className="flex items-center gap-2">
                      {[0, 1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRsvpGuests(num)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            rsvpGuests === num
                              ? 'bg-amber-400 text-pine-950 border-amber-300 shadow-md scale-105'
                              : 'bg-black/40 text-emerald-200 border-white/15 hover:border-amber-400/40'
                          }`}
                        >
                          {num === 0 ? 'Solo yo' : `+${num}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dish or contribution note */}
                  <div>
                    <label className="block text-emerald-300 font-bold mb-1">
                      ¿Qué plato, bebida o pasabocas piensas llevar? (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Natilla casera, buñuelos calientes, gaseosa 3L..."
                      value={rsvpDish}
                      onChange={e => setRsvpDish(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white placeholder-white/40 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* Note to host */}
                  <div>
                    <label className="block text-emerald-300 font-bold mb-1">
                      Mensaje o nota para el anfitrión (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Llego sobre las 7:30pm con los niños..."
                      value={rsvpNote}
                      onChange={e => setRsvpNote(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white placeholder-white/40 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRsvpModal(false)}
                  className="px-3.5 py-2 text-emerald-300 hover:text-white cursor-pointer font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 font-bold shadow-md hover:scale-102 transition-all cursor-pointer"
                >
                  {rsvpStatus === 'confirmed' ? 'Guardar Asistencia 🎄' : 'Registrar Respuesta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
