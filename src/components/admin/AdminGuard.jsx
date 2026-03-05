import { useState, useEffect, useRef } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import './AdminGuard.css';

const ADMIN_KEY = 'belgaum-fresh-admin';
const ADMIN_EXPIRY_KEY = 'belgaum-fresh-admin-expiry';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'belgaum2026';
const ADMIN_EMAIL = 'vijomarketing1@gmail.com';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 min lockout

export default function AdminGuard({ children }) {
  const { user, signInWithGoogle, logIn, logOut, signUp } = useAuth();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  // Auto-authenticate if Firebase Auth user is the admin email
  useEffect(() => {
    if (user && user.email === ADMIN_EMAIL) {
      setAuthenticated(true);
      return;
    }

    // Fall back to session-storage password auth
    const saved = sessionStorage.getItem(ADMIN_KEY);
    const expiry = sessionStorage.getItem(ADMIN_EXPIRY_KEY);
    if (saved === 'true' && expiry && Date.now() < parseInt(expiry)) {
      setAuthenticated(true);
      scheduleTimeout(parseInt(expiry) - Date.now());
    } else {
      sessionStorage.removeItem(ADMIN_KEY);
      sessionStorage.removeItem(ADMIN_EXPIRY_KEY);
    }
    return () => clearTimeout(timerRef.current);
  }, [user]);

  function scheduleTimeout(ms) {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      sessionStorage.removeItem(ADMIN_KEY);
      sessionStorage.removeItem(ADMIN_EXPIRY_KEY);
      setAuthenticated(false);
      setError('Session expired. Please log in again.');
    }, ms);
  }

  // Google Sign-In for admin
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const loggedUser = await signInWithGoogle();
      if (loggedUser.email === ADMIN_EMAIL) {
        setAuthenticated(true);
      } else {
        await logOut();
        setError('This Google account is not authorised as admin.');
      }
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Email + password login for admin (auto-creates account if first time)
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (lockedUntil && Date.now() < lockedUntil) {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000 / 60);
      setError(`Too many attempts. Try again in ${remaining} minute(s).`);
      return;
    }
    if (email !== ADMIN_EMAIL) {
      setError('This email is not authorised as admin.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      let loggedUser;
      try {
        loggedUser = await logIn(email, password);
      } catch (loginErr) {
        // Account doesn't exist yet — create it on first login
        if (loginErr.code === 'auth/user-not-found' || loginErr.code === 'auth/invalid-credential') {
          loggedUser = await signUp(email, password, 'Admin');
        } else {
          throw loginErr;
        }
      }
      if (loggedUser.email === ADMIN_EMAIL) {
        setAuthenticated(true);
        setAttempts(0);
      } else {
        await logOut();
        setError('This account is not authorised as admin.');
      }
    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_MS);
        setError('Too many failed attempts. Locked for 5 minutes.');
      } else {
        setError(`Incorrect credentials. ${MAX_ATTEMPTS - newAttempts} attempt(s) remaining.`);
      }
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  // Password-only login (for shop owner without Firebase account)
  const handlePasswordLogin = (e) => {
    e.preventDefault();
    if (lockedUntil && Date.now() < lockedUntil) {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000 / 60);
      setError(`Too many attempts. Try again in ${remaining} minute(s).`);
      return;
    }

    if (password === ADMIN_PASSWORD) {
      const expiry = Date.now() + SESSION_TIMEOUT_MS;
      sessionStorage.setItem(ADMIN_KEY, 'true');
      sessionStorage.setItem(ADMIN_EXPIRY_KEY, expiry.toString());
      setAuthenticated(true);
      setAttempts(0);
      scheduleTimeout(SESSION_TIMEOUT_MS);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_MS);
        setError('Too many failed attempts. Locked for 5 minutes.');
      } else {
        setError(`Incorrect password. ${MAX_ATTEMPTS - newAttempts} attempt(s) remaining.`);
      }
      setPassword('');
    }
  };

  if (authenticated) return children;

  const isLocked = lockedUntil && Date.now() < lockedUntil;

  return (
    <div className="admin-guard">
      <div className="admin-guard-card">
        <div className="admin-guard-icon">
          <Lock size={32} />
        </div>
        <h2>Admin Access</h2>
        <p>Sign in to manage orders and products</p>

        {/* Google Sign-In */}
        <button
          className="admin-google-btn"
          onClick={handleGoogleLogin}
          disabled={loading || isLocked}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.583c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.583 9 3.583z"/>
          </svg>
          Continue with Google
        </button>

        <div className="admin-divider"><span>or sign in with email</span></div>

        {/* Email + password login */}
        <form onSubmit={handleEmailLogin} className="admin-guard-form">
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            placeholder="Admin email"
            disabled={loading || isLocked}
            autoComplete="email"
          />
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Password"
              disabled={loading || isLocked}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <span className="admin-guard-error">{error}</span>}
          <Button type="submit" size="lg" fullWidth disabled={loading || isLocked}>
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        {/* Fallback: owner password only */}
        <details className="admin-owner-fallback">
          <summary>Owner access (password only)</summary>
          <form onSubmit={handlePasswordLogin} className="admin-guard-form" style={{ marginTop: '12px' }}>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Owner password"
                disabled={isLocked}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Button type="submit" size="md" fullWidth disabled={isLocked}>
              Sign In
            </Button>
          </form>
        </details>
      </div>
    </div>
  );
}
