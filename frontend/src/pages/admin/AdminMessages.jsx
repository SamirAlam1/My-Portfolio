import { useState, useEffect } from 'react';
import API from '../../utils/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Toast from '../../components/shared/Toast';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { useTheme } from '../../context/ThemeContext';

const AdminMessages = () => {
  const [messages, setMessages]     = useState([]);
  const [selected, setSelected]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [toast, setToast]           = useState(null);
  const [confirmId, setConfirmId]   = useState(null);
  const { isDark } = useTheme();

  const fetchMessages = () => {
    setLoading(true);
    API.get('/messages').then(({ data }) => setMessages(data.data))
      .catch(() => setToast({ message: 'Failed to load messages', type: 'error' }))
      .finally(() => setLoading(false));
  };
  useEffect(fetchMessages, []);

  const toggleRead = async (msg) => {
    try {
      await API.put(`/messages/${msg._id}`, { read: !msg.read });
      fetchMessages();
      if (selected?._id === msg._id) setSelected({ ...msg, read: !msg.read });
    } catch { setToast({ message: 'Failed to update', type: 'error' }); }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/messages/${confirmId}`);
      setToast({ message: 'Message deleted!', type: 'success' });
      if (selected?._id === confirmId) setSelected(null);
      fetchMessages();
    } catch { setToast({ message: 'Failed to delete', type: 'error' }); }
    finally  { setConfirmId(null); }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact Messages</h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {messages.length} total · {messages.filter((m) => !m.read).length} unread
        </p>
      </div>

      {loading ? <LoadingSpinner size="lg" className="py-20" /> : (
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Message List */}
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className={`card text-center py-20 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <p className="text-4xl mb-4">✉️</p>
                No messages yet
              </div>
            ) : messages.map((msg) => (
              <div key={msg._id}
                onClick={() => setSelected(msg)}
                className={`card cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                  selected?._id === msg._id
                    ? isDark ? 'border-violet-500/50 bg-violet-500/5' : 'border-violet-400 bg-violet-50'
                    : !msg.read
                      ? isDark ? 'border-violet-500/20' : 'border-violet-300'
                      : ''
                }`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 text-sm"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-semibold text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{msg.name}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!msg.read && <div className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />}
                        <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className={`text-sm font-medium mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{msg.subject}</p>
                    <p className={`text-xs mt-0.5 truncate ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Detail */}
          <div className="lg:sticky lg:top-6">
            {!selected ? (
              <div className={`card text-center py-20 h-full flex flex-col items-center justify-center ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                <p className="text-4xl mb-3">👆</p>
                <p className="text-sm">Select a message to read</p>
              </div>
            ) : (
              <div className="card">
                {/* Header */}
                <div className={`flex items-start justify-between gap-4 pb-4 mb-4 border-b ${
                  isDark ? 'border-violet-500/10' : 'border-violet-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                      {selected.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selected.name}</p>
                      <a href={`mailto:${selected.email}`} className="text-violet-500 text-sm hover:underline">{selected.email}</a>
                    </div>
                  </div>
                  <span className={`text-xs flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {new Date(selected.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className={`font-bold text-lg mb-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{selected.subject}</p>
                <p className={`leading-relaxed text-sm whitespace-pre-wrap ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selected.message}</p>

                {/* Actions */}
                <div className={`flex gap-3 mt-6 pt-4 border-t ${isDark ? 'border-violet-500/10' : 'border-violet-100'}`}>
                  <button onClick={() => toggleRead(selected)}
                    className={`text-sm py-2 px-4 rounded-xl border font-medium transition-colors ${
                      selected.read
                        ? isDark ? 'border-gray-600 text-gray-400 hover:bg-gray-700' : 'border-gray-300 text-gray-500 hover:bg-gray-100'
                        : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                    }`}>
                    {selected.read ? '📩 Mark Unread' : '✅ Mark Read'}
                  </button>
                  <a href={`mailto:${selected.email}`} className="btn-primary text-sm py-2 px-4">📧 Reply</a>
                  <button onClick={() => setConfirmId(selected._id)} className="btn-danger text-sm py-2 px-4 ml-auto">🗑️ Delete</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={!!confirmId} title="Delete Message" message="Are you sure? This cannot be undone."
        onConfirm={handleDelete} onCancel={() => setConfirmId(null)} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminMessages;