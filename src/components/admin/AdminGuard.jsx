import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../ui/Button';
import './AdminGuard.css';

const ADMIN_KEY = 'belgaum-fresh-admin';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'belgaum2026';

export default function AdminGuard({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem(ADMIN_KEY);
    if (saved === 'true') setAuthenticated(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_KEY, 'true');
      setAuthenticated(true);
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  if (authenticated) return children;

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
          <Button type="submit" size="lg" fullWidth>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
