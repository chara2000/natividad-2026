import React, { useState } from 'react';
import {
  Settings,
  Users,
  Download,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Copy,
  Crown,
  Wallet,
  Gift,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  UserCog,
  Trash2,
  Plus,
} from 'lucide-react';
import { useChristmas } from '../../context/ChristmasContext';
import { soundFX } from '../../utils/audio';
import { UserRole } from '../../types';

const ROLE_OPTIONS: { value: UserRole; label: string; emoji: string; color: string }[] = [
  { value: 'organizer', label: 'Co-Organizador',   emoji: '👑', color: 'text-amber-300' },
  { value: 'treasurer', label: 'Tesorero',          emoji: '💰', color: 'text-blue-300' },
  { value: 'member',    label: 'Miembro Familiar',  emoji: '🎄', color: 'text-emerald-300' },
  { value: 'guest',     label: 'Invitado',          emoji: '🎁', color: 'text-purple-300' },
];

const getRoleBadge = (role: UserRole) => {
  const opt = ROLE_OPTIONS.find(r => r.value === role);
  return opt ?? ROLE_OPTIONS[2];
};

export const CommunitySettingsModule: React.FC = () => {
  const {
    community,
    updateCommunity,
    updateGlobalQuota,
    members,
    addMember,
    currentUser,
    updateMemberRole,
    resetToDemoData,
    clearDemoData,
    showAlert,
    showConfirm,
    canManageSettings,
  } = useChristmas();

  const [copiedCode, setCopiedCode] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberFamily, setNewMemberFamily] = useState('');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  /* PIN master management */
  const [showPinSection, setShowPinSection] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [showNewPin, setShowNewPin] = useState(false);
  const [showCurrentPin, setShowCurrentPin] = useState(false);

  const handleCopyCode = () => {
    soundFX.playJingleBell();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(community.inviteCode);
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    addMember({
      name: newMemberName.trim(),
      email: newMemberEmail.trim() || `${newMemberName.toLowerCase().replace(/\s+/g, '')}@familia.com`,
      role: 'member',
      avatar: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='85'>🎄</text></svg>`,
      familyGroup: newMemberFamily.trim() || 'Familia',
    });

    setShowAddMemberModal(false);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberFamily('');
    showAlert(`${newMemberName.trim()} fue agregado a la familia navideña 🎄`, 'Miembro Agregado', 'success');
  };

  const handleUpdatePin = () => {
    if (!newPin.trim() || newPin.length < 4) {
      showAlert('El PIN debe tener al menos 4 caracteres.', 'PIN Inválido', 'warning');
      return;
    }
    updateCommunity({ masterPin: newPin.trim() });
    setNewPin('');
    setShowPinSection(false);
    showAlert('PIN Maestro actualizado exitosamente 🔐', 'PIN Actualizado', 'success');
    soundFX.playJingleBell();
  };

  const handleExportData = () => {
    soundFX.playJingleBell();
    const data = {
      community: localStorage.getItem('natividad_community'),
      members: localStorage.getItem('natividad_members'),
      activities: localStorage.getItem('natividad_activities'),
      expenses: localStorage.getItem('natividad_expenses'),
      contributions: localStorage.getItem('natividad_contributions'),
      secretSanta: localStorage.getItem('natividad_secretsanta'),
      polls: localStorage.getItem('natividad_polls'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `natividad_respaldo_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-20">

      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-widest font-bold text-amber-300 flex items-center gap-1.5">
          <Settings className="w-3.5 h-3.5" /> Configuración y Miembros
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
          Espacio Comunitario Navideño
        </h2>
        <p className="text-xs text-emerald-200/80 mt-0.5">
          Administra los participantes, roles, código de invitación y configuración del grupo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── Card 1: Community Profile & Invite ── */}
        <div className="glass-card rounded-3xl p-6 border border-amber-400/30 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold font-cinzel text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Información del Espacio
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
              Navidad {community.year}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-emerald-300 font-bold mb-1">Nombre del Espacio</label>
              <input
                type="text"
                value={community.name}
                onChange={e => updateCommunity({ name: e.target.value })}
                disabled={!canManageSettings}
                className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-bold mb-1">Lema o Slogan Navideño</label>
              <input
                type="text"
                value={community.slogan}
                onChange={e => updateCommunity({ slogan: e.target.value })}
                disabled={!canManageSettings}
                className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-bold mb-1">Presupuesto Meta Global (COP)</label>
              <input
                type="number"
                step="50000"
                value={community.totalBudgetGoal}
                onChange={e => updateCommunity({ totalBudgetGoal: Number(e.target.value) })}
                disabled={!canManageSettings}
                className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white font-mono font-bold disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-bold mb-1">
                Cuota por Persona / Familiar (COP)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="10000"
                  value={community.quotaPerPerson || 150000}
                  onChange={e => updateGlobalQuota(Number(e.target.value) || 0, false)}
                  disabled={!canManageSettings}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white font-mono font-bold disabled:opacity-50"
                />
                {canManageSettings && (
                  <button
                    type="button"
                    onClick={() => {
                      showConfirm(
                        `¿Deseas aplicar esta cuota de $${(community.quotaPerPerson || 150000).toLocaleString('es-CO')} COP a TODOS los familiares registrados en Finanzas?`,
                        () => updateGlobalQuota(community.quotaPerPerson || 150000, true),
                        'Aplicar Cuota a Todos'
                      );
                    }}
                    className="whitespace-nowrap px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-[11px] font-bold"
                  >
                    Aplicar a Todos
                  </button>
                )}
              </div>
              <p className="text-[10px] text-emerald-400/70 mt-1">
                Cuota individual sugerida para cada familiar. Puedes aplicarla a todos los familiares o ajustar cuotas especiales desde el módulo de Finanzas.
              </p>
            </div>

            {/* Invite Code */}
            <div className="bg-black/40 p-4 rounded-2xl border border-amber-400/30 space-y-2 mt-4">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">
                Código de Invitación Familiar
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="text-base font-mono font-black text-white tracking-widest">
                  {community.inviteCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 text-pine-950 font-bold text-xs"
                >
                  {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <p className="text-[11px] text-emerald-200/70">
                Comparte este código para que tus familiares se unan a la comunidad navideña.
              </p>
            </div>

            {/* ── PIN Maestro Section (only for organizer) ── */}
            {canManageSettings && (
              <div className="bg-amber-950/30 p-4 rounded-2xl border border-amber-400/25 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" /> PIN Maestro de Administrador
                  </span>
                  <button
                    onClick={() => setShowPinSection(!showPinSection)}
                    className="text-[10px] text-amber-300 hover:text-amber-100 font-bold underline"
                  >
                    {showPinSection ? 'Cerrar' : 'Cambiar PIN'}
                  </button>
                </div>

                {/* Show current PIN */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-white/80 tracking-widest">
                    {showCurrentPin ? (community.masterPin || '2026') : '•'.repeat((community.masterPin || '2026').length)}
                  </span>
                  <button
                    onClick={() => setShowCurrentPin(!showCurrentPin)}
                    className="text-amber-400/60 hover:text-amber-200"
                  >
                    {showCurrentPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {showPinSection && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="block text-[10px] text-amber-300 font-bold">Nuevo PIN (mín. 4 caracteres)</label>
                    <div className="relative">
                      <input
                        type={showNewPin ? 'text' : 'password'}
                        value={newPin}
                        onChange={e => setNewPin(e.target.value)}
                        placeholder="Nuevo PIN maestro"
                        maxLength={10}
                        className="w-full pl-3 pr-9 py-2 rounded-xl bg-black/60 border border-amber-400/40 text-xs font-mono font-bold text-amber-200 placeholder-amber-400/40 focus:border-amber-400 focus:outline-none tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPin(!showNewPin)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-400/60 hover:text-amber-200"
                      >
                        {showNewPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <button
                      onClick={handleUpdatePin}
                      className="w-full py-2 rounded-xl bg-amber-500/30 hover:bg-amber-500/50 border border-amber-400/40 text-amber-200 font-bold text-xs"
                    >
                      Guardar Nuevo PIN 🔐
                    </button>
                  </div>
                )}

                <p className="text-[10px] text-amber-300/60">
                  Este PIN es necesario para registrar nuevos Organizadores o Tesoreros en el sistema.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Card 2: Members Directory ── */}
        <div className="glass-card rounded-3xl p-6 border border-emerald-500/20 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold font-cinzel text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" /> Miembros ({members.length})
            </h3>
            {canManageSettings && (
              <button
                onClick={() => setShowAddMemberModal(true)}
                className="flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-amber-100 px-2.5 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            )}
          </div>

          <div className="max-h-[420px] overflow-y-auto space-y-2 pr-1 scrollbar-hide">
            {members.length === 0 && (
              <p className="text-xs text-emerald-300/50 text-center py-8">
                Aún no hay miembros registrados. ¡Invita a tu familia! 🎄
              </p>
            )}
            {members.map(member => {
              const badge = getRoleBadge(member.role);
              const isCurrentUser = member.id === currentUser?.id;
              const isAvatarEmoji = member.avatar.startsWith('data:');

              return (
                <div
                  key={member.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs transition-all ${
                    isCurrentUser
                      ? 'bg-amber-500/10 border-amber-400/30'
                      : 'bg-black/30 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Avatar */}
                    {isAvatarEmoji ? (
                      <div className="w-9 h-9 rounded-full bg-black/40 border border-amber-400/30 flex items-center justify-center text-xl flex-shrink-0">
                        {/* Extract emoji from data URL */}
                        {decodeURIComponent(member.avatar).match(/>([^<]*)</)?.[1] ?? '🎄'}
                      </div>
                    ) : (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-9 h-9 rounded-full object-cover border border-amber-400/40 flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <h5 className="font-bold text-white truncate leading-tight">
                        {member.name}
                        {isCurrentUser && (
                          <span className="ml-1 text-[9px] text-amber-300 font-black">(Tú)</span>
                        )}
                      </h5>
                      <span className="text-[10px] text-emerald-300/60 truncate block">
                        {member.familyGroup || 'Familia'} · {member.email}
                      </span>
                    </div>
                  </div>

                  {/* Role selector — organizer can change any member's role */}
                  <div className="flex-shrink-0">
                    {canManageSettings ? (
                      <select
                        value={member.role}
                        onChange={e => {
                          soundFX.playClick();
                          updateMemberRole(member.id, e.target.value as UserRole);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/15 text-[11px] font-bold text-amber-300 focus:outline-none focus:border-amber-400 cursor-pointer hover:border-amber-400/60 transition-all appearance-none text-center"
                        style={{ minWidth: '110px' }}
                      >
                        {ROLE_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.emoji} {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`text-[9px] uppercase font-bold px-2.5 py-1 rounded-full border ${
                          member.role === 'organizer'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                            : member.role === 'treasurer'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                            : member.role === 'guest'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                        }`}
                      >
                        {badge.emoji} {badge.label}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-2 border-t border-white/5">
            <p className="text-[10px] text-emerald-300/50 text-center flex items-center justify-center gap-1">
              <UserCog className="w-3 h-3" />
              {canManageSettings
                ? 'Haz clic en el selector de rol para promover o cambiar a cualquier familiar'
                : 'Solo el Organizador puede cambiar roles'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Backup & Maintenance ── */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Gestión de Datos</h4>
          <p className="text-xs text-emerald-200/70 mt-0.5">
            Exporta un respaldo JSON o limpia los datos para empezar con datos reales.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {canManageSettings && (
            <button
              onClick={() =>
                showConfirm(
                  '¿Deseas vaciar todos los datos para registrar los eventos, gastos y miembros reales de tu familia navideña?',
                  () => clearDemoData(),
                  'Limpiar Datos'
                )
              }
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-400/40 active:scale-95 transition-all"
            >
              🧹 Vaciar Datos
            </button>
          )}

          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 font-semibold text-xs border border-white/15 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Exportar JSON
          </button>

          {canManageSettings && (
            <button
              onClick={() =>
                showConfirm(
                  '¿Estás seguro de restablecer todos los datos a la configuración inicial?',
                  () => resetToDemoData(),
                  'Restablecer Datos'
                )
              }
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/60 text-rose-300 font-semibold text-xs border border-rose-500/30 active:scale-95 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reiniciar
            </button>
          )}
        </div>
      </div>

      {/* ── Modal: Add Member ── */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm glass-card border border-amber-400/40 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-bold font-cinzel text-white mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" /> Agregar Familiar
            </h3>
            <p className="text-[11px] text-emerald-300/70 mb-4">Se registrará como Miembro Familiar por defecto.</p>
            <form onSubmit={handleAddMemberSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Tío Fernando García"
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-emerald-300 font-bold mb-1">Grupo Familiar / Rama</label>
                <input
                  type="text"
                  placeholder="Ej: Familia García Pérez"
                  value={newMemberFamily}
                  onChange={e => setNewMemberFamily(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-emerald-300 font-bold mb-1">Correo (Opcional)</label>
                <input
                  type="email"
                  placeholder="ejemplo@gmail.com"
                  value={newMemberEmail}
                  onChange={e => setNewMemberEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 rounded-xl text-emerald-300 hover:text-white text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-pine-950 font-bold text-xs"
                >
                  Guardar 🎄
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
