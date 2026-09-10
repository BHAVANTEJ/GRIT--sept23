-- Seed Data: seed_courses.sql
--
-- ⚠️  PLACEHOLDER DATA — DO NOT RUN AGAINST PRODUCTION.
--
-- The final GRIT SCHOOL courses have not been decided. The three courses below
-- are illustrative examples only; their titles, descriptions, durations and
-- prices are NOT real offerings and the thumbnails are stock photos.
--
-- The application no longer depends on this file: the frontend and backend both
-- return an empty catalogue when `public.courses` is empty, and the Courses page
-- renders "Courses coming soon." Run this ONLY to exercise the UI locally.
--
-- When the real courses are decided, replace this file (or insert via the admin
-- dashboard) and set status = 'published' on the rows that should go live.

INSERT INTO public.courses (id, title, slug, short_description, description, thumbnail_url, duration_weeks, price, is_published)
VALUES
(
    'a1b2c3d4-0001-4000-8000-000000000001',
    'Full-Stack Web Mastery',
    'full-stack-web-mastery',
    'Master modern React, TypeScript, Node.js, Express, and Supabase from scratch.',
    'Comprehensive end-to-end full-stack development curriculum focusing on real-world projects, secure authentication, database modeling, and cloud deployment.',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    12,
    499.00,
    true
),
(
    'a1b2c3d4-0002-4000-8000-000000000002',
    'AI Systems & Agentic Engineering',
    'ai-systems-agentic-engineering',
    'Build production-ready LLM pipelines, autonomous agents, and RAG architectures.',
    'Learn how to architect, optimize, and deploy high-performance AI agents using state-of-the-art LLM frameworks, vector databases, and scalable cloud toolings.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    10,
    599.00,
    true
),
(
    'a1b2c3d4-0003-4000-8000-000000000003',
    'Distributed Systems & System Design',
    'distributed-systems-and-design',
    'Architect resilient microservices, database sharding, and high-concurrency apps.',
    'Deep dive into real-world system design interviews, load balancers, caching strategies, distributed consensus, and event-driven microservices.',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    8,
    399.00,
    true
)
ON CONFLICT (slug) DO NOTHING;

-- Modules for Full-Stack Web Mastery
INSERT INTO public.course_modules (course_id, title, description, position)
VALUES
('a1b2c3d4-0001-4000-8000-000000000001', 'Module 1: Modern TypeScript & React Foundations', 'Master strict typing, hooks, state management, and component architecture.', 1),
('a1b2c3d4-0001-4000-8000-000000000001', 'Module 2: Node.js & Express RESTful API Development', 'Architect robust controllers, services, middleware, and request validation.', 2),
('a1b2c3d4-0001-4000-8000-000000000001', 'Module 3: PostgreSQL Database Design & Supabase RLS', 'Build relational schemas, write raw SQL migrations, and secure data with RLS.', 3),
('a1b2c3d4-0001-4000-8000-000000000001', 'Module 4: Authentication, Security & Production Deployment', 'Implement Supabase Auth, session lifecycle, environment isolation, and CI/CD.', 4)
ON CONFLICT DO NOTHING;
