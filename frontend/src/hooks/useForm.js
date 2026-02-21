import { useState, useCallback } from 'react';

// Generic form state management hook
const useForm = (initialValues = {}) => {
  const [values, setValues]   = useState(initialValues);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  // Handle any input change (text, checkbox, select, textarea)
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Set a single field programmatically
  const setField = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Reset form to initial values
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  // Set errors manually (e.g. from server validation)
  const setFormErrors = useCallback((errs) => {
    setErrors(errs);
  }, []);

  return {
    values,
    errors,
    loading,
    setLoading,
    handleChange,
    setField,
    reset,
    setFormErrors,
    setValues,
  };
};

export default useForm;