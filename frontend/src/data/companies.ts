import { Company } from '../types/company.types';

/**
 * Company display data for the landing-page marquee.
 *
 * This is the fallback/seed layer. `companyService` reads the Supabase
 * `companies` table first and only falls back to this list when the table is
 * empty or unreachable, so the same shape works before and after the table is
 * populated from the admin dashboard.
 *
 * NOTE: these are shown as companies learners recognise, NOT as verified
 * GRIT SCHOOL partners. The section heading must not claim a partnership that
 * has not been confirmed.
 */
export const FALLBACK_COMPANIES: Company[] = [
  { id: 'meesho', name: 'Meesho', logo_url: null, website_url: null, display_order: 1, is_visible: true },
  { id: 'phonepe', name: 'PhonePe', logo_url: null, website_url: null, display_order: 2, is_visible: true },
  { id: 'zoho', name: 'Zoho', logo_url: null, website_url: null, display_order: 3, is_visible: true },
  { id: 'flipkart', name: 'Flipkart', logo_url: null, website_url: null, display_order: 4, is_visible: true },
  { id: 'razorpay', name: 'Razorpay', logo_url: null, website_url: null, display_order: 5, is_visible: true },
  { id: 'swiggy', name: 'Swiggy', logo_url: null, website_url: null, display_order: 6, is_visible: true },
  { id: 'freshworks', name: 'Freshworks', logo_url: null, website_url: null, display_order: 7, is_visible: true },
];

/**
 * Heading shown above the marquee. Deliberately neutral: it describes the
 * companies as recognisable technology employers rather than asserting an
 * official relationship with GRIT SCHOOL.
 */
export const COMPANIES_SECTION_LABEL = 'ENGINEERS FROM COMPANIES LIKE THESE';
