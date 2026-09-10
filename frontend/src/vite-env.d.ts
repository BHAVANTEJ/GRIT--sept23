/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_API_BASE_URL: string;
  /** ISO 8601 with UTC offset, e.g. 2026-10-09T00:00:00+05:30 */
  readonly VITE_COHORT_START_DATE?: string;
  readonly VITE_COHORT_TIMEZONE_LABEL?: string;
  readonly VITE_COHORT_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
