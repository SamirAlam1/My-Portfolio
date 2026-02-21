import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();
  return (
    <footer className={`border-t mt-20 py-12 ${
      isDark ? 'bg-[#0a0a1a] border-violet-500/10' : 'bg-white border-violet-200/60'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="font-mono text-lg font-bold gradient-text">
            &lt;Samir Alam /&gt;
          </Link>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            © {new Date().getFullYear()} — Built with MERN Stack by Samir Alam
          </p>
          <div className="flex gap-5">
            {[
              { href: 'https://github.com',   label: 'GitHub'   },
              { href: 'https://linkedin.com', label: 'LinkedIn' },
            ].map(({ href, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                className={`text-sm font-medium transition-colors ${
                  isDark ? 'text-gray-500 hover:text-violet-400' : 'text-gray-400 hover:text-violet-600'
                }`}>
                {label}
              </a>
            ))}
            <Link to="/admin/login"
              className={`text-sm font-medium transition-colors ${
                isDark ? 'text-gray-700 hover:text-gray-500' : 'text-gray-300 hover:text-gray-400'
              }`}>
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;