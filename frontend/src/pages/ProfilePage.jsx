import { useEffect, useState } from 'react';
import { profileService } from '../services/profileService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/common/Toast';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const STATES = ['Uttar Pradesh', 'Haryana', 'Punjab', 'Maharashtra', 'Karnataka', 'Delhi', 'Rajasthan', 'Gujarat'];
const CROPS  = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize'];

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile]     = useState(null);
  const [form, setForm]           = useState({});
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const { toast, showToast }      = useToast();

  useEffect(() => {
    profileService.getProfile()
      .then((res) => {
        const p = res.data.data;
        setProfile(p);
        setForm({
          fullName:      p.fullName      || user?.fullName || '',
          phone:         p.phone         || user?.phone    || '',
          address:       p.address       || '',
          state:         p.state         || '',
          district:      p.district      || '',
          preferredCrop: p.preferredCrop || '',
          farmSize:      p.farmSize      || '',
        });
      })
      .catch(() => showToast('Failed to load profile', 'error'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await profileService.updateProfile(form);
      setProfile(res.data.data);
      showToast('Profile updated successfully');
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    } finally { setSaving(false); }
  };

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await profileService.uploadPhoto(file);
      setProfile(res.data.data);
      showToast('Photo uploaded');
    } catch { showToast('Photo upload failed', 'error'); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { showToast('Passwords do not match', 'error'); return; }
    try {
      await profileService.changePassword(passwords);
      showToast('Password changed');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { showToast(err.response?.data?.message || 'Password change failed', 'error'); }
  };

  if (loading) return <LoadingSkeleton rows={8} height={28} />;

  const photoSrc = profile?.profilePhoto
    ? (profile.profilePhoto.startsWith('http') ? profile.profilePhoto : `/api${profile.profilePhoto}`)
    : null;

  const tabs = [
    { id: 'personal', label: '👤 Personal' },
    { id: 'farm',     label: '🌾 Farm Info' },
    { id: 'security', label: '🔒 Security' },
  ];

  return (
    <>
      <Toast toast={toast} />
      <h2 className="page-title">My Profile</h2>

      <div className="row g-4">
        {/* ── Profile card with cover ── */}
        <div className="col-lg-4">
          <div className="card-custom p-0" style={{ overflow: 'hidden' }}>
            {/* Cover */}
            <div className="profile-cover" />
            {/* Avatar */}
            <div style={{ padding: '3rem 1.5rem 1.5rem', position: 'relative' }}>
              <div className="profile-avatar">
                {photoSrc
                  ? <img src={photoSrc} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '2.2rem' }}>👤</span>}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <h5 style={{ fontWeight: 800, marginBottom: '0.2rem' }}>{profile?.fullName || user?.fullName}</h5>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{profile?.email || user?.email}</div>
                {form.preferredCrop && (
                  <span className="badge-custom badge-primary mt-2" style={{ fontSize: '0.78rem' }}>
                    🌾 {form.preferredCrop} Farmer
                  </span>
                )}
              </div>
              <label className="btn btn-sm btn-outline-success w-100 mb-0">
                📷 Change Photo
                <input type="file" accept="image/*" hidden onChange={handlePhoto} />
              </label>
            </div>

            {/* Summary */}
            <div style={{ padding: '0 1.5rem 1.5rem' }}>
              <div className="divider mt-0" />
              {[
                { icon: '📍', label: form.state || 'State not set' },
                { icon: '🏘', label: form.district || 'District not set' },
                { icon: '📐', label: form.farmSize ? `${form.farmSize} acres farm` : 'Farm size not set' },
                { icon: '📞', label: form.phone || 'Phone not set' },
              ].map((item) => (
                <div key={item.label} className="d-flex align-items-center gap-2 mb-2">
                  <span style={{ fontSize: '1rem', width: 22, textAlign: 'center' }}>{item.icon}</span>
                  <span style={{ fontSize: '0.87rem', color: 'var(--text-muted)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs & forms ── */}
        <div className="col-lg-8">
          {/* Tab switcher */}
          <div className="d-flex gap-2 mb-4">
            {tabs.map((t) => (
              <button key={t.id} type="button"
                onClick={() => setActiveTab(t.id)}
                className={activeTab === t.id ? 'btn btn-primary-custom btn-sm' : 'btn btn-outline-success btn-sm'}
                style={{ fontSize: '0.85rem' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Personal info */}
          {activeTab === 'personal' && (
            <form onSubmit={handleSave} className="card-custom">
              <div className="section-title mb-4">👤 Personal Information</div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email Address</label>
                  <input className="form-control" value={profile?.email || user?.email} disabled style={{ opacity: 0.65 }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Mobile Number</label>
                  <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label">Full Address</label>
                  <input className="form-control" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary-custom mt-4" disabled={saving}>
                {saving ? '⏳ Saving...' : '✓ Save Personal Info'}
              </button>
            </form>
          )}

          {/* Farm info */}
          {activeTab === 'farm' && (
            <form onSubmit={handleSave} className="card-custom">
              <div className="section-title mb-4">🌾 Farm Information</div>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">State</label>
                  <select className="form-select" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}>
                    <option value="">Select State</option>
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">District</label>
                  <input className="form-control" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} placeholder="Enter district" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Farm Size (acres)</label>
                  <input type="number" step="0.1" min="0" className="form-control" value={form.farmSize} onChange={(e) => setForm({ ...form, farmSize: e.target.value })} placeholder="e.g. 5.5" />
                </div>
                <div className="col-12">
                  <label className="form-label">Preferred Crop</label>
                  <div className="d-flex flex-wrap gap-2">
                    {CROPS.map((c) => (
                      <button type="button" key={c}
                        onClick={() => setForm({ ...form, preferredCrop: c })}
                        style={{
                          padding: '0.5rem 1.1rem', borderRadius: 20,
                          border: `2px solid ${form.preferredCrop === c ? 'var(--primary)' : 'var(--border)'}`,
                          background: form.preferredCrop === c ? 'rgba(46,125,50,0.1)' : 'var(--surface)',
                          color: form.preferredCrop === c ? 'var(--primary)' : 'var(--text)',
                          fontWeight: form.preferredCrop === c ? 700 : 500, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s',
                        }}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary-custom mt-4" disabled={saving}>
                {saving ? '⏳ Saving...' : '✓ Save Farm Info'}
              </button>
            </form>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordChange} className="card-custom">
              <div className="section-title mb-4">🔒 Change Password</div>
              <div className="row g-3">
                {[
                  { key: 'currentPassword', label: 'Current Password' },
                  { key: 'newPassword',     label: 'New Password' },
                  { key: 'confirmPassword', label: 'Confirm New Password' },
                ].map((f) => (
                  <div className="col-12" key={f.key}>
                    <label className="form-label">{f.label}</label>
                    <input type="password" className="form-control" value={passwords[f.key]} onChange={(e) => setPasswords({ ...passwords, [f.key]: e.target.value })} />
                  </div>
                ))}
              </div>
              <button type="submit" className="btn btn-primary-custom mt-4">🔒 Update Password</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
