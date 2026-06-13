import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="auth-split">
      <div className="auth-form-side">
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div className="text-center mb-4">
            <Link to="/" className="text-decoration-none">
              <h3 style={{ color: 'var(--primary)' }}>🌾 AgroPulse</h3>
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
      <div className="auth-banner-side">
        <div className="text-center">
          <h2 className="fw-bold mb-3">Empowering Farmers</h2>
          <p className="lead mb-0">Smart weather, market prices, irrigation & crop care — all in one place.</p>
        </div>
      </div>
    </div>
  );
}
