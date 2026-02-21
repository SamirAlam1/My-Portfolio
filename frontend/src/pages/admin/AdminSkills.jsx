import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import API from '../../utils/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import Toast from '../../components/shared/Toast';
import { useTheme } from '../../context/ThemeContext';

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Other'];

export const AdminSkillsList = () => {
  const [skills, setSkills]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const { isDark } = useTheme();

  const fetchSkills = () => {
    setLoading(true);
    API.get('/skills').then(({ data }) => setSkills(data.data))
      .catch(() => setToast({ message: 'Failed to load skills', type: 'error' }))
      .finally(() => setLoading(false));
  };
  useEffect(fetchSkills, []);

  const handleDelete = async () => {
    try {
      await API.delete(`/skills/${confirmId}`);
      setToast({ message: 'Skill deleted!', type: 'success' });
      fetchSkills();
    } catch { setToast({ message: 'Failed to delete', type: 'error' }); }
    finally  { setConfirmId(null); }
  };

  const grouped = skills.reduce((acc, s) => { (acc[s.category] = acc[s.category] || []).push(s); return acc; }, {});

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Skills</h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{skills.length} total</p>
        </div>
        <Link to="/admin/skills/new" className="btn-primary">+ Add Skill</Link>
      </div>

      {loading ? <LoadingSpinner size="lg" className="py-20" /> :
       skills.length === 0 ? (
        <div className={`card text-center py-20 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <p className="text-4xl mb-4">🛠️</p>
          No skills yet. <Link to="/admin/skills/new" className="text-violet-500 hover:underline">Add one!</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, catSkills]) => (
            <div key={category} className="card">
              <h2 className={`font-bold mb-4 pb-3 border-b ${isDark ? 'text-gray-200 border-violet-500/10' : 'text-gray-800 border-violet-100'}`}>
                {category}
              </h2>
              <div className="space-y-3">
                {catSkills.map((skill) => (
                  <div key={skill._id} className={`flex items-center gap-4 p-3 rounded-xl border ${
                    isDark ? 'border-violet-500/10 bg-[#0f0f23]/50' : 'border-violet-100 bg-violet-50/40'
                  }`}>
                    <span className="text-2xl">{skill.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`font-semibold text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{skill.name}</span>
                        <span className="text-xs font-bold gradient-text">{skill.level}%</span>
                      </div>
                      <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                        <div className="h-full rounded-full" style={{ width: `${skill.level}%`, background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }} />
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Link to={`/admin/skills/edit/${skill._id}`} className="btn-secondary text-xs py-1.5 px-3">Edit</Link>
                      <button onClick={() => setConfirmId(skill._id)} className="btn-danger text-xs py-1.5 px-3">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog isOpen={!!confirmId} title="Delete Skill" message="Are you sure? This cannot be undone."
        onConfirm={handleDelete} onCancel={() => setConfirmId(null)} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export const AdminSkillForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const isEdit = Boolean(id);

  const [form, setForm]         = useState({ name: '', category: 'Frontend', level: 80, icon: '⚡' });
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [toast, setToast]       = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    API.get(`/skills/${id}`).then(({ data }) => setForm(data.data))
      .catch(() => setToast({ message: 'Failed to load skill', type: 'error' }))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (isEdit) { await API.put(`/skills/${id}`, form);  setToast({ message: 'Skill updated!', type: 'success' }); }
      else        { await API.post('/skills', form);        setToast({ message: 'Skill created!', type: 'success' }); }
      setTimeout(() => navigate('/admin/skills'), 1000);
    } catch (err) { setToast({ message: err.response?.data?.message || 'Failed to save', type: 'error' }); }
    finally { setLoading(false); }
  };

  if (fetching) return <LoadingSpinner size="lg" className="py-20" />;
  const labelClass = `block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`;

  return (
    <div className="animate-fade-in max-w-lg">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/skills')}
          className={`p-2 rounded-xl border transition-colors ${isDark ? 'border-violet-500/20 text-gray-400 hover:text-white hover:bg-violet-500/10' : 'border-violet-200 text-gray-500 hover:text-gray-900 hover:bg-violet-50'}`}>←</button>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{isEdit ? 'Edit Skill' : 'New Skill'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Skill Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="React.js" required />
          </div>
          <div>
            <label className={labelClass}>Icon (emoji)</label>
            <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="input-field" placeholder="⚡" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Category *</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Level: <span className="gradient-text font-bold">{form.level}%</span></label>
          <input type="range" min="1" max="100" value={form.level}
            onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-violet-500"
            style={{ background: `linear-gradient(to right, #7c3aed ${form.level}%, ${isDark ? '#374151' : '#e5e7eb'} ${form.level}%)` }} />
          <div className={`flex justify-between text-xs mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            <span>Beginner</span><span>Intermediate</span><span>Expert</span>
          </div>
        </div>

        {/* Preview */}
        <div className={`p-4 rounded-xl border ${isDark ? 'border-violet-500/10 bg-[#0f0f23]/50' : 'border-violet-200 bg-violet-50/50'}`}>
          <p className={`text-xs mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Preview</p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{form.icon}</span>
            <span className={`font-semibold text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{form.name || 'Skill Name'}</span>
            <span className="ml-auto text-xs font-bold gradient-text">{form.level}%</span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <div className="h-full rounded-full transition-all" style={{ width: `${form.level}%`, background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? '⏳ Saving...' : '💾 Save Skill'}</button>
          <button type="button" onClick={() => navigate('/admin/skills')} className="btn-secondary">Cancel</button>
        </div>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};