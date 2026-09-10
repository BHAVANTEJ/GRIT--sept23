export type CohortStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface Cohort {
  id: string;
  name: string;
  start_date: string; // ISO 8601 timestamp
  end_date?: string | null;
  status: CohortStatus;
  created_at?: string;
  updated_at?: string;
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** true once the target date has been reached or passed */
  isComplete: boolean;
}
