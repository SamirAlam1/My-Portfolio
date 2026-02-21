import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import ThemeToggle from '../shared/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useTheme();
  const location = useLocation();

  useEffect(() => { setSidebarOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? 'bg-[#0a0a1a]' : 'bg-violet-50'}`}>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)' }}
      />

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 md:hidden transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Mobile Topbar */}
        <header className={`md:hidden flex items-center justify-between px-4 py-3 border-b flex-shrink-0 ${
          isDark ? 'bg-[#0f0f23] border-violet-500/10' : 'bg-white border-violet-200 shadow-sm'
        }`}>
          <span className="font-mono font-bold gradient-text">Admin Panel</span>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setSidebarOpen(true)}
              className={`p-2 rounded-xl transition-colors ${
                isDark ? 'text-gray-400 hover:text-violet-300 hover:bg-violet-500/10' : 'text-gray-500 hover:text-violet-700 hover:bg-violet-50'
              }`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;