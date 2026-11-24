'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  UserProfile,
  UserRole,
  Community,
  Activity,
  ActivityRsvp,
  ExpenseItem,
  UserContribution,
  PaymentReceipt,
  SecretSantaSession,
  Poll,
  AdventDay,
  MemoryPhoto,
  SantaAIMessage,
  SecretSantaWishlist,
} from '../types';
import {
  initialCurrentUser,
  initialMembers,
  initialCommunity,
  initialActivities,
  initialExpenses,
  initialContributions,
  initialReceipts,
  initialSecretSanta,
  initialPolls,
  initialAdventDays,
  initialMemories,
  initialSantaMessages,
} from '../data/initialData';
import { soundFX } from '../utils/audio';
import { fireHolidayConfetti } from '../utils/confetti';
import { syncActivityToSupabase, syncExpenseToSupabase, syncReceiptToSupabase, getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { FestiveAlertModal, AlertModalOptions } from '../components/ui/FestiveAlertModal';

interface ChristmasContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  login: (user: UserProfile) => void;
  logout: () => void;
  registerUser: (user: UserProfile) => void;

  // Role-based permissions (RBAC)
  canManageActivities: boolean;
  canManageFinances: boolean;
  canApproveReceipts: boolean;
  canRunSecretSanta: boolean;
  canCreatePolls: boolean;
  canManageSettings: boolean;
  isGuest: boolean;

  // Custom Festive Alerts & Confirms
  showAlert: (message: string, title?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  showConfirm: (message: string, onConfirm: () => void, title?: string) => void;

  community: Community;
  updateCommunity: (updated: Partial<Community>) => void;
  updateGlobalQuota: (newQuota: number, applyToAll?: boolean) => void;
  updateUserQuota: (userId: string, newQuota: number) => void;
  members: UserProfile[];
  addMember: (member: Omit<UserProfile, 'id'>) => void;
  updateMemberRole: (userId: string, newRole: UserRole) => void;
  updateUserProfile: (userId: string, updates: Partial<UserProfile>) => void;
  showCompleteProfileModal: boolean;
  setShowCompleteProfileModal: (show: boolean) => void;
  
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateActivity: (id: string, updated: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  toggleItineraryItem: (activityId: string, itemId: string) => void;
  toggleActivityTask: (activityId: string, taskId: string) => void;
  claimPotluckDish: (activityId: string, dishId: string, userId?: string) => void;
  addPotluckDish: (activityId: string, dish: { name: string; category: any; servings: number }) => void;
  deletePotluckDish: (activityId: string, dishId: string) => void;
  addItineraryItem: (activityId: string, item: { time: string; title: string; description: string; responsibleId?: string }) => void;
  deleteItineraryItem: (activityId: string, itemId: string) => void;
  addActivityTask: (activityId: string, task: { title: string; priority: 'alta' | 'media' | 'baja'; assignedToId?: string }) => void;
  deleteActivityTask: (activityId: string, taskId: string) => void;
  toggleAttendance: (activityId: string) => void;
  submitActivityRsvp: (
    activityId: string,
    rsvpData: { guestCount: number; dishContribution?: string; note?: string; status: 'confirmed' | 'declined' }
  ) => void;

  expenses: ExpenseItem[];
  addExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  deleteExpense: (id: string) => void;

  contributions: UserContribution[];
  receipts: PaymentReceipt[];
  registerPaymentReceipt: (data: {
    userId: string;
    amount: number;
    activityId?: string;
    paidByUserId?: string;
    paidByName?: string;
    referenceNumber?: string;
    method: 'nequi' | 'daviplata' | 'efectivo' | 'transferencia' | 'tarjeta';
    notes?: string;
    receiptImage?: string;
  }) => void;
  approveReceipt: (receiptId: string) => void;
  rejectReceipt: (receiptId: string) => void;
  deleteReceipt: (receiptId: string) => void;

  // Financial calculations
  financialStats: {
    totalBudgetGoal: number;
    totalExpenses: number;
    totalCollected: number;
    remainingToCollect: number;
    progressPercentage: number;
    pendingContributorsCount: number;
    paidContributorsCount: number;
    totalContributors: number;
  };

  // Secret Santa
  secretSanta: SecretSantaSession;
  runSecretSantaDraw: () => { success: boolean; message: string };
  resetSecretSantaDraw: () => void;
  updateSecretSantaSettings: (settings: { budgetMin?: number; budgetMax?: number; deliveryDate?: string; title?: string }) => void;
  addSecretSantaExclusion: (giverId: string, forbiddenId: string) => void;
  removeSecretSantaExclusion: (giverId: string, forbiddenId: string) => void;
  updateWishlist: (userId: string, wishlist: SecretSantaWishlist) => void;
  toggleGiftPurchased: (giverId: string) => void;
  
  // Polls
  polls: Poll[];
  votePoll: (pollId: string, optionId: string) => void;
  createPoll: (poll: Omit<Poll, 'id' | 'createdAt' | 'comments'>) => void;
  addPollComment: (pollId: string, text: string) => void;
  deletePoll: (pollId: string) => void;
  toggleClosePoll: (pollId: string) => void;

  // Advent Calendar
  adventDays: AdventDay[];
  unlockAdventDay: (dayNumber: number) => void;

  // Memories
  memories: MemoryPhoto[];
  addMemoryPhoto: (memory: Omit<MemoryPhoto, 'id' | 'likes'>) => void;
  toggleLikeMemory: (memoryId: string) => void;

  // Santa AI
  santaMessages: SantaAIMessage[];
  sendSantaAIMessage: (promptText: string) => void;
  isSantaTyping: boolean;

  // Audio & Atmosphere
  soundEnabled: boolean;
  toggleSound: () => void;
  snowEnabled: boolean;
  toggleSnow: () => void;

  // Accessibility
  largeFontMode: boolean;
  toggleLargeFont: () => void;

  // Navigation state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  resetToDemoData: () => void;
  clearDemoData: () => void;
}

const ChristmasContext = createContext<ChristmasContextType | undefined>(undefined);

export const ChristmasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Purges legacy mock data from localStorage if present
  const loadStored = <T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') return fallback;
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return fallback;
      const parsed = JSON.parse(saved);

      // Clean out any legacy mock data automatically
      if (key === 'natividad_community' && (parsed?.id === 'comm-garcia-2026' || parsed?.name?.includes('García') || parsed?.name?.includes('Garcia'))) {
        localStorage.removeItem(key);
        return fallback;
      }
      if (key === 'natividad_current_user' && parsed?.id?.startsWith('user-')) {
        localStorage.removeItem(key);
        return fallback;
      }
      if (key === 'natividad_members' && Array.isArray(parsed) && parsed.some(p => p.id?.startsWith('user-'))) {
        localStorage.removeItem(key);
        return fallback;
      }
      if (key === 'natividad_activities' && Array.isArray(parsed) && parsed.some(a => a.id?.startsWith('act-'))) {
        localStorage.removeItem(key);
        return fallback;
      }
      if (key === 'natividad_expenses' && Array.isArray(parsed) && parsed.some(e => e.id?.startsWith('exp-'))) {
        localStorage.removeItem(key);
        return fallback;
      }
      if (key === 'natividad_receipts' && Array.isArray(parsed) && parsed.some(r => r.id?.startsWith('rec-'))) {
        localStorage.removeItem(key);
        return fallback;
      }
      if (key === 'natividad_polls' && Array.isArray(parsed) && parsed.some(p => p.id?.startsWith('poll-'))) {
        localStorage.removeItem(key);
        return fallback;
      }
      if (key === 'natividad_memories' && Array.isArray(parsed) && parsed.some(m => m.id?.startsWith('mem-'))) {
        localStorage.removeItem(key);
        return fallback;
      }
      if (key === 'natividad_secretsanta' && parsed?.assignments?.length > 0 && parsed.assignments.some((a: any) => a.giverId?.startsWith('user-'))) {
        localStorage.removeItem(key);
        return fallback;
      }

      return parsed;
    } catch {
      return fallback;
    }
  };

  // State initialized with identical static defaults on server and client to prevent hydration mismatch
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(initialCurrentUser);
  const [community, setCommunity] = useState<Community>(initialCommunity);
  const [members, setMembers] = useState<UserProfile[]>(initialMembers);

  const membersRef = useRef(members);
  membersRef.current = members;

  const currentUserRef = useRef(currentUser);
  currentUserRef.current = currentUser;
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpenses);
  const [contributions, setContributions] = useState<UserContribution[]>(initialContributions);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(initialReceipts);
  const [secretSanta, setSecretSanta] = useState<SecretSantaSession>(initialSecretSanta);
  const [polls, setPolls] = useState<Poll[]>(initialPolls);
  const [adventDays, setAdventDays] = useState<AdventDay[]>(initialAdventDays);
  const [memories, setMemories] = useState<MemoryPhoto[]>(initialMemories);
  const [santaMessages, setSantaMessages] = useState<SantaAIMessage[]>(initialSantaMessages);
  const [isSantaTyping, setIsSantaTyping] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [snowEnabled, setSnowEnabled] = useState<boolean>(true);
  const [largeFontMode, setLargeFontMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isHydrated, setIsHydrated] = useState(false);
  const [showCompleteProfileModal, setShowCompleteProfileModal] = useState<boolean>(false);

  // Client-side hydration from localStorage after mount
  useEffect(() => {
    const savedUser = loadStored('natividad_current_user', initialCurrentUser);
    const savedComm = loadStored('natividad_community', initialCommunity);
    const savedMembers = loadStored('natividad_members', initialMembers);
    const savedActs = loadStored('natividad_activities', initialActivities);
    const savedExpenses = loadStored('natividad_expenses', initialExpenses);
    const savedContribs = loadStored('natividad_contributions', initialContributions);
    const savedReceipts = loadStored('natividad_receipts', initialReceipts);
    const savedSanta = loadStored('natividad_secretsanta', initialSecretSanta);
    const savedPolls = loadStored('natividad_polls', initialPolls);
    const savedAdvent = loadStored('natividad_advent', initialAdventDays);
    const savedMemories = loadStored('natividad_memories', initialMemories);
    const savedMsgs = loadStored('natividad_santa_messages', initialSantaMessages);

    try {
      const savedSnow = localStorage.getItem('natividad_snow_enabled');
      if (savedSnow !== null) setSnowEnabled(savedSnow === 'true');
      const savedFont = localStorage.getItem('natividad_large_font');
      if (savedFont !== null) {
        const on = savedFont === 'true';
        setLargeFontMode(on);
        document.documentElement.classList.toggle('large-font', on);
      }
    } catch {}

    if (savedUser) setCurrentUser(savedUser);
    if (savedComm) setCommunity(savedComm);
    if (savedMembers) setMembers(savedMembers);
    if (savedActs) setActivities(savedActs);
    if (savedExpenses) setExpenses(savedExpenses);
    if (savedContribs) setContributions(savedContribs);
    if (savedReceipts) setReceipts(savedReceipts);
    if (savedSanta) setSecretSanta(savedSanta);
    if (savedPolls) setPolls(savedPolls);
    if (savedAdvent) setAdventDays(savedAdvent);
    if (savedMemories) setMemories(savedMemories);
    if (savedMsgs) setSantaMessages(savedMsgs);

    setIsHydrated(true);
  }, []);

  // Synchronize contributions with members so every non-guest member always has an aporte record
  useEffect(() => {
    if (!isHydrated) return;
    const nonGuests = members.filter(m => m.role !== 'guest');
    if (nonGuests.length === 0) return;

    setContributions(prev => {
      let changed = false;
      const updated = [...prev];
      for (const m of nonGuests) {
        if (!updated.some(c => c.userId === m.id)) {
          changed = true;
          updated.push({
            userId: m.id,
            targetAmount: community.quotaPerPerson || 150000,
            paidAmount: 0,
            status: 'pending',
          });
        }
      }
      return changed ? updated : prev;
    });
  }, [members, isHydrated]);

  // Handle Google OAuth session from Supabase
  const handleGoogleUser = (sbUser: any) => {
    const email = sbUser.email?.toLowerCase();
    const curr = currentUserRef.current;

    // Prevent redundant loop if already logged in with this Google account
    if (curr && email && curr.email?.toLowerCase() === email && curr.authProvider === 'google') {
      return;
    }

    const avatar =
      sbUser.user_metadata?.avatar_url ||
      sbUser.user_metadata?.picture ||
      `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='85'>🎅</text></svg>`;

    const existing = membersRef.current.find(
      m => (email && m.email?.toLowerCase() === email) || m.id === `usr-google-${sbUser.id}` || m.id === sbUser.id
    );

    if (existing) {
      // Intelligently link Google OAuth to existing profile without creating duplicates
      const updatedExisting: UserProfile = {
        ...existing,
        avatar: existing.avatar || avatar,
        authProvider: 'google',
      };
      if (!curr || curr.id !== existing.id) {
        setCurrentUser(updatedExisting);
        if (typeof window !== 'undefined') {
          localStorage.setItem('natividad_current_user', JSON.stringify(updatedExisting));
        }
      }
      setMembers(prev => {
        const item = prev.find(m => m.id === existing.id);
        if (item && item.authProvider === 'google' && item.avatar === updatedExisting.avatar) {
          return prev;
        }
        return prev.map(m => m.id === existing.id ? updatedExisting : m);
      });

      // Guarantee existing profile is tied to auth.users in Supabase public.profiles table
      const sb = getSupabase();
      if (sb && isSupabaseConfigured() && email) {
        void sb.from('profiles').update({
          user_id: sbUser.id,
          avatar: updatedExisting.avatar,
        }).eq('email', email);
      }

      soundFX.playJingleBell?.();
      showAlert(`¡Bienvenido(a) de nuevo, ${existing.name}! Tu cuenta está vinculada con Google 🎄`, 'Sesión Iniciada con Google', 'success');

      // Prompt to complete profile if phone or familyGroup is missing
      if (!existing.phone || !existing.familyGroup || existing.familyGroup === 'Familia') {
        setShowCompleteProfileModal(true);
      }
      return;
    }

    const fullName =
      sbUser.user_metadata?.full_name ||
      sbUser.user_metadata?.name ||
      (email ? email.split('@')[0] : 'Familiar Google');

    const newGoogleMember: UserProfile = {
      id: `usr-google-${sbUser.id.substring(0, 10)}`,
      name: fullName,
      email: email || '',
      avatar,
      role: 'member',
      familyGroup: 'Familia',
      authProvider: 'google',
      createdAt: new Date().toISOString(),
    };

    // Guarantee new Google user is tied to Supabase public.profiles table
    const sb = getSupabase();
    if (sb && isSupabaseConfigured() && email) {
      void (async () => {
        try {
          await sb.from('profiles').upsert({
            user_id: sbUser.id,
            name: fullName,
            email: email,
            avatar: avatar,
            role: 'member',
            family_group: 'Familia',
          }, { onConflict: 'email' });
        } catch (err) {
          console.warn('Profiles table sync notice:', err);
        }
      })();
    }

    setMembers(prev => {
      if (prev.some(m => m.id === newGoogleMember.id || (email && m.email === email))) return prev;
      return [...prev, newGoogleMember];
    });

    setCurrentUser(newGoogleMember);
    if (typeof window !== 'undefined') {
      localStorage.setItem('natividad_current_user', JSON.stringify(newGoogleMember));
    }

    const defaultQuota = community.quotaPerPerson || 150000;
    setContributions(prev => {
      if (prev.some(c => c.userId === newGoogleMember.id)) return prev;
      return [
        ...prev,
        {
          userId: newGoogleMember.id,
          targetAmount: defaultQuota,
          paidAmount: 0,
          status: 'pending',
        },
      ];
    });

    soundFX.playJingleBell?.();
    setShowCompleteProfileModal(true);
  };

  // Listen for Supabase OAuth events & extract Google OAuth hash tokens directly
  useEffect(() => {
    if (!isHydrated) return;

    // 1. Direct Hash Token Extraction (Guarantees Google OAuth works immediately regardless of network status or key type)
    if (typeof window !== 'undefined' && window.location.hash && window.location.hash.includes('access_token=')) {
      try {
        const hash = window.location.hash.startsWith('#')
          ? window.location.hash.substring(1)
          : window.location.hash;
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        if (accessToken) {
          const parts = accessToken.split('.');
          if (parts.length === 3) {
            const base64Url = parts[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            const payload = JSON.parse(jsonPayload);
            if (payload && (payload.email || payload.sub)) {
              handleGoogleUser({
                id: payload.sub || 'google-user',
                email: payload.email || '',
                user_metadata: payload.user_metadata || {
                  full_name: payload.name || payload.email?.split('@')[0],
                  avatar_url: payload.picture,
                },
              });
              // Clean the hash from the browser URL so it doesn't re-trigger or clutter the address bar
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
          }
        }
      } catch (err) {
        console.warn('Error procesando token de Google en hash URL:', err);
      }
    }

    // 2. Supabase SDK session listener (if configured)
    const sb = getSupabase();
    if (!sb) return;

    sb.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleGoogleUser(session.user);
      }
    }).catch(() => {});

    const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
        handleGoogleUser(session.user);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [isHydrated]);

  // Custom Alert State
  const [alertState, setAlertState] = useState<AlertModalOptions>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const showAlert = (
    message: string,
    title = 'Notificación Navideña',
    type: 'success' | 'info' | 'warning' | 'error' = 'info'
  ) => {
    setAlertState({
      isOpen: true,
      title,
      message,
      type,
      confirmText: 'Entendido',
      onConfirm: () => setAlertState(prev => ({ ...prev, isOpen: false })),
    });
  };

  const showConfirm = (message: string, onConfirm: () => void, title = 'Confirmar Acción') => {
    setAlertState({
      isOpen: true,
      title,
      message,
      type: 'confirm',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      onConfirm: () => {
        setAlertState(prev => ({ ...prev, isOpen: false }));
        onConfirm();
      },
      onCancel: () => setAlertState(prev => ({ ...prev, isOpen: false })),
    });
  };

  // Auth methods
  const login = (user: UserProfile) => {
    setCurrentUser(user);
    setMembers(prev => {
      const exists = prev.some(m => m.id === user.id || m.email === user.email);
      return exists ? prev : [...prev, user];
    });

    if (user.role !== 'guest') {
      const defaultQuota = community.quotaPerPerson || 150000;
      setContributions(prev => {
        if (prev.some(c => c.userId === user.id)) return prev;
        return [
          ...prev,
          {
            userId: user.id,
            targetAmount: defaultQuota,
            paidAmount: 0,
            status: 'pending',
          },
        ];
      });
    }

    showAlert(`¡Bienvenido(a) a la celebración, ${user.name}! 🎄`, 'Sesión Iniciada', 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('natividad_current_user');
    }
    const sb = getSupabase();
    if (sb) {
      sb.auth.signOut().catch(() => {});
    }
    showAlert('Has cerrado tu sesión en Natividad.', 'Sesión Cerrada', 'info');
  };

  const registerUser = (user: UserProfile) => {
    const cleanUser = {
      ...user,
      email: user.email.toLowerCase(),
    };
    setCurrentUser(cleanUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('natividad_current_user', JSON.stringify(cleanUser));
    }
    setMembers(prev => {
      const exists = prev.some(
        m => m.id === cleanUser.id || (m.email && m.email.toLowerCase() === cleanUser.email)
      );
      if (exists) {
        return prev.map(m =>
          m.id === cleanUser.id || (m.email && m.email.toLowerCase() === cleanUser.email)
            ? { ...m, ...cleanUser }
            : m
        );
      }
      return [...prev, cleanUser];
    });

    if (cleanUser.role !== 'guest') {
      const defaultQuota = community.quotaPerPerson || 150000;
      setContributions(prev => [
        ...prev.filter(c => c.userId !== cleanUser.id),
        {
          userId: cleanUser.id,
          targetAmount: defaultQuota,
          paidAmount: 0,
          status: 'pending',
        },
      ]);
    }

    const roleName =
      cleanUser.role === 'organizer'
        ? 'Organizador General'
        : cleanUser.role === 'treasurer'
        ? 'Tesorero / Finanzas'
        : cleanUser.role === 'member'
        ? 'Miembro Familiar'
        : 'Invitado';

    showAlert(
      `¡Registro exitoso! Tu rol es: ${roleName}.\n\nYa puedes acceder a todas las funciones permitidas para tu perfil.`,
      '¡Bienvenido(a) a la Familia! 🎅',
      'success'
    );
  };

  // RBAC permissions based on active currentUser
  const userRole = currentUser?.role || 'guest';
  const canManageActivities = userRole === 'organizer';
  const canManageFinances = userRole === 'organizer' || userRole === 'treasurer';
  const canApproveReceipts = userRole === 'organizer' || userRole === 'treasurer';
  const canRunSecretSanta = userRole === 'organizer';
  const canCreatePolls = userRole === 'organizer' || userRole === 'treasurer';
  const canManageSettings = userRole === 'organizer';
  const isGuest = userRole === 'guest';

  // Persistence to localStorage (only after client hydration)
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    if (currentUser) {
      localStorage.setItem('natividad_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('natividad_current_user');
    }
  }, [currentUser, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    localStorage.setItem('natividad_community', JSON.stringify(community));
  }, [community, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    localStorage.setItem('natividad_members', JSON.stringify(members));
  }, [members, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    localStorage.setItem('natividad_activities', JSON.stringify(activities));
  }, [activities, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    localStorage.setItem('natividad_expenses', JSON.stringify(expenses));
  }, [expenses, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    localStorage.setItem('natividad_contributions', JSON.stringify(contributions));
  }, [contributions, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    localStorage.setItem('natividad_receipts', JSON.stringify(receipts));
  }, [receipts, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    localStorage.setItem('natividad_secretsanta', JSON.stringify(secretSanta));
  }, [secretSanta, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    localStorage.setItem('natividad_polls', JSON.stringify(polls));
  }, [polls, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    localStorage.setItem('natividad_advent', JSON.stringify(adventDays));
  }, [adventDays, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    localStorage.setItem('natividad_memories', JSON.stringify(memories));
  }, [memories, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    localStorage.setItem('natividad_santa_messages', JSON.stringify(santaMessages));
  }, [santaMessages, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    localStorage.setItem('natividad_snow_enabled', String(snowEnabled));
  }, [snowEnabled, isHydrated]);

  // Sound and visual helpers
  const toggleSound = () => {
    const state = soundFX.toggleSound();
    setSoundEnabled(state);
  };

  const toggleSnow = () => {
    setSnowEnabled(prev => !prev);
  };

  const toggleLargeFont = () => {
    setLargeFontMode(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('natividad_large_font', JSON.stringify(next));
        document.documentElement.classList.toggle('large-font', next);
      }
      return next;
    });
  };

  // Community
  const updateCommunity = (updated: Partial<Community>) => {
    if (!canManageSettings) {
      showAlert('Solo los organizadores pueden modificar la configuración de la comunidad.', 'Acceso Restringido', 'warning');
      return;
    }
    setCommunity(prev => ({ ...prev, ...updated }));
  };

  const updateGlobalQuota = (newQuota: number, applyToAll = true) => {
    if (!canManageFinances && !canManageActivities && !canManageSettings) {
      showAlert('Solo organizadores y tesoreros pueden modificar la cuota general.', 'Acceso Restringido', 'warning');
      return;
    }
    setCommunity(prev => ({ ...prev, quotaPerPerson: newQuota }));
    if (applyToAll) {
      setContributions(prev =>
        prev.map(c => ({
          ...c,
          targetAmount: newQuota,
          status: c.paidAmount >= newQuota ? 'paid' : c.paidAmount > 0 ? 'partial' : 'pending',
        }))
      );
    }
    soundFX.playClick();
    showAlert(`Cuota fijada en $${newQuota.toLocaleString('es-CO')} COP por persona.`, 'Cuota Actualizada', 'success');
  };

  const updateUserQuota = (userId: string, newQuota: number) => {
    if (!canManageFinances && !canManageActivities && !canManageSettings) {
      showAlert('Solo organizadores y tesoreros pueden modificar cuotas individuales.', 'Acceso Restringido', 'warning');
      return;
    }
    setContributions(prev => {
      const exists = prev.some(c => c.userId === userId);
      if (exists) {
        return prev.map(c =>
          c.userId === userId
            ? {
                ...c,
                targetAmount: newQuota,
                status: c.paidAmount >= newQuota ? 'paid' : c.paidAmount > 0 ? 'partial' : 'pending',
              }
            : c
        );
      } else {
        return [
          ...prev,
          {
            userId,
            targetAmount: newQuota,
            paidAmount: 0,
            status: 'pending',
          },
        ];
      }
    });
    soundFX.playClick();
    showAlert(`Cuota individual actualizada a $${newQuota.toLocaleString('es-CO')} COP.`, 'Cuota Actualizada', 'success');
  };

  const addMember = (memberData: Omit<UserProfile, 'id'>) => {
    const newMember: UserProfile = {
      ...memberData,
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };
    setMembers(prev => [...prev, newMember]);
    if (newMember.role !== 'guest') {
      const defaultQuota = community.quotaPerPerson || 150000;
      setContributions(prev => [
        ...prev,
        {
          userId: newMember.id,
          targetAmount: defaultQuota,
          paidAmount: 0,
          status: 'pending',
        },
      ]);
    }
    soundFX.playJingleBell();
  };

  const updateMemberRole = (userId: string, newRole: UserRole) => {
    if (!canManageSettings) {
      showAlert('Solo los organizadores pueden cambiar los roles familiares.', 'Acceso Restringido', 'warning');
      return;
    }

    setMembers(prev =>
      prev.map(m => (m.id === userId ? { ...m, role: newRole } : m))
    );

    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, role: newRole } : null));
    }

    const roleName =
      newRole === 'organizer'
        ? 'Co-Organizador ⭐'
        : newRole === 'treasurer'
        ? 'Tesorero / Finanzas 💰'
        : newRole === 'member'
        ? 'Miembro Familiar 🎄'
        : 'Invitado 🎁';

    showAlert(`Se actualizó el rol a: ${roleName}`, 'Rol Actualizado', 'success');
    soundFX.playJingleBell();
  };

  const updateUserProfile = (userId: string, updates: Partial<UserProfile>) => {
    setMembers(prev =>
      prev.map(m => (m.id === userId ? { ...m, ...updates } : m))
    );

    if (currentUser?.id === userId) {
      setCurrentUser(prev => {
        if (!prev) return null;
        const updated = { ...prev, ...updates };
        if (typeof window !== 'undefined') {
          localStorage.setItem('natividad_current_user', JSON.stringify(updated));
        }
        return updated;
      });
    }

    const sb = getSupabase();
    if (sb) {
      void sb.from('profiles').update({
        name: updates.name,
        phone: updates.phone,
        family_group: updates.familyGroup,
        avatar: updates.avatar,
      }).eq('email', currentUser?.email || '');
    }

    soundFX.playJingleBell();
    showAlert('¡Perfil familiar actualizado correctamente! 🎄', 'Perfil Guardado', 'success');
  };

  // Activities CRUD
  const addActivity = async (activityData: Omit<Activity, 'id'>) => {
    if (!canManageActivities) {
      showAlert('Solo los organizadores tienen permisos para crear actividades.', 'Acceso Restringido', 'warning');
      return;
    }

    const newActivity: Activity = {
      ...activityData,
      id: `act-${Date.now()}`,
    };
    setActivities(prev => [newActivity, ...prev]);
    soundFX.playJingleBell();
    fireHolidayConfetti();

    try {
      await syncActivityToSupabase(newActivity);
    } catch (e) {
      console.log('Sync activity note:', e);
    }
  };

  const updateActivity = (id: string, updated: Partial<Activity>) => {
    setActivities(prev =>
      prev.map(act => (act.id === id ? { ...act, ...updated } : act))
    );
  };

  const deleteActivity = (id: string) => {
    if (!canManageActivities) {
      showAlert('Solo los organizadores pueden eliminar actividades.', 'Acceso Restringido', 'warning');
      return;
    }
    showConfirm('¿Estás seguro de que deseas eliminar esta actividad navideña?', () => {
      setActivities(prev => prev.filter(act => act.id !== id));
      soundFX.playClick();
    }, 'Eliminar Actividad');
  };

  const toggleItineraryItem = (activityId: string, itemId: string) => {
    const act = activities.find(a => a.id === activityId);
    const item = act?.itinerary.find(i => i.id === itemId);
    if (!item) return;

    const canToggle = canManageActivities || (currentUser?.id && item.responsibleId === currentUser.id);
    if (!canToggle) {
      showAlert('Solo el organizador o el familiar asignado puede marcar este ítem del cronograma.', 'Acceso Restringido', 'warning');
      return;
    }

    setActivities(prev =>
      prev.map(a => {
        if (a.id !== activityId) return a;
        const updatedItinerary = a.itinerary.map(it => {
          if (it.id === itemId) {
            const nextCompleted = !it.completed;
            if (nextCompleted) soundFX.playJingleBell();
            return { ...it, completed: nextCompleted };
          }
          return it;
        });
        return { ...a, itinerary: updatedItinerary };
      })
    );
  };

  const toggleActivityTask = (activityId: string, taskId: string) => {
    const act = activities.find(a => a.id === activityId);
    const task = act?.tasks.find(t => t.id === taskId);
    if (!task) return;

    const canToggle = canManageActivities || (currentUser?.id && task.assignedToId === currentUser.id);
    if (!canToggle) {
      showAlert('Solo el organizador o el familiar asignado puede marcar esta tarea.', 'Acceso Restringido', 'warning');
      return;
    }

    setActivities(prev =>
      prev.map(a => {
        if (a.id !== activityId) return a;
        const updatedTasks = a.tasks.map(t => {
          if (t.id === taskId) {
            const nextCompleted = !t.completed;
            if (nextCompleted) soundFX.playJingleBell();
            return { ...t, completed: nextCompleted };
          }
          return t;
        });
        return { ...a, tasks: updatedTasks };
      })
    );
  };

  const claimPotluckDish = (activityId: string, dishId: string, userId?: string) => {
    const claimerId = userId || currentUser?.id;
    if (!claimerId) {
      showAlert('Debes iniciar sesión para apartar un plato.', 'Acceso Requerido', 'warning');
      return;
    }

    setActivities(prev =>
      prev.map(act => {
        if (act.id !== activityId) return act;
        const updatedPotluck = act.potluckDishes.map(dish => {
          if (dish.id === dishId) {
            const isCurrentlyAssigned = dish.assignedToId === claimerId;
            return {
              ...dish,
              assignedToId: isCurrentlyAssigned ? undefined : claimerId,
            };
          }
          return dish;
        });
        return { ...act, potluckDishes: updatedPotluck };
      })
    );
    soundFX.playJingleBell();
  };

  const addPotluckDish = (
    activityId: string,
    dish: { name: string; category: any; servings: number }
  ) => {
    setActivities(prev =>
      prev.map(act => {
        if (act.id !== activityId) return act;
        const newDish = { id: `pot-${Date.now()}`, ...dish };
        return { ...act, potluckDishes: [...act.potluckDishes, newDish] };
      })
    );
    soundFX.playClick();
  };

  const deletePotluckDish = (activityId: string, dishId: string) => {
    if (!canManageActivities) {
      showAlert('Solo el organizador puede eliminar platos de la lista.', 'Acceso Restringido', 'warning');
      return;
    }
    setActivities(prev =>
      prev.map(act =>
        act.id !== activityId
          ? act
          : { ...act, potluckDishes: act.potluckDishes.filter(d => d.id !== dishId) }
      )
    );
    soundFX.playClick();
  };

  const addItineraryItem = (
    activityId: string,
    item: { time: string; title: string; description: string; responsibleId?: string }
  ) => {
    if (!canManageActivities) {
      showAlert('Solo el organizador puede agregar ítems al itinerario.', 'Acceso Restringido', 'warning');
      return;
    }
    const newItem = { id: `itin-${Date.now()}`, ...item, completed: false };
    setActivities(prev =>
      prev.map(act =>
        act.id !== activityId
          ? act
          : { ...act, itinerary: [...act.itinerary, newItem].sort((a, b) => a.time.localeCompare(b.time)) }
      )
    );
    soundFX.playClick();
  };

  const deleteItineraryItem = (activityId: string, itemId: string) => {
    if (!canManageActivities) {
      showAlert('Solo el organizador puede eliminar ítems del itinerario.', 'Acceso Restringido', 'warning');
      return;
    }
    setActivities(prev =>
      prev.map(act =>
        act.id !== activityId
          ? act
          : { ...act, itinerary: act.itinerary.filter(i => i.id !== itemId) }
      )
    );
    soundFX.playClick();
  };

  const addActivityTask = (
    activityId: string,
    task: { title: string; priority: 'alta' | 'media' | 'baja'; assignedToId?: string }
  ) => {
    if (!canManageActivities) {
      showAlert('Solo el organizador puede agregar tareas.', 'Acceso Restringido', 'warning');
      return;
    }
    const newTask = { id: `task-${Date.now()}`, ...task, completed: false };
    setActivities(prev =>
      prev.map(act =>
        act.id !== activityId
          ? act
          : { ...act, tasks: [...act.tasks, newTask] }
      )
    );
    soundFX.playClick();
  };

  const deleteActivityTask = (activityId: string, taskId: string) => {
    if (!canManageActivities) {
      showAlert('Solo el organizador puede eliminar tareas.', 'Acceso Restringido', 'warning');
      return;
    }
    setActivities(prev =>
      prev.map(act =>
        act.id !== activityId
          ? act
          : { ...act, tasks: act.tasks.filter(t => t.id !== taskId) }
      )
    );
    soundFX.playClick();
  };

  const toggleAttendance = (activityId: string) => {
    const userId = currentUser?.id;
    if (!userId) {
      showAlert('Debes iniciar sesión para confirmar asistencia.', 'Acceso Requerido', 'warning');
      return;
    }
    setActivities(prev =>
      prev.map(act => {
        if (act.id !== activityId) return act;
        const isAttending = act.attendees.includes(userId);
        const updatedAttendees = isAttending
          ? act.attendees.filter(id => id !== userId)
          : [...act.attendees, userId];
        if (!isAttending) soundFX.playJingleBell();
        return { ...act, attendees: updatedAttendees };
      })
    );
  };

  const submitActivityRsvp = (
    activityId: string,
    rsvpData: { guestCount: number; dishContribution?: string; note?: string; status: 'confirmed' | 'declined' }
  ) => {
    const userId = currentUser?.id;
    if (!userId) {
      showAlert('Debes iniciar sesión para confirmar asistencia con acompañantes.', 'Acceso Requerido', 'warning');
      return;
    }

    const userName = currentUser?.name || 'Familiar';

    setActivities(prev =>
      prev.map(act => {
        if (act.id !== activityId) return act;

        const currentRsvps = act.rsvps || [];
        const existingIdx = currentRsvps.findIndex(r => r.userId === userId);
        const newRsvp: ActivityRsvp = {
          userId,
          userName,
          guestCount: Math.max(0, rsvpData.guestCount || 0),
          dishContribution: rsvpData.dishContribution?.trim() || undefined,
          note: rsvpData.note?.trim() || undefined,
          status: rsvpData.status,
          updatedAt: new Date().toISOString(),
        };

        const updatedRsvps = existingIdx >= 0
          ? currentRsvps.map((r, i) => (i === existingIdx ? newRsvp : r))
          : [...currentRsvps, newRsvp];

        // Sync attendees array
        let updatedAttendees = [...act.attendees];
        if (rsvpData.status === 'confirmed') {
          if (!updatedAttendees.includes(userId)) {
            updatedAttendees.push(userId);
          }
        } else {
          updatedAttendees = updatedAttendees.filter(id => id !== userId);
        }

        return {
          ...act,
          attendees: updatedAttendees,
          rsvps: updatedRsvps,
        };
      })
    );

    if (rsvpData.status === 'confirmed') {
      soundFX.playJingleBell();
      fireHolidayConfetti();
      const totalPeople = 1 + (rsvpData.guestCount || 0);
      showAlert(
        `¡Confirmado! Asistencia registrada para ${totalPeople} persona(s) (${userName}${rsvpData.guestCount ? ` + ${rsvpData.guestCount} acompañante(s)` : ''}).${rsvpData.dishContribution ? `\nLlevarás: ${rsvpData.dishContribution}` : ''} 🎄`,
        '¡Asistencia Confirmada!',
        'success'
      );
    } else {
      soundFX.playClick();
      showAlert('Hemos actualizado tu respuesta. ¡Te extrañaremos en esta actividad!', 'Asistencia Actualizada', 'info');
    }
  };

  // Expenses CRUD
  const addExpense = async (expenseData: Omit<ExpenseItem, 'id'>) => {
    if (!canManageFinances) {
      showAlert('Solo los organizadores y tesoreros pueden registrar gastos oficiales.', 'Acceso Restringido', 'warning');
      return;
    }

    const newExpense: ExpenseItem = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };
    setExpenses(prev => [newExpense, ...prev]);
    soundFX.playJingleBell();

    try {
      await syncExpenseToSupabase(newExpense);
    } catch (e) {
      console.log('Sync expense note:', e);
    }
  };

  const deleteExpense = (id: string) => {
    if (!canManageFinances) {
      showAlert('Solo organizadores y tesoreros pueden eliminar gastos.', 'Acceso Restringido', 'warning');
      return;
    }
    showConfirm('¿Deseas eliminar este registro de gasto?', () => {
      setExpenses(prev => prev.filter(e => e.id !== id));
      soundFX.playClick();
    }, 'Eliminar Gasto');
  };

  // Receipts / Payments
  const registerPaymentReceipt = async (data: {
    userId: string;
    amount: number;
    activityId?: string;
    paidByUserId?: string;
    paidByName?: string;
    referenceNumber?: string;
    method: 'nequi' | 'daviplata' | 'efectivo' | 'transferencia' | 'tarjeta';
    notes?: string;
    receiptImage?: string;
  }) => {
    const beneficiaryId = data.userId || currentUser?.id || 'usr-fam';
    const beneficiaryUser = members.find(m => m.id === beneficiaryId) || currentUser;
    const now = new Date();
    const newReceipt: PaymentReceipt = {
      id: `rec-${Date.now()}`,
      userId: beneficiaryId,
      userName: beneficiaryUser?.name || 'Familiar',
      paidByUserId: data.paidByUserId || currentUser?.id,
      paidByName: data.paidByName || currentUser?.name,
      referenceNumber: data.referenceNumber,
      activityId: data.activityId,
      amount: data.amount,
      method: data.method,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: data.notes,
      receiptImage: data.receiptImage,
      status: canApproveReceipts ? 'approved' : 'pending',
      verifiedBy: canApproveReceipts ? (currentUser?.name || 'Tesorero') : undefined,
    };

    setReceipts(prev => [newReceipt, ...prev]);

    // Update or create contribution immediately if approved
    if (newReceipt.status === 'approved') {
      setContributions(prev => {
        const exists = prev.some(c => c.userId === beneficiaryId);
        if (exists) {
          return prev.map(c => {
            if (c.userId === beneficiaryId) {
              const nextPaid = c.paidAmount + data.amount;
              return {
                ...c,
                paidAmount: nextPaid,
                status: nextPaid >= c.targetAmount ? 'paid' : 'partial',
              };
            }
            return c;
          });
        } else {
          const defaultQuota = community.quotaPerPerson || 150000;
          return [
            ...prev,
            {
              userId: beneficiaryId,
              targetAmount: defaultQuota,
              paidAmount: data.amount,
              status: data.amount >= defaultQuota ? 'paid' : 'partial',
            },
          ];
        }
      });
    }

    soundFX.playJingleBell();
    fireHolidayConfetti();

    try {
      await syncReceiptToSupabase(newReceipt);
    } catch (e) {
      console.log('Sync receipt note:', e);
    }
  };

  const approveReceipt = (receiptId: string) => {
    if (!canApproveReceipts) {
      showAlert('Solo organizadores y tesoreros pueden aprobar comprobantes.', 'Acceso Restringido', 'warning');
      return;
    }

    const receipt = receipts.find(r => r.id === receiptId);
    if (!receipt) return;

    setReceipts(prev =>
      prev.map(r =>
        r.id === receiptId
          ? { ...r, status: 'approved', verifiedBy: currentUser?.name || 'Organizador' }
          : r
      )
    );

    setContributions(prev => {
      const exists = prev.some(c => c.userId === receipt.userId);
      if (exists) {
        return prev.map(c => {
          if (c.userId === receipt.userId) {
            const nextPaid = c.paidAmount + receipt.amount;
            return {
              ...c,
              paidAmount: nextPaid,
              status: nextPaid >= c.targetAmount ? 'paid' : 'partial',
            };
          }
          return c;
        });
      } else {
        const defaultQuota = community.quotaPerPerson || 150000;
        return [
          ...prev,
          {
            userId: receipt.userId,
            targetAmount: defaultQuota,
            paidAmount: receipt.amount,
            status: receipt.amount >= defaultQuota ? 'paid' : 'partial',
          },
        ];
      }
    });

    soundFX.playJingleBell();
  };

  const rejectReceipt = (receiptId: string) => {
    if (!canApproveReceipts) {
      showAlert('Solo organizadores y tesoreros pueden rechazar comprobantes.', 'Acceso Restringido', 'warning');
      return;
    }

    showConfirm('¿Deseas rechazar este comprobante de pago?', () => {
      setReceipts(prev =>
        prev.map(r =>
          r.id === receiptId
            ? { ...r, status: 'rejected', verifiedBy: currentUser?.name || 'Organizador' }
            : r
        )
      );
      soundFX.playClick();
    }, 'Rechazar Comprobante');
  };

  const deleteReceipt = (receiptId: string) => {
    if (!canApproveReceipts) {
      showAlert('Solo organizadores y tesoreros pueden eliminar comprobantes.', 'Acceso Restringido', 'warning');
      return;
    }

    const receipt = receipts.find(r => r.id === receiptId);
    if (!receipt) return;

    showConfirm(
      `¿Deseas eliminar permanentemente el comprobante de $${receipt.amount.toLocaleString('es-CO')} de ${receipt.userName}? Si ya fue aprobado, se descontará del saldo aportado.`,
      () => {
        if (receipt.status === 'approved') {
          setContributions(prev =>
            prev.map(c => {
              if (c.userId === receipt.userId) {
                const nextPaid = Math.max(0, c.paidAmount - receipt.amount);
                return {
                  ...c,
                  paidAmount: nextPaid,
                  status: nextPaid >= c.targetAmount ? 'paid' : nextPaid > 0 ? 'partial' : 'pending',
                };
              }
              return c;
            })
          );
        }
        setReceipts(prev => prev.filter(r => r.id !== receiptId));
        soundFX.playClick();
        showAlert('Comprobante eliminado con éxito.', 'Comprobante Eliminado', 'success');
      },
      'Eliminar Comprobante'
    );
  };

  // Financial Stats
  const totalBudgetGoal = community?.totalBudgetGoal || 1000000;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalCollected = receipts
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.amount, 0);
  const remainingToCollect = Math.max(0, totalBudgetGoal - totalCollected);
  const progressPercentage =
    totalBudgetGoal > 0 ? Math.round((totalCollected / totalBudgetGoal) * 100) : 0;
  const pendingContributorsCount = contributions.filter(c => c.status !== 'paid').length;
  const paidContributorsCount = contributions.filter(c => c.status === 'paid').length;
  const totalContributors = contributions.length;

  // Secret Santa
  const runSecretSantaDraw = (): { success: boolean; message: string } => {
    if (!canRunSecretSanta) {
      showAlert('Solo el organizador puede realizar el sorteo de Amigo Secreto.', 'Acceso Restringido', 'warning');
      return { success: false, message: 'Acceso denegado' };
    }

    const nonGuests = members.filter(m => m.role !== 'guest');
    const participantIds = nonGuests.map(m => m.id);

    if (participantIds.length < 2) {
      const msg = 'Se requieren al menos 2 personas registradas para realizar el sorteo de Amigo Secreto.';
      showAlert(msg, 'Participantes Insuficientes', 'warning');
      return { success: false, message: msg };
    }

    // Derangement algorithm with exclusions
    const givers = [...participantIds];
    let receivers = [...participantIds];
    let valid = false;
    let attempts = 0;

    while (!valid && attempts < 3000) {
      attempts++;
      receivers = [...participantIds].sort(() => Math.random() - 0.5);
      valid = true;

      for (let i = 0; i < givers.length; i++) {
        const g = givers[i];
        const r = receivers[i];
        if (g === r) {
          valid = false;
          break;
        }
        if (secretSanta.exclusions[g]?.includes(r)) {
          valid = false;
          break;
        }
      }
    }

    if (!valid) {
      const msg = 'No se encontró una combinación válida con las exclusiones actuales. Intenta reducir las reglas de bloqueo.';
      showAlert(msg, 'Error en el Sorteo', 'error');
      return { success: false, message: msg };
    }

    const assignments = givers.map((giverId, idx) => ({
      giverId,
      receiverId: receivers[idx],
      giftPurchased: false,
      delivered: false,
    }));

    setSecretSanta(prev => ({
      ...prev,
      status: 'drawn',
      assignments,
      participants: participantIds,
    }));

    soundFX.playMagicReveal();
    fireHolidayConfetti();

    const okMsg = `¡Sorteo realizado con éxito entre ${participantIds.length} familiares! Cada uno ya puede descubrir a su amigo secreto. 🎁`;
    showAlert(okMsg, '¡Sorteo Realizado! 🎁', 'success');
    return { success: true, message: okMsg };
  };

  const resetSecretSantaDraw = () => {
    if (!canRunSecretSanta) {
      showAlert('Solo el organizador puede reiniciar el sorteo.', 'Acceso Restringido', 'warning');
      return;
    }
    showConfirm(
      '¿Deseas reiniciar el sorteo? Se borrarán las asignaciones secretas para permitir realizar un nuevo sorteo.',
      () => {
        setSecretSanta(prev => ({
          ...prev,
          status: 'draft',
          assignments: [],
          participants: [],
        }));
        soundFX.playClick();
        showAlert('El sorteo de Amigo Secreto se ha reiniciado.', 'Sorteo Reiniciado', 'info');
      },
      'Reiniciar Sorteo'
    );
  };

  const updateSecretSantaSettings = (settings: { budgetMin?: number; budgetMax?: number; deliveryDate?: string; title?: string }) => {
    if (!canRunSecretSanta) {
      showAlert('Solo el organizador puede modificar la configuración del sorteo.', 'Acceso Restringido', 'warning');
      return;
    }
    setSecretSanta(prev => ({
      ...prev,
      ...settings,
    }));
    soundFX.playClick();
    showAlert('Reglas del sorteo actualizadas correctamente.', 'Guardado', 'success');
  };

  const addSecretSantaExclusion = (giverId: string, forbiddenId: string) => {
    if (!canRunSecretSanta) return;
    setSecretSanta(prev => {
      const current = prev.exclusions[giverId] || [];
      if (current.includes(forbiddenId)) return prev;
      return {
        ...prev,
        exclusions: {
          ...prev.exclusions,
          [giverId]: [...current, forbiddenId],
        },
      };
    });
    soundFX.playClick();
  };

  const removeSecretSantaExclusion = (giverId: string, forbiddenId: string) => {
    if (!canRunSecretSanta) return;
    setSecretSanta(prev => {
      const current = prev.exclusions[giverId] || [];
      return {
        ...prev,
        exclusions: {
          ...prev.exclusions,
          [giverId]: current.filter(id => id !== forbiddenId),
        },
      };
    });
    soundFX.playClick();
  };

  const updateWishlist = (userId: string, wishlist: SecretSantaWishlist) => {
    setSecretSanta(prev => ({
      ...prev,
      wishlists: {
        ...prev.wishlists,
        [userId]: wishlist,
      },
    }));
    soundFX.playJingleBell();
    showAlert('Tu lista de deseos navideños ha sido actualizada.', 'Lista Guardada', 'success');
  };

  const toggleGiftPurchased = (giverId: string) => {
    setSecretSanta(prev => ({
      ...prev,
      assignments: prev.assignments.map(a =>
        a.giverId === giverId ? { ...a, giftPurchased: !a.giftPurchased } : a
      ),
    }));
    soundFX.playClick();
  };

  // Polls
  const votePoll = (pollId: string, optionId: string) => {
    if (isGuest) {
      showAlert('Los invitados tienen acceso de solo lectura.', 'Acceso Restringido', 'info');
      return;
    }
    const voterId = currentUser?.id;
    if (!voterId) return;

    setPolls(prev =>
      prev.map(p => {
        if (p.id !== pollId) return p;
        const updatedOptions = p.options.map(opt => {
          const hasVoted = opt.votes.includes(voterId);
          if (opt.id === optionId) {
            return {
              ...opt,
              votes: hasVoted
                ? opt.votes.filter(id => id !== voterId)
                : [...opt.votes, voterId],
            };
          } else {
            return p.allowMultiple
              ? opt
              : { ...opt, votes: opt.votes.filter(id => id !== voterId) };
          }
        });
        return { ...p, options: updatedOptions };
      })
    );
    soundFX.playClick();
  };

  const createPoll = (pollData: Omit<Poll, 'id' | 'createdAt' | 'comments'>) => {
    if (!canCreatePolls) {
      showAlert('Solo organizadores y tesoreros pueden publicar encuestas oficiales.', 'Acceso Restringido', 'warning');
      return;
    }

    const newPoll: Poll = {
      ...pollData,
      id: `poll-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      comments: [],
    };
    setPolls(prev => [newPoll, ...prev]);
    soundFX.playJingleBell();
    fireHolidayConfetti();
  };

  const addPollComment = (pollId: string, text: string) => {
    if (isGuest) {
      showAlert('Los invitados tienen acceso de solo lectura.', 'Acceso Restringido', 'info');
      return;
    }
    const commenter = currentUser || { id: 'anon', name: 'Familiar' };
    const newComment = {
      id: `com-${Date.now()}`,
      userId: commenter.id,
      text: text.trim(),
      time: 'Hace un momento',
    };
    setPolls(prev =>
      prev.map(p => (p.id === pollId ? { ...p, comments: [...p.comments, newComment] } : p))
    );
    soundFX.playClick();
  };

  const deletePoll = (pollId: string) => {
    if (!canCreatePolls) {
      showAlert('Solo organizadores pueden eliminar encuestas.', 'Acceso Restringido', 'warning');
      return;
    }
    const targetPoll = polls.find(p => p.id === pollId);
    if (!targetPoll) return;

    showConfirm(
      `¿Deseas eliminar la encuesta "${targetPoll.question}"? Se perderán todos los votos y comentarios registrados.`,
      () => {
        setPolls(prev => prev.filter(p => p.id !== pollId));
        soundFX.playClick();
        showAlert('Encuesta eliminada exitosamente.', 'Encuesta Eliminada', 'success');
      },
      'Eliminar Encuesta'
    );
  };

  const toggleClosePoll = (pollId: string) => {
    if (!canCreatePolls) {
      showAlert('Solo organizadores pueden abrir o cerrar encuestas.', 'Acceso Restringido', 'warning');
      return;
    }
    const target = polls.find(p => p.id === pollId);
    if (!target) return;
    const isCurrentlyClosed = target.closesAt && target.closesAt < new Date().toISOString().split('T')[0];

    setPolls(prev =>
      prev.map(p => {
        if (p.id !== pollId) return p;
        return {
          ...p,
          closesAt: isCurrentlyClosed ? '2026-12-31' : '2020-01-01',
        };
      })
    );
    soundFX.playClick();
    showAlert(
      isCurrentlyClosed ? 'La encuesta ha sido reabierta para votación.' : 'La encuesta ha sido cerrada.',
      isCurrentlyClosed ? 'Encuesta Abierta' : 'Encuesta Cerrada',
      'info'
    );
  };

  // Advent Calendar
  const unlockAdventDay = (dayNumber: number) => {
    setAdventDays(prev =>
      prev.map(d => (d.dayNumber === dayNumber ? { ...d, unlocked: true } : d))
    );
    soundFX.playMagicReveal();
    fireHolidayConfetti();
  };

  // Memories
  const addMemoryPhoto = (memoryData: Omit<MemoryPhoto, 'id' | 'likes'>) => {
    if (isGuest) {
      showAlert('Los invitados tienen acceso de solo lectura.', 'Acceso Restringido', 'info');
      return;
    }

    const newMem: MemoryPhoto = {
      ...memoryData,
      id: `mem-${Date.now()}`,
      likes: 1,
      likedByCurrentUser: true,
    };
    setMemories(prev => [newMem, ...prev]);
    soundFX.playJingleBell();
    fireHolidayConfetti();
  };

  const toggleLikeMemory = (memoryId: string) => {
    setMemories(prev =>
      prev.map(m => {
        if (m.id !== memoryId) return m;
        const currentlyLiked = m.likedByCurrentUser;
        return {
          ...m,
          likes: currentlyLiked ? Math.max(0, m.likes - 1) : m.likes + 1,
          likedByCurrentUser: !currentlyLiked,
        };
      })
    );
    soundFX.playClick();
  };

  // Santa IA with real Next.js API route (/api/santa-ai)
  const sendSantaAIMessage = async (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: SantaAIMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: promptText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSantaMessages(prev => [...prev, userMsg]);
    setIsSantaTyping(true);
    soundFX.playClick();

    try {
      const res = await fetch('/api/santa-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...santaMessages, userMsg].map(m => ({
            role: m.sender === 'santa' ? 'assistant' : 'user',
            content: m.text,
          })),
          context: {
            communityName: community.name,
            totalBudgetGoal,
            totalCollected,
            remainingToCollect,
            totalActivities: activities.length,
            totalMembers: members.length,
            userRole: currentUser?.role,
            userName: currentUser?.name,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.reply || data.text || '¡Ho, ho, ho! Feliz Navidad.';
        const santaMsg: SantaAIMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'santa',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setSantaMessages(prev => [...prev, santaMsg]);
        soundFX.playJingleBell();
      } else {
        throw new Error('API route returned error');
      }
    } catch {
      // Local fallback
      setTimeout(() => {
        const fallbackMsg: SantaAIMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'santa',
          text: `¡Ho, ho, ho! 🎅✨ Te escucho fuerte y claro. Para ${community.name}, actualmente llevamos $${totalCollected.toLocaleString('es-CO')} recaudados de nuestra meta de $${totalBudgetGoal.toLocaleString('es-CO')}. ¡Que viva el espíritu navideño y la unión familiar!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setSantaMessages(prev => [...prev, fallbackMsg]);
        soundFX.playJingleBell();
      }, 900);
    } finally {
      setIsSantaTyping(false);
    }
  };

  const resetToDemoData = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    setCurrentUser(null);
    setCommunity(initialCommunity);
    setMembers([]);
    setActivities([]);
    setExpenses([]);
    setContributions([]);
    setReceipts([]);
    setSecretSanta(initialSecretSanta);
    setPolls([]);
    setAdventDays(initialAdventDays);
    setMemories([]);
    setSantaMessages(initialSantaMessages);
    showAlert('Se han limpiado los datos.', 'Datos Reiniciados', 'info');
  };

  const clearDemoData = () => {
    setActivities([]);
    setExpenses([]);
    setReceipts([]);
    setContributions([]);
    setMemories([]);
    showAlert('Todos los datos de prueba han sido eliminados. El sistema está 100% limpio para datos reales.', 'Datos Limpios', 'success');
  };

  return (
    <ChristmasContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        logout,
        registerUser,
        canManageActivities,
        canManageFinances,
        canApproveReceipts,
        canRunSecretSanta,
        canCreatePolls,
        canManageSettings,
        isGuest,
        showAlert,
        showConfirm,
        community,
        updateCommunity,
        updateGlobalQuota,
        updateUserQuota,
        members,
        addMember,
        updateMemberRole,
        updateUserProfile,
        showCompleteProfileModal,
        setShowCompleteProfileModal,
        activities,
        addActivity,
        updateActivity,
        deleteActivity,
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
        expenses,
        addExpense,
        deleteExpense,
        contributions,
        receipts,
        registerPaymentReceipt,
        approveReceipt,
        rejectReceipt,
        deleteReceipt,
        financialStats: {
          totalBudgetGoal,
          totalExpenses,
          totalCollected,
          remainingToCollect,
          progressPercentage,
          pendingContributorsCount,
          paidContributorsCount,
          totalContributors,
        },
        secretSanta,
        runSecretSantaDraw,
        resetSecretSantaDraw,
        updateSecretSantaSettings,
        addSecretSantaExclusion,
        removeSecretSantaExclusion,
        updateWishlist,
        toggleGiftPurchased,
        polls,
        votePoll,
        createPoll,
        addPollComment,
        deletePoll,
        toggleClosePoll,
        adventDays,
        unlockAdventDay,
        memories,
        addMemoryPhoto,
        toggleLikeMemory,
        santaMessages,
        sendSantaAIMessage,
        isSantaTyping,
        soundEnabled,
        toggleSound,
        snowEnabled,
        toggleSnow,
        largeFontMode,
        toggleLargeFont,
        activeTab,
        setActiveTab,
        resetToDemoData,
        clearDemoData,
      }}
    >
      {children}
      <FestiveAlertModal
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
        onConfirm={alertState.onConfirm}
        onCancel={alertState.onCancel}
      />
    </ChristmasContext.Provider>
  );
};

export const useChristmas = () => {
  const context = useContext(ChristmasContext);
  if (!context) {
    throw new Error('useChristmas must be used within a ChristmasProvider');
  }
  return context;
};
