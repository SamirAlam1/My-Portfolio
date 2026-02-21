import { useState, useCallback } from 'react';

// Easy toast notification management
const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Shorthand helpers
  const success = useCallback((msg) => showToast(msg, 'success'), [showToast]);
  const error   = useCallback((msg) => showToast(msg, 'error'),   [showToast]);
  const info    = useCallback((msg) => showToast(msg, 'info'),    [showToast]);
  const warning = useCallback((msg) => showToast(msg, 'warning'), [showToast]);

  return { toast, hideToast, showToast, success, error, info, warning };
};

export default useToast;