-- RLS Policies: profiles_policies.sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public read for profile avatars/names
CREATE POLICY "Public profiles are readable by everyone"
ON public.profiles FOR SELECT
USING (true);

-- Users can update only their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);
