import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationBell from './NotificationBell';

export default function Navbar({ authenticated = false }) {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!authenticated) {
    return (
      <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
        <div className="container">
          <Link className="navbar-brand" to="/">🌾 AgroPulse</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navMain">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
              <li className="nav-item"><a className="nav-link" href="/#features">Features</a></li>
              <li className="nav-item"><a className="nav-link" href="/#about">About</a></li>
              <li className="nav-item"><a className="nav-link" href="/#contact">Contact</a></li>
              <li className="nav-item">
                <button className="btn btn-sm btn-outline-secondary" onClick={toggleTheme}>
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </li>
              <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
              <li className="nav-item">
                <Link className="btn btn-primary-custom btn-sm" to="/signup">Get Started</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container-fluid px-3">
        <Link className="navbar-brand" to="/dashboard">🌾 AgroPulse</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navAuth">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navAuth">
          <ul className="navbar-nav me-auto">
            {[
              ['Dashboard', '/dashboard'],
              ['Weather', '/weather'],
              ['Market', '/market'],
              ['Irrigation', '/irrigation'],
              ['Crop Care', '/crop-care'],
              ['Diseases', '/diseases'],
              ['Schemes', '/schemes'],
              ['Chatbot', '/chatbot'],
            ].map(([label, path]) => (
              <li className="nav-item" key={path}>
                <NavLink className="nav-link" to={path}>{label}</NavLink>
              </li>
            ))}
          </ul>
          <ul className="navbar-nav align-items-lg-center gap-lg-2">
            <li className="nav-item"><NotificationBell /></li>
            <li className="nav-item">
              <button className="btn btn-sm btn-outline-secondary" onClick={toggleTheme}>
                {darkMode ? '☀️' : '🌙'}
              </button>
            </li>
            <li className="nav-item dropdown">
              <button className="btn btn-link nav-link dropdown-toggle" data-bs-toggle="dropdown">
                👤 {user?.fullName?.split(' ')[0] || 'Profile'}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                <li><Link className="dropdown-item" to="/notifications">Notifications</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
