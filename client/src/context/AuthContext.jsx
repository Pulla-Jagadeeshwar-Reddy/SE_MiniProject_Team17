import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { configureApi } from '../api/client';

/**
 * Holds the logged-in user for the whole app.
 *   const { user, login, logout } = useAuth();
 *   user -> null, or { id, role } where role is 'Student' | 'Faculty' | 'Admin'
 *
 * The role is read from the token only to decide what to SHOW.
 * All real permission checks happen on the server.
 *
 * #5 (login & session) owns the login/logout calls below; keep the same
 * function names so pages using useAuth() keep working.
 */
const AuthContext = createContext(null);
const STORAGE_KEY = 'csmqp_token';

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return { id: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

function readStoredToken() {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(readStoredToken);
  const user = useMemo(() => (token ? decodeToken(token) : null), [token]);

  const saveToken = useCallback((t) => {
    setToken(t);
    try {
      if (t) sessionStorage.setItem(STORAGE_KEY, t);
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable – keep the token in memory only */
    }
  }, []);

  const login = useCallback(
    async (email, password) => {
      const { data } = await api.post('/auth/login', { email, password });
      saveToken(data.token);
      return decodeToken(data.token);
    },
    [saveToken]
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      /* ignore – we log out locally anyway */
    }
    saveToken(null);
    navigate('/login');
  }, [navigate, saveToken]);

  useEffect(() => {
    configureApi({
      tokenGetter: () => token,
      unauthorizedHandler: () => {
        saveToken(null);
        navigate('/login', { state: { message: 'Your session has expired. Please log in again.' } });
      },
    });
  }, [token, navigate, saveToken]);

  const value = useMemo(() => ({ user, token, login, logout }), [user, token, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
