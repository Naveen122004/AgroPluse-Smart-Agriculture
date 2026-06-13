import { useEffect, useState } from 'react';
import { schemeService } from '../services/schemeService';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { formatDate } from '../utils/formatters';
import { useToast } from '../hooks/useToast';
import Toast from '../components/common/Toast';

const isActive = (lastDate) => !lastDate || new Date(lastDate) >= new Date();

const CAT_ICONS = {
  'PM-KISAN':        '💰',
  'Crop Insurance':  '🛡',
  'Irrigation':      '💧',
  'Fertilizer Subsidy': '🧪',
  'Farm Machinery':  '🚜',
  'Organic Farming': '🌿',
  'Livestock':       '🐄',
  'Horticulture':    '🍎',
  'Crop Loan':       '🏦',
  'General':         '🏛',
};

export default function SchemesPage() {
  const [schemes, setSchemes]       = useState([]);
  const [latest, setLatest]         = useState([]);
  const [savedIds, setSavedIds]     = useState(new Set());
  const [categories, setCategories] = useState([]);
  const [states, setStates]         = useState([]);
  const [search, setSearch]         = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selected, setSelected]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [syncing, setSyncing]       = useState(false);
  const [activeTab, setActiveTab]   = useState('all');
  const { toast, showToast }        = useToast();

  const loadMeta = async () => {
    try {
      const [catRes, stateRes] = await Promise.all([
        schemeService.getCategories(),
        schemeService.getStates(),
      ]);
      setCategories(catRes.data.data || []);
      setStates(stateRes.data.data || []);
    } catch { /* non-critical */ }
  };

  const loadLatest = async () => {
    try {
      const res = await schemeService.getLatest();
      setLatest(res.data.data || []);
    } catch { /* non-critical */ }
  };

  const load = async () => {
    setLoading(true);
    try {
      let res;
      if (search)                  res = await schemeService.search(search);
      else if (categoryFilter)     res = await schemeService.filterByCategory(categoryFilter);
      else if (stateFilter)        res = await schemeService.filter(stateFilter);
      else if (activeTab === 'new') res = await schemeService.getNew();
      else if (activeTab === 'saved') res = await schemeService.getSaved();
      else                         res = await schemeService.getAll();
      setSchemes(res.data.data?.content || res.data.data || []);
      const savedRes = await schemeService.getSaved();
      setSavedIds(new Set((savedRes.data.data || []).map((s) => s.id)));
    } catch { setSchemes([]); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    loadMeta();
    loadLatest();
  }, []);

  useEffect(() => { load(); }, [activeTab]);

  const handleSearch = (e) => { e.preventDefault(); load(); };

  const clearFilters = () => {
    setSearch('');
    setStateFilter('');
    setCategoryFilter('');
    setTimeout(load, 0);
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await schemeService.triggerSync();
      const data = res.data.data;
      showToast(`✅ ${data.message}`);
      await load();
      await loadLatest();
    } catch {
      showToast('Sync failed', 'error');
    } finally { setSyncing(false); }
  };

  const toggleSave = async (id) => {
    try {
      if (savedIds.has(id)) {
        await schemeService.unsave(id);
        setSavedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
        showToast('Scheme removed from saved');
      } else {
        await schemeService.save(id);
        setSavedIds((prev) => new Set([...prev, id]));
        showToast('Scheme saved');
      }
    } catch { showToast('Action failed', 'error'); }
  };

  const viewDetails = async (id) => {
    try {
      const res = await schemeService.getById(id);
      setSelected(res.data.data);
    } catch { showToast('Failed to load details', 'error'); }
  };

  const activeCount = schemes.filter((s) => isActive(s.lastDate)).length;
  const newCount    = schemes.filter((s) => s.isNew).length;

  return (
    <>
      <Toast toast={toast} />

      {/* ── Header ── */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="page-title mb-1">🏛 Government Schemes</h2>
          <p className="text-muted-custom mb-0" style={{ fontSize: '0.88rem' }}>
            Latest agricultural schemes, subsidies, and welfare programs from Government of India
          </p>
        </div>
        <button className="btn btn-outline-success btn-sm d-flex align-items-center gap-2"
          onClick={handleSync} disabled={syncing}>
          <span style={{ display: 'inline-block', animation: syncing ? 'spin 1s linear infinite' : 'none' }}>🔄</span>
          {syncing ? 'Syncing...' : 'Sync Latest'}
        </button>
      </div>

      {/* ── Stats row ── */}
      <div className="row g-3 mb-4">
        {[
          { icon: '🏛', label: 'Total Schemes',  val: schemes.length,   color: 'green' },
          { icon: '✅', label: 'Active Now',      val: activeCount,       color: 'green' },
          { icon: '🆕', label: 'New (30 days)',   val: newCount,          color: 'blue'  },
          { icon: '⭐', label: 'Saved by You',    val: savedIds.size,     color: 'amber' },
        ].map((s) => (
          <div className="col-6 col-lg-3" key={s.label}>
            <div className="stat-card">
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div>
                <div className="stat-value">{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Latest schemes strip ── */}
      {latest.length > 0 && (
        <div className="card-custom mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="section-title mb-0">🆕 Latest Government Updates</div>
            <button className="btn btn-sm btn-link p-0" style={{ color: 'var(--primary)', fontSize: '0.82rem' }}
              onClick={() => setActiveTab('new')}>View all new →</button>
          </div>
          <div className="row g-2">
            {latest.map((s) => (
              <div className="col-md-6 col-lg" key={s.id}>
                <div className="d-flex align-items-start gap-2 p-2 rounded"
                  style={{ background: 'rgba(46,125,50,0.06)', border: '1px solid var(--border)', cursor: 'pointer' }}
                  onClick={() => viewDetails(s.id)}>
                  <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{CAT_ICONS[s.category] || '🏛'}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', lineHeight: 1.3, marginBottom: '0.15rem' }}
                      className="text-truncate">{s.schemeName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {s.publishDate ? formatDate(s.publishDate) : s.state}
                    </div>
                    {s.isNew && <span className="badge-custom badge-primary" style={{ fontSize: '0.65rem' }}>NEW</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        {[
          { id: 'all',   label: '📋 All Schemes' },
          { id: 'new',   label: '🆕 Recently Added' },
          { id: 'saved', label: `⭐ Saved (${savedIds.size})` },
        ].map((t) => (
          <button key={t.id} type="button"
            onClick={() => { setActiveTab(t.id); setSearch(''); setCategoryFilter(''); setStateFilter(''); }}
            className={activeTab === t.id ? 'btn btn-sm btn-primary-custom' : 'btn btn-sm btn-outline-success'}
            style={{ fontSize: '0.82rem' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Search & Filters ── */}
      <form onSubmit={handleSearch} className="card-custom mb-4 p-3">
        <div className="row g-2 align-items-end mb-3">
          <div className="col-md-5">
            <label className="form-label">Search Schemes</label>
            <input className="form-control" placeholder="PM-KISAN, Fasal Bima, irrigation..." value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">State</label>
            <select className="form-select" value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
              <option value="">All States</option>
              {states.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-auto d-flex gap-2">
            <button type="submit" className="btn btn-primary-custom">🔍 Search</button>
            {(search || stateFilter || categoryFilter) && (
              <button type="button" className="btn btn-outline-secondary" onClick={clearFilters}>Clear</button>
            )}
          </div>
        </div>

        {/* Category pills */}
        <div>
          <div className="form-label mb-2">Category</div>
          <div className="d-flex flex-wrap gap-2">
            <button type="button"
              className={!categoryFilter ? 'btn btn-sm btn-primary-custom' : 'btn btn-sm btn-outline-success'}
              style={{ fontSize: '0.8rem' }} onClick={() => setCategoryFilter('')}>
              🏛 All
            </button>
            {categories.map((cat) => (
              <button type="button" key={cat}
                className={categoryFilter === cat ? 'btn btn-sm btn-primary-custom' : 'btn btn-sm btn-outline-success'}
                style={{ fontSize: '0.8rem' }}
                onClick={() => { setCategoryFilter(cat); setSearch(''); setTimeout(load, 0); }}>
                {CAT_ICONS[cat] || '🏛'} {cat}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* ── Scheme cards ── */}
      {loading ? <LoadingSkeleton rows={4} height={120} /> : schemes.length === 0 ? (
        <EmptyState icon="🏛" title="No schemes found" message="Try a different filter or click Sync Latest" />
      ) : (
        <div className="row g-3">
          {schemes.map((s) => {
            const active = isActive(s.lastDate);
            return (
              <div className="col-md-6" key={s.id}>
                <div className="card-custom h-100"
                  style={{ borderLeft: `4px solid ${active ? 'var(--primary)' : 'var(--border)'}` }}>

                  {/* Card header */}
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                      <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                        <h5 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 0 }}>{s.schemeName}</h5>
                        {s.isNew && (
                          <span style={{
                            background: 'var(--primary)', color: '#fff', fontSize: '0.65rem',
                            fontWeight: 800, padding: '0.15em 0.55em', borderRadius: 4,
                            letterSpacing: '0.06em', textTransform: 'uppercase',
                          }}>NEW</span>
                        )}
                      </div>
                    </div>
                    <span className={`badge-custom ${active ? 'badge-primary' : 'badge-gray'}`}
                      style={{ fontSize: '0.7rem', flexShrink: 0 }}>
                      {active ? '✅ Active' : '⏹ Closed'}
                    </span>
                  </div>

                  {/* Meta tags */}
                  <div className="d-flex flex-wrap gap-1 mb-2">
                    {s.category && (
                      <span className="badge-custom badge-blue" style={{ fontSize: '0.7rem' }}>
                        {CAT_ICONS[s.category] || '🏛'} {s.category}
                      </span>
                    )}
                    {s.state && <span className="badge-custom badge-gray" style={{ fontSize: '0.7rem' }}>📍 {s.state}</span>}
                    {s.lastDate && <span className="badge-custom badge-amber" style={{ fontSize: '0.7rem' }}>📅 {formatDate(s.lastDate)}</span>}
                    {s.publishDate && <span className="badge-custom badge-gray" style={{ fontSize: '0.7rem' }}>🗓 {formatDate(s.publishDate)}</span>}
                  </div>

                  <p className="text-muted-custom mb-2" style={{ fontSize: '0.87rem', lineHeight: 1.65 }}>
                    {s.description?.slice(0, 120)}{s.description?.length > 120 ? '…' : ''}
                  </p>

                  {s.benefits && (
                    <div className="info-tip mb-3" style={{ fontSize: '0.83rem' }}>
                      💰 {s.benefits?.slice(0, 90)}{s.benefits?.length > 90 ? '…' : ''}
                    </div>
                  )}

                  <div className="d-flex gap-2 flex-wrap mt-auto">
                    <button className="btn btn-sm btn-primary-custom" onClick={() => viewDetails(s.id)}>
                      View Details
                    </button>
                    <button className={`btn btn-sm ${savedIds.has(s.id) ? 'btn-accent' : 'btn-outline-success'}`}
                      onClick={() => toggleSave(s.id)}>
                      {savedIds.has(s.id) ? '★ Saved' : '☆ Save'}
                    </button>
                    {s.officialLink && (
                      <a href={s.officialLink} target="_blank" rel="noreferrer"
                        className="btn btn-sm btn-outline-secondary">🔗 Official</a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Detail Modal ── */}
      {selected && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelected(null)}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}>
            <div className="modal-content"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
              <div className="modal-header"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', borderBottom: 'none' }}>
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <h5 className="modal-title" style={{ color: '#fff', fontWeight: 700, marginBottom: '0.2rem' }}>
                      {selected.schemeName}
                    </h5>
                    {selected.isNew && (
                      <span style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '0.15em 0.6em', borderRadius: 4, letterSpacing: '0.06em' }}>NEW</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>
                    {CAT_ICONS[selected.category] || '🏛'} {selected.category} · {selected.state}
                  </div>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelected(null)} />
              </div>
              <div className="modal-body p-4">
                <div className="d-flex gap-2 flex-wrap mb-4">
                  {selected.state     && <span className="badge-custom badge-blue">{selected.state}</span>}
                  {selected.category  && <span className="badge-custom badge-primary">{CAT_ICONS[selected.category] || '🏛'} {selected.category}</span>}
                  {selected.lastDate  && <span className="badge-custom badge-amber">Deadline: {formatDate(selected.lastDate)}</span>}
                  {selected.publishDate && <span className="badge-custom badge-gray">Published: {formatDate(selected.publishDate)}</span>}
                  <span className={`badge-custom ${isActive(selected.lastDate) ? 'badge-primary' : 'badge-gray'}`}>
                    {isActive(selected.lastDate) ? '✅ Active' : '⏹ Closed'}
                  </span>
                </div>

                {[
                  { key: 'description',        label: '📋 Description'   },
                  { key: 'eligibility',        label: '✅ Eligibility'    },
                  { key: 'benefits',           label: '💰 Benefits'       },
                  { key: 'applicationProcess', label: '📝 How to Apply'   },
                ].map((f) => selected[f.key] && (
                  <div key={f.key} className="mb-4">
                    <h6 style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: '0.5rem' }}>{f.label}</h6>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.75, marginBottom: 0 }}>{selected[f.key]}</p>
                  </div>
                ))}

                {selected.source && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    🔗 Source: {selected.source}
                  </div>
                )}
              </div>
              {selected.officialLink && (
                <div className="modal-footer" style={{ borderTop: '1px solid var(--border)' }}>
                  <a href={selected.officialLink} target="_blank" rel="noreferrer"
                    className="btn btn-primary-custom">🔗 Visit Official Website</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
