import { useState, useCallback } from 'react';
import { fetchApi } from '../services/api';

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async (endpoint: string, options?: RequestInit) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi<T>(endpoint, options);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err.message || 'API Request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, request };
}
