import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useToast } from '../hooks/useToast';
import Toast from '../components/common/Toast';
import { validateEmail, validatePassword } from '../utils/validators';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { toast, showToast } = useToast();

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      showToast('Enter a valid email', 'error');
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      showToast('OTP sent to your email (check console in dev mode)');
      setStep(2);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.verifyOtp({ email, otp });
      showToast('OTP verified');
      setStep(3);
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (!validatePassword(passwords.newPassword)) {
      showToast('Password must be 8+ chars with uppercase and digit', 'error');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword({ email, otp, ...passwords });
      showToast('Password reset successful!');
      setStep(4);
    } catch (err) {
      showToast(err.response?.data?.message || 'Reset failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast toast={toast} />
      <div className="card-custom">
        <h4 className="text-center mb-4" style={{ color: 'var(--primary)' }}>Reset Password</h4>

        {step === 1 && (
          <form onSubmit={sendOtp}>
            <p className="small text-muted-custom">Enter your registered email to receive OTP.</p>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary-custom w-100" disabled={loading}>Send OTP</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verifyOtp}>
            <div className="mb-3">
              <label className="form-label">Enter OTP</label>
              <input type="text" className="form-control" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary-custom w-100" disabled={loading}>Verify OTP</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={resetPassword}>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input type="password" className="form-control" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-control" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary-custom w-100" disabled={loading}>Reset Password</button>
          </form>
        )}

        {step === 4 && (
          <div className="text-center">
            <p className="text-success fw-semibold">Password updated successfully!</p>
            <Link to="/login" className="btn btn-primary-custom">Go to Login</Link>
          </div>
        )}

        {step < 4 && (
          <p className="text-center mt-3 small mb-0">
            <Link to="/login">Back to Login</Link>
          </p>
        )}
      </div>
    </>
  );
}
