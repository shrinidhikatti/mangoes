import { useState, useEffect, useCallback } from 'react';

/**
 * Generic hook for async data fetching with loading/error states.
 * Falls back to mock data when Firebase is not configured.
 */
export function useFirestoreQuery(fetchFn, deps = [], fallbackData = null) {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      console.warn('Firestore fetch failed, using fallback:', err.message);
      setError(err);
      // Keep fallback data if Firebase isn't configured
      if (fallbackData !== null) {
        setData(fallbackData);
      }
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

/**
 * Hook for async mutations (create, update, delete) with loading state.
 */
export function useFirestoreMutation(mutationFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutationFn(...args);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutationFn]);

  return { execute, loading, error };
}
