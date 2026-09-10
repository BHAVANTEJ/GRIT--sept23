import { API_BASE_URL } from '../lib/constants';
import { supabase } from '../lib/supabase';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await response.json();
  if (!response.ok || json.success === false) {
    throw new Error(json.error?.message || 'An API error occurred');
  }

  return json.data as T;
}
