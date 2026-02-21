import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import API from '../../utils/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import Toast from '../../components/shared/Toast';
import { useTheme } from '../../context/ThemeContext';

// ─── List View ────────────────────────────────────────────────────────────────
export const AdminProjectsList = () => {
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const { isDark } = useTheme();

  const fetchProjects = () => {
    setLoading(true);
    API.get('/projects')
      .then(({ data }) => setProjects(data.data))
      .catch(() => setToast({ message: 'Failed to load projects', type: 'error' }))
      .finally(() => setLoading(false));
  };
  useEffect(fetchProjects, []);

  const handleDelete = async () => {
    try {
      await API.delete(`/projects/${confirmId}`);
      setToast({ message: 'Project deleted!', type: 'success' });
      fetchProjects();
    } catch {
      setToast({ message: 'Failed to delete', type: 'error' });
    } finally { setConfirmId(null); }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Projects</h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{projects.length} total</p>
        </div>
        <Link to="/admin/projects/new" className="btn-primary">+ Add Project</Link>
      </div>

      {loading ? <LoadingSpinner size="lg" className="py-20" /> :
       projects.length === 0 ? (
        <div className={`card text-center py-20 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <p className="text-4xl mb-4">💼</p>
          No projects yet.{' '}
          <Link to="/admin/projects/new" className="text-violet-500 hover:underline">Add one!</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project._id} className="card flex items-center gap-4">
              {project.imageUrl && (
                <img src={project.imageUrl} alt="" className={`w-16 h-16 rounded-xl object-cover flex-shrink-0 ${isDark ? 'bg-[#0a0a1a]' : 'bg-gray-100'}`}
                  onError={(e) => e.target.style.display = 'none'} />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.title}</h3>
                  {project.featured && <span className="badge text-xs">⭐ Featured</span>}
                </div>
                <p className={`text-sm mt-1 truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{project.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.techStack.slice(0, 4).map((t) => <span key={t} className="tag text-xs">{t}</span>)}
                  {project.techStack.length > 4 && <span className="tag text-xs">+{project.techStack.length - 4}</span>}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link to={`/admin/projects/edit/${project._id}`} className="btn-secondary text-sm py-1.5 px-3">Edit</Link>
                <button onClick={() => setConfirmId(project._id)} className="btn-danger text-sm py-1.5 px-3">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog isOpen={!!confirmId} title="Delete Project" message="Are you sure? This cannot be undone."
        onConfirm={handleDelete} onCancel={() => setConfirmId(null)} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

// ─── Form View ────────────────────────────────────────────────────────────────
export const AdminProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '', description: '', techStack: '', liveUrl: '', githubUrl: '', imageUrl: '', featured: false,
  });
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [toast, setToast]       = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    API.get(`/projects/${id}`)
      .then(({ data }) => {
        const p = data.data;
        setForm({ ...p, techStack: p.techStack.join(', ') });
      })
      .catch(() => setToast({ message: 'Failed to load project', type: 'error' }))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, techStack: form.techStack.split(',').map((t) => t.trim()).filter(Boolean) };
    try {
      if (isEdit) { await API.put(`/projects/${id}`, payload); setToast({ message: 'Project updated!', type: 'success' }); }
      else        { await API.post('/projects', payload);       setToast({ message: 'Project created!', type: 'success' }); }
      setTimeout(() => navigate('/admin/projects'), 1000);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to save', type: 'error' });
    } finally { setLoading(false); }
  };

  if (fetching) return <LoadingSpinner size="lg" className="py-20" />;

  const labelClass = `block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`;

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/projects')}
          className={`p-2 rounded-xl border transition-colors ${isDark ? 'border-violet-500/20 text-gray-400 hover:text-white hover:bg-violet-500/10' : 'border-violet-200 text-gray-500 hover:text-gray-900 hover:bg-violet-50'}`}>
          ←
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{isEdit ? 'Edit Project' : 'New Project'}</h1>
          <p className={`text-sm mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{isEdit ? 'Update project details' : 'Add a new project'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className={labelClass}>Title *</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="My Awesome Project" required />
        </div>
        <div>
          <label className={labelClass}>Description *</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[100px] resize-y" placeholder="Brief description..." required />
        </div>
        <div>
          <label className={labelClass}>Tech Stack (comma separated) *</label>
          <input value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} className="input-field" placeholder="React, Node.js, MongoDB" required />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Live URL</label>
            <input value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} className="input-field" placeholder="https://myproject.com" />
          </div>
          <div>
            <label className={labelClass}>GitHub URL</label>
            <input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className="input-field" placeholder="https://github.com/..." />
          </div>
        </div>
        <div>
          <label className={labelClass}>Image URL</label>
          <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="input-field" placeholder="https://..." />
        </div>
        <label className={`flex items-center gap-3 cursor-pointer p-4 rounded-xl border transition-colors ${
          isDark ? 'border-violet-500/10 hover:border-violet-500/30' : 'border-violet-200 hover:border-violet-400'
        }`}>
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-violet-500" />
          <div>
            <p className={`font-medium text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Featured Project</p>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Show in featured section on portfolio</p>
          </div>
        </label>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? '⏳ Saving...' : '💾 Save Project'}</button>
          <button type="button" onClick={() => navigate('/admin/projects')} className="btn-secondary">Cancel</button>
        </div>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};