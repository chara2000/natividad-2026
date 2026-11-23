import React, { useState, useMemo } from 'react';
import {
  WalletCards,
  Plus,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Receipt,
  FileCheck,
  FileX,
  Share2,
  DollarSign,
  PieChart,
  UserCheck,
  X,
  Upload,
  ArrowUpRight,
  Filter,
  Edit2,
  Settings2,
  Trash2,
  Eye,
  Users,
  Gift,
  Sparkles,
  MessageCircle,
  PartyPopper,
  FileSpreadsheet,
  Download,
  Printer,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useChristmas } from '../../context/ChristmasContext';
import { ExpenseCategory } from '../../types';
import { soundFX } from '../../utils/audio';
import { compressImageFile } from '../../utils/imageCompressor';
import {
  FilterBar,
  ChipGroup,
  SearchInput,
  SortDropdown,
  DateRangePicker,
  AmountRangeFilter,
} from '../ui/FilterBar';

export const FinancesModule: React.FC = () => {
  const {
    currentUser,
    community,
    members,
    activities,
    expenses,
    addExpense,
    deleteExpense,
    contributions,
    receipts,
    registerPaymentReceipt,
    approveReceipt,
    rejectReceipt,
    deleteReceipt,
    financialStats,
    canManageFinances,
    canApproveReceipts,
    updateGlobalQuota,
    updateUserQuota,
    showAlert,
    showConfirm,
  } = useChristmas();

  const [activeTab, setActiveTab] = useState<'contributions' | 'expenses' | 'receipts' | 'summary'>('contributions');

  // Quota Management States
  const [showGlobalQuotaModal, setShowGlobalQuotaModal] = useState(false);
  const [tempGlobalQuota, setTempGlobalQuota] = useState(community.quotaPerPerson || 150000);
  const [applyGlobalToAll, setApplyGlobalToAll] = useState(true);

  const [userQuotaTarget, setUserQuotaTarget] = useState<{ userId: string; name: string; quota: number } | null>(null);
  const [tempUserQuota, setTempUserQuota] = useState(150000);

  // Receipts status filter
  const [receiptStatusFilter, setReceiptStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Modal: Registrar Abono/Pago
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payTargetType, setPayTargetType] = useState<'myself' | 'other'>('myself');
  const [payUserId, setPayUserId] = useState(currentUser?.id || '');
  const [payBeneficiaryId, setPayBeneficiaryId] = useState<string>('');
  const [payAmount, setPayAmount] = useState(100000);
  const [payActivityId, setPayActivityId] = useState<string>('');
  const [payMethod, setPayMethod] = useState<'nequi' | 'daviplata' | 'efectivo' | 'transferencia' | 'tarjeta'>('nequi');
  const [payNotes, setPayNotes] = useState('');
  const [payReferenceNumber, setPayReferenceNumber] = useState('');
  const [payReceiptImage, setPayReceiptImage] = useState<string>('');
  const [previewVoucherUrl, setPreviewVoucherUrl] = useState<string | null>(null);

  // WhatsApp success modal state
  const [showPaySuccessModal, setShowPaySuccessModal] = useState(false);
  const [paySuccessData, setPaySuccessData] = useState<{
    amount: number;
    beneficiaryName: string;
    method: string;
    treasurerName: string;
  } | null>(null);

  // Cuentas Claras Reports State
  const [showCuentasClarasModal, setShowCuentasClarasModal] = useState(false);
  const [cuentasClarasTab, setCuentasClarasTab] = useState<'whatsapp' | 'csv' | 'summary'>('whatsapp');

  const detailedWhatsAppReport = useMemo(() => {
    const nonGuests = members.filter(m => m.role !== 'guest');
    let text = `🎄 *ESTADO DE CUENTAS CLARAS - NAVIDAD 2026*\n`;
    text += `🏛️ *Comunidad:* ${community.name}\n`;
    text += `📅 *Fecha:* ${new Date().toLocaleDateString('es-CO')}\n\n`;

    text += `💰 *RESUMEN GENERAL:*\n`;
    text += `• Meta Presupuestal: $${financialStats.totalBudgetGoal.toLocaleString('es-CO')} COP\n`;
    text += `• Total Recaudado: $${financialStats.totalCollected.toLocaleString('es-CO')} COP (${financialStats.progressPercentage}%)\n`;
    text += `• Total Gastos: $${financialStats.totalExpenses.toLocaleString('es-CO')} COP\n`;
    const cajaDisponible = financialStats.totalCollected - financialStats.totalExpenses;
    text += `• Saldo en Caja Disponible: $${cajaDisponible.toLocaleString('es-CO')} COP\n`;
    text += `• Pendiente por Recaudar: $${financialStats.remainingToCollect.toLocaleString('es-CO')} COP\n\n`;

    text += `👥 *APORTES POR FAMILIAR:*\n`;
    nonGuests.forEach(m => {
      const c = contributions.find(x => x.userId === m.id);
      const target = c ? c.targetAmount : (community.quotaPerPerson || 150000);
      const paid = c ? c.paidAmount : 0;
      const pending = Math.max(0, target - paid);
      const statusEmoji = paid >= target ? '✅' : paid > 0 ? '⚠️' : '❌';
      const statusText = paid >= target ? 'Al día' : paid > 0 ? `Abonó $${paid.toLocaleString('es-CO')}` : 'Sin abonos';
      text += `${statusEmoji} *${m.name}*: ${statusText} (Meta: $${target.toLocaleString('es-CO')}${pending > 0 ? ` | Saldo: $${pending.toLocaleString('es-CO')}` : ''})\n`;
    });

    if (community.paymentDetails) {
      text += `\n💳 *DATOS DE PAGO:*\n`;
      if (community.paymentDetails.nequiNumber) text += `• Nequi: ${community.paymentDetails.nequiNumber}\n`;
      if (community.paymentDetails.daviplataNumber) text += `• Daviplata: ${community.paymentDetails.daviplataNumber}\n`;
      if (community.paymentDetails.accountHolder) text += `• Titular: ${community.paymentDetails.accountHolder}\n`;
    }

    text += `\n🎅 *¡Gracias por hacer posible esta fiesta en familia!*`;
    return text;
  }, [members, community, financialStats, contributions]);

  const handleCopyWhatsAppReport = () => {
    soundFX.playJingleBell();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(detailedWhatsAppReport);
      showAlert('¡Reporte detallado copiado al portapapeles! Listo para enviar por WhatsApp.', 'Reporte Copiado', 'success');
    }
  };

  const handleDownloadCSV = () => {
    soundFX.playClick();
    const nonGuests = members.filter(m => m.role !== 'guest');
    let csv = `\uFEFF`; // UTF-8 BOM for Microsoft Excel

    csv += `REPORTE FINANCIERO CUENTAS CLARAS - NAVIDAD 2026\n`;
    csv += `Comunidad:,"${community.name}"\n`;
    csv += `Fecha de generación:,"${new Date().toLocaleDateString('es-CO')}"\n`;
    csv += `Meta Presupuestal:,$${financialStats.totalBudgetGoal}\n`;
    csv += `Total Recaudado:,$${financialStats.totalCollected}\n`;
    csv += `Total Gastos:,$${financialStats.totalExpenses}\n`;
    csv += `Saldo en Caja:,$${financialStats.totalCollected - financialStats.totalExpenses}\n\n`;

    csv += `--- APORTES POR FAMILIAR ---\n`;
    csv += `Nombre,Rol,Grupo Familiar,Meta Asignada (COP),Monto Pagado (COP),Saldo Pendiente (COP),Estado\n`;
    nonGuests.forEach(m => {
      const c = contributions.find(x => x.userId === m.id);
      const target = c ? c.targetAmount : (community.quotaPerPerson || 150000);
      const paid = c ? c.paidAmount : 0;
      const pending = Math.max(0, target - paid);
      const status = paid >= target ? 'Al día' : paid > 0 ? 'Parcial' : 'Pendiente';
      csv += `"${m.name}","${m.role}","${m.familyGroup || 'Familia'}",${target},${paid},${pending},"${status}"\n`;
    });

    csv += `\n--- COMPROBANTES DE PAGO REGISTRADOS ---\n`;
    csv += `Fecha,Hora,Beneficiario,Pagado Por,Método,Monto (COP),Referencia,Estado,Verificado Por\n`;
    receipts.forEach(r => {
      csv += `"${r.date}","${r.time}","${r.userName}","${r.paidByName || r.userName}","${r.method}",${r.amount},"${r.referenceNumber || 'N/A'}","${r.status}","${r.verifiedBy || 'N/A'}"\n`;
    });

    csv += `\n--- GASTOS EJECUTADOS ---\n`;
    csv += `Fecha,Concepto,Categoría,Monto (COP),Pagado Por,Estado\n`;
    expenses.forEach(e => {
      const payer = members.find(m => m.id === e.paidByUserId)?.name || 'Organizador';
      csv += `"${e.date}","${e.concept}","${e.category}",${e.amount},"${payer}","${e.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cuentas_claras_navidad_2026_${community.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showAlert('¡Archivo CSV descargado con éxito! Puedes abrirlo en Excel para revisar balances.', 'Archivo Descargado', 'success');
  };

  const openPaymentForMyself = () => {
    soundFX.playJingleBell();
    setPayTargetType('myself');
    const myId = currentUser?.id || (members[0]?.id ?? '');
    setPayUserId(myId);
    setPayBeneficiaryId(myId);
    const myCont = displayContributions.find(c => c.userId === myId);
    const pending = myCont ? Math.max(0, myCont.targetAmount - myCont.paidAmount) : 50000;
    setPayAmount(pending > 0 ? pending : 50000);
    setShowPaymentModal(true);
  };

  const openPaymentForOther = (targetMemberId?: string) => {
    soundFX.playClick();
    setPayTargetType('other');
    const firstOther = members.find(m => m.id !== currentUser?.id) || members[0];
    const chosenId = targetMemberId || firstOther?.id || '';
    setPayBeneficiaryId(chosenId);
    setPayUserId(chosenId);
    const targetCont = displayContributions.find(c => c.userId === chosenId);
    const pending = targetCont ? Math.max(0, targetCont.targetAmount - targetCont.paidAmount) : 50000;
    setPayAmount(pending > 0 ? pending : 50000);
    setShowPaymentModal(true);
  };

  const dynamicCategoryDistribution = useMemo(() => {
    const categoryLabels: Record<ExpenseCategory, { label: string; color: string }> = {
      alimentacion: { label: 'Alimentación (Cena, Pavo, Buñuelos, Natilla)', color: 'bg-emerald-400' },
      bebidas: { label: 'Bebidas (Vinos, Refrescos, Champaña)', color: 'bg-amber-400' },
      decoracion: { label: 'Decoración y Faroles', color: 'bg-blue-400' },
      musica: { label: 'Música, Animación y Luces', color: 'bg-rose-400' },
      transporte: { label: 'Transporte y Paseos', color: 'bg-teal-400' },
      logistica: { label: 'Logística, Menaje y Sillas', color: 'bg-purple-400' },
      regalos: { label: 'Regalos, Premios y Rifas', color: 'bg-yellow-400' },
      otros: { label: 'Otros Gastos Varios', color: 'bg-zinc-400' },
    };

    const categoryTotals: Partial<Record<ExpenseCategory, number>> = {};
    let totalSpent = 0;

    for (const exp of expenses) {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      totalSpent += exp.amount;
    }

    if (totalSpent === 0) return [];

    return Object.entries(categoryTotals).map(([cat, amount]) => {
      const info = categoryLabels[cat as ExpenseCategory] || { label: cat, color: 'bg-emerald-400' };
      const percent = Math.round(((amount || 0) / totalSpent) * 100);
      return {
        category: cat,
        label: info.label,
        amount: amount || 0,
        percent,
        color: info.color,
      };
    }).sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const handleDeleteExpense = (expId: string, concept: string) => {
    if (!canManageFinances) {
      showAlert('Solo el tesorero u organizador puede eliminar gastos.', 'Acceso Restringido', 'warning');
      return;
    }
    showConfirm(
      `¿Deseas eliminar el gasto "${concept}"?`,
      () => {
        deleteExpense(expId);
      },
      'Eliminar Gasto'
    );
  };

  const handleApproveReceipt = (id: string) => {
    if (!canApproveReceipts) {
      showAlert('Solo el tesorero u organizador puede verificar comprobantes.', 'Acceso Restringido', 'warning');
      return;
    }
    approveReceipt(id);
  };

  const handleRejectReceipt = (id: string) => {
    if (!canApproveReceipts) {
      showAlert('Solo el tesorero u organizador puede rechazar comprobantes.', 'Acceso Restringido', 'warning');
      return;
    }
    showConfirm(
      '¿Deseas rechazar este comprobante de pago?',
      () => {
        rejectReceipt(id);
      },
      'Rechazar Comprobante'
    );
  };

  // Modal: Registrar Gasto
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expConcept, setExpConcept] = useState('');
  const [expAmount, setExpAmount] = useState(50000);
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('alimentacion');
  const [expPayerId, setExpPayerId] = useState(currentUser?.id || '');

  // Filter for members
  const [memberFilter, setMemberFilter] = useState<'all' | 'pending' | 'paid'>('all');

  // Expense / Receipt advanced filters
  const [expSearchQuery, setExpSearchQuery] = useState('');
  const [expCategoryFilter, setExpCategoryFilter] = useState('');
  const [expAmountMin, setExpAmountMin] = useState('');
  const [expAmountMax, setExpAmountMax] = useState('');
  const [expDateFrom, setExpDateFrom] = useState('');
  const [expDateTo, setExpDateTo] = useState('');
  const [expSortBy, setExpSortBy] = useState('date_desc');

  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;

    // Determine target beneficiary: either myself or another family member
    const finalBeneficiaryId = payTargetType === 'myself'
      ? (currentUser?.id || payUserId || members[0]?.id || '')
      : (payBeneficiaryId || payUserId || currentUser?.id || '');

    if (!finalBeneficiaryId) {
      showAlert('Por favor selecciona el familiar al que se le aplicará el aporte.', 'Familiar Requerido', 'warning');
      return;
    }

    const beneficiary = members.find(m => m.id === finalBeneficiaryId);

    registerPaymentReceipt({
      userId: finalBeneficiaryId,
      amount: Number(payAmount),
      activityId: payActivityId || undefined,
      method: payMethod,
      paidByUserId: currentUser?.id,
      paidByName: currentUser?.name || 'Familiar',
      referenceNumber: payReferenceNumber.trim() || undefined,
      notes: payNotes || (payTargetType === 'other'
        ? `Aporte cancelado por ${currentUser?.name || 'un familiar'} a nombre de ${beneficiary?.name || 'Familiar'}`
        : `Aporte personal de ${currentUser?.name || 'Familiar'}`),
      receiptImage: payReceiptImage,
    });

    // Build WhatsApp notification data before closing modal
    const beneficiaryName = payTargetType === 'myself'
      ? (currentUser?.name || 'mi cuenta')
      : (members.find(m => m.id === payBeneficiaryId)?.name || 'un familiar');
    const treasurer = members.find(m => m.role === 'treasurer') || members.find(m => m.role === 'organizer');
    const methodLabel: Record<string, string> = {
      nequi: 'Nequi', daviplata: 'Daviplata', efectivo: 'Efectivo',
      transferencia: 'Transferencia Bancaria', tarjeta: 'Tarjeta',
    };
    setPaySuccessData({
      amount: payAmount,
      beneficiaryName,
      method: methodLabel[payMethod] || payMethod,
      treasurerName: treasurer?.name || 'el Organizador',
    });

    setShowPaymentModal(false);
    setShowPaySuccessModal(true);
    setPayNotes('');
    setPayReceiptImage('');
    setPayActivityId('');
    setPayReferenceNumber('');
  };

  const handleRegisterExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expConcept.trim() || expAmount <= 0) return;

    addExpense({
      concept: expConcept,
      category: expCategory,
      amount: Number(expAmount),
      paidByUserId: expPayerId,
      date: new Date().toISOString().split('T')[0],
      status: 'approved',
    });

    setShowExpenseModal(false);
    setExpConcept('');
  };

  const handleSimulateVoucher = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImageFile(file, 800, 0.72);
        setPayReceiptImage(compressedBase64);
      } catch (err) {
        console.error('Error al optimizar comprobante:', err);
      }
    }
  };

  const shareFinancesToWhatsApp = () => {
    soundFX.playJingleBell();
    const text = `📊 *ESTADO FINANCIERO - ${community.name}*\n\n` +
      `💰 *Meta Total:* $${financialStats.totalBudgetGoal.toLocaleString('es-CO')} COP\n` +
      `✅ *Recaudado:* $${financialStats.totalCollected.toLocaleString('es-CO')} (${financialStats.progressPercentage}%)\n` +
      `⏳ *Falta por recaudar:* $${financialStats.remainingToCollect.toLocaleString('es-CO')} COP\n` +
      `👥 *Al día:* ${financialStats.paidContributorsCount} personas\n` +
      `⚠️ *Pendientes:* ${financialStats.pendingContributorsCount} personas\n\n` +
      `¡Por favor realicen sus aportes por Nequi/Daviplata para confirmar las compras de la cena y novenas! 🎄`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showAlert('¡Reporte financiero copiado al portapapeles! Listo para pegar en WhatsApp.', 'Reporte Copiado', 'success');
    }
  };

  const displayContributions = useMemo(() => {
    const nonGuests = members.filter(m => m.role !== 'guest');
    return nonGuests
      .map(m => {
        const existing = contributions.find(c => c.userId === m.id);
        if (existing) return { ...existing, member: m };
        return {
          userId: m.id,
          targetAmount: 200000,
          paidAmount: 0,
          status: 'pending' as const,
          member: m,
        };
      })
      .filter(c => {
        if (memberFilter === 'pending') return c.status !== 'paid';
        if (memberFilter === 'paid') return c.status === 'paid';
        return true;
      });
  }, [members, contributions, memberFilter]);

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(exp => {
        if (expSearchQuery && !exp.concept.toLowerCase().includes(expSearchQuery.toLowerCase())) return false;
        if (expCategoryFilter && exp.category !== expCategoryFilter) return false;
        if (expAmountMin && exp.amount < Number(expAmountMin)) return false;
        if (expAmountMax && exp.amount > Number(expAmountMax)) return false;
        if (expDateFrom && exp.date < expDateFrom) return false;
        if (expDateTo && exp.date > expDateTo) return false;
        return true;
      })
      .sort((a, b) => {
        if (expSortBy === 'amount_desc') return b.amount - a.amount;
        if (expSortBy === 'amount_asc') return a.amount - b.amount;
        if (expSortBy === 'date_asc') return a.date.localeCompare(b.date);
        return b.date.localeCompare(a.date); // date_desc default
      });
  }, [expenses, expSearchQuery, expCategoryFilter, expAmountMin, expAmountMax, expDateFrom, expDateTo, expSortBy]);

  const expCategoryChips = [
    { id: 'alimentacion', label: 'Alimentación', emoji: '🍗', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' },
    { id: 'bebidas', label: 'Bebidas', emoji: '🍷', color: 'bg-rose-500/20 text-rose-300 border-rose-400/40' },
    { id: 'decoracion', label: 'Decoración', emoji: '🎄', color: 'bg-amber-500/20 text-amber-300 border-amber-400/40' },
    { id: 'musica', label: 'Música', emoji: '🎵', color: 'bg-purple-500/20 text-purple-300 border-purple-400/40' },
    { id: 'regalos', label: 'Regalos', emoji: '🎁', color: 'bg-blue-500/20 text-blue-300 border-blue-400/40' },
    { id: 'transporte', label: 'Transporte', emoji: '🚌', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40' },
  ];

  const expSortOptions = [
    { id: 'date_desc', label: 'Más recientes' },
    { id: 'date_asc', label: 'Más antiguos' },
    { id: 'amount_desc', label: 'Mayor monto' },
    { id: 'amount_asc', label: 'Menor monto' },
  ];

  const expActiveFiltersCount = [expSearchQuery, expCategoryFilter, expAmountMin, expAmountMax, expDateFrom, expDateTo]
    .filter(Boolean).length;

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Header with Stats & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-amber-300 flex items-center gap-1.5">
            <WalletCards className="w-3.5 h-3.5" /> Finanzas y Gastos Compartidos
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
            Presupuesto Navideño
          </h2>
          <p className="text-xs text-emerald-200/80 mt-0.5">
            Control transparente de aportes, gastos, comprobantes y balances.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              soundFX.playClick();
              setShowCuentasClarasModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-800/60 to-emerald-700/60 hover:from-emerald-700/60 hover:to-emerald-600/60 border border-emerald-400/40 text-emerald-200 text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-300" /> Cuentas Claras & Reportes
          </button>

          {canManageFinances && (
            <button
              onClick={() => {
                soundFX.playClick();
                setShowExpenseModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-berry-900/40 hover:bg-berry-900/60 border border-rose-400/30 text-rose-200 text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" /> Registrar Gasto
            </button>
          )}

          <button
            onClick={openPaymentForMyself}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Registrar Abono / Pago
          </button>
        </div>
      </div>

      {/* ── Banner de Comprobantes Pendientes de Verificación (Para Organizadores y Tesoreros) ── */}
      {canApproveReceipts && (() => {
        const pendingCount = receipts.filter(r => r.status === 'pending').length;
        if (pendingCount === 0) return null;

        return (
          <div className="glass-card rounded-2xl p-4 border border-amber-400/50 bg-gradient-to-r from-amber-500/15 via-emerald-950/40 to-pine-950/80 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 flex-shrink-0">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>🔔 {pendingCount} Comprobante{pendingCount > 1 ? 's' : ''} Pendiente{pendingCount > 1 ? 's' : ''} de Verificación</span>
                  <span className="text-[10px] bg-amber-400 text-pine-950 px-2 py-0.5 rounded-full font-black">Por Aprobar</span>
                </h4>
                <p className="text-xs text-emerald-200/80">
                  Hay familiares que han registrado pagos. Aprueba los comprobantes para sumarlos al total recaudado oficial.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveTab('receipts');
                setReceiptStatusFilter('pending');
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-pine-950 font-bold text-xs shadow-md transition-all whitespace-nowrap self-stretch sm:self-auto text-center"
            >
              Revisar y Aprobar ({pendingCount})
            </button>
          </div>
        );
      })()}

      {/* 2. Main Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Goal */}
        <div className="glass-card rounded-2xl p-4 border border-amber-400/25">
          <span className="text-[11px] font-bold text-emerald-300/80 uppercase">Presupuesto Meta</span>
          <div className="text-2xl font-black font-cinzel text-white mt-1">
            ${financialStats.totalBudgetGoal.toLocaleString('es-CO')}
          </div>
          <span className="text-[10px] text-emerald-300/60">Fijado para la Navidad 2026</span>
        </div>

        {/* Card 2: Recaudado */}
        <div className="glass-card rounded-2xl p-4 border border-emerald-400/30 bg-emerald-950/40">
          <span className="text-[11px] font-bold text-emerald-300 uppercase flex items-center justify-between">
            Total Recaudado
            <span className="text-amber-300 font-mono font-bold">{financialStats.progressPercentage}%</span>
          </span>
          <div className="text-2xl font-black font-cinzel text-amber-300 mt-1">
            ${financialStats.totalCollected.toLocaleString('es-CO')}
          </div>
          <div className="w-full bg-black/40 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full"
              style={{ width: `${financialStats.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Card 3: Faltante */}
        <div className="glass-card rounded-2xl p-4 border border-rose-400/25 bg-berry-950/30">
          <span className="text-[11px] font-bold text-rose-300 uppercase">Falta por Recaudar</span>
          <div className="text-2xl font-black font-cinzel text-rose-300 mt-1">
            ${financialStats.remainingToCollect.toLocaleString('es-CO')}
          </div>
          <span className="text-[10px] text-rose-200/60">
            {financialStats.pendingContributorsCount} personas con saldo pendiente
          </span>
        </div>

        {/* Card 4: Gastos Ejecutados */}
        <div className="glass-card rounded-2xl p-4 border border-blue-400/25">
          <span className="text-[11px] font-bold text-blue-300 uppercase">Gastos Ejecutados</span>
          <div className="text-2xl font-black font-cinzel text-blue-200 mt-1">
            ${financialStats.totalExpenses.toLocaleString('es-CO')}
          </div>
          <span className="text-[10px] text-blue-200/60">
            {expenses.length} conceptos registrados
          </span>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        {[
          { id: 'contributions', label: `Aportes por Persona (${contributions.length})`, icon: UserCheck },
          { id: 'expenses', label: `Gastos & Compras (${expenses.length})`, icon: DollarSign },
          { id: 'receipts', label: `Comprobantes (${receipts.length})`, icon: Receipt },
          { id: 'summary', label: 'Distribución por Categorías', icon: PieChart },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundFX.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
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

      {/* Tab 1: Aportes por Persona */}
      {activeTab === 'contributions' && (
        <div className="space-y-4">
          {/* Banner de Cuota Base por Persona */}
          <div className="glass-card p-4 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/10 via-emerald-950/30 to-pine-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-300 flex items-center gap-1.5">
                <Settings2 className="w-3.5 h-3.5" /> Meta de Aporte Familiar
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                  ${(community.quotaPerPerson || 150000).toLocaleString('es-CO')}
                </span>
                <span className="text-xs text-emerald-300/80">COP por persona / familiar</span>
              </div>
              <p className="text-[11px] text-emerald-200/70">
                Esta es la cuota base que se asigna a cada miembro. Puedes ajustarla para todos o personalizarla por familiar.
              </p>
            </div>

            {canManageFinances && (
              <button
                onClick={() => {
                  soundFX.playClick();
                  setTempGlobalQuota(community.quotaPerPerson || 150000);
                  setApplyGlobalToAll(true);
                  setShowGlobalQuotaModal(true);
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 font-bold text-xs whitespace-nowrap shadow-sm hover:scale-[1.02] transition-all"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>Configurar Cuota General</span>
              </button>
            )}
          </div>

          {/* ── Tarjeta Destacada de Mi Aporte Personal ── */}
          {currentUser && (() => {
            const myCont = displayContributions.find(c => c.userId === currentUser.id);
            const myQuota = myCont?.targetAmount || community.quotaPerPerson || 150000;
            const myPaid = myCont?.paidAmount || 0;
            const myPending = Math.max(0, myQuota - myPaid);
            const myPercent = Math.min(100, Math.round((myPaid / (myQuota || 1)) * 100));
            const isCompleted = myPaid >= myQuota;

            return (
              <div className="glass-card p-5 rounded-3xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-500/15 via-emerald-950/60 to-pine-950/90 shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-lg"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-white font-cinzel">
                          Mi Aporte Personal: {currentUser.name}
                        </h3>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                          {currentUser.role === 'organizer' ? '👑 Organizador' : currentUser.role === 'treasurer' ? '💰 Tesorero' : '🎄 Familiar'}
                        </span>
                      </div>
                      <span className="text-xs text-emerald-200/80">
                        {currentUser.familyGroup || 'Familia'} · Meta individual: ${myQuota.toLocaleString('es-CO')} COP
                      </span>
                    </div>
                  </div>

                  {isCompleted ? (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/30 text-emerald-300 border border-emerald-400 flex items-center gap-1.5 self-start sm:self-auto shadow-md">
                      <Sparkles className="w-4 h-4 text-amber-300" /> ¡Meta Cumplida al 100%! 🏆
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-400/40 self-start sm:self-auto">
                      ⏳ Faltan ${myPending.toLocaleString('es-CO')} COP
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 bg-black/40 p-3 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-amber-300 font-bold">
                      Aportado por ti: ${myPaid.toLocaleString('es-CO')} ({myPercent}%)
                    </span>
                    <span className="text-emerald-300/80">
                      Meta fijada: ${myQuota.toLocaleString('es-CO')}
                    </span>
                  </div>
                  <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-gradient-to-r from-emerald-400 to-amber-300' : 'bg-amber-400'
                      }`}
                      style={{ width: `${myPercent}%` }}
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-emerald-300/70">
                    {isCompleted
                      ? '¡Excelente! Tu cuota está completa. Puedes realizar abonos adicionales o pagar la cuota de otro familiar.'
                      : 'Puedes cancelar tu aporte por cuotas o completo mediante Nequi, Daviplata o Efectivo.'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openPaymentForOther()}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800/40 hover:bg-emerald-800/60 border border-emerald-400/30 text-emerald-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Pagar por un Familiar</span>
                    </button>

                    <button
                      type="button"
                      onClick={openPaymentForMyself}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-pine-950 text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>{isCompleted ? 'Hacer Abono Extra' : 'Realizar Mi Aporte'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Beautiful Filter Bar for contributions */}
          <FilterBar
            label="Filtrar Aportes"
            activeFiltersCount={memberFilter !== 'all' ? 1 : 0}
            onClearAll={() => setMemberFilter('all')}
            defaultOpen={true}
          >
            <ChipGroup
              label="Estado del aporte"
              options={[
                { id: 'all', label: `Todos (${contributions.length})`, emoji: '👥', color: 'bg-white/15 text-white border-white/30' },
                { id: 'pending', label: `Pendientes (${financialStats.pendingContributorsCount})`, emoji: '⚠️', color: 'bg-rose-500/20 text-rose-300 border-rose-400/40' },
                { id: 'paid', label: `Al día (${financialStats.paidContributorsCount})`, emoji: '✅', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' },
              ]}
              value={memberFilter}
              onChange={(id) => setMemberFilter((id || 'all') as any)}
            />
          </FilterBar>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {displayContributions.map(cont => {
              const member = cont.member || members.find(m => m.id === cont.userId);
              if (!member) return null;
              const pending = Math.max(0, cont.targetAmount - cont.paidAmount);
              const percent = Math.min(100, Math.round((cont.paidAmount / (cont.targetAmount || 1)) * 100));

              return (
                <div
                  key={cont.userId}
                  className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">
                          {member.name}
                        </h4>
                        <span className="text-[11px] text-emerald-300/70">
                          {member.familyGroup || 'Familia'}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        cont.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                          : cont.status === 'partial'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                      }`}
                    >
                      {cont.status === 'paid' ? '✓ Pagado' : cont.status === 'partial' ? '⏳ Abono Parcial' : '⚠️ Pendiente'}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-amber-300 font-bold">
                        Aportado: ${cont.paidAmount.toLocaleString('es-CO')}
                      </span>
                      <div className="flex items-center gap-1.5 text-emerald-200/80">
                        <span>Cuota: ${cont.targetAmount.toLocaleString('es-CO')}</span>
                        {canManageFinances && (
                          <button
                            type="button"
                            title={`Modificar cuota para ${member.name}`}
                            onClick={() => {
                              soundFX.playClick();
                              setUserQuotaTarget({
                                userId: cont.userId,
                                name: member.name,
                                quota: cont.targetAmount,
                              });
                              setTempUserQuota(cont.targetAmount);
                            }}
                            className="p-1 rounded-md hover:bg-amber-400/20 text-amber-400/70 hover:text-amber-300 transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          cont.status === 'paid' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                    <span className="text-rose-300 text-[11px]">
                      {pending > 0 ? `Faltan $${pending.toLocaleString('es-CO')}` : '¡Cuota completa! 🎁'}
                    </span>

                    <button
                      onClick={() => {
                        if (currentUser?.id === member.id) {
                          openPaymentForMyself();
                        } else {
                          openPaymentForOther(member.id);
                        }
                      }}
                      className="px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 font-semibold text-xs active:scale-95 cursor-pointer"
                    >
                      {currentUser?.id === member.id ? 'Realizar Mi Aporte' : '+ Abonar por este familiar'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Gastos y Compras */}
      {activeTab === 'expenses' && (
        <div className="space-y-3">
          {/* Beautiful Filter Bar for expenses */}
          <FilterBar
            label="Filtrar Gastos"
            activeFiltersCount={expActiveFiltersCount}
            onClearAll={() => {
              setExpSearchQuery('');
              setExpCategoryFilter('');
              setExpAmountMin('');
              setExpAmountMax('');
              setExpDateFrom('');
              setExpDateTo('');
              setExpSortBy('date_desc');
            }}
          >
            {/* Row 1: Search + Sort */}
            <div className="flex items-center gap-3 flex-wrap">
              <SearchInput
                value={expSearchQuery}
                onChange={setExpSearchQuery}
                placeholder="Buscar gasto o concepto…"
              />
              <SortDropdown
                options={expSortOptions}
                value={expSortBy}
                onChange={setExpSortBy}
                label="Ordenar"
              />
            </div>
            {/* Row 2: Category chips */}
            <ChipGroup
              label="Categoría"
              options={expCategoryChips}
              value={expCategoryFilter}
              onChange={setExpCategoryFilter}
            />
            {/* Row 3: Amount range + Date range */}
            <div className="flex items-center gap-4 flex-wrap">
              <AmountRangeFilter
                min={expAmountMin}
                max={expAmountMax}
                onMinChange={setExpAmountMin}
                onMaxChange={setExpAmountMax}
                currency="$"
              />
              <DateRangePicker
                fromDate={expDateFrom}
                toDate={expDateTo}
                onFromChange={setExpDateFrom}
                onToChange={setExpDateTo}
                label="Fecha"
              />
            </div>
          </FilterBar>

          <div className="space-y-2">
            {filteredExpenses.map(exp => {
              const payer = members.find(m => m.id === exp.paidByUserId);
              return (
                <div
                  key={exp.id}
                  className="glass-card p-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-berry-900/30 border border-rose-400/30 flex items-center justify-center text-rose-400 flex-shrink-0">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        {exp.concept}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-emerald-300/70 mt-0.5">
                        <span className="capitalize">{exp.category}</span>
                        <span>•</span>
                        <span>Pagado por: {payer?.name || 'Comunidad'}</span>
                        <span>•</span>
                        <span>{exp.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm sm:text-base font-bold font-cinzel text-amber-300 block">
                      ${exp.amount.toLocaleString('es-CO')}
                    </span>
                    {canManageFinances && (
                      <button
                        type="button"
                        onClick={() => handleDeleteExpense(exp.id, exp.concept)}
                        className="text-[10px] text-rose-300 hover:text-rose-100 hover:underline cursor-pointer"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Comprobantes */}
      {activeTab === 'receipts' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-emerald-200/80">
              Historial de pagos registrados mediante Nequi, Daviplata, efectivo o transferencia.
            </p>
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'pending', label: 'Pendientes' },
                { id: 'approved', label: 'Aprobados' },
                { id: 'rejected', label: 'Rechazados' },
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setReceiptStatusFilter(f.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    receiptStatusFilter === f.id
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                      : 'text-emerald-200/60 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {receipts
              .filter(rec => receiptStatusFilter === 'all' || rec.status === receiptStatusFilter)
              .map(rec => (
                <div
                  key={rec.id}
                  className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 flex-shrink-0">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white">{rec.userName}</h4>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                          {rec.method}
                        </span>
                        {rec.paidByName && rec.paidByName !== rec.userName && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                            <Gift className="w-3 h-3" /> Pagado por: {rec.paidByName}
                          </span>
                        )}
                        {rec.activityId && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                            🍗 {activities.find(a => a.id === rec.activityId)?.title || 'Actividad'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-emerald-200/70 mt-0.5">
                        {rec.notes || 'Aporte navideño'}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-emerald-300/60 font-mono mt-1 flex-wrap">
                        <span>{rec.date} · {rec.time}</span>
                        {rec.referenceNumber && (
                          <span className="bg-black/40 px-1.5 py-0.5 rounded border border-white/10 text-emerald-300">
                            Ref: #{rec.referenceNumber}
                          </span>
                        )}
                        {rec.verifiedBy && (
                          <span className="text-amber-300/80">
                            (Verificado por {rec.verifiedBy})
                          </span>
                        )}
                      </div>

                      {rec.receiptImage && (
                        <div className="mt-2">
                          <button
                            type="button"
                            onClick={() => setPreviewVoucherUrl(rec.receiptImage || null)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-400/30 text-emerald-300 hover:text-white text-[11px] font-semibold transition-all cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> Ver Comprobante Adjunto
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-between sm:justify-end flex-wrap">
                    <span className="text-base font-bold font-cinzel text-amber-300">
                      +${rec.amount.toLocaleString('es-CO')}
                    </span>

                    {rec.status === 'pending' ? (
                      canApproveReceipts ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleApproveReceipt(rec.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-pine-950 text-xs font-bold transition-all shadow-sm cursor-pointer"
                          >
                            ✓ Aprobar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectReceipt(rec.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300 text-xs font-bold transition-all cursor-pointer"
                          >
                            ✗ Rechazar
                          </button>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-300 font-semibold bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-500/30">
                          ⏳ Pendiente
                        </span>
                      )
                    ) : rec.status === 'approved' ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Aprobado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-rose-400 font-semibold bg-rose-950/60 px-2.5 py-1 rounded-xl border border-rose-500/30">
                        <X className="w-3.5 h-3.5" /> Rechazado
                      </span>
                    )}

                    {canApproveReceipts && (
                      <button
                        type="button"
                        onClick={() => deleteReceipt(rec.id)}
                        title="Eliminar comprobante"
                        className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400/70 hover:text-rose-300 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 4: Resumen de Distribución */}
      {activeTab === 'summary' && (
        <div className="glass-card p-6 rounded-3xl border border-amber-400/30 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-cinzel text-white">
              Distribución de Gastos Presupuestados
            </h3>
            <span className="text-xs text-amber-300 font-semibold">
              Total ejecutado: ${financialStats.totalExpenses.toLocaleString('es-CO')}
            </span>
          </div>
          <p className="text-xs text-emerald-200/80">
            Desglose porcentual para que todo esté claro y la familia sepa en qué se invierte el fondo navideño.
          </p>

          {dynamicCategoryDistribution.length === 0 ? (
            <div className="p-8 rounded-2xl bg-black/20 border border-white/5 text-center space-y-2">
              <PieChart className="w-8 h-8 text-amber-400/60 mx-auto" />
              <p className="text-sm font-semibold text-white">Aún no hay gastos ejecutados</p>
              <p className="text-xs text-emerald-200/70 max-w-md mx-auto">
                A medida que el Tesorero u Organizador registre compras (alimentación, bebidas, música, decoración), el gráfico de distribución en tiempo real se calculará automáticamente aquí.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dynamicCategoryDistribution.map((cat, idx) => (
                <div key={idx} className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-white">{cat.label}</span>
                    <span className="text-amber-300">
                      ${cat.amount.toLocaleString('es-CO')} ({cat.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Registrar Abono/Pago */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md glass-card border border-amber-400/40 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-base font-bold font-cinzel text-white flex items-center gap-2">
                <WalletCards className="w-5 h-5 text-amber-400" /> Registrar Abono / Pago
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-emerald-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterPayment} className="space-y-4 text-xs">
              {/* Selector de Beneficiario: Para Mí vs Para un Familiar */}
              <div>
                <label className="block text-emerald-300 font-bold mb-1.5">
                  ¿Para quién es este aporte?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPayTargetType('myself');
                      const myId = currentUser?.id || (members[0]?.id ?? '');
                      setPayUserId(myId);
                      setPayBeneficiaryId(myId);
                      const myCont = displayContributions.find(c => c.userId === myId);
                      const pending = myCont ? Math.max(0, myCont.targetAmount - myCont.paidAmount) : 50000;
                      setPayAmount(pending > 0 ? pending : 50000);
                    }}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                      payTargetType === 'myself'
                        ? 'bg-amber-400/25 border-amber-400 text-amber-300 shadow-sm'
                        : 'bg-black/30 border-white/10 text-emerald-200/70 hover:border-white/20'
                    }`}
                  >
                    <span>👤 Para mí mismo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPayTargetType('other');
                      const firstOther = members.find(m => m.id !== currentUser?.id) || members[0];
                      const chosenId = firstOther?.id || '';
                      setPayBeneficiaryId(chosenId);
                      setPayUserId(chosenId);
                      const cont = displayContributions.find(c => c.userId === chosenId);
                      const pending = cont ? Math.max(0, cont.targetAmount - cont.paidAmount) : 50000;
                      setPayAmount(pending > 0 ? pending : 50000);
                    }}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                      payTargetType === 'other'
                        ? 'bg-amber-400/25 border-amber-400 text-amber-300 shadow-sm'
                        : 'bg-black/30 border-white/10 text-emerald-200/70 hover:border-white/20'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Pagar por un familiar</span>
                  </button>
                </div>
              </div>

              {payTargetType === 'other' ? (
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">
                    Seleccionar Familiar Beneficiario *
                  </label>
                  <select
                    value={payBeneficiaryId}
                    onChange={e => {
                      const chosenId = e.target.value;
                      setPayBeneficiaryId(chosenId);
                      setPayUserId(chosenId);
                      const cont = displayContributions.find(c => c.userId === chosenId);
                      const pending = cont ? Math.max(0, cont.targetAmount - cont.paidAmount) : 50000;
                      setPayAmount(pending > 0 ? pending : 50000);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                  >
                    {members.map(m => {
                      const c = displayContributions.find(cont => cont.userId === m.id);
                      const pending = c ? Math.max(0, c.targetAmount - c.paidAmount) : 0;
                      return (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.familyGroup || 'Familia'}) {pending > 0 ? `· Faltan: $${pending.toLocaleString('es-CO')}` : '· ¡Cuota al día!'}
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-[10px] text-amber-300/80 mt-1">
                    El aporte se abonará a la meta de este familiar, indicando que fue pagado por ti ({currentUser?.name}).
                  </p>
                </div>
              ) : (
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-emerald-200/80">Abonando a tu cuenta:</span>
                  <span className="font-bold text-amber-300">{currentUser?.name}</span>
                </div>
              )}

              <div>
                <label className="block text-emerald-300 font-bold mb-1">
                  Monto aportado (COP) *
                </label>
                <input
                  type="number"
                  step="5000"
                  required
                  value={payAmount}
                  onChange={e => setPayAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-sm font-bold font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">
                  ¿Para qué actividad o fondo es este aporte?
                </label>
                <select
                  value={payActivityId}
                  onChange={e => setPayActivityId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="">🌟 Fondo General Navideño</option>
                  {activities.map(act => (
                    <option key={act.id} value={act.id}>
                      {act.type === 'dinner' ? '🍗' : '🕯️'} {act.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">
                  Método de Pago
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'nequi', label: '📲 Nequi' },
                    { id: 'daviplata', label: '🔴 Daviplata' },
                    { id: 'efectivo', label: '💵 Efectivo' },
                    { id: 'transferencia', label: '🏦 Transferencia' },
                    { id: 'tarjeta', label: '💳 Tarjeta' },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayMethod(m.id as any)}
                      className={`p-2 rounded-xl text-center font-bold text-[11px] border transition-all ${
                        payMethod === m.id
                          ? 'bg-amber-400/25 border-amber-400 text-amber-300'
                          : 'bg-black/30 border-white/10 text-emerald-200/70 hover:border-white/20'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {payMethod === 'efectivo' ? (
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-400/30 text-emerald-200/90 text-[11px] space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    💵 Entrega en Efectivo
                  </div>
                  <p>
                    Entrega el dinero directamente al tesorero u organizador. No requieres adjuntar captura; el comprobante se enviará para que el tesorero lo apruebe.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-emerald-300 font-bold mb-1">
                      Número de Referencia / Aprobación (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: M-189302 o últimos 4 dígitos"
                      value={payReferenceNumber}
                      onChange={e => setPayReferenceNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-emerald-300 font-bold mb-1">
                      Adjuntar Comprobante (Captura de Pago)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSimulateVoucher}
                      className="w-full text-xs text-emerald-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-pine-950 hover:file:bg-amber-400"
                    />
                    {payReceiptImage && (
                      <div className="mt-2 text-emerald-300 text-[11px] flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Comprobante cargado correctamente
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Notas / Mensaje Navideño</label>
                <input
                  type="text"
                  placeholder="Ej: Cuota de diciembre, ¡Feliz Navidad familia!"
                  value={payNotes}
                  onChange={e => setPayNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-emerald-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 font-black shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
                >
                  Confirmar Aporte 🎁
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Registrar Gasto */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md glass-card border border-rose-400/40 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-base font-bold font-cinzel text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-rose-400" /> Registrar Gasto Comunitario
              </h3>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="text-emerald-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterExpense} className="space-y-4 text-xs">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">Concepto del Gasto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Pernil de cerdo ahumado, 50 faroles, etc."
                  value={expConcept}
                  onChange={e => setExpConcept(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Monto Pagado *</label>
                  <input
                    type="number"
                    step="5000"
                    required
                    value={expAmount}
                    onChange={e => setExpAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Categoría</label>
                  <select
                    value={expCategory}
                    onChange={e => setExpCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white"
                  >
                    <option value="alimentacion">Alimentación</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="decoracion">Decoración</option>
                    <option value="musica">Música / Sonido</option>
                    <option value="regalos">Regalos / Solidaria</option>
                    <option value="transporte">Transporte</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">¿Quién pagó la factura?</label>
                <select
                  value={expPayerId}
                  onChange={e => setExpPayerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 text-emerald-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  Guardar Gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Configurar Cuota General */}
      {showGlobalQuotaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-amber-400/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold font-cinzel text-white flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-amber-400" /> Cuota General por Familiar
              </h3>
              <button
                onClick={() => setShowGlobalQuotaModal(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-emerald-200/80">
              Define el valor meta de aporte que debe dar cada miembro de la familia para el fondo navideño.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-emerald-300 font-bold text-xs mb-1">
                  Monto de la Cuota (COP)
                </label>
                <input
                  type="number"
                  step="10000"
                  min="0"
                  value={tempGlobalQuota}
                  onChange={e => setTempGlobalQuota(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white font-mono font-bold text-lg"
                  placeholder="150000"
                />
                <div className="flex gap-2 mt-2">
                  {[100000, 150000, 200000, 250000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTempGlobalQuota(amt)}
                      className={`text-[10px] px-2 py-1 rounded-lg border font-mono ${
                        tempGlobalQuota === amt
                          ? 'bg-amber-400/30 text-amber-200 border-amber-400'
                          : 'bg-white/5 text-emerald-300/80 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      ${(amt / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-xl bg-white/5 border border-white/10">
                <input
                  type="checkbox"
                  checked={applyGlobalToAll}
                  onChange={e => setApplyGlobalToAll(e.target.checked)}
                  className="mt-0.5 rounded border-emerald-400 text-amber-500 focus:ring-amber-400"
                />
                <div className="text-xs">
                  <span className="font-semibold text-white block">
                    Actualizar a todos los familiares actuales
                  </span>
                  <span className="text-[11px] text-emerald-300/70">
                    Si está marcado, todos los familiares verán su meta ajustada a este monto.
                  </span>
                </div>
              </label>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGlobalQuotaModal(false)}
                  className="px-4 py-2 text-emerald-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateGlobalQuota(tempGlobalQuota, applyGlobalToAll);
                    setShowGlobalQuotaModal(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-pine-950 font-bold text-xs shadow-lg transition-transform hover:scale-105"
                >
                  Guardar Cuota
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Ajustar Cuota Individual de un Familiar */}
      {userQuotaTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-sm w-full p-6 rounded-3xl border border-amber-400/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold font-cinzel text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" /> Cuota Individual
              </h3>
              <button
                onClick={() => setUserQuotaTarget(null)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-emerald-200/80">
              Personaliza la meta de aporte para <strong className="text-amber-300">{userQuotaTarget.name}</strong>.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-emerald-300 font-bold text-xs mb-1">
                  Monto de Cuota (COP)
                </label>
                <input
                  type="number"
                  step="10000"
                  min="0"
                  value={tempUserQuota}
                  onChange={e => setTempUserQuota(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white font-mono font-bold text-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUserQuotaTarget(null)}
                  className="px-4 py-2 text-emerald-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateUserQuota(userQuotaTarget.userId, tempUserQuota);
                    setUserQuotaTarget(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-pine-950 font-bold text-xs shadow-lg transition-transform hover:scale-105"
                >
                  Actualizar Cuota
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal: Vista Completa de Comprobante (Lightbox) */}
      {previewVoucherUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="glass-card max-w-lg w-full p-4 rounded-3xl border border-amber-400/50 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-sm font-bold font-cinzel text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-400" /> Comprobante de Pago Adjunto
              </h3>
              <button
                onClick={() => setPreviewVoucherUrl(null)}
                className="text-white/60 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto rounded-2xl border border-white/10 bg-black/50 p-2 flex items-center justify-center">
              <img
                src={previewVoucherUrl}
                alt="Comprobante de pago"
                className="max-h-[65vh] w-auto object-contain rounded-xl shadow-lg"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setPreviewVoucherUrl(null)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-pine-950 font-bold text-xs"
              >
                Cerrar Vista
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal: Éxito de Pago + CTA WhatsApp */}
      {showPaySuccessModal && paySuccessData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card max-w-sm w-full p-6 rounded-3xl border border-emerald-400/50 shadow-2xl space-y-5 text-center">
            {/* Icono animado */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/30 to-green-600/30 border-2 border-emerald-400/60 flex items-center justify-center shadow-xl shadow-emerald-900/40">
                <PartyPopper className="w-10 h-10 text-emerald-300" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black font-cinzel text-white">¡Aporte Registrado!</h3>
              <p className="text-xs text-emerald-300/80">
                Tu pago está en proceso de aprobación por {paySuccessData.treasurerName}.
              </p>
            </div>

            {/* Resumen del pago */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/60">Monto</span>
                <span className="font-black text-emerald-300 text-sm">
                  ${paySuccessData.amount.toLocaleString('es-CO')} COP
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">A nombre de</span>
                <span className="font-bold text-white">{paySuccessData.beneficiaryName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Método</span>
                <span className="font-bold text-amber-300">{paySuccessData.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Estado</span>
                <span className="font-bold text-yellow-300 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Pendiente de aprobación
                </span>
              </div>
            </div>

            {/* Botón WhatsApp */}
            <button
              onClick={() => {
                const msg = encodeURIComponent(
                  `🎄 ¡Hola ${paySuccessData.treasurerName}! Acabo de registrar mi aporte de *$${paySuccessData.amount.toLocaleString('es-CO')} COP* por *${paySuccessData.method}* en Natividad 2026 a nombre de *${paySuccessData.beneficiaryName}*. ¡Quedo atento a tu aprobación! 🎁✅`
                );
                window.open(`https://wa.me/?text=${msg}`, '_blank');
              }}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-black text-sm shadow-lg shadow-green-900/40 transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              Notificar al Tesorero por WhatsApp
            </button>

            <button
              onClick={() => { setShowPaySuccessModal(false); setPaySuccessData(null); }}
              className="w-full py-2.5 rounded-2xl border border-white/10 text-white/60 hover:text-white text-xs font-semibold transition-colors"
            >
              Cerrar y continuar
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: Centro de Reportes "Cuentas Claras" ── */}
      {showCuentasClarasModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card max-w-2xl w-full rounded-3xl p-6 sm:p-7 border border-amber-400/40 shadow-2xl relative my-8 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-pine-950 shadow-md">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    Transparencia Familiar
                  </span>
                  <h3 className="text-xl font-bold font-cinzel text-white">
                    Centro de Reportes "Cuentas Claras"
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCuentasClarasModal(false)}
                className="text-white/60 hover:text-white text-2xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex rounded-2xl bg-black/40 p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setCuentasClarasTab('whatsapp')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  cuentasClarasTab === 'whatsapp'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-emerald-300/70 hover:text-white'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" /> Desglose WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setCuentasClarasTab('csv')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  cuentasClarasTab === 'csv'
                    ? 'bg-amber-500 text-pine-950 shadow-md'
                    : 'text-emerald-300/70 hover:text-white'
                }`}
              >
                <Download className="w-3.5 h-3.5" /> Descargar CSV / Excel
              </button>
              <button
                type="button"
                onClick={() => setCuentasClarasTab('summary')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  cuentasClarasTab === 'summary'
                    ? 'bg-white/20 text-white shadow-md'
                    : 'text-emerald-300/70 hover:text-white'
                }`}
              >
                <Printer className="w-3.5 h-3.5" /> Vista Imprimible
              </button>
            </div>

            {/* TAB 1: WhatsApp Report */}
            {cuentasClarasTab === 'whatsapp' && (
              <div className="space-y-4">
                <p className="text-xs text-emerald-200/80">
                  Desglose individual y transparente con el estado de cada familiar, saldo en caja y datos de pago listo para enviar al grupo familiar:
                </p>

                <div className="bg-black/60 rounded-2xl p-4 border border-white/10 font-mono text-xs text-emerald-200 whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed select-all">
                  {detailedWhatsAppReport}
                </div>

                <div className="flex flex-wrap gap-2.5 justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleCopyWhatsAppReport}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-300" /> Copiar al Portapapeles
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playJingleBell();
                      const url = `https://wa.me/?text=${encodeURIComponent(detailedWhatsAppReport)}`;
                      window.open(url, '_blank');
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-black text-xs shadow-lg shadow-green-900/40 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" /> Enviar por WhatsApp
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: Download CSV */}
            {cuentasClarasTab === 'csv' && (
              <div className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-4 text-xs text-amber-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Estructura del archivo exportado:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-emerald-100/90 text-[11px]">
                    <li><strong>Sección 1 (Aportes Familiares):</strong> Metas asignadas, monto abonado, saldos pendientes y estado de pago de cada miembro.</li>
                    <li><strong>Sección 2 (Comprobantes de Pago):</strong> Historial completo de recibos, método de pago, referencia y estado de verificación.</li>
                    <li><strong>Sección 3 (Gastos Oficiales):</strong> Registro de compras, categorías (alimentación, bebidas, música, etc.) y persona responsable.</li>
                  </ul>
                  <p className="text-[10px] text-amber-300/80 italic">
                    * El archivo incluye codificación UTF-8 con BOM para que abra perfectamente con tildes y signos de peso en Microsoft Excel y Google Sheets.
                  </p>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadCSV}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:scale-102 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Descargar CSV (cuentas_claras_navidad_2026.csv)
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: Printable Summary */}
            {cuentasClarasTab === 'summary' && (
              <div className="space-y-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div>
                      <h4 className="font-bold text-white text-sm">{community.name}</h4>
                      <span className="text-[10px] text-emerald-300/70">Balance Oficial de Cierre</span>
                    </div>
                    <span className="text-[10px] text-white/50">{new Date().toLocaleDateString('es-CO')}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-emerald-300/70 block">Meta</span>
                      <span className="font-bold text-white">${financialStats.totalBudgetGoal.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-emerald-300/70 block">Recaudado</span>
                      <span className="font-bold text-amber-400">${financialStats.totalCollected.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-rose-300/70 block">Gastado</span>
                      <span className="font-bold text-rose-300">${financialStats.totalExpenses.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-emerald-300/70 block">En Caja</span>
                      <span className="font-bold text-emerald-400">
                        ${(financialStats.totalCollected - financialStats.totalExpenses).toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-2 flex justify-between text-[11px]">
                    <span className="text-white/70">Familiares al día:</span>
                    <span className="font-bold text-emerald-300">{financialStats.paidContributorsCount} personas</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/70">Familiares con saldo pendiente:</span>
                    <span className="font-bold text-rose-300">{financialStats.pendingContributorsCount} personas</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      if (typeof window !== 'undefined') window.print();
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-amber-300" /> Imprimir Balance Familiar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
