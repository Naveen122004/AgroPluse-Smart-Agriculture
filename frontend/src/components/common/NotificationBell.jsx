import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { notificationService } from '../../services/notificationService';

export default function NotificationBell() {
  const { unreadCount, refreshUnreadCount } = useNotifications();
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    refreshUnreadCount();
    notificationService.getAll().then((res) => {
      setRecent((res.data.data || []).slice(0, 5));
    }).catch(() => {});
  }, [refreshUnreadCount]);

  return (
    <div className="dropdown">
      <button
        className="btn btn-link position-relative text-decoration-none"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        🔔
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
          </span>
        )}
      </button>
      <ul className="dropdown-menu dropdown-menu-end shadow" style={{ minWidth: 280 }}>
        <li className="dropdown-header">Notifications</li>
        {recent.length === 0 ? (
          <li><span className="dropdown-item-text text-muted">No notifications</span></li>
        ) : (
          recent.map((n) => (
            <li key={n.id}>
              <span className={`dropdown-item small ${!n.isRead ? 'fw-semibold' : ''}`}>
                {n.title}
              </span>
            </li>
          ))
        )}
        <li><hr className="dropdown-divider" /></li>
        <li><Link className="dropdown-item text-center" to="/notifications">View all</Link></li>
      </ul>
    </div>
  );
}
