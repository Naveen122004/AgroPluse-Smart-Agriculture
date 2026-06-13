import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

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
