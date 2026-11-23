import React, { useMemo } from 'react';
import {
  CalendarDays,
  WalletCards,
  Gift,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  Clock,
  PlusCircle,
  Vote,
  Share2,
  Flame,
  Gamepad2,
} from 'lucide-react';
import { useChristmas } from '../../context/ChristmasContext';
import { CountdownBanner } from '../CountdownBanner';
import { soundFX } from '../../utils/audio';

export const DashboardModule: React.FC = () => {
  const {
    currentUser,
    community,
    members,
    activities,
    financialStats,
    contributions,
    secretSanta,
    setActiveTab,
    showAlert,
  } = useChristmas();

  // Find user's contribution
  const myContribution = contributions.find(c => c.userId === currentUser?.id) || {
    userId: currentUser?.id || 'usr-anon',
    targetAmount: community?.quotaPerPerson || 150000,
    paidAmount: 0,
    status: 'pending' as const,
  };

  // Upcoming activities sorted by date
  const upcomingActivities = activities
    .filter(a => a.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextActivity = upcomingActivities[0];

  // My secret santa status
  const mySecretSantaAssignment = secretSanta.assignments?.find(
    a => a.giverId === currentUser?.id
  );

  const smartAction = useMemo(() => {
    const today = new Date();
    const month = today.getMonth(); // 11 is December
    const day = today.getDate();

    // 1. Is it Novena time? (Dec 16 - 24)
    if (month === 11 && day >= 16 && day <= 24) {
      const novenaDay = day - 15;
      return {
        icon: '🕯️',
        badge: 'Novena de Aguinaldos',
        timing: `Día ${novenaDay} de 9`,
        title: `¡Hoy rezamos el Día ${novenaDay} de la Novena!`,
        description: `Reúnete en familia para rezar las oraciones completas, los gozos y cantar villancicos tradicionales.`,
        buttonLabel: `Rezar Día ${novenaDay} de la Novena`,
        action: () => {
          soundFX.playJingleBell();
          setActiveTab('novena');
        },
      };
    }

    // 2. Pending Quota?
    const pendingAmount = myContribution.targetAmount - myContribution.paidAmount;
    if (currentUser && myContribution.status !== 'paid' && pendingAmount > 0) {
      return {
        icon: '💰',
        badge: 'Cuota Familiar Pendiente',
        timing: 'Prioridad Financiera',
        title: `Tienes un saldo pendiente de $${pendingAmount.toLocaleString('es-CO')} COP`,
        description: `Tu aporte puntual permite asegurar los insumos de la cena navideña, regalos y sorpresas familiares.`,
        buttonLabel: 'Abonar / Enviar Comprobante',
        action: () => {
          soundFX.playClick();
          setActiveTab('finances');
        },
      };
    }

    // 3. Upcoming activity RSVP?
    if (nextActivity && currentUser && !nextActivity.attendees.includes(currentUser.id)) {
      return {
        icon: '🗓️',
        badge: 'Confirmación de Asistencia',
        timing: `Próximo evento: ${nextActivity.date}`,
        title: `¿Asistirás a "${nextActivity.title}"?`,
        description: `Confirma tu asistencia y la de tus acompañantes para que el anfitrión prepare la cena y logística.`,
        buttonLabel: 'Confirmar Asistencia (RSVP)',
        action: () => {
          soundFX.playClick();
          setActiveTab('activities');
        },
      };
    }

    // 4. Secret Santa wishlist / receiver?
    if (mySecretSantaAssignment) {
      const receiver = members.find(m => m.id === mySecretSantaAssignment.receiverId);
      return {
        icon: '🎁',
        badge: 'Amigo Secreto Asignado',
        timing: 'Sorteo Activo',
        title: `Tu amigo secreto es: ${receiver?.name || 'Familiar'}`,
        description: `Revisa su lista de deseos, sugerencias de regalo y tallas para preparar su regalo sorpresa.`,
        buttonLabel: 'Ver Lista de Deseos',
        action: () => {
          soundFX.playJingleBell();
          setActiveTab('secretsanta');
        },
      };
    }

    // Default: Holiday fun
    return {
      icon: '🎉',
      badge: 'Celebración Familiar',
      timing: 'Navidad 2026',
      title: '¡Todo al día y listo para compartir en familia!',
      description: 'Disfruta de la nueva Balotera Virtual de Bingo, los retos de aguinaldos o pregúntale a Santa IA.',
      buttonLabel: 'Juegos y Balotera de Bingo',
      action: () => {
        soundFX.playClick();
        setActiveTab('games');
      },
    };
  }, [currentUser, myContribution, nextActivity, mySecretSantaAssignment, members, setActiveTab]);

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Countdown Banner */}
      <CountdownBanner />

      {/* 🌟 Acción Recomendada para Ti Hoy (Smart Card) */}
      <div className="relative overflow-hidden rounded-3xl glass-card border border-amber-400/40 p-5 sm:p-6 shadow-xl bg-gradient-to-r from-amber-950/40 via-pine-900/60 to-emerald-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-pine-950 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20 flex-shrink-0">
              {smartAction.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                  {smartAction.badge}
                </span>
                <span className="text-xs text-white/50">{smartAction.timing}</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold font-cinzel text-white mt-1">
                {smartAction.title}
              </h4>
              <p className="text-xs text-emerald-200/80 mt-0.5 line-clamp-2">
                {smartAction.description}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
            <button
              onClick={smartAction.action}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-pine-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{smartAction.buttonLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Financial Progress Card (Exact format requested by user) */}
      <div className="relative overflow-hidden rounded-3xl glass-card border border-amber-400/30 p-6 sm:p-7 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-300">
                Fondo Comunitario de Navidad
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-white mt-1">
              {community.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40">
              <TrendingUp className="w-3.5 h-3.5" /> En progreso
            </span>
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveTab('finances');
              }}
              className="text-xs text-emerald-300 hover:text-white flex items-center gap-1 font-semibold underline underline-offset-4"
            >
              Ver balance completo <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Big numbers */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl sm:text-4xl font-black font-cinzel text-amber-400 drop-shadow-md">
                ${financialStats.totalCollected.toLocaleString('es-CO')}
              </span>
              <span className="text-sm sm:text-base text-emerald-200/80 font-medium">
                Recaudado de ${financialStats.totalBudgetGoal.toLocaleString('es-CO')} {community.currency}
              </span>
            </div>

            {/* Progress Bar with glowing candy-stripe style */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {financialStats.progressPercentage}% recaudado
                </span>
                <span className="text-rose-300">
                  Faltan ${financialStats.remainingToCollect.toLocaleString('es-CO')}
                </span>
              </div>
              <div className="h-4 w-full bg-black/50 rounded-full p-0.5 border border-amber-500/30 overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-300 transition-all duration-1000 shadow-lg shadow-amber-500/40 relative"
                  style={{ width: `${financialStats.progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse-subtle" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-emerald-950/50 border border-emerald-500/20 rounded-2xl p-3 text-center">
              <span className="text-xs text-emerald-300/80 font-medium block">Participantes</span>
              <span className="text-lg font-black text-white">{financialStats.totalContributors} personas</span>
            </div>
            <div className="bg-berry-950/50 border border-rose-500/20 rounded-2xl p-3 text-center">
              <span className="text-xs text-rose-300/80 font-medium block">Aportes pendientes</span>
              <span className="text-lg font-black text-rose-300">{financialStats.pendingContributorsCount} personas</span>
            </div>
          </div>
        </div>

        {/* Quick actions row */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-2.5">
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('finances');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:scale-102 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> Registrar Abono / Pago
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('activities');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800/40 hover:bg-emerald-800/60 border border-emerald-400/30 text-white font-semibold text-xs transition-all active:scale-95"
          >
            <CalendarDays className="w-4 h-4 text-emerald-400" /> Crear Actividad
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('secretsanta');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-berry-900/40 hover:bg-berry-900/60 border border-rose-400/30 text-white font-semibold text-xs transition-all active:scale-95"
          >
            <Gift className="w-4 h-4 text-rose-400" /> Amigo Secreto
          </button>

          <button
            onClick={() => {
              soundFX.playJingleBell();
              setActiveTab('santa-ai');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs shadow-md hover:scale-102 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> Consultar Santa IA
          </button>
        </div>
      </div>

      {/* 3. Personal Status & Next Activity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Financial Summary */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-emerald-500/20 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <WalletCards className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Mi Estado Personal</h4>
                <p className="text-xs text-emerald-300/70">{currentUser?.name || 'Invitado'}</p>
              </div>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                myContribution.status === 'paid'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
              }`}
            >
              {myContribution.status === 'paid' ? 'Al día 🎁' : 'Pendiente ⏳'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-black/30 p-3.5 rounded-2xl border border-white/5">
            <div>
              <span className="text-[11px] text-emerald-300/70 block">Tu cuota asignada:</span>
              <span className="text-lg font-bold text-white">
                ${myContribution.targetAmount.toLocaleString('es-CO')}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-emerald-300/70 block">Has aportado:</span>
              <span className="text-lg font-bold text-amber-300">
                ${myContribution.paidAmount.toLocaleString('es-CO')}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-emerald-200/80">
            <span>
              {myContribution.status === 'paid'
                ? '¡Gracias por tu aporte puntual! Ya estás listo para disfrutar.'
                : `Te faltan $${(myContribution.targetAmount - myContribution.paidAmount).toLocaleString('es-CO')} COP.`}
            </span>
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveTab('finances');
              }}
              className="text-amber-300 font-bold hover:underline ml-2"
            >
              Detalles
            </button>
          </div>
        </div>

        {/* Amigo Secreto Widget */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-rose-500/20 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-berry-600/20 border border-rose-400/30 flex items-center justify-center text-rose-400">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{secretSanta.title}</h4>
                <p className="text-xs text-rose-300/70">
                  Presupuesto: ${secretSanta.budgetMin.toLocaleString('es-CO')} - ${secretSanta.budgetMax.toLocaleString('es-CO')}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-berry-500/20 text-rose-300 border border-rose-400/30">
              Sorteado 🤫
            </span>
          </div>

          <p className="text-xs text-emerald-100/90 leading-relaxed bg-black/30 p-3 rounded-2xl border border-white/5">
            {mySecretSantaAssignment ? (
              <>
                ¡Tu amigo secreto ya fue asignado! Descubre sus gustos, tallas favoritas y lista de deseos en privado.
              </>
            ) : (
              'El sorteo está listo. Entra para consultar tu amigo secreto.'
            )}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-amber-300">
              <Sparkles className="w-3.5 h-3.5" /> Entrega el 24 de Diciembre
            </div>
            <button
              onClick={() => {
                soundFX.playMagicReveal();
                setActiveTab('secretsanta');
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-berry-600 to-rose-600 hover:from-berry-500 hover:to-rose-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1"
            >
              Ver mi amigo secreto <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Highlighted Next Activity */}
      {nextActivity && (
        <div className="glass-card rounded-3xl p-6 border border-amber-400/30 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 uppercase">
                  Próxima Actividad Confirmada
                </span>
                <span className="text-xs text-emerald-300/70">
                  {nextActivity.type === 'dinner' ? '🍗 Cena Navideña' : '🕯️ Novena'}
                </span>
              </div>
              <h3 className="text-xl font-bold font-cinzel text-white mt-1">
                {nextActivity.title}
              </h3>
            </div>

            <button
              onClick={() => {
                soundFX.playClick();
                setActiveTab('activities');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-700/40 hover:bg-emerald-700/60 border border-emerald-400/30 text-white font-semibold text-xs flex items-center gap-1.5 self-start md:self-auto"
            >
              Ver detalles e itinerario <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-emerald-100/80 mb-4 max-w-2xl leading-relaxed">
            {nextActivity.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2 text-emerald-200">
              <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{nextActivity.date} · {nextActivity.time}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-200">
              <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span className="truncate">{nextActivity.location}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-200">
              <WalletCards className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Presupuesto: ${nextActivity.estimatedBudget.toLocaleString('es-CO')}</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Additional Highlights: Encuestas y Juegos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Quick Poll Card */}
        <div
          onClick={() => {
            soundFX.playClick();
            setActiveTab('polls');
          }}
          className="glass-card-interactive glass-card rounded-2xl p-4 border border-amber-400/20 cursor-pointer"
        >
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Vote className="w-5 h-5" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Encuesta Activa
            </h4>
          </div>
          <p className="text-xs font-semibold text-emerald-100 line-clamp-2">
            🍗 ¿Qué plato principal prefieren para la Gran Cena del 24?
          </p>
          <span className="text-[11px] text-amber-300/80 font-bold mt-2 inline-block">
            Votar ahora →
          </span>
        </div>

        {/* Potluck / Comidas Card */}
        <div
          onClick={() => {
            soundFX.playClick();
            setActiveTab('activities');
          }}
          className="glass-card-interactive glass-card rounded-2xl p-4 border border-emerald-400/20 cursor-pointer"
        >
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Sparkles className="w-5 h-5" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Organizador de Comidas
            </h4>
          </div>
          <p className="text-xs font-semibold text-emerald-100 line-clamp-2">
            ¿Quién lleva la natilla y los buñuelos? Revisa y aparta tu plato.
          </p>
          <span className="text-[11px] text-emerald-300/80 font-bold mt-2 inline-block">
            Ver asignaciones de comida →
          </span>
        </div>

        {/* WhatsApp Share Card */}
        <div
          onClick={() => {
            soundFX.playJingleBell();
            const text = `🎄 ¡Saludos familia! Los invito a nuestra plataforma navideña ${community.name}. Código de acceso: ${community.inviteCode}`;
            if (navigator.clipboard) {
              navigator.clipboard.writeText(text);
              showAlert('¡Mensaje de invitación copiado al portapapeles! Puedes pegarlo en el grupo de WhatsApp.', 'Invitación Copiada', 'success');
            }
          }}
          className="glass-card-interactive glass-card rounded-2xl p-4 border border-rose-400/20 cursor-pointer sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center gap-2 text-rose-400 mb-2">
            <Share2 className="w-5 h-5" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              WhatsApp Familiar
            </h4>
          </div>
          <p className="text-xs font-semibold text-emerald-100 line-clamp-2">
            Invita a tíos, primos y amigos con un solo clic a la plataforma.
          </p>
          <span className="text-[11px] text-rose-300 font-bold mt-2 inline-block">
            Copiar enlace de invitación 📲
          </span>
        </div>
      </div>
    </div>
  );
};
