import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import API from '../../utils/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import Toast from '../../components/shared/Toast';
import { useTheme } from '../../context/ThemeContext';

const BOARDS = [
  '',
  'CBSE (Central Board of Secondary Education)',
  'ICSE (Indian Certificate of Secondary Education)',
  'Bihar School Examination Board (BSEB)',
  'UP Board (UPMSP)',
  'Maharashtra Board (MSBSHSE)',
  'Rajasthan Board (RBSE)',
  'MP Board (MPBSE)',
  'Gujarat Board (GSEB)',
  'West Bengal Board (WBBSE)',
  'Tamil Nadu Board (TNBSE)',
  'Karnataka Board (KSEEB)',
  'Andhra Pradesh Board (BIEAP)',
  'Telangana Board (BIETELANGANA)',
  'Kerala Board (DHSE)',
  'NIOS (National Institute of Open Schooling)',
  'IB (International Baccalaureate)',
  'Cambridge IGCSE',
  'Other',
];

export const AdminEducationList = () => {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const { isDark } = useTheme();

  const fetchItems = () => {
    setLoading(true);
    API.get('/education').then(({ data }) => setItems(data.data))
      .catch(() => setToast({ message: 'Failed to load education', type: 'error' }))
      .finally(() => setLoading(false));
  };
  useEffect(fetchItems, []);

  const handleDelete = async () => {
    try {
      await API.delete(`/education/${confirmId}`);
      setToast({ message: 'Education entry deleted!', type: 'success' });
      fetchItems();
    } catch { setToast({ message: 'Failed to delete', type: 'error' }); }
    finally  { setConfirmId(null); }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Education</h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{items.length} entries</p>
        </div>
        <Link to="/admin/education/new" className="btn-primary">+ Add Education</Link>
      </div>

      {loading ? <LoadingSpinner size="lg" className="py-20" /> :
       items.length === 0 ? (
        <div className={`card text-center py-20 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <p className="text-4xl mb-4">🎓</p>
          No education entries.{' '}
          <Link to="/admin/education/new" className="text-violet-500 hover:underline">Add one!</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((edu) => (
            <div key={edu._id} className="card flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.15))' }}>
                🎓
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{edu.degree}</h3>
                <p className="gradient-text font-medium text-sm">{edu.fieldOfStudy}</p>
                <p className={`text-sm mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{edu.institution}</p>
                {edu.board && (
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>📋 {edu.board}</p>
                )}
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                  {edu.startYear} — {edu.endYear || 'Present'}
                  {edu.grade && ` • ${edu.grade}`}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link to={`/admin/education/edit/${edu._id}`} className="btn-secondary text-sm py-1.5 px-3">Edit</Link>
                <button onClick={() => setConfirmId(edu._id)} className="btn-danger text-sm py-1.5 px-3">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog isOpen={!!confirmId} title="Delete Education" message="Are you sure? This cannot be undone."
        onConfirm={handleDelete} onCancel={() => setConfirmId(null)} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export const AdminEducationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    institution: '', degree: '', fieldOfStudy: '', board: '',
    startYear: '', endYear: '', grade: '', description: '',
  });
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [toast, setToast]       = useState(null);
  const [customBoard, setCustomBoard] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    API.get(`/education/${id}`).then(({ data }) => {
      const edu = data.data;
      setForm(edu);
      // Check if board is a custom value not in list
      if (edu.board && !BOARDS.includes(edu.board)) setCustomBoard(true);
    }).catch(() => setToast({ message: 'Failed to load', type: 'error' }))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (isEdit) { await API.put(`/education/${id}`, form); setToast({ message: 'Updated!', type: 'success' }); }
      else        { await API.post('/education', form);       setToast({ message: 'Created!', type: 'success' }); }
      setTimeout(() => navigate('/admin/education'), 1000);
    } catch (err) { setToast({ message: err.response?.data?.message || 'Failed', type: 'error' }); }
    finally { setLoading(false); }
  };

  if (fetching) return <LoadingSpinner size="lg" className="py-20" />;

  const labelClass = `block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`;
  const selectClass = `input-field`;

  return (
    <div className="animate-fade-in max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/education')}
          className={`p-2 rounded-xl border transition-colors ${
            isDark
              ? 'border-violet-500/20 text-gray-400 hover:text-white hover:bg-violet-500/10'
              : 'border-violet-200 text-gray-500 hover:text-gray-900 hover:bg-violet-50'
          }`}>←
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {isEdit ? 'Edit Education' : 'New Education'}
          </h1>
          <p className={`text-sm mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {isEdit ? 'Update education details' : 'Add a new education entry'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">

        {/* Institution */}
        <div>
          <label className={labelClass}>Institution / School / College *</label>
          <input
            value={form.institution}
            onChange={(e) => setForm({ ...form, institution: e.target.value })}
            className="input-field"
            placeholder="e.g. Nandlal Singh College Daudpur"
            required
          />
        </div>

        {/* Degree + Field */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Degree *</label>
            <input
              value={form.degree}
              onChange={(e) => setForm({ ...form, degree: e.target.value })}
              className="input-field"
              placeholder="e.g. 10th, 12th, B.Tech"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Field of Study *</label>
            <input
              value={form.fieldOfStudy}
              onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}
              className="input-field"
              placeholder="e.g. Science, Commerce, CSE"
              required
            />
          </div>
        </div>

        {/* Board */}
        <div>
          <label className={labelClass}>Board / University</label>
          {!customBoard ? (
            <div className="space-y-2">
              <select
                value={form.board}
                onChange={(e) => {
                  if (e.target.value === 'Other') {
                    setCustomBoard(true);
                    setForm({ ...form, board: '' });
                  } else {
                    setForm({ ...form, board: e.target.value });
                  }
                }}
                className={selectClass}
              >
                <option value="">-- Select Board --</option>
                {BOARDS.filter(Boolean).map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                Board nahi mila?{' '}
                <button type="button" onClick={() => setCustomBoard(true)} className="text-violet-500 hover:underline">
                  Manually type karo
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                value={form.board}
                onChange={(e) => setForm({ ...form, board: e.target.value })}
                className="input-field"
                placeholder="e.g. Bihar School Examination Board"
                autoFocus
              />
              <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                <button type="button" onClick={() => { setCustomBoard(false); setForm({ ...form, board: '' }); }} className="text-violet-500 hover:underline">
                  ← Dropdown se select karo
                </button>
              </p>
            </div>
          )}

          {/* Board Preview */}
          {form.board && (
            <div className={`mt-2 flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
              isDark ? 'bg-violet-500/10 text-violet-300' : 'bg-violet-50 text-violet-700'
            }`}>
              📋 <span className="font-medium">{form.board}</span>
            </div>
          )}
        </div>

        {/* Years + Grade */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Start Year *</label>
            <input
              type="number"
              value={form.startYear}
              onChange={(e) => setForm({ ...form, startYear: e.target.value })}
              className="input-field"
              placeholder="2022"
              min="1900" max="2100"
              required
            />
          </div>
          <div>
            <label className={labelClass}>End Year</label>
            <input
              type="number"
              value={form.endYear}
              onChange={(e) => setForm({ ...form, endYear: e.target.value })}
              className="input-field"
              placeholder="2024"
              min="1900" max="2100"
            />
          </div>
          <div>
            <label className={labelClass}>Grade / CGPA </label>
            <input
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
              className="input-field"
              placeholder="78.8%"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field min-h-[100px] resize-y"
            placeholder="Notable achievements, subjects, activities..."
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '⏳ Saving...' : '💾 Save'}
          </button>
          <button type="button" onClick={() => navigate('/admin/education')} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};