import { useEffect, useState } from 'react';
import { cropCareService } from '../services/cropCareService';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

const CROPS      = ['All', 'Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize'];
const CATEGORIES = ['All', 'Health Tips', 'Fertilizer', 'Pest Control', 'Disease Prevention'];
const CAT_ICONS  = { 'Health Tips': '💚', 'Fertilizer': '🧪', 'Pest Control': '🐛', 'Disease Prevention': '🛡' };
const CROP_ICONS = { Rice: '🌾', Wheat: '🌾', Cotton: '🌿', Sugarcane: '🎋', Maize: '🌽' };

const seasonalTips = [
  { icon: '☀️', season: 'Summer',  tip: 'Increase irrigation frequency. Use mulching to retain soil moisture.' },
  { icon: '🌧', season: 'Monsoon', tip: 'Ensure good drainage. Watch for fungal diseases in wet conditions.' },
  { icon: '❄️', season: 'Winter',  tip: 'Protect seedlings from frost. Apply potassium-rich fertilizers.' },
];

export default function CropCarePage() {
  const [advisories, setAdvisories] = useState([]);
  const [search, setSearch]       = useState('');
  const [crop, setCrop]           = useState('All');
  const [category, setCategory]   = useState('All');
  const [loading, setLoading]     = useState(true);
  const [expanded, setExpanded]   = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      let res;
      if (search) res = await cropCareService.search(search);
      else if (crop !== 'All' || category !== 'All') res = await cropCareService.filter(crop === 'All' ? '' : crop, category === 'All' ? '' : category);
      else res = await cropCareService.getAll();
      setAdvisories(res.data.data || []);
    } catch { setAdvisories([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h2 className="page-title mb-0">🌱 Crop Care Advisory</h2>
        <span className="badge-custom badge-primary">{advisories.length} Advisories</span>
      </div>

      <div className="row g-4">
        <div className="col-lg-9">
          {/* ── Search & filter ── */}
          <div className="card-custom mb-4 p-3">
            <form onSubmit={(e) => { e.preventDefault(); load(); }}>
              <div className="row g-2 align-items-end mb-3">
                <div className="col">
                  <label className="form-label">Search Advisories</label>
                  <input className="form-control" placeholder="Search by topic, pest, disease..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="col-auto">
                  <button type="submit" className="btn btn-primary-custom">🔍 Search</button>
                </div>
              </div>

              {/* Crop pills */}
              <div className="mb-2">
                <div className="form-label mb-2">Crop</div>
                <div className="d-flex flex-wrap gap-2">
                  {CROPS.map((c) => (
                    <button type="button" key={c}
                      onClick={() => setCrop(c)}
                      className={crop === c ? 'btn btn-sm btn-primary-custom' : 'btn btn-sm btn-outline-success'}
                      style={{ fontSize: '0.82rem' }}>
                      {CROP_ICONS[c] || ''} {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category pills */}
              <div>
                <div className="form-label mb-2">Category</div>
                <div className="d-flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button type="button" key={cat}
                      onClick={() => setCategory(cat)}
                      className={category === cat ? 'btn btn-sm btn-primary-custom' : 'btn btn-sm btn-outline-success'}
                      style={{ fontSize: '0.82rem' }}>
                      {CAT_ICONS[cat] || ''} {cat}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* ── Advisory cards ── */}
          {loading ? <LoadingSkeleton rows={5} height={80} /> : advisories.length === 0 ? (
            <EmptyState icon="🌱" title="No advisories found" message="Try adjusting the filters above" />
          ) : (
            <div className="row g-3">
              {advisories.map((a) => (
                <div className="col-md-6" key={a.id}>
                  <div className="card-custom h-100" style={{ borderTop: `3px solid var(--${a.category === 'Pest Control' ? 'accent' : 'primary'})` }}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge-custom badge-primary" style={{ fontSize: '0.75rem' }}>
                        {CROP_ICONS[a.cropName] || '🌱'} {a.cropName}
                      </span>
                      <span className="badge-custom badge-gray" style={{ fontSize: '0.72rem' }}>
                        {CAT_ICONS[a.category] || ''} {a.category}
                      </span>
                    </div>
                    <h5 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem' }}>{a.title}</h5>
                    {a.season && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>📅 {a.season}</div>}
                    <p style={{ fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '0.75rem', color: 'var(--text)' }}>
                      {expanded === a.id ? a.content : (a.content?.slice(0, 130) + (a.content?.length > 130 ? '…' : ''))}
                    </p>
                    <button className="btn btn-sm btn-link p-0" style={{ color: 'var(--primary)', fontSize: '0.83rem', fontWeight: 600 }}
                      onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
                      {expanded === a.id ? '▲ Show less' : '▼ Read more'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="col-lg-3">
          <div className="card-custom mb-3">
            <div className="section-title">🗓 Seasonal Tips</div>
            {seasonalTips.map((s) => (
              <div key={s.season} className="mb-3">
                <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.25rem' }}>{s.icon} {s.season}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.tip}</div>
              </div>
            ))}
          </div>
          <div className="card-custom">
            <div className="section-title">📚 Quick Reference</div>
            {[
              { label: 'NPK Ratio',     val: '4:2:1 for most cereals' },
              { label: 'Spray Timing',  val: 'Early morning is ideal' },
              { label: 'Soil pH',       val: '6.0–7.5 for most crops' },
              { label: 'Watering',      val: 'Check 2-inch deep soil' },
            ].map((r) => (
              <div key={r.label} className="d-flex justify-content-between mb-2 pb-2" style={{ borderBottom: '1px solid var(--border)', fontSize: '0.83rem' }}>
                <span className="text-muted-custom">{r.label}</span>
                <span style={{ fontWeight: 600 }}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
