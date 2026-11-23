export type UserRole = 'organizer' | 'treasurer' | 'member' | 'guest';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone?: string;
  role: UserRole;
  familyGroup?: string; // e.g. "Familia García Gómez"
  password?: string;
  createdAt?: string;
  authProvider?: 'local' | 'google';
}

export interface Community {
  id: string;
  name: string;
  slogan: string;
  year: number;
  totalBudgetGoal: number;
  quotaPerPerson?: number; // Cuota por persona configurable
  currency: string; // 'COP', 'USD', 'MXN', etc.
  coverGradient: string;
  inviteCode: string;
  masterPin?: string; // PIN maestro para autorizar Organizadores y Tesoreros
  paymentDetails?: {
    nequiNumber?: string;
    daviplataNumber?: string;
    accountHolder?: string;
  };
}

export type ActivityType =
  | 'novena'
  | 'dinner'
  | 'trip'
  | 'party'
  | 'secretsanta'
  | 'velitas'
  | 'charity'
  | 'custom';

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  description: string;
  responsibleId?: string;
  completed: boolean;
}

export interface ActivityTask {
  id: string;
  title: string;
  assignedToId?: string;
  completed: boolean;
  priority: 'alta' | 'media' | 'baja';
}

export interface PotluckDish {
  id: string;
  name: string;
  category: 'plato' | 'bebida' | 'postre' | 'pasaboca' | 'desechable';
  assignedToId?: string;
  servings: number;
}

export interface ActivityRsvp {
  userId: string;
  userName: string;
  guestCount: number; // additional companions/guests
  dishContribution?: string; // what they are bringing or dietary note
  note?: string;
  status: 'confirmed' | 'declined';
  updatedAt: string;
}

export interface Activity {
  id: string;
  communityId: string;
  title: string;
  type: ActivityType;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  mapAddress?: string;
  estimatedBudget: number;
  maxParticipants?: number;
  organizerId: string;
  attendees: string[]; // user IDs
  rsvps?: ActivityRsvp[];
  status: 'upcoming' | 'ongoing' | 'completed';
  novenaDay?: number; // 1 to 9 if type === 'novena'
  itinerary: ItineraryItem[];
  tasks: ActivityTask[];
  potluckDishes: PotluckDish[];
}

export type ExpenseCategory =
  | 'alimentacion'
  | 'bebidas'
  | 'decoracion'
  | 'musica'
  | 'transporte'
  | 'logistica'
  | 'regalos'
  | 'otros';

export interface ExpenseItem {
  id: string;
  activityId?: string;
  concept: string;
  category: ExpenseCategory;
  amount: number;
  paidByUserId: string;
  date: string;
  receiptUrl?: string;
  status: 'approved' | 'pending';
}

export type SplitMethod = 'equal' | 'family' | 'custom' | 'consumption';

export interface UserContribution {
  userId: string;
  activityId?: string;
  targetAmount: number;
  paidAmount: number;
  status: 'paid' | 'partial' | 'pending';
}

export interface PaymentReceipt {
  id: string;
  userId: string; // The beneficiary of the contribution
  userName: string;
  paidByUserId?: string; // Who actually submitted the payment (if paying on behalf of another)
  paidByName?: string;
  referenceNumber?: string;
  activityId?: string;
  amount: number;
  method: 'nequi' | 'daviplata' | 'efectivo' | 'transferencia' | 'tarjeta';
  date: string;
  time: string;
  notes?: string;
  receiptImage?: string; // base64 or mock placeholder
  status: 'approved' | 'pending' | 'rejected';
  verifiedBy?: string;
}

export interface SecretSantaWishlist {
  userId: string;
  suggestions: string[];
  sizes?: string;
  favoriteColors?: string[];
  dislikes?: string;
  hints?: string;
}

export interface SecretSantaAssignment {
  giverId: string;
  receiverId: string;
  giftPurchased?: boolean;
  delivered?: boolean;
}

export interface SecretSantaSession {
  id: string;
  communityId: string;
  title: string;
  budgetMin: number;
  budgetMax: number;
  currency: string;
  drawDate: string;
  deliveryDate: string;
  status: 'draft' | 'drawn' | 'completed';
  participants: string[]; // user IDs
  exclusions: { [giverId: string]: string[] }; // user ID to forbidden receiver IDs
  assignments: SecretSantaAssignment[];
  wishlists: { [userId: string]: SecretSantaWishlist };
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // user IDs
}

export interface Poll {
  id: string;
  communityId: string;
  question: string;
  description?: string;
  options: PollOption[];
  allowMultiple: boolean;
  closesAt?: string;
  createdBy: string;
  createdAt: string;
  comments: { id: string; userId: string; text: string; time: string }[];
}

export interface AdventDay {
  dayNumber: number;
  title: string;
  surprise: string;
  carolOrQuote: string;
  mission: string;
  unlocked: boolean;
}

export interface MemoryPhoto {
  id: string;
  communityId?: string;
  title: string;
  activityName?: string;
  authorName: string;
  authorAvatar: string;
  imageUrl: string;
  date: string;
  likes: number;
  likedByCurrentUser?: boolean;
  caption: string;
}

export interface SantaAIMessage {
  id: string;
  sender: 'user' | 'santa';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'create_activity' | 'view_finances' | 'secret_santa' | 'poll';
    label: string;
    payload?: any;
  };
}
