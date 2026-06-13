import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

// DEMO MODE ENABLED — remove DEMO_USER and set DEMO_MODE = false to restore auth
const DEMO_MODE = true;
const DEMO_USER = {
  id: 0,
  fullName: 'Demo Farmer',
  email: 'demo@agropulse.com',
  state: 'Maharashtra',
  district: 'Pune',
  preferredCrop: 'Wheat',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('agropulse_token');
    const savedUser = localStorage.getItem('agropulse_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    } else if (DEMO_MODE) {
      // DEMO MODE ENABLED — auto-load demo user without login
      setUser(DEMO_USER);
      setToken('demo-token');
    }
    setLoading(false);
  }, []);

  const persistAuth = (authData) => {
    setToken(authData.token);
    setUser(authData.user);
    localStorage.setItem('agropulse_token', authData.token);
    localStorage.setItem('agropulse_user', JSON.stringify(authData.user));
  };

  const signup = async (data) => {
    const res = await authService.signup(data);
    persistAuth(res.data.data);
    return res.data;
  };

  const login = async (data) => {
    const res = await authService.login(data);
    persistAuth(res.data.data);
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('agropulse_token');
    localStorage.removeItem('agropulse_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signup, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
