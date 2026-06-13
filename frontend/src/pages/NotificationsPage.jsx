import { useEffect, useState } from 'react';
import { notificationService } from '../services/notificationService';
import { useNotifications } from '../context/NotificationContext';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { formatDateTime } from '../utils/formatters';

const TYPE_CONFIG = {
  WEATHER: { icon: '🌤', label: 'Weather',  badge: 'badge-blue'  },
  MARKET:  { icon: '💰', label: 'Market',   badge: 'badge-amber' },
  DISEASE: { icon: '⚠️', label: 'Disease',  badge: 'badge-red'   },
  SCHEME:  { icon: '🏛', label: 'Scheme',   badge: 'badge-primary' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter]               = useState('ALL');
  const [loading, setLoading]             = useState(true);
  const { refreshUnreadCount, setUnreadCount } = useNotifications();

  const load = () => {
    notificationService.getAll()
      .then((res) => setNotifications(res.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    refreshUnreadCount();
  };

  const markAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const types = ['ALL', ...Object.keys(TYPE_CONFIG)];
  const filtered = filter === 'ALL' ? notifications : notifications.filter((n) => n.type === filter);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="page-title mb-1">🔔 Notifications</h2>
          {unreadCount > 0 && <span className="badge-custom badge-primary">{unreadCount} unread</span>}
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-sm btn-outline-success" onClick={markAllRead}>✓ Mark all as read</button>
        )}
      </div>

      {/* ── Stats ── */}
      <div className="row g-3 mb-4">
        {[
          { icon: '📬', label: 'Total',   val: notifications.length,   color: 'green' },
          { icon: '🔴', label: 'Unread',  val: unreadCount,             color: 'red'   },
          { icon: '🌤', label: 'Weather', val: notifications.filter((n) => n.type === 'WEATHER').length, color: 'blue'  },
          { icon: '⚠️', label: 'Disease', val: notifications.filter((n) => n.type === 'DISEASE').length, color: 'amber' },
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

      {/* ── Type filter pills ── */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {types.map((t) => (
          <button key={t} type="button"
            onClick={() => setFilter(t)}
            className={filter === t ? 'btn btn-sm btn-primary-custom' : 'btn btn-sm btn-outline-success'}
            style={{ fontSize: '0.82rem' }}>
            {TYPE_CONFIG[t]?.icon || '🔔'} {TYPE_CONFIG[t]?.label || 'All'}
          </button>
        ))}
      </div>

      {loading ? <LoadingSkeleton rows={5} height={60} /> : filtered.length === 0 ? (
        <EmptyState icon="🔔" title="No notifications" message="Alerts will appear here for weather, market, disease and schemes." />
      ) : (
        <div className="row g-2">
          {filtered.map((n) => {
            const cfg = TYPE_CONFIG[n.type] || { icon: '🔔', label: n.type, badge: 'badge-gray' };
            return (
              <div className="col-12" key={n.id}>
                <div
                  className="card-custom"
                  style={{ padding: '1rem 1.25rem', borderLeft: !n.isRead ? '4px solid var(--primary)' : '4px solid var(--border)', opacity: n.isRead ? 0.75 : 1, transition: 'opacity 0.2s' }}>
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div className="d-flex align-items-start gap-3">
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(46,125,50,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0, marginTop: 2 }}>
                        {cfg.icon}
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                          <strong style={{ fontSize: '0.93rem' }}>{n.title}</strong>
                          <span className={`badge-custom ${cfg.badge}`} style={{ fontSize: '0.7rem' }}>{cfg.label}</span>
                          {!n.isRead && <span className="badge-custom badge-primary" style={{ fontSize: '0.7rem' }}>New</span>}
                        </div>
                        <p className="text-muted-custom mb-1" style={{ fontSize: '0.87rem', lineHeight: 1.6 }}>{n.message}</p>
                        <small className="text-muted-custom" style={{ fontSize: '0.78rem' }}>{formatDateTime(n.createdAt)}</small>
                      </div>
                    </div>
                    {!n.isRead && (
                      <button className="btn btn-sm btn-outline-success" style={{ fontSize: '0.78rem', flexShrink: 0 }} onClick={() => markRead(n.id)}>
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
