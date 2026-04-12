// hooks/useCalculator.js
import { useState, useCallback } from 'react';
import { calculateCosts } from '../utils/api';
import { v4 as uuidv4 } from 'uuid';

const getSessionId = () => {
  let id = localStorage.getItem('cloudcalc-session');
  if (!id) { id = uuidv4(); localStorage.setItem('cloudcalc-session', id); }
  return id;
};

const useCalculator = () => {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const calculate = useCallback(async (inputs) => {
    setLoading(true);
    setError(null);
    try {
      const res = await calculateCosts({ ...inputs, sessionId: getSessionId() });
      setResult(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => { setResult(null); setError(null); }, []);

  return { result, loading, error, calculate, reset };
};

export default useCalculator;
