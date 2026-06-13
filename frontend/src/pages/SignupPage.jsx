import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/common/Toast';
import { getFieldError } from '../utils/validators';

export default function SignupPage() {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast } = useToast();

  const validate = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const err = getFieldError(key, form[key], form.password);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(form);
      showToast('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0] || 'Signup failed';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'fullName', label: 'Full Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone Number', type: 'tel' },
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
  ];

  return (
    <>
      <Toast toast={toast} />
      <div className="card-custom">
        <h4 className="text-center mb-4" style={{ color: 'var(--primary)' }}>Create Account</h4>
        <form onSubmit={handleSubmit}>
          {fields.map(({ name, label, type }) => (
            <div className="mb-3" key={name}>
              <label className="form-label">{label}</label>
              <input
                type={type}
                className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
                value={form[name]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
              />
              {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
            </div>
          ))}
          <button type="submit" className="btn btn-primary-custom w-100" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center mt-3 small mb-0">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </>
  );
}
