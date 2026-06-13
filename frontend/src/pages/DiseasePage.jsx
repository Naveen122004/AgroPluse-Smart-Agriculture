import { useEffect, useState } from 'react';
import { diseaseService } from '../services/diseaseService';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

const SEV_STYLE = {
  HIGH:   { badge: 'badge-red',   border: '#c62828', icon: '🔴' },
  MEDIUM: { badge: 'badge-amber', border: '#f57c00', icon: '🟡' },
  LOW:    { badge: 'badge-primary', border: 'var(--primary)', icon: '🟢' },
};

const diseaseTips = [
  { icon: '🔍', tip: 'Inspect crops weekly — early detection prevents 80% of yield loss.' },
  { icon: '💧', tip: 'Avoid overhead irrigation which spreads fungal spores between plants.' },
  { icon: '🔄', tip: 'Crop rotation breaks the lifecycle of soil-borne diseases effectively.' },
];

export default function DiseasePage() {
  const [diseases, setDiseases]   = useState([]);
  const [search, setSearch]       = useState('');
  const [crop, setCrop]           = useState('');
  const [category, setCategory]   = useState('');
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      let res;
      if (search) res = await diseaseService.search(search);
      else if (crop || category) res = await diseaseService.filter(crop, category);
      else res = await diseaseService.getAll();
      setDiseases(res.data.data || []);
    } catch { setDiseases([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const highCount   = diseases.filter((d) => d.severity === 'HIGH').length;
  const mediumCount = diseases.filter((d) => d.severity === 'MEDIUM').length;

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h2 className="page-title mb-0">⚠️ Disease Alerts</h2>
        <div className="d-flex gap-2">
          {highCount > 0 && <span className="badge-custom badge-red">🔴 {highCount} High Risk</span>}
          {mediumCount > 0 && <span className="badge-custom badge-amber">🟡 {mediumCount} Medium</span>}
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-9">
          {/* ── Filters ── */}
          <form onSubmit={(e) => { e.preventDefault(); load(); }} className="card-custom mb-4 p-3">
            <div className="row g-2 align-items-end">
              <div className="col-md-4">
                <label className="form-label">Search Disease</label>
                <input className="form-control" placeholder="e.g. Blight, Rust..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Crop Affected</label>
                <input className="form-control" placeholder="e.g. Wheat, Rice..." value={crop} onChange={(e) => setCrop(e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Category</label>
                <input className="form-control" placeholder="e.g. Fungal..." value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>
              <div className="col-auto">
                <button type="submit" className="btn btn-primary-custom">🔍 Filter</button>
              </div>
            </div>
          </form>

          {/* ── Disease cards ── */}
          {loading ? <LoadingSkeleton rows={4} height={100} /> : diseases.length === 0 ? (
            <EmptyState icon="⚠️" title="No disease alerts" message="No diseases match your search criteria" />
          ) : (
            <div className="row g-3">
              {diseases.map((d) => {
                const sev = SEV_STYLE[d.severity] || SEV_STYLE.MEDIUM;
                return (
                  <div className="col-md-6" key={d.id}>
                    <div className="card-custom h-100 dashboard-card" style={{ borderLeft: `4px solid ${sev.border}` }}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h5 style={{ fontWeight: 700, fontSize: '0.97rem', marginBottom: '0.2rem' }}>{d.diseaseName}</h5>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{d.cropAffected} • {d.category}</div>
                        </div>
                        <span className={`badge-custom ${sev.badge}`} style={{ fontSize: '0.72rem', flexShrink: 0 }}>
                          {sev.icon} {d.severity}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.87rem', lineHeight: 1.65, color: 'var(--text)', marginBottom: '0.75rem' }}>
                        <strong>Symptoms:</strong> {d.symptoms?.slice(0, 100)}{d.symptoms?.length > 100 ? '…' : ''}
                      </p>

                      <button className="btn btn-sm btn-outline-success mt-auto" onClick={() => setSelected(d)}>
                        View Full Details →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Prevention sidebar ── */}
        <div className="col-lg-3">
          <div className="card-custom mb-3">
            <div className="section-title">🛡 Prevention Tips</div>
            {diseaseTips.map((t, i) => (
              <div key={i} className="info-tip" style={{ fontSize: '0.83rem' }}>
                <span style={{ fontSize: '1.1rem', marginRight: '0.4rem' }}>{t.icon}</span>{t.tip}
              </div>
            ))}
          </div>
          <div className="card-custom">
            <div className="section-title">📊 Risk Summary</div>
            {[
              { label: 'High Risk',   count: diseases.filter((d) => d.severity === 'HIGH').length,   style: 'badge-red'   },
              { label: 'Medium Risk', count: diseases.filter((d) => d.severity === 'MEDIUM').length, style: 'badge-amber' },
              { label: 'Low Risk',    count: diseases.filter((d) => d.severity === 'LOW').length,    style: 'badge-primary' },
            ].map((r) => (
              <div key={r.label} className="d-flex justify-content-between align-items-center mb-2 pb-2" style={{ borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }}>
                <span>{r.label}</span>
                <span className={`badge-custom ${r.style}`} style={{ fontSize: '0.75rem' }}>{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {selected && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setSelected(null)}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid var(--border)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', background: `linear-gradient(135deg, ${SEV_STYLE[selected.severity]?.border || 'var(--primary)'}, var(--surface))` }}>
                <div>
                  <h5 className="modal-title" style={{ fontWeight: 700 }}>{selected.diseaseName}</h5>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{selected.cropAffected} • {selected.category}</div>
                </div>
                <button type="button" className="btn-close" onClick={() => setSelected(null)} />
              </div>
              <div className="modal-body p-4">
                <span className={`badge-custom ${SEV_STYLE[selected.severity]?.badge || 'badge-amber'} mb-4`}>
                  {SEV_STYLE[selected.severity]?.icon} Severity: {selected.severity}
                </span>
                {[
                  { key: 'symptoms',  label: '🔍 Symptoms'  },
                  { key: 'causes',    label: '🧬 Causes'    },
                  { key: 'prevention', label: '🛡 Prevention' },
                  { key: 'treatment', label: '💊 Treatment' },
                ].map((f) => selected[f.key] && (
                  <div key={f.key} className="mb-4">
                    <h6 style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: '0.5rem' }}>{f.label}</h6>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.75, marginBottom: 0 }}>{selected[f.key]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
