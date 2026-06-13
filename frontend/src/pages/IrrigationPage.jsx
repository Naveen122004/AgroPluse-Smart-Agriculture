import { useEffect, useState } from 'react';
import { irrigationService } from '../services/irrigationService';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { useToast } from '../hooks/useToast';
import Toast from '../components/common/Toast';
import { formatDateTime } from '../utils/formatters';

const CROPS    = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize'];
const SOILS    = ['Clay', 'Sandy', 'Loamy', 'Silty'];
const WEATHER  = ['Sunny/Hot', 'Rain Forecast', 'Cloudy', 'Cold/Winter'];
const CROP_ICONS = { Rice: '🌾', Wheat: '🌾', Cotton: '🌿', Sugarcane: '🎋', Maize: '🌽' };

const waterTips = [
  '💧 Drip irrigation reduces water use by up to 50% compared to flood irrigation.',
  '🌅 Water crops early morning to minimize evaporation losses throughout the day.',
  '🌱 Sandy soils need more frequent watering than clay or loamy soils.',
];

export default function IrrigationPage() {
  const [form, setForm] = useState({ cropType: 'Rice', soilType: 'Clay', weatherCondition: 'Rain Forecast' });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast, showToast } = useToast();

  useEffect(() => {
    irrigationService.getHistory()
      .then((res) => setHistory(res.data.data || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await irrigationService.getRecommendation(form);
      setResult(res.data.data);
      const histRes = await irrigationService.getHistory();
      setHistory(histRes.data.data || []);
      showToast('Recommendation generated');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed', 'error');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Toast toast={toast} />
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h2 className="page-title mb-0">💧 Irrigation Scheduler</h2>
        <span className="badge-custom badge-blue">Smart Recommendations</span>
      </div>

      <div className="row g-4 mb-4">
        {/* ── Form ── */}
        <div className="col-lg-4">
          <form onSubmit={handleSubmit} className="card-custom h-100">
            <div className="section-title mb-4">⚙️ Get Recommendation</div>

            <div className="mb-3">
              <label className="form-label">Crop Type</label>
              <div className="row g-2">
                {CROPS.map((c) => (
                  <div className="col-6" key={c}>
                    <button type="button"
                      onClick={() => setForm({ ...form, cropType: c })}
                      style={{
                        width: '100%', padding: '0.5rem 0.4rem', borderRadius: 8, border: `2px solid ${form.cropType === c ? 'var(--primary)' : 'var(--border)'}`,
                        background: form.cropType === c ? 'rgba(46,125,50,0.1)' : 'var(--surface)',
                        color: form.cropType === c ? 'var(--primary)' : 'var(--text)',
                        fontWeight: form.cropType === c ? 700 : 500, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s',
                      }}>
                      {CROP_ICONS[c] || '🌱'} {c}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Soil Type</label>
              <select className="form-select" value={form.soilType} onChange={(e) => setForm({ ...form, soilType: e.target.value })}>
                {SOILS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label">Weather Condition</label>
              <select className="form-select" value={form.weatherCondition} onChange={(e) => setForm({ ...form, weatherCondition: e.target.value })}>
                {WEATHER.map((w) => <option key={w}>{w}</option>)}
              </select>
            </div>

            <button type="submit" className="btn btn-primary-custom w-100" disabled={loading}>
              {loading ? '⏳ Calculating...' : '💧 Get Irrigation Advice'}
            </button>
          </form>
        </div>

        {/* ── Result + Tips ── */}
        <div className="col-lg-8">
          <div className="row g-3 h-100">
            <div className="col-12">
              <div className="card-custom">
                <div className="section-title">📋 Recommendation</div>
                {loading ? <LoadingSkeleton rows={4} /> : result ? (
                  <>
                    <div className="row g-3 mb-3">
                      {[
                        { icon: '💧', label: 'Water Required',    val: result.waterRequirement,    color: 'blue'  },
                        { icon: '⏰', label: 'Best Time',          val: result.recommendedTime,     color: 'amber' },
                        { icon: '📅', label: 'Frequency',          val: result.irrigationFrequency, color: 'green' },
                      ].map((s) => (
                        <div className="col-sm-4" key={s.label}>
                          <div className="stat-card">
                            <div className={`stat-icon ${s.color}`} style={{ width: 40, height: 40, fontSize: '1.1rem' }}>{s.icon}</div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)' }}>{s.val || '—'}</div>
                              <div className="stat-label" style={{ fontSize: '0.72rem' }}>{s.label}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="info-tip" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
                      🌱 {result.recommendation}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div style={{ fontSize: '3rem', marginBottom: '0.75rem', opacity: 0.4 }}>💧</div>
                    <p className="text-muted-custom mb-0" style={{ fontSize: '0.9rem' }}>Select crop, soil and weather condition to get personalised irrigation advice.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="col-12">
              <div className="card-custom">
                <div className="section-title">💡 Water Conservation Tips</div>
                <div className="row g-2">
                  {waterTips.map((t, i) => <div key={i} className="col-md-4"><div className="info-tip" style={{ fontSize: '0.83rem', height: '100%' }}>{t}</div></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── History timeline ── */}
      <div className="card-custom">
        <div className="section-title">🕒 Recommendation History</div>
        {history.length === 0 ? (
          <div className="text-center py-3">
            <div style={{ fontSize: '2rem', opacity: 0.4 }}>📋</div>
            <p className="text-muted-custom mt-2 mb-0" style={{ fontSize: '0.9rem' }}>No irrigation history yet. Generate your first recommendation above.</p>
          </div>
        ) : (
          <div className="timeline">
            {history.map((h) => (
              <div className="timeline-item" key={h.id}>
                <div className="timeline-dot">💧</div>
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                  <div>
                    <div className="timeline-title">
                      {CROP_ICONS[h.cropType] || '🌱'} {h.cropType}
                      <span className="ms-2 badge-custom badge-primary" style={{ fontSize: '0.72rem' }}>{h.soilType}</span>
                      <span className="ms-1 badge-custom badge-amber" style={{ fontSize: '0.72rem' }}>{h.weatherCondition}</span>
                    </div>
                    <div className="timeline-desc">{h.recommendation?.slice(0, 100)}{h.recommendation?.length > 100 ? '…' : ''}</div>
                  </div>
                  <small className="text-muted-custom" style={{ whiteSpace: 'nowrap', fontSize: '0.78rem' }}>{formatDateTime(h.createdAt)}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
