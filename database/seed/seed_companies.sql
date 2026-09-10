-- Seed: seed_companies.sql
-- Populates the landing-page marquee. Run after 008_create_companies.sql.
--
-- These are well-known technology employers shown as recognisable names. This
-- seed asserts NO partnership, sponsorship or endorsement relationship with
-- GRIT SCHOOL — the UI heading is worded accordingly. Replace with verified
-- partners (and update the heading in src/data/companies.ts) if such
-- relationships are ever confirmed.

INSERT INTO public.companies (name, logo_url, website_url, display_order, is_visible)
VALUES
    ('Meesho',     NULL, 'https://www.meesho.com',     1, true),
    ('PhonePe',    NULL, 'https://www.phonepe.com',    2, true),
    ('Zoho',       NULL, 'https://www.zoho.com',       3, true),
    ('Flipkart',   NULL, 'https://www.flipkart.com',   4, true),
    ('Razorpay',   NULL, 'https://razorpay.com',       5, true),
    ('Swiggy',     NULL, 'https://www.swiggy.com',     6, true),
    ('Freshworks', NULL, 'https://www.freshworks.com', 7, true)
ON CONFLICT DO NOTHING;
