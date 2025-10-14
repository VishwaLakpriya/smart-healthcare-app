import { useState } from "react";
export function useAsync<T>(fn: () => Promise<T>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const run = async () => {
    setLoading(true); setError(null);
    try { return await fn(); } catch (e) { setError(e); throw e; }
    finally { setLoading(false); }
  };
  return { run, loading, error };
}
