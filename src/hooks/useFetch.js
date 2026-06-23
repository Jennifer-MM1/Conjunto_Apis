import { useState, useEffect, useCallback, useRef } from 'react';

export const useFetch = (apiFunc, autoExecute = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoExecute);
  const [error, setError] = useState(null);

  // Keep a reference to the active apiFunc to avoid execution on recreations
  const apiFuncRef = useRef(apiFunc);
  useEffect(() => {
    apiFuncRef.current = apiFunc;
  }, [apiFunc]);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFuncRef.current(...args);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      console.error("useFetch Error: ", err);
      setError(err.message || 'Ocurrió un error inesperado al cargar los datos.');
      setLoading(false);
      throw err;
    }
  }, []);

  useEffect(() => {
    if (autoExecute) {
      execute();
    }
  }, [autoExecute, execute]);

  return { data, loading, error, execute, setData };
};
