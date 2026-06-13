import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', paddingTop: '3rem', paddingBottom: '1.5rem' }}>
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.75rem' }}>🌾 AgroPulse</div>
            <p className="text-muted-custom" style={{ fontSize: '0.88rem', lineHeight: 1.75, maxWidth: 280 }}>
              Empowering Indian farmers through smart technology. Weather, market, irrigation and crop care — all in one platform.
            </p>
            <div className="d-flex gap-2 mt-3">
              {['📧', '📞', '📍'].map((icon, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(46,125,50,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', cursor: 'pointer' }}>{icon}</div>
              ))}
            </div>
          </div>
          <div className="col-lg-2 col-md-6 col-6">
            <h6 style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', color: 'var(--text)' }}>Platform</h6>
            <ul className="list-unstyled" style={{ fontSize: '0.88rem' }}>
              {[['Home', '/'], ['Login', '/login'], ['Sign Up', '/signup']].map(([label, path]) => (
                <li key={label} style={{ marginBottom: '0.5rem' }}>
                  <Link to={path} style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-2 col-md-6 col-6">
            <h6 style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', color: 'var(--text)' }}>Modules</h6>
            <ul className="list-unstyled" style={{ fontSize: '0.88rem' }}>
              {[['Weather', '/#features'], ['Market', '/#features'], ['Irrigation', '/#features'], ['Crop Care', '/#features']].map(([label, href]) => (
                <li key={label} style={{ marginBottom: '0.5rem' }}>
                  <a href={href} style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-4 col-md-6">
            <h6 style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', color: 'var(--text)' }}>Contact</h6>
            <div style={{ fontSize: '0.88rem' }}>
              <p className="text-muted-custom mb-2">📧 support@agropulse.in</p>
              <p className="text-muted-custom mb-2">📞 +91 1800-AGRO-HELP</p>
              <p className="text-muted-custom mb-3">📍 India</p>
              <div className="d-flex gap-2">
                <span className="badge-custom badge-primary" style={{ fontSize: '0.72rem' }}>🌾 Wheat</span>
                <span className="badge-custom badge-primary" style={{ fontSize: '0.72rem' }}>🌿 Rice</span>
                <span className="badge-custom badge-primary" style={{ fontSize: '0.72rem' }}>🌽 Maize</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: 1, background: 'var(--border)', margin: '1.5rem 0' }} />
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <p className="text-muted-custom mb-0" style={{ fontSize: '0.82rem' }}>
            © {new Date().getFullYear()} AgroPulse. Final Year Project. Built with ❤️ for Indian Farmers.
          </p>
          <div className="d-flex gap-3" style={{ fontSize: '0.82rem' }}>
            <span className="text-muted-custom">React 18 + Spring Boot 3</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
