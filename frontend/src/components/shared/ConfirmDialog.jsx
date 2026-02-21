const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#16162e] border border-violet-500/20 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fade-in"
        style={{ boxShadow: '0 8px 40px rgba(124,58,237,0.2)' }}>

        {/* Icon */}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
          style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))', border: '1px solid rgba(239,68,68,0.2)' }}>
          🗑️
        </div>

        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          {/* Cancel button — violet outline */}
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm border-2 border-violet-500/40 text-violet-300 hover:bg-violet-500/10 hover:border-violet-400 transition-all duration-200"
          >
            Cancel
          </button>

          {/* Delete button — red gradient */}
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)', boxShadow: '0 4px 15px rgba(220,38,38,0.35)' }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;