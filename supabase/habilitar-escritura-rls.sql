-- ==============================================================================
-- HABILITAR ESCRITURA Y ACTUALIZACIÓN EN TODAS LAS TABLAS DE NATIVIDAD (RLS)
-- Pega este script en tu Supabase Dashboard > SQL Editor y dale a "RUN".
-- ==============================================================================

-- 1. Profiles
DROP POLICY IF EXISTS "Public Full Access Profiles" ON public.profiles;
CREATE POLICY "Public Full Access Profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- 2. Communities
DROP POLICY IF EXISTS "Public Full Access Communities" ON public.communities;
CREATE POLICY "Public Full Access Communities" ON public.communities FOR ALL USING (true) WITH CHECK (true);

-- 3. Community Members
DROP POLICY IF EXISTS "Public Full Access Community Members" ON public.community_members;
CREATE POLICY "Public Full Access Community Members" ON public.community_members FOR ALL USING (true) WITH CHECK (true);

-- 4. Activities
DROP POLICY IF EXISTS "Public Full Access Activities" ON public.activities;
CREATE POLICY "Public Full Access Activities" ON public.activities FOR ALL USING (true) WITH CHECK (true);

-- 5. Activity Members & Tasks & Potluck
DROP POLICY IF EXISTS "Public Full Access Activity Members" ON public.activity_members;
CREATE POLICY "Public Full Access Activity Members" ON public.activity_members FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access Itineraries" ON public.itineraries;
CREATE POLICY "Public Full Access Itineraries" ON public.itineraries FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access Itinerary Tasks" ON public.itinerary_tasks;
CREATE POLICY "Public Full Access Itinerary Tasks" ON public.itinerary_tasks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access Potluck Dishes" ON public.potluck_dishes;
CREATE POLICY "Public Full Access Potluck Dishes" ON public.potluck_dishes FOR ALL USING (true) WITH CHECK (true);

-- 6. Expenses
DROP POLICY IF EXISTS "Public Full Access Expenses" ON public.expenses;
CREATE POLICY "Public Full Access Expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);

-- 7. Contributions & Payment Receipts
DROP POLICY IF EXISTS "Public Full Access Contributions" ON public.contributions;
CREATE POLICY "Public Full Access Contributions" ON public.contributions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access Receipts" ON public.payment_receipts;
CREATE POLICY "Public Full Access Receipts" ON public.payment_receipts FOR ALL USING (true) WITH CHECK (true);

-- 8. Secret Santa & Wishlists
DROP POLICY IF EXISTS "Public Full Access Secret Santa" ON public.secret_santa;
CREATE POLICY "Public Full Access Secret Santa" ON public.secret_santa FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access Secret Assignments" ON public.secret_assignments;
CREATE POLICY "Public Full Access Secret Assignments" ON public.secret_assignments FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access Wishlists" ON public.wishlists;
CREATE POLICY "Public Full Access Wishlists" ON public.wishlists FOR ALL USING (true) WITH CHECK (true);

-- 9. Polls & Votes
DROP POLICY IF EXISTS "Public Full Access Polls" ON public.polls;
CREATE POLICY "Public Full Access Polls" ON public.polls FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access Poll Options" ON public.poll_options;
CREATE POLICY "Public Full Access Poll Options" ON public.poll_options FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access Poll Votes" ON public.poll_votes;
CREATE POLICY "Public Full Access Poll Votes" ON public.poll_votes FOR ALL USING (true) WITH CHECK (true);

-- 10. Memories
DROP POLICY IF EXISTS "Public Full Access Memories" ON public.memories;
CREATE POLICY "Public Full Access Memories" ON public.memories FOR ALL USING (true) WITH CHECK (true);

-- 11. VINCULACIÓN AUTOMÁTICA DE USUARIOS DE GOOGLE / AUTH A PUBLIC.PROFILES
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
