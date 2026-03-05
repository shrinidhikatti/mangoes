import { useState, useEffect, useRef } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../ui/Button';
import './AdminGuard.css';

const ADMIN_KEY = 'belgaum-fresh-admin';
const ADMIN_EXPIRY_KEY = 'belgaum-fresh-admin-expiry';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'belgaum2026';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 min lockout after max attempts

export default function AdminGuard({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
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
  }, []);

  function scheduleTimeout(ms) {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      sessionStorage.removeItem(ADMIN_KEY);
      sessionStorage.removeItem(ADMIN_EXPIRY_KEY);
      setAuthenticated(false);
      setError('Session expired. Please log in again.');
    }, ms);
  }

  const handleLogin = (e) => {
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
        const lockUntil = Date.now() + LOCKOUT_MS;
        setLockedUntil(lockUntil);
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
        <p>Enter the admin password to continue</p>

        <form onSubmit={handleLogin} className="admin-guard-form">
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter password"
              autoFocus
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
          {error && <span className="admin-guard-error">{error}</span>}
          <Button type="submit" size="lg" fullWidth disabled={isLocked}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
