-- Migration: 007_alter_courses_add_status.sql
-- Adds lifecycle status + display ordering to courses.
--
-- The existing `is_published` boolean is KEPT rather than dropped: the RLS
-- policy "Published courses readable by everyone" and existing client queries
-- both depend on it. A trigger keeps the two representations in sync so old and
-- new code agree, and `is_published` can be retired later without a breaking
-- change.

ALTER TABLE public.courses
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'archived'));

ALTER TABLE public.courses
    ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0;

-- Backfill status from the pre-existing boolean for any rows already present.
UPDATE public.courses
SET status = CASE WHEN is_published THEN 'published' ELSE 'draft' END
WHERE status = 'draft';

CREATE INDEX IF NOT EXISTS idx_courses_status ON public.courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_display_order ON public.courses(display_order);

-- Keep is_published mirroring status in both directions, so whichever column a
-- writer sets, readers of the other see the correct value.
CREATE OR REPLACE FUNCTION public.sync_course_publish_flags()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- An explicit non-default status wins; otherwise derive from the boolean.
        IF NEW.status IS DISTINCT FROM 'draft' THEN
            NEW.is_published := (NEW.status = 'published');
        ELSE
            NEW.status := CASE WHEN NEW.is_published THEN 'published' ELSE 'draft' END;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF NEW.status IS DISTINCT FROM OLD.status THEN
            NEW.is_published := (NEW.status = 'published');
        ELSIF NEW.is_published IS DISTINCT FROM OLD.is_published THEN
            NEW.status := CASE WHEN NEW.is_published THEN 'published' ELSE 'draft' END;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_course_publish_flags ON public.courses;
CREATE TRIGGER sync_course_publish_flags
    BEFORE INSERT OR UPDATE ON public.courses
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_course_publish_flags();
