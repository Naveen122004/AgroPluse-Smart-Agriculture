import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { marketService } from '../services/marketService';
import { formatCurrency, formatDate } from '../utils/formatters';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const chartOpts = (label) => ({
  responsive: true,
  plugins: { legend: { display: false }, title: { display: true, text: label, color: 'var(--text)', font: { size: 13, weight: '600' } } },
  scales: { x: { ticks: { color: 'var(--text-muted)', font: { size: 11 } }, grid: { color: 'var(--border)' } }, y: { ticks: { color: 'var(--text-muted)', font: { size: 11 } }, grid: { color: 'var(--border)' } } },
});

export default function MarketPage() {
  const [prices, setPrices] = useState([]);
  const [crop, setCrop] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [sortBy, setSortBy] = useState('avgPrice');
  const [trends, setTrends] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState('Wheat');

  const loadPrices = async () => {
    setLoading(true);
    try {
      let res;
      if (crop) res = await marketService.search(crop, { sortBy, sortDir: 'desc' });
      else if (state) res = await marketService.filter(state, district, { sortBy, sortDir: 'desc' });
      else res = await marketService.getPrices({ sortBy, sortDir: 'desc', size: 50 });
      setPrices(res.data.data?.content || res.data.data || []);
    } catch { setPrices([]); }
    finally { setLoading(false); }
  };

  const loadCharts = async (cropName) => {
    try {
      const [tRes, wRes] = await Promise.all([marketService.getTrends(cropName), marketService.getWeekly(cropName)]);
      setTrends(tRes.data.data);
      setWeekly(wRes.data.data);
      setSelectedCrop(cropName);
    } catch { /* ignore */ }
  };

  useEffect(() => { loadPrices(); loadCharts('Wheat'); }, []);

  const trendChart = trends?.length > 0 ? {
    labels: trends.map((t) => formatDate(t.date)),
    datasets: [{ label: 'Avg Price (₹)', data: trends.map((t) => t.avgPrice), borderColor: '#2E7D32', backgroundColor: 'rgba(46,125,50,0.08)', tension: 0.35, fill: true, pointBackgroundColor: '#2E7D32', pointRadius: 4 }],
  } : null;

  const weeklyChart = weekly?.length > 0 ? {
    labels: weekly.map((w) => w.marketName),
    datasets: [{ label: 'Weekly Avg (₹)', data: weekly.map((w) => w.weeklyAvgPrice), backgroundColor: 'rgba(102,187,106,0.75)', borderRadius: 6 }],
  } : null;

  const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, p) => a + (p.avgPrice || 0), 0) / prices.length) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices.map((p) => p.maxPrice || 0)) : null;

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h2 className="page-title mb-0">💰 Market Prices</h2>
        <span className="badge-custom badge-amber">Mandi Rates</span>
      </div>

      {/* ── Insight strip ── */}
      {prices.length > 0 && (
        <div className="row g-3 mb-4">
          {[
            { icon: '📊', label: 'Total Listings', val: prices.length, color: 'green' },
            { icon: '💰', label: 'Average Price',  val: avgPrice ? formatCurrency(avgPrice) : '—', color: 'amber' },
            { icon: '📈', label: 'Highest Price',  val: maxPrice ? formatCurrency(maxPrice) : '—', color: 'green' },
            { icon: '🌾', label: 'Crops Tracked',  val: [...new Set(prices.map((p) => p.cropName))].length, color: 'blue' },
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
      )}

      {/* ── Filters ── */}
      <form onSubmit={(e) => { e.preventDefault(); loadPrices(); }} className="card-custom mb-4 p-3">
        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Crop Name</label>
            <input className="form-control" placeholder="e.g. Wheat, Rice..." value={crop} onChange={(e) => setCrop(e.target.value)} />
          </div>
          <div className="col-md-2">
            <label className="form-label">State</label>
            <input className="form-control" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
          </div>
          <div className="col-md-2">
            <label className="form-label">District</label>
            <input className="form-control" placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} />
          </div>
          <div className="col-md-2">
            <label className="form-label">Sort By</label>
            <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="avgPrice">Avg Price</option>
              <option value="minPrice">Min Price</option>
              <option value="maxPrice">Max Price</option>
              <option value="cropName">Crop Name</option>
            </select>
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary-custom">🔍 Filter</button>
          </div>
        </div>
      </form>

      {/* ── Table ── */}
      {loading ? <LoadingSkeleton rows={6} height={32} /> : prices.length === 0 ? (
        <EmptyState icon="💰" title="No prices found" />
      ) : (
        <div className="card-custom mb-4 p-0" style={{ overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ background: 'rgba(46,125,50,0.07)' }}>
                <tr>
                  <th>Crop</th><th>Market</th><th>State</th><th>District</th>
                  <th>Min</th><th>Max</th><th>Avg</th><th>Date</th><th></th>
                </tr>
              </thead>
              <tbody>
                {prices.map((p) => (
                  <tr key={p.id}>
                    <td><span className="badge-custom badge-primary" style={{ fontSize: '0.78rem' }}>{p.cropName}</span></td>
                    <td style={{ fontWeight: 600 }}>{p.marketName}</td>
                    <td className="text-muted-custom">{p.state}</td>
                    <td className="text-muted-custom">{p.district}</td>
                    <td>{formatCurrency(p.minPrice)}</td>
                    <td>{formatCurrency(p.maxPrice)}</td>
                    <td><span style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(p.avgPrice)}</span></td>
                    <td className="text-muted-custom">{formatDate(p.priceDate)}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-success" style={{ fontSize: '0.78rem' }} onClick={() => loadCharts(p.cropName)}>📊 Chart</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Analytics ── */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="section-title mb-0">📈 Analytics — {selectedCrop}</h5>
      </div>
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card-custom">
            {trendChart
              ? <Line data={trendChart} options={chartOpts(`${selectedCrop} Price Trend (₹/quintal)`)} />
              : <div className="text-center py-4 text-muted-custom">No trend data available</div>}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card-custom">
            {weeklyChart
              ? <Bar data={weeklyChart} options={chartOpts(`${selectedCrop} Weekly Market Comparison`)} />
              : <div className="text-center py-4 text-muted-custom">No weekly data available</div>}
          </div>
        </div>
      </div>

      {/* ── Market tips ── */}
      <div className="card-custom mt-4">
        <div className="section-title">💡 Market Intelligence Tips</div>
        <div className="row g-3">
          {[
            { icon: '📊', tip: 'Compare prices across at least 3 mandis before deciding where to sell.' },
            { icon: '📅', tip: 'Post-harvest prices often dip — consider storing for 2–4 weeks if you have storage.' },
            { icon: '📰', tip: 'Watch government MSP announcements that set the price floor for major crops.' },
          ].map((t, i) => (
            <div className="col-md-4" key={i}>
              <div className="info-tip" style={{ height: '100%' }}>
                <span style={{ fontSize: '1.1rem', marginRight: '0.4rem' }}>{t.icon}</span>{t.tip}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
