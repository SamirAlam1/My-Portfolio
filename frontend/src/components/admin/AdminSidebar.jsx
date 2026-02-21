import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../shared/ThemeToggle';

const menuItems = [
  { to: '/admin/dashboard', label: 'Dashboard',        icon: '📊' },
  { to: '/admin/projects',  label: 'Projects',         icon: '💼' },
  { to: '/admin/skills',    label: 'Skills',           icon: '🛠️' },
  { to: '/admin/education', label: 'Education',        icon: '🎓' },
  { to: '/admin/blogs',     label: 'Blog Posts',       icon: '📝' },
  { to: '/admin/messages',  label: 'Contact Messages', icon: '✉️' },
];

const AdminSidebar = ({ onClose }) => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <aside className={`flex flex-col h-full border-r transition-colors duration-300 ${
      isDark
        ? 'bg-[#0f0f23] border-violet-500/10'
        : 'bg-white border-violet-200'
    }`}>

      {/* Header */}
      <div className={`p-5 border-b ${isDark ? 'border-violet-500/10' : 'border-violet-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-mono font-bold gradient-text text-lg">Admin Panel</h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {onClose && (
              <button onClick={onClose}
                className={`p-1.5 rounded-lg md:hidden transition-colors ${
                  isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-700'
                }`}>✕</button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onClose}
            className={`sidebar-link ${pathname === to || pathname.startsWith(to + '/') ? 'active' : ''}`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t space-y-1 ${isDark ? 'border-violet-500/10' : 'border-violet-100'}`}>
        <Link to="/" target="_blank" className="sidebar-link text-sm">
          <span>🌐</span>
          <span>View Portfolio</span>
        </Link>
        <button
          onClick={handleLogout}
          className={`sidebar-link w-full text-left transition-colors ${
            isDark
              ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
              : 'text-red-500 hover:text-red-600 hover:bg-red-50'
          }`}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;