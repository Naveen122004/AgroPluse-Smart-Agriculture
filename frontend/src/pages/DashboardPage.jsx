import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { schemeService } from '../services/schemeService';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { formatCurrency } from '../utils/formatters';
import { exportDashboardPdf } from '../utils/pdfExport';

const tips = [
  '💧 Water crops early morning to reduce evaporation losses.',
  '🌱 Rotate crops each season to maintain soil fertility.',
  '🐛 Inspect leaves weekly for early signs of pest damage.',
  '🌤 Monitor 3-day forecast before scheduling irrigation.',
  '📊 Compare at least 3 mandis before selling your harvest.',
];

const quickActions = [
  { icon: '🌤', label: 'Check Weather',   link: '/weather' },
  { icon: '💰', label: 'Market Rates',    link: '/market' },
  { icon: '💧', label: 'Irrigation Plan', link: '/irrigation' },
  { icon: '💬', label: 'Ask Chatbot',     link: '/chatbot' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [latestScheme, setLatestScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tipIdx] = useState(() => Math.floor(Math.random() * tips.length));

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    Promise.all([
      dashboardService.getSummary(),
      schemeService.getAll({ page: 0, size: 1 }),
    ])
      .then(([sumRes, schemeRes]) => {
        setSummary(sumRes.data.data);
        const schemes = schemeRes.data.data?.content || schemeRes.data.data || [];
        setLatestScheme(schemes[0] || null);
      })
      .catch(() => setSummary({}))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton rows={6} height={80} />;

  const w   = summary?.weather;
  const m   = summary?.marketHighlight;
  const irr = summary?.latestIrrigation;
  const tip = summary?.cropTip;

  const cards = [
    {
      title: 'Weather', icon: '🌤', link: '/weather', color: 'green',
      content: w ? `${w.temperature}°C — ${w.condition}` : 'Search weather',
      sub: w ? `Humidity ${w.humidity}%  ·  Wind ${w.windSpeed} km/h` : 'Set location in profile',
    },
    {
      title: 'Market Price', icon: '💰', link: '/market', color: 'amber',
      content: m ? `${m.cropName}: ${formatCurrency(m.avgPrice)}/q` : 'View crop prices',
      sub: m ? `${m.marketName}, ${m.state}` : 'Check mandi rates',
    },
    {
      title: 'Irrigation', icon: '💧', link: '/irrigation', color: 'blue',
      content: irr ? irr.recommendation?.slice(0, 55) + '…' : 'Get irrigation advice',
      sub: irr ? `${irr.cropType} — ${irr.irrigationFrequency}` : 'Based on crop & weather',
    },
    {
      title: 'Crop Care', icon: '🌱', link: '/crop-care', color: 'green',
      content: tip ? tip.title : 'Daily crop tips',
      sub: tip ? tip.cropName : 'Fertilizer & pest control',
    },
    {
      title: 'Govt Schemes', icon: '🏛', link: '/schemes', color: 'amber',
      content: latestScheme ? latestScheme.schemeName : 'Explore schemes',
      sub: latestScheme ? latestScheme.state : `${summary?.savedSchemesCount || 0} saved`,
    },
    {
      title: 'Notifications', icon: '🔔', link: '/notifications', color: 'red',
      content: `${summary?.unreadNotifications || 0} unread alerts`,
      sub: 'Weather, market & disease alerts',
    },
  ];

  return (
    <div>
      {/* ── Welcome header ── */}
      <div className="card-custom mb-4" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #43a047 100%)', color: '#fff', border: 'none' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <div style={{ fontSize: '0.82rem', opacity: 0.85, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{today}</div>
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.3rem,3vw,1.9rem)', margin: '0.3rem 0 0.25rem', color: '#fff' }}>
              {greeting()}, {user?.fullName?.split(' ')[0]}! 👋
            </h2>
            <p style={{ opacity: 0.88, marginBottom: 0, fontSize: '0.93rem' }}>Here's your farm overview for today.</p>
          </div>
          <button className="btn btn-accent btn-sm" onClick={() => exportDashboardPdf(summary, user?.fullName)}>
            📄 Export PDF Report
          </button>
        </div>
      </div>

      {/* ── Quick stats row ── */}
      <div className="row g-3 mb-4">
        {[
          { icon: '🌡', label: 'Temperature',   val: w ? `${w.temperature}°C` : '—',           color: 'green' },
          { icon: '🔔', label: 'Active Alerts', val: summary?.unreadNotifications || 0,          color: 'red'   },
          { icon: '💰', label: 'Market Update', val: m ? formatCurrency(m.avgPrice) : '—',      color: 'amber' },
          { icon: '🏛', label: 'Saved Schemes', val: summary?.savedSchemesCount || 0,            color: 'blue'  },
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

      <div className="row g-4">
        {/* ── Main module cards ── */}
        <div className="col-lg-8">
          <div className="row g-3 mb-4">
            {cards.map((card) => (
              <div className="col-md-6" key={card.title}>
                <Link to={card.link} className="text-decoration-none">
                  <div className="card-custom dashboard-card">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div className={`stat-icon ${card.color}`} style={{ width: 40, height: 40, fontSize: '1.1rem' }}>{card.icon}</div>
                      <h6 className="mb-0" style={{ color: 'var(--primary)', fontWeight: 700 }}>{card.title}</h6>
                    </div>
                    <p className="mb-1 fw-600" style={{ color: 'var(--text)', fontSize: '0.93rem', fontWeight: 600 }}>{card.content}</p>
                    <small className="text-muted-custom" style={{ fontSize: '0.8rem' }}>{card.sub}</small>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* ── Recent Activities ── */}
          <div className="card-custom">
            <div className="section-title">📋 Recent Activities</div>
            {summary?.recentActivities?.length > 0 ? (
              <ul className="list-unstyled mb-0">
                {summary.recentActivities.map((a, i) => (
                  <li key={i} className="d-flex justify-content-between align-items-start py-2" style={{ borderBottom: i < summary.recentActivities.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 4 }} />
                      <span style={{ fontSize: '0.88rem' }}>{a.description}</span>
                    </div>
                    <small className="text-muted-custom ms-3" style={{ whiteSpace: 'nowrap', fontSize: '0.78rem' }}>{a.createdAt?.replace('T', ' ').slice(0, 16)}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-3">
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌱</div>
                <p className="text-muted-custom mb-0" style={{ fontSize: '0.9rem' }}>No recent activities yet. Start exploring modules!</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div className="col-lg-4">
          {/* Today's tip */}
          <div className="card-custom mb-3">
            <div className="section-title">💡 Today's Farming Tip</div>
            <div className="info-tip">{tips[tipIdx]}</div>
            <div className="info-tip">{tips[(tipIdx + 1) % tips.length]}</div>
          </div>

          {/* Quick actions */}
          <div className="card-custom mb-3">
            <div className="section-title">⚡ Quick Actions</div>
            <div className="row g-2">
              {quickActions.map((qa) => (
                <div className="col-6" key={qa.label}>
                  <Link to={qa.link} className="text-decoration-none">
                    <div className="d-flex flex-column align-items-center p-3 rounded text-center" style={{ background: 'rgba(46,125,50,0.07)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', transition: 'background 0.2s, transform 0.2s', cursor: 'pointer' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(46,125,50,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(46,125,50,0.07)'; e.currentTarget.style.transform = 'none'; }}>
                      <span style={{ fontSize: '1.4rem', marginBottom: '0.3rem' }}>{qa.icon}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)' }}>{qa.label}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Agri facts */}
          <div className="card-custom">
            <div className="section-title">🌾 Agriculture Facts</div>
            {[
              { icon: '👨‍🌾', val: '140M+',  label: 'Indian Farmers' },
              { icon: '🌾',   val: '60%',    label: 'Food from Small Farms' },
              { icon: '💧',   val: '70%',    label: 'Water Used in Farming' },
            ].map((f) => (
              <div key={f.label} className="d-flex align-items-center gap-3 mb-3">
                <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(46,125,50,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>{f.val}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{f.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
