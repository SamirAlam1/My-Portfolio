import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/shared/ThemeToggle';

const AdminLogin = () => {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login }    = useAuth();
  const { isDark }   = useTheme();
  const navigate     = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
      isDark ? 'bg-[#0a0a1a]' : 'bg-violet-50'
    }`}>

      {/* Theme toggle top right */}
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)' }} />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className={`rounded-2xl p-8 border ${
          isDark
            ? 'bg-[#16162e]/80 border-violet-500/20'
            : 'bg-white border-violet-200 shadow-xl shadow-violet-100'
        }`}
          style={{ boxShadow: isDark ? '0 8px 40px rgba(124,58,237,0.15)' : '' }}>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.15))',
                borderColor: 'rgba(124,58,237,0.3)'
              }}>
              <span className="text-3xl">🔐</span>
            </div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Admin Login</h1>
            <p className={`mt-1 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Portfolio CMS Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
                placeholder="admin@portfolio.com"
                required autoFocus
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full justify-center py-3" disabled={loading}>
              {loading ? '⏳ Signing in...' : '🚀 Sign In'}
            </button>
          </form>

          {/* Default credentials hint */}
          {/* <div className={`mt-6 p-4 rounded-xl border text-xs ${
            isDark
              ? 'bg-violet-500/5 border-violet-500/15 text-gray-500'
              : 'bg-violet-50 border-violet-200 text-gray-400'
          }`}>
            <p className={`font-semibold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Default credentials (after seeding):
            </p>
            <p>Email: admin@portfolio.com</p>
            <p>Password: Admin@123456</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;