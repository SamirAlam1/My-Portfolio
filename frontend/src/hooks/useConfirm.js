import { useState, useCallback } from 'react';

// Reusable confirm dialog state management
const useConfirm = () => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    id: null,
    title: 'Are you sure?',
    message: 'This action cannot be undone.',
  });

  const openConfirm = useCallback((id, title, message) => {
    setConfirmState({
      isOpen: true,
      id,
      title:   title   || 'Are you sure?',
      message: message || 'This action cannot be undone.',
    });
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmState((prev) => ({ ...prev, isOpen: false, id: null }));
  }, []);

  return {
    confirmState,
    openConfirm,
    closeConfirm,
  };
};

export default useConfirm;