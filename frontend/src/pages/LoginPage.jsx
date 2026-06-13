import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/common/Toast';
import { validateEmail } from '../utils/validators';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(form.email)) {
      showToast('Enter a valid email address', 'error');
      return;
    }
    if (!form.password) {
      showToast('Password is required', 'error');
      return;
    }
    setLoading(true);
    try {
      await login(form);
      showToast('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Login failed';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast toast={toast} />
      <div className="card-custom">
        <h4 className="text-center mb-4" style={{ color: 'var(--primary)' }}>Welcome Back</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="remember"
              checked={form.rememberMe}
              onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="remember">Remember Me</label>
          </div>
          <button type="submit" className="btn btn-primary-custom w-100" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <div className="text-center mt-3 small">
          <Link to="/forgot-password">Forgot Password?</Link>
          <p className="mt-2 mb-0">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
}
