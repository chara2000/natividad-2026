'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Mail,
  User,
  Phone,
  Shield,
  Users,
  Check,
  ArrowRight,
  Gift,
  Wallet,
  Crown,
  Eye,
  EyeOff,
  KeyRound,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { soundFX } from '../../utils/audio';
import { getSupabase, isSupabaseConfigured } from '../../lib/supabase';

/* ───────────────────────────────────────────────────────────
   GOOGLE 4-COLOR ICON SVG
─────────────────────────────────────────────────────────── */
const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

/* ───────────────────────────────────────────────────────────
   FESTIVE EMOJI AVATARS
─────────────────────────────────────────────────────────── */
const AVATAR_OPTIONS = [
  { id: 'av-santa',   label: 'Papá Noel',        emoji: '🎅' },
  { id: 'av-reindeer',label: 'Rodolfo Reno',     emoji: '🦌' },
  { id: 'av-snow',    label: 'Muñeco de Nieve',  emoji: '⛄' },
  { id: 'av-star',    label: 'Estrella Belén',   emoji: '⭐' },
  { id: 'av-cookie',  label: 'Galleta Jengibre', emoji: '🍪' },
  { id: 'av-elf',     label: 'Duende Navideño',  emoji: '🧝' },
  { id: 'av-angel',   label: 'Ángel',            emoji: '👼' },
  { id: 'av-bell',    label: 'Campana Navideña', emoji: '🔔' },
];

const makeAvatarDataUrl = (emoji: string): string =>
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='85'>${emoji}</text></svg>`;

/* ───────────────────────────────────────────────────────────
   ROLES DEFINITION — Miembro por defecto, PIN para admin
─────────────────────────────────────────────────────────── */
const ROLES_INFO: {
  id: UserRole;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge: string;
  requiresPin: boolean;
}[] = [
  {
    id: 'member',
    title: 'Miembro Familiar',
    subtitle: 'Participa en eventos, aporta, vota en encuestas y juega amigo secreto.',
    icon: Users,
    badge: 'Recomendado para Familia',
    requiresPin: false,
  },
  {
    id: 'guest',
    title: 'Invitado',
    subtitle: 'Acceso de solo lectura a celebraciones, novenas y fotos familiares.',
    icon: Gift,
    badge: 'Solo lectura',
    requiresPin: false,
  },
  {
    id: 'organizer',
    title: 'Organizador General',
    subtitle: 'Administra toda la comunidad, actividades, sorteos y configuración.',
    icon: Crown,
    badge: 'Requiere PIN Maestro',
    requiresPin: true,
  },
  {
    id: 'treasurer',
    title: 'Tesorero / Finanzas',
    subtitle: 'Registra compras, gastos y aprueba comprobantes de pago de la familia.',
    icon: Wallet,
    badge: 'Requiere PIN Maestro',
    requiresPin: true,
  },
];

/* ───────────────────────────────────────────────────────────
   MINI SNOWFALL CANVAS
─────────────────────────────────────────────────────────── */
const MiniSnowfall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const flakes = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.8,
      speed: Math.random() * 0.45 + 0.2,
      swing: 0,
      swingSpeed: Math.random() * 0.015 + 0.005,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      flakes.forEach(f => {
        f.swing += f.swingSpeed;
        f.y += f.speed;
        f.x += Math.sin(f.swing) * 0.5;
        if (f.y > canvas.height) {
          f.y = -4;
          f.x = Math.random() * canvas.width;
        }
        if (f.x > canvas.width) f.x = 0;
        if (f.x < 0) f.x = canvas.width;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${f.opacity})`;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 3;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full rounded-3xl pointer-events-none z-0"
    />
  );
};

/* ───────────────────────────────────────────────────────────
   AUTH MODAL PROPS
─────────────────────────────────────────────────────────── */
interface AuthModalProps {
  onLogin: (user: UserProfile) => void;
  existingUsers: UserProfile[];
  masterPin?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onLogin,
  existingUsers,
  masterPin = '2026',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  /* Login fields */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /* Register fields */
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [familyGroup, setFamilyGroup] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [selectedAvatarId, setSelectedAvatarId] = useState(AVATAR_OPTIONS[0].id);
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  /* Google Sign-in state */
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleSimName, setGoogleSimName] = useState('');
  const [googleSimEmail, setGoogleSimEmail] = useState('');
  const [googleSimFamily, setGoogleSimFamily] = useState('');
  const [googleSetupInfo, setGoogleSetupInfo] = useState<{
    projectId?: string;
    callbackUrl?: string;
    providerSettingsUrl?: string;
  } | null>(null);
  const [copiedCallback, setCopiedCallback] = useState(false);

  const selectedAvatarOption = AVATAR_OPTIONS.find(a => a.id === selectedAvatarId) ?? AVATAR_OPTIONS[0];
  const avatarUrl = makeAvatarDataUrl(selectedAvatarOption.emoji);
  const selectedRoleInfo = ROLES_INFO.find(r => r.id === role)!;

  const handleSelectRole = (r: UserRole) => {
    soundFX.playClick();
    setRole(r);
    setPinInput('');
    setErrorMessage('');
  };

  /* ── GOOGLE SIGN-IN HANDLER ── */
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsLoadingGoogle(true);
    soundFX.playClick();

    const sb = getSupabase();
    if (sb && isSupabaseConfigured()) {
      try {
        const returnUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const { data, error } = await sb.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: returnUrl,
            queryParams: {
              access_type: 'offline',
              prompt: 'select_account',
            },
          },
        });

        if (error) {
          console.warn('Supabase OAuth notice:', error.message);
          setGoogleSetupInfo({
            projectId: 'jdoefygyqowysjzzfqxh',
            callbackUrl: 'https://jdoefygyqowysjzzfqxh.supabase.co/auth/v1/callback',
            providerSettingsUrl: 'https://supabase.com/dashboard/project/jdoefygyqowysjzzfqxh/auth/providers',
          });
          setShowGoogleModal(true);
          setIsLoadingGoogle(false);
          return;
        }

        if (data?.url) {
          // Official Google OAuth redirect!
          window.location.href = data.url;
          return;
        }
      } catch (err: any) {
        console.warn('OAuth redirect notice:', err);
        setShowGoogleModal(true);
        setIsLoadingGoogle(false);
      }
    } else {
      setShowGoogleModal(true);
      setIsLoadingGoogle(false);
    }
  };

  const handleSimulatedGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = googleSimName.trim() || 'Familiar Google';
    const finalEmail = googleSimEmail.trim().toLowerCase() || 'familiar.google@gmail.com';

    // Check if user already exists
    const existing = existingUsers.find(
      u => u.email.toLowerCase() === finalEmail
    );

    if (existing) {
      soundFX.playJingleBell();
      onLogin(existing);
      setShowGoogleModal(false);
      return;
    }

    const newGoogleUser: UserProfile = {
      id: `usr-google-${Date.now()}`,
      name: finalName,
      email: finalEmail,
      avatar: makeAvatarDataUrl('🎅'),
      role: 'member',
      familyGroup: googleSimFamily.trim() || 'Familia',
      authProvider: 'google',
      createdAt: new Date().toISOString(),
    };

    soundFX.playJingleBell();
    onLogin(newGoogleUser);
    setShowGoogleModal(false);
  };

  /* ── SUBMIT LOGIN ── */
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor ingresa tu correo y contraseña.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const found = existingUsers.find(
      u => u.email.toLowerCase() === cleanEmail
    );

    if (found) {
      if (found.authProvider === 'google' && !found.password) {
        setErrorMessage('Esta cuenta fue registrada con Google 🎅. Por favor usa el botón "Continuar con Google" arriba.');
        return;
      }
      if (found.password && found.password !== password) {
        setErrorMessage('Contraseña incorrecta. Por favor verifica tus datos 🎄');
        return;
      }
      soundFX.playJingleBell();
      onLogin(found);
      return;
    }

    setErrorMessage('No encontramos ninguna cuenta con este correo. ¿Deseas registrarte en la pestaña "Crear Cuenta"?');
  };

  /* ── SUBMIT REGISTER ── */
  const normalizedRegEmail = regEmail.trim().toLowerCase();
  const duplicateUser = normalizedRegEmail
    ? existingUsers.find(u => u.email.toLowerCase() === normalizedRegEmail)
    : null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMessage('Por favor completa todos los campos requeridos (*).');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedRegEmail)) {
      setErrorMessage('Por favor ingresa un correo electrónico válido (ej: familiar@gmail.com).');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    /* PIN check for privileged roles */
    if (selectedRoleInfo.requiresPin) {
      if (!pinInput.trim()) {
        setErrorMessage(
          `El rol "${selectedRoleInfo.title}" requiere el PIN Maestro. Si eres familiar, selecciona "Miembro Familiar".`
        );
        return;
      }
      if (pinInput !== masterPin) {
        setErrorMessage('PIN Maestro incorrecto ❌. Por defecto es 2026.');
        return;
      }
    }

    if (duplicateUser) {
      if (duplicateUser.authProvider === 'google') {
        setErrorMessage('Ya existe una cuenta con este correo registrada mediante Google. Usa el botón "Continuar con Google" para ingresar.');
      } else {
        setErrorMessage('Ya existe una cuenta con este correo. Por favor inicia sesión en la pestaña "Iniciar Sesión".');
      }
      return;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: normalizedRegEmail,
      phone: phone.trim() || undefined,
      role,
      familyGroup: familyGroup.trim() || 'Familia',
      avatar: avatarUrl,
      password: regPassword,
      authProvider: 'local',
      createdAt: new Date().toISOString(),
    };

    soundFX.playJingleBell();
    onLogin(newUser);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-[#010e07]/95 backdrop-blur-xl overflow-y-auto">
      <div className="w-full max-w-lg my-8 relative">
        {/* Glow halo */}
        <div className="absolute -top-16 -left-16 w-52 h-52 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* ── CARD CONTAINER ── */}
        <div className="relative glass-card rounded-3xl border border-amber-400/40 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] bg-pine-950/90 overflow-hidden">
          <MiniSnowfall />

          <div className="relative z-10">
            {/* ── LOGO & BRANDING ── */}
            <div className="text-center mb-6">
              <div className="relative inline-block mb-3">
                <img
                  src="/logo.png"
                  alt="Natividad 2026"
                  className="w-20 h-20 mx-auto rounded-2xl object-cover shadow-2xl border-2 border-amber-400/60 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)] animate-pulse"
                />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-white tracking-widest">
                NATIVIDAD 2026
              </h2>
              <p className="text-xs text-amber-300 font-semibold tracking-wide mt-0.5">
                Portal Familiar Privado de Celebraciones
              </p>
            </div>

            {/* ── TABS ── */}
            <div className="flex p-1 rounded-2xl bg-black/60 border border-white/10 mb-5">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                  soundFX.playClick();
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 shadow-md font-black'
                    : 'text-emerald-200/70 hover:text-white'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage('');
                  soundFX.playClick();
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 shadow-md font-black'
                    : 'text-emerald-200/70 hover:text-white'
                }`}
              >
                Crear Cuenta
              </button>
            </div>

            {/* ── ERROR ALERT ── */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-950/70 border border-rose-400/40 text-rose-200 text-xs text-center flex items-center justify-center gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ── GOOGLE SIGN-IN BUTTON ── */}
            <div className="mb-4">
              <button
                type="button"
                disabled={isLoadingGoogle}
                onClick={handleGoogleSignIn}
                className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-800 font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] border border-white/20 cursor-pointer disabled:opacity-70 group"
              >
                {isLoadingGoogle ? (
                  <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <GoogleIcon className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                )}
                <span>
                  {mode === 'login' ? 'Continuar con Google' : 'Registrarse con Google'}
                </span>
              </button>

              <div className="flex items-center my-3.5">
                <div className="flex-1 border-t border-white/10" />
                <span className="px-3 text-[10px] sm:text-[11px] uppercase tracking-wider text-emerald-300/60 font-semibold">
                  O con correo electrónico
                </span>
                <div className="flex-1 border-t border-white/10" />
              </div>
            </div>

            {/* ════════════════════════════════════════════
                LOGIN FORM
            ════════════════════════════════════════════ */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1.5">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/60 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="tu_correo@familia.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/50 border border-white/15 text-sm text-white placeholder-emerald-400/40 focus:border-amber-400 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/60 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-black/50 border border-white/15 text-sm text-white placeholder-emerald-400/40 focus:border-amber-400 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-3 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-pine-950 font-black text-sm shadow-xl shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Ingresar a la Celebración 🎄</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-xs text-emerald-200/70 pt-2">
                  ¿Aún no te has registrado?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMessage('');
                    }}
                    className="text-amber-300 font-bold hover:underline cursor-pointer"
                  >
                    Regístrate aquí ✨
                  </button>
                </p>
              </form>
            )}

            {/* ════════════════════════════════════════════
                REGISTER FORM
            ════════════════════════════════════════════ */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {/* Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-1">
                      Nombre Completo *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-400/60 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ej: Juan Carlos"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-emerald-400/40 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-1">
                      Celular / WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-400/60 pointer-events-none" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+57 300 000 0000"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-emerald-400/40 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Email + Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-1">
                      Correo Electrónico *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-400/60 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        placeholder="familiar@correo.com"
                        className={`w-full pl-9 pr-3 py-2 rounded-xl bg-black/50 border text-xs text-white placeholder-emerald-400/40 focus:outline-none transition-colors ${
                          duplicateUser
                            ? 'border-amber-400/80 bg-amber-950/20'
                            : 'border-white/15 focus:border-amber-400'
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-1">
                      Contraseña (mín 6 car.) *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-400/60 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-8 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-emerald-400/40 focus:border-amber-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-400/60 hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {regPassword.length > 0 && (
                      <div className="mt-1 flex items-center justify-between text-[10px]">
                        <span className={regPassword.length >= 6 ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                          {regPassword.length >= 6 ? '✓ Longitud segura' : `Mínimo 6 (${regPassword.length}/6)`}
                        </span>
                        <div className="flex gap-1">
                          <div className={`w-5 h-1 rounded-full ${regPassword.length > 0 ? (regPassword.length >= 6 ? 'bg-emerald-400' : 'bg-amber-400') : 'bg-white/20'}`} />
                          <div className={`w-5 h-1 rounded-full ${regPassword.length >= 6 ? 'bg-emerald-400' : 'bg-white/20'}`} />
                          <div className={`w-5 h-1 rounded-full ${regPassword.length >= 9 ? 'bg-emerald-400' : 'bg-white/20'}`} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Inline Duplicate Alert */}
                {duplicateUser && (
                  <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-400/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-amber-200 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>
                        {duplicateUser.authProvider === 'google'
                          ? 'Este correo ya está registrado con Google.'
                          : 'Ya existe una cuenta creada con este correo.'}
                      </span>
                    </div>
                    {duplicateUser.authProvider === 'google' ? (
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-pine-950 font-black text-[11px] flex items-center gap-1.5 shadow cursor-pointer whitespace-nowrap"
                      >
                        <GoogleIcon className="w-3.5 h-3.5" />
                        Entrar con Google
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEmail(regEmail.trim());
                          setMode('login');
                          setErrorMessage('');
                          soundFX.playClick();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-pine-950 font-black text-[11px] shadow cursor-pointer whitespace-nowrap"
                      >
                        Iniciar Sesión
                      </button>
                    )}
                  </div>
                )}

                {/* Rama Familiar */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-1">
                    Rama Familiar o Apellido
                  </label>
                  <input
                    type="text"
                    value={familyGroup}
                    onChange={e => setFamilyGroup(e.target.value)}
                    placeholder="Ej: Familia García Ríos, Primos del Norte..."
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-emerald-400/40 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Avatar Picker */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-1">
                    Elige tu Avatar Navideño
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-0.5">
                    {AVATAR_OPTIONS.map(av => {
                      const isSel = av.id === selectedAvatarId;
                      return (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => {
                            soundFX.playClick();
                            setSelectedAvatarId(av.id);
                          }}
                          className={`w-full h-11 rounded-2xl flex items-center justify-center text-xl transition-all border cursor-pointer ${
                            isSel
                              ? 'bg-amber-400/30 border-amber-400 scale-105 shadow-md shadow-amber-400/20'
                              : 'bg-black/40 border-white/10 hover:border-white/30'
                          }`}
                          title={av.label}
                        >
                          {av.emoji}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-1.5">
                    Rol en la Celebración
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES_INFO.map(r => {
                      const isSel = r.id === role;
                      const Icon = r.icon;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => handleSelectRole(r.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSel
                              ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm'
                              : 'bg-black/30 border-white/10 text-emerald-200/70 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <Icon className={`w-3.5 h-3.5 ${isSel ? 'text-amber-400' : 'text-emerald-400'}`} />
                            <span className="text-xs font-bold truncate">{r.title}</span>
                          </div>
                          <span className="text-[10px] text-emerald-300/60 block leading-tight">
                            {r.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* PIN Maestro Input if Organizer/Treasurer */}
                {selectedRoleInfo.requiresPin && (
                  <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-400/40 animate-in fade-in">
                    <div className="flex items-center gap-2 mb-1.5">
                      <KeyRound className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-amber-300">
                        PIN Maestro de Administrador Requerido
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-200/80 mb-2">
                      Para evitar registros no autorizados como Organizador o Tesorero, introduce el PIN (por defecto: 2026).
                    </p>
                    <div className="relative">
                      <input
                        type={showPin ? 'text' : 'password'}
                        value={pinInput}
                        onChange={e => setPinInput(e.target.value)}
                        placeholder="PIN Maestro (ej: 2026)"
                        className="w-full px-3 pr-10 py-2 rounded-xl bg-black/60 border border-amber-400/50 text-xs text-white focus:border-amber-300 focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-300/60 hover:text-white cursor-pointer"
                      >
                        {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-pine-950 font-black text-sm shadow-xl shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Crear mi Cuenta Navideña ✨</span>
                </button>

                <p className="text-center text-xs text-emerald-200/70 pt-1">
                  ¿Ya tienes cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage('');
                    }}
                    className="text-amber-300 font-bold hover:underline cursor-pointer"
                  >
                    Inicia sesión aquí 🔑
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── MODAL: ACCESO GOOGLE & CONFIGURACIÓN ── */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="glass-card max-w-lg w-full p-6 sm:p-7 rounded-3xl border border-amber-400/50 shadow-2xl space-y-4 bg-pine-950/95 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-md flex-shrink-0">
                  <GoogleIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-cinzel text-white leading-tight">
                    Acceso con Cuenta de Google
                  </h3>
                  <span className="text-[11px] text-amber-300">
                    Configuración de Supabase & Acceso Inmediato
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="p-1 rounded-lg text-white/60 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Aviso de Estado en Supabase */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  ⚠️ Falta activar Google en Supabase
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30">
                  ID: {googleSetupInfo?.projectId || 'jdoefygyqowysjzzfqxh'}
                </span>
              </div>
              <p className="text-emerald-100/90 text-[11px] leading-relaxed">
                Supabase respondió: <em>"Unsupported provider: provider is not enabled"</em>. Para que la ventana emergente oficial de Google abra sola, solo debes activar el interruptor de Google en tu panel de Supabase.
              </p>
              
              <div className="pt-1 flex flex-wrap gap-2 items-center">
                <a
                  href={googleSetupInfo?.providerSettingsUrl || `https://supabase.com/dashboard/project/jdoefygyqowysjzzfqxh/auth/providers`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-400 text-pine-950 font-bold text-xs shadow hover:bg-amber-300 transition-all cursor-pointer"
                >
                  <span>Abrir Configuración en Supabase</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    const cb = googleSetupInfo?.callbackUrl || 'https://jdoefygyqowysjzzfqxh.supabase.co/auth/v1/callback';
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(cb);
                      setCopiedCallback(true);
                      setTimeout(() => setCopiedCallback(false), 3000);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/20 text-white font-medium text-xs hover:border-amber-400 transition-all cursor-pointer"
                >
                  {copiedCallback ? '✓ Callback Copiado' : 'Copiar Callback URL'}
                </button>
              </div>
            </div>

            {/* Acceso Rápido / Inmediato con Google */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-white block">
                🚀 ¿Quieres ingresar ya mismo con tu cuenta de Google?
              </span>
              <p className="text-[11px] text-emerald-200/80">
                Puedes ingresar tus datos de Gmail aquí abajo y entrarás al instante como <strong>Miembro Familiar con cuenta de Google</strong> sin esperar:
              </p>

              <form onSubmit={handleSimulatedGoogleSubmit} className="space-y-3 p-4 rounded-2xl bg-black/50 border border-white/10 text-xs">
                <div>
                  <label className="block text-emerald-300 mb-1 font-semibold">Tu Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={googleSimName}
                    onChange={e => setGoogleSimName(e.target.value)}
                    placeholder="Ej: Juan Carlos Pérez"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 mb-1 font-semibold">Tu Correo de Gmail *</label>
                  <input
                    type="email"
                    required
                    value={googleSimEmail}
                    onChange={e => setGoogleSimEmail(e.target.value)}
                    placeholder="tu_cuenta@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 mb-1 font-semibold">Familia / Apellidos (Opcional)</label>
                  <input
                    type="text"
                    value={googleSimFamily}
                    onChange={e => setGoogleSimFamily(e.target.value)}
                    placeholder="Ej: Familia Pérez Gómez"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
                >
                  <GoogleIcon className="w-4 h-4" />
                  <span>Ingresar de Inmediato con Google</span>
                </button>
              </form>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
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
