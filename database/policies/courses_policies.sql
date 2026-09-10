-- RLS Policies: courses_policies.sql
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

-- Published courses readable by everyone
CREATE POLICY "Published courses readable by everyone"
ON public.courses FOR SELECT
USING (is_published = true);

-- Course modules readable by everyone
CREATE POLICY "Course modules readable by everyone"
ON public.course_modules FOR SELECT
USING (true);
