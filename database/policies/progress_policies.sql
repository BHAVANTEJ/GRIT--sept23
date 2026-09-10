-- RLS Policies: progress_policies.sql
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own learning progress
CREATE POLICY "Users can view their own progress"
ON public.learning_progress FOR SELECT
USING (auth.uid() = user_id);

-- Users can update/upsert their own progress
CREATE POLICY "Users can insert their own progress"
ON public.learning_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.learning_progress FOR UPDATE
USING (auth.uid() = user_id);
