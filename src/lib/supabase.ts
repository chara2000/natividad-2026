import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder')
  );
};

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabaseInstance;
};

// Check if tables are already created in Supabase
export async function checkSupabaseTables(): Promise<{ connected: boolean; tablesCreated: boolean; error?: string }> {
  const sb = getSupabase();
  if (!sb) {
    return { connected: false, tablesCreated: false, error: 'No hay credenciales configuradas' };
  }

  try {
    const { data, error } = await sb.from('communities').select('id').limit(1);
    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
        return { connected: true, tablesCreated: false, error: 'Falta ejecutar el script SQL en Supabase' };
      }
      if (error.code === '401' || error.message?.includes('JWT') || error.message?.includes('unauthorized') || error.message?.includes('Invalid API key')) {
        return { connected: false, tablesCreated: false, error: 'Clave pública anon de Supabase requerida' };
      }
      return { connected: true, tablesCreated: false, error: error.message };
    }
    return { connected: true, tablesCreated: true };
  } catch (err: any) {
    return { connected: false, tablesCreated: false, error: err?.message || 'Error de conexión' };
  }
}

// -------------------------------------------------------------
// CRUD: Communities
// -------------------------------------------------------------
export async function fetchCommunitiesFromDB() {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('communities').select('*');
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function saveCommunityToDB(comm: any) {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('communities').upsert({
      id: comm.id,
      name: comm.name,
      slogan: comm.slogan,
      year: comm.year,
      total_budget_goal: comm.totalBudgetGoal,
      currency: comm.currency,
      invite_code: comm.inviteCode,
    }).select().single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

// -------------------------------------------------------------
// CRUD: Activities
// -------------------------------------------------------------
export async function fetchActivitiesFromDB(communityId: string) {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from('activities')
      .select('*, itineraries(*), itinerary_tasks(*), potluck_dishes(*)')
      .eq('community_id', communityId);
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function createActivityInDB(activity: any) {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('activities').insert({
      id: activity.id,
      community_id: activity.communityId,
      title: activity.title,
      type: activity.type,
      description: activity.description,
      date: activity.date,
      time: activity.time,
      location: activity.location,
      estimated_budget: activity.estimatedBudget,
      status: activity.status || 'upcoming',
      novena_day: activity.novenaDay || null,
    }).select().single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export const syncActivityToSupabase = createActivityInDB;
export const syncExpenseToSupabase = createExpenseInDB;
export const syncReceiptToSupabase = createReceiptInDB;

export async function deleteActivityFromDB(activityId: string) {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from('activities').delete().eq('id', activityId);
    return !error;
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// CRUD: Expenses
// -------------------------------------------------------------
export async function fetchExpensesFromDB(communityId: string) {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from('expenses')
      .select('*')
      .eq('community_id', communityId);
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function createExpenseInDB(expense: any) {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('expenses').insert({
      id: expense.id,
      community_id: expense.communityId || 'comm-principal',
      activity_id: expense.activityId || null,
      concept: expense.concept,
      category: expense.category,
      amount: expense.amount,
      paid_by_user_id: expense.paidByUserId,
      date: expense.date,
      status: expense.status || 'approved',
    }).select().single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function deleteExpenseFromDB(expenseId: string) {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from('expenses').delete().eq('id', expenseId);
    return !error;
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// CRUD: Payment Receipts & Contributions
// -------------------------------------------------------------
export async function fetchReceiptsFromDB(communityId: string) {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from('payment_receipts')
      .select('*')
      .eq('community_id', communityId);
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function createReceiptInDB(receipt: any) {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('payment_receipts').insert({
      id: receipt.id,
      community_id: receipt.communityId || 'comm-principal',
      user_id: receipt.userId,
      amount: receipt.amount,
      method: receipt.method,
      date: receipt.date,
      time: receipt.time || '12:00',
      notes: receipt.notes,
      receipt_image_url: receipt.receiptImage || null,
      status: receipt.status || 'approved',
      verified_by: receipt.verifiedBy || null,
    }).select().single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

// -------------------------------------------------------------
// CRUD: Polls
// -------------------------------------------------------------
export async function fetchPollsFromDB(communityId: string) {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from('polls')
      .select('*, poll_options(*)')
      .eq('community_id', communityId);
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function createPollInDB(poll: any) {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data: pollData, error: pollError } = await sb.from('polls').insert({
      id: poll.id,
      community_id: poll.communityId,
      question: poll.question,
      description: poll.description,
      allow_multiple: poll.allowMultiple || false,
      closes_at: poll.closesAt || null,
      created_by: poll.createdBy,
    }).select().single();

    if (pollError) return null;

    if (poll.options && poll.options.length > 0) {
      const optionsToInsert = poll.options.map((opt: any) => ({
        id: opt.id,
        poll_id: poll.id,
        text: opt.text,
      }));
      await sb.from('poll_options').insert(optionsToInsert);
    }

    return pollData;
  } catch {
    return null;
  }
}
