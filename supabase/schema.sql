-- ==============================================================================
-- SCHEMA COMPLETO DE POSTGRESQL PARA SUPABASE - NATIVIDAD PWA 🎄
-- Plataforma Navideña en Comunidad: Actividades, Finanzas, Amigo Secreto,
-- Itinerarios, Novenas, Encuestas y Recuerdos.
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: PROFILES (Perfiles de usuarios)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('organizer', 'member', 'admin')),
  family_group TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA: COMMUNITIES (Familias y Grupos Navideños)
CREATE TABLE IF NOT EXISTS public.communities (
  id TEXT PRIMARY KEY DEFAULT ('comm-' || substr(md5(random()::text), 1, 8)),
  name TEXT NOT NULL,
  slogan TEXT,
  year INT DEFAULT 2026 NOT NULL,
  total_budget_goal NUMERIC(12, 2) DEFAULT 2000000 NOT NULL,
  currency TEXT DEFAULT 'COP' NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA: COMMUNITY_MEMBERS
CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id TEXT REFERENCES public.communities(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(community_id, profile_id)
);

-- 5. TABLA: ACTIVITIES (Actividades y Novenas)
CREATE TABLE IF NOT EXISTS public.activities (
  id TEXT PRIMARY KEY DEFAULT ('act-' || substr(md5(random()::text), 1, 8)),
  community_id TEXT REFERENCES public.communities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('novena', 'dinner', 'trip', 'party', 'secretsanta', 'velitas', 'charity', 'custom')),
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  map_address TEXT,
  estimated_budget NUMERIC(12, 2) DEFAULT 0,
  max_participants INT,
  novena_day INT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLA: ACTIVITY_MEMBERS (Asistentes confirmados)
CREATE TABLE IF NOT EXISTS public.activity_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id TEXT REFERENCES public.activities(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(activity_id, profile_id)
);

-- 7. TABLA: ITINERARIES (Cronogramas por horas)
CREATE TABLE IF NOT EXISTS public.itineraries (
  id TEXT PRIMARY KEY DEFAULT ('itin-' || substr(md5(random()::text), 1, 8)),
  activity_id TEXT REFERENCES public.activities(id) ON DELETE CASCADE,
  time_slot TIME NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  responsible_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  order_index INT DEFAULT 0
);

-- 8. TABLA: ITINERARY_TASKS
CREATE TABLE IF NOT EXISTS public.itinerary_tasks (
  id TEXT PRIMARY KEY DEFAULT ('task-' || substr(md5(random()::text), 1, 8)),
  activity_id TEXT REFERENCES public.activities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  assigned_to_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  priority TEXT DEFAULT 'media' CHECK (priority IN ('alta', 'media', 'baja')),
  completed BOOLEAN DEFAULT false NOT NULL
);

-- 9. TABLA: POTLUCK_DISHES (Organizador de Comidas)
CREATE TABLE IF NOT EXISTS public.potluck_dishes (
  id TEXT PRIMARY KEY DEFAULT ('pot-' || substr(md5(random()::text), 1, 8)),
  activity_id TEXT REFERENCES public.activities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'plato' CHECK (category IN ('plato', 'bebida', 'postre', 'pasaboca', 'desechable')),
  assigned_to_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  servings INT DEFAULT 20
);

-- 10. TABLA: EXPENSES (Gastos y Compras)
CREATE TABLE IF NOT EXISTS public.expenses (
  id TEXT PRIMARY KEY DEFAULT ('exp-' || substr(md5(random()::text), 1, 8)),
  community_id TEXT REFERENCES public.communities(id) ON DELETE CASCADE,
  activity_id TEXT REFERENCES public.activities(id) ON DELETE SET NULL,
  concept TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('alimentacion', 'bebidas', 'decoracion', 'musica', 'transporte', 'logistica', 'regalos', 'otros')),
  amount NUMERIC(12, 2) NOT NULL,
  paid_by_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  status TEXT DEFAULT 'approved' CHECK (status IN ('approved', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. TABLA: CONTRIBUTIONS (Cuotas individuales)
CREATE TABLE IF NOT EXISTS public.contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id TEXT REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_amount NUMERIC(12, 2) NOT NULL,
  paid_amount NUMERIC(12, 2) DEFAULT 0 NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('paid', 'partial', 'pending')),
  UNIQUE(community_id, user_id)
);

-- 12. TABLA: PAYMENT_RECEIPTS (Registro de abonos y evidencias)
CREATE TABLE IF NOT EXISTS public.payment_receipts (
  id TEXT PRIMARY KEY DEFAULT ('rec-' || substr(md5(random()::text), 1, 8)),
  community_id TEXT REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('nequi', 'daviplata', 'efectivo', 'transferencia', 'tarjeta')),
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  time TIME DEFAULT CURRENT_TIME NOT NULL,
  notes TEXT,
  receipt_image_url TEXT,
  status TEXT DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected')),
  verified_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. TABLA: SECRET_SANTA (Intercambios de amigos secretos)
CREATE TABLE IF NOT EXISTS public.secret_santa (
  id TEXT PRIMARY KEY DEFAULT ('santa-' || substr(md5(random()::text), 1, 8)),
  community_id TEXT REFERENCES public.communities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  budget_min NUMERIC(12, 2) DEFAULT 50000 NOT NULL,
  budget_max NUMERIC(12, 2) DEFAULT 80000 NOT NULL,
  currency TEXT DEFAULT 'COP' NOT NULL,
  draw_date DATE,
  delivery_date DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'drawn', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. TABLA: SECRET_ASSIGNMENTS (Asignaciones privadas)
CREATE TABLE IF NOT EXISTS public.secret_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT REFERENCES public.secret_santa(id) ON DELETE CASCADE,
  giver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  gift_purchased BOOLEAN DEFAULT false NOT NULL,
  delivered BOOLEAN DEFAULT false NOT NULL,
  UNIQUE(session_id, giver_id)
);

-- 15. TABLA: WISHLISTS (Listas de deseos)
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  suggestions TEXT[] DEFAULT '{}',
  sizes TEXT,
  favorite_colors TEXT[] DEFAULT '{}',
  dislikes TEXT,
  hints TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

-- 16. TABLA: POLLS & VOTES
CREATE TABLE IF NOT EXISTS public.polls (
  id TEXT PRIMARY KEY DEFAULT ('poll-' || substr(md5(random()::text), 1, 8)),
  community_id TEXT REFERENCES public.communities(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  description TEXT,
  allow_multiple BOOLEAN DEFAULT false,
  closes_at DATE,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.poll_options (
  id TEXT PRIMARY KEY DEFAULT ('opt-' || substr(md5(random()::text), 1, 8)),
  poll_id TEXT REFERENCES public.polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.poll_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id TEXT REFERENCES public.polls(id) ON DELETE CASCADE,
  option_id TEXT REFERENCES public.poll_options(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(option_id, user_id)
);

-- 17. TABLA: MEMORIES (Álbum de fotos)
CREATE TABLE IF NOT EXISTS public.memories (
  id TEXT PRIMARY KEY DEFAULT ('mem-' || substr(md5(random()::text), 1, 8)),
  community_id TEXT REFERENCES public.communities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  activity_name TEXT,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  image_url TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  likes INT DEFAULT 0,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 18. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secret_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS GENERALES DE ACCESO (LECTURA Y ESCRITURA COMPLETA)
CREATE POLICY "Public Full Access Profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Communities" ON public.communities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Community Members" ON public.community_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Activities" ON public.activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Activity Members" ON public.activity_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Itineraries" ON public.itineraries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Itinerary Tasks" ON public.itinerary_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Potluck Dishes" ON public.potluck_dishes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Contributions" ON public.contributions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Receipts" ON public.payment_receipts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Secret Santa" ON public.secret_santa FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Secret Assignments" ON public.secret_assignments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Wishlists" ON public.wishlists FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Polls" ON public.polls FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Poll Options" ON public.poll_options FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Poll Votes" ON public.poll_votes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Memories" ON public.memories FOR ALL USING (true) WITH CHECK (true);

-- 19. TRIGGER AUTOMÁTICO: VINCULAR USUARIOS DE GOOGLE / AUTH A LA TABLA PROFILES
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, avatar, role, family_group)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="85">🎅</text></svg>'),
    'member',
    'Familia'
  )
  ON CONFLICT (email) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    name = COALESCE(public.profiles.name, EXCLUDED.name),
    avatar = COALESCE(public.profiles.avatar, EXCLUDED.avatar);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();
