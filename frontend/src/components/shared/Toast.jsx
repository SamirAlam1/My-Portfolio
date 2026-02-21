import { useEffect } from 'react';

const icons = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
};

const colors = {
  success: 'border-green-500/50 bg-green-500/10 text-green-400',
  error: 'border-red-500/50 bg-red-500/10 text-red-400',
  info: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
  warning: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400',
};

const Toast = ({ message, type = 'info', onClose, duration = 3500 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-sm shadow-2xl animate-slide-up max-w-sm ${colors[type]}`}
    >
      <span className="text-lg">{icons[type]}</span>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-current opacity-60 hover:opacity-100">✕</button>
    </div>
  );
};

export default Toast;