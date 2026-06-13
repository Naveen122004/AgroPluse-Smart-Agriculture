import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { contactService } from '../services/dashboardService';
import { useToast } from '../hooks/useToast';
import Toast from '../components/common/Toast';

const features = [
  { icon: '🌤', title: 'Weather Forecast', desc: '7-day hyperlocal forecasts with charts and rain probability for any city or village.',  route: '/weather' },
  { icon: '💰', title: 'Market Prices',    desc: 'Live mandi rates with trend graphs so you know when and where to sell for best prices.', route: '/market' },
  { icon: '💧', title: 'Smart Irrigation', desc: 'AI-powered water scheduling based on your crop type, soil and current weather conditions.', route: '/irrigation' },
  { icon: '🌱', title: 'Crop Care',        desc: 'Expert advisories on fertilizers, pest management and seasonal care tailored per crop.',   route: '/crop-care' },
  { icon: '⚠️', title: 'Disease Alerts',  desc: 'Early warnings for plant diseases with symptoms, prevention and treatment guidance.',      route: '/diseases' },
  { icon: '🏛', title: 'Govt Schemes',    desc: 'All central and state subsidy programs and support schemes in one searchable place.',       route: '/schemes' },
];

const stats = [
  { value: '2,400+', label: 'Active Farmers' },
  { value: '50+',    label: 'Supported Crops' },
  { value: '500+',   label: 'Daily Updates' },
  { value: '28',     label: 'States Covered' },
];

const steps = [
  { num: '1', title: 'Create Free Account', desc: 'Register with your email and phone number in under 2 minutes.' },
  { num: '2', title: 'Set Up Farm Profile', desc: 'Enter your state, district and preferred crop for personalised insights.' },
  { num: '3', title: 'Explore All Modules', desc: 'Access weather, market, irrigation, crop care and disease modules.' },
  { num: '4', title: 'Get Daily Alerts', desc: 'Receive smart notifications for weather changes, market swings and disease risks.' },
];

const testimonials = [
  { name: 'Ramesh Kumar',   loc: 'Meerut, Uttar Pradesh',    crop: '🌾 Wheat',   text: 'Market price updates help me decide exactly when to sell my wheat for maximum profit. Saved me a lot of money!' },
  { name: 'Sunita Devi',    loc: 'Karnal, Haryana',          crop: '🌾 Rice',    text: 'The irrigation scheduler told me to skip watering during the forecast rain. Saved water and my crops are healthier.' },
  { name: 'Vikram Patel',   loc: 'Nagpur, Maharashtra',      crop: '🌿 Cotton',  text: 'Disease alerts notified me about cotton rust two weeks early. I treated it in time and saved the entire harvest.' },
];

const faqs = [
  { q: 'Is AgroPulse free for farmers?',        a: 'Yes, registration and all core features are completely free for all farmers.' },
  { q: 'Do I need an internet connection?',      a: 'Yes, an internet connection is required to access live weather and market data.' },
  { q: 'Can I use it on my mobile phone?',       a: 'Absolutely. AgroPulse is fully responsive and works on mobile, tablet and desktop.' },
  { q: 'How accurate is the weather forecast?',  a: 'We use OpenWeatherMap API which provides reliable 7-day forecasts with high accuracy.' },
  { q: 'Which states are covered for schemes?',  a: 'All major Indian states are covered. More are being added continuously.' },
];

export default function LandingPage() {
  const [contact, setContact] = useState({ name: '', email: '', subject: '', message: '' });
  const { toast, showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleFeatureClick = (route) => {
    navigate(isAuthenticated ? route : '/login');
  };

  const handleContact = async (e) => {
    e.preventDefault();
    try {
      await contactService.submit(contact);
      showToast('Message sent successfully!');
      setContact({ name: '', email: '', subject: '', message: '' });
    } catch {
      showToast('Failed to send message', 'error');
    }
  };

  return (
    <>
      <Toast toast={toast} />
      <Navbar />

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge-custom badge-primary mb-3" style={{ fontSize: '0.8rem' }}>
                🌱 Smart Agriculture Platform
              </span>
              <h1 className="fw-800 mb-3" style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: 'var(--text)', lineHeight: 1.2 }}>
                Empowering Farmers Through{' '}
                <span style={{ color: 'var(--primary)' }}>Smart Technology</span>
              </h1>
              <p className="text-muted-custom mb-4" style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
                Weather forecasts, mandi prices, irrigation scheduling, crop care, disease alerts and government schemes — everything a modern farmer needs in one dashboard.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/signup" className="btn btn-primary-custom btn-lg px-4">Get Started Free</Link>
                <a href="#features" className="btn btn-outline-success btn-lg px-4">See Features</a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card-custom p-4" style={{ borderRadius: 'var(--radius-lg)' }}>
                <div className="text-center mb-3">
                  <div style={{ fontSize: '4rem', lineHeight: 1 }}>🌾</div>
                  <h5 className="mt-2 mb-0" style={{ color: 'var(--primary)' }}>AgroPulse Dashboard</h5>
                  <small className="text-muted-custom">Smart Agriculture Support System</small>
                </div>
                <div className="row g-2">
                  {[
                    { icon: '🌤', label: 'Weather',  val: '28°C Clear' },
                    { icon: '💰', label: 'Wheat',    val: '₹2,180/q' },
                    { icon: '💧', label: 'Irrigation',val: 'Next: 2 days' },
                    { icon: '🔔', label: 'Alerts',   val: '3 new' },
                  ].map((item) => (
                    <div className="col-6" key={item.label}>
                      <div className="d-flex align-items-center gap-2 p-2 rounded" style={{ background: 'rgba(46,125,50,0.06)', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{item.label}</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{item.val}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div className="stats-strip">
        <div className="container">
          <div className="row g-3 justify-content-center">
            {stats.map((s) => (
              <div className="col-6 col-md-3" key={s.label}>
                <div className="hero-stat">
                  <div className="hero-stat-value">{s.value}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── About ── */}
      <section id="about" className="py-5">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge-custom badge-primary mb-2">About AgroPulse</span>
              <h2 className="page-title mb-3">Built for India's 140 Million Farmers</h2>
              <p className="text-muted-custom mb-3" style={{ lineHeight: 1.8 }}>
                AgroPulse is a final-year agriculture support platform designed to help Indian farmers make data-driven decisions. We combine real-time weather data, live market intelligence, and expert crop advisories into one easy-to-use digital dashboard.
              </p>
              <ul className="list-unstyled">
                {[
                  'Save time on daily farm planning decisions',
                  'Better crop yields through expert advisories',
                  'Informed selling with live mandi rate data',
                  'Access all government schemes in one place',
                  'AI chatbot for instant farming answers',
                ].map((b) => (
                  <li key={b} className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: '0.93rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 800 }}>✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                {[
                  { icon: '🌾', title: 'Crop Intelligence', desc: 'Personalised advisories based on crop type and season' },
                  { icon: '📊', title: 'Market Analytics',  desc: 'Price trends and weekly market comparison charts' },
                  { icon: '🛡', title: 'Disease Guard',     desc: 'AI-powered early disease detection and alerts' },
                  { icon: '💬', title: 'AI Assistant',      desc: '24/7 chatbot for farming queries in simple language' },
                ].map((item) => (
                  <div className="col-6" key={item.title}>
                    <div className="card-custom h-100 text-center">
                      <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.3rem' }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-5" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge-custom badge-primary mb-2">Platform Features</span>
            <h2 className="page-title mb-2">Everything You Need</h2>
            <p className="text-muted-custom col-lg-6 mx-auto" style={{ fontSize: '0.95rem' }}>
              Six powerful modules designed specifically for Indian farmers.
            </p>
          </div>
          <div className="row g-4">
            {features.map((f) => (
              <div className="col-md-6 col-lg-4" key={f.title}>
                <div
                  className="card-custom h-100"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleFeatureClick(f.route)}
                >
                  <div className="feature-icon">{f.icon}</div>
                  <h5 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h5>
                  <p className="text-muted-custom mb-2" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>{f.desc}</p>
                  <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {isAuthenticated ? 'Open module →' : 'Login to access →'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <span className="badge-custom badge-primary mb-2">Simple Setup</span>
              <h2 className="page-title mb-3">How It Works</h2>
              <p className="text-muted-custom" style={{ lineHeight: 1.8 }}>
                Getting started with AgroPulse takes less than 5 minutes. No technical knowledge required.
              </p>
            </div>
            <div className="col-lg-7">
              <div className="timeline">
                {steps.map((s) => (
                  <div className="timeline-item" key={s.num}>
                    <div className="timeline-dot">{s.num}</div>
                    <div className="timeline-title">{s.title}</div>
                    <div className="timeline-desc">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-5" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge-custom badge-primary mb-2">Farmer Stories</span>
            <h2 className="page-title mb-0">Trusted by Farmers</h2>
          </div>
          <div className="row g-4">
            {testimonials.map((t) => (
              <div className="col-md-4" key={t.name}>
                <div className="card-custom h-100" style={{ position: 'relative' }}>
                  <div style={{ fontSize: '2rem', lineHeight: 1, marginBottom: '1rem', opacity: 0.3, color: 'var(--primary)', fontFamily: 'Georgia', fontWeight: 900 }}>"</div>
                  <p style={{ fontStyle: 'italic', lineHeight: 1.75, fontSize: '0.93rem', marginBottom: '1.2rem' }}>"{t.text}"</p>
                  <div className="d-flex align-items-center gap-3 mt-auto">
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(46,125,50,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>👤</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.loc}</div>
                      <span className="badge-custom badge-primary" style={{ fontSize: '0.7rem', marginTop: '0.15rem' }}>{t.crop}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-5">
        <div className="container col-lg-8">
          <div className="text-center mb-5">
            <span className="badge-custom badge-primary mb-2">Common Questions</span>
            <h2 className="page-title mb-0">FAQ</h2>
          </div>
          <div className="accordion" id="faqAccordion">
            {faqs.map((f, i) => (
              <div className="accordion-item" key={i}>
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#faq${i}`}>
                    {f.q}
                  </button>
                </h2>
                <div id={`faq${i}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="accordion-body">{f.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-5" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="row g-5 align-items-start justify-content-center">
            <div className="col-lg-4 d-none d-lg-block">
              <span className="badge-custom badge-primary mb-2">Get In Touch</span>
              <h2 className="page-title mb-3">Contact Us</h2>
              <p className="text-muted-custom mb-4" style={{ lineHeight: 1.8 }}>Have a question, suggestion or want to collaborate? We'd love to hear from you.</p>
              {[
                { icon: '📧', label: 'Email',   val: 'support@agropulse.in' },
                { icon: '📞', label: 'Helpline', val: '+91 1800-AGRO-HELP' },
                { icon: '📍', label: 'Location', val: 'India' },
              ].map((c) => (
                <div key={c.label} className="d-flex align-items-center gap-3 mb-3">
                  <div className="stat-icon green" style={{ width: 40, height: 40, fontSize: '1rem' }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{c.label}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{c.val}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-lg-6">
              <form onSubmit={handleContact} className="card-custom">
                <h5 className="section-title mb-4">✉️ Send a Message</h5>
                <div className="row g-3">
                  {['name', 'email', 'subject'].map((field) => (
                    <div className={field === 'subject' ? 'col-12' : 'col-md-6'} key={field}>
                      <label className="form-label">{field}</label>
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        className="form-control"
                        value={contact[field]}
                        onChange={(e) => setContact({ ...contact, [field]: e.target.value })}
                        required
                      />
                    </div>
                  ))}
                  <div className="col-12">
                    <label className="form-label">Message</label>
                    <textarea className="form-control" rows={4} value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} required />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary-custom w-100">Send Message</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
