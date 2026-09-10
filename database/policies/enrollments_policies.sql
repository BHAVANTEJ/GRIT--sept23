-- RLS Policies: enrollments_policies.sql
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Users can view their own enrollments
CREATE POLICY "Users can view their own enrollments"
ON public.enrollments FOR SELECT
USING (auth.uid() = user_id);

-- Users can enroll themselves
CREATE POLICY "Users can insert their own enrollments"
ON public.enrollments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own enrollments
CREATE POLICY "Users can update their own enrollments"
ON public.enrollments FOR UPDATE
USING (auth.uid() = user_id);
