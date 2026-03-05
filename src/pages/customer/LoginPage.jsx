import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import './LoginPage.css';

export default function LoginPage() {
  const { signUp, logIn, resetPassword, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || '/';
  const defaultMode = location.state?.mode || 'login';

  const [mode, setMode] = useState(defaultMode); // 'login' | 'signup' | 'reset'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      navigate(returnTo, { replace: true });
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(getFriendlyError(err.code));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'reset') {
        await resetPassword(form.email);
        setResetSent(true);
      } else if (mode === 'signup') {
        if (!form.name.trim()) { setError('Please enter your name'); setLoading(false); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
        await signUp(form.email, form.password, form.name);
        navigate(returnTo, { replace: true });
      } else {
        await logIn(form.email, form.password);
        navigate(returnTo, { replace: true });
      }
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  function getFriendlyError(code) {
    switch (code) {
      case 'auth/email-already-in-use': return 'An account with this email already exists.';
      case 'auth/invalid-email': return 'Please enter a valid email address.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential': return 'Incorrect email or password.';
      case 'auth/user-not-found': return 'No account found with this email.';
      case 'auth/too-many-requests': return 'Too many attempts. Please try again later.';
      case 'auth/weak-password': return 'Password must be at least 6 characters.';
      default: return 'Something went wrong. Please try again.';
    }
  }

  return (
    <div className="login-page">
      <div className="login-card animate-fade-in-up">
        <div className="login-brand">
          <span className="login-brand-icon">🥭</span>
          <span className="login-brand-name">Mango Mane</span>
        </div>

        {mode === 'reset' ? (
          <>
            <h1 className="login-title">Reset Password</h1>
            <p className="login-subtitle">We'll send a reset link to your email.</p>
            {resetSent ? (
              <div className="login-success">
                ✅ Reset link sent! Check your inbox.
                <button className="login-link-btn" onClick={() => { setMode('login'); setResetSent(false); }}>
                  Back to login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="login-form">
                <div className="login-field">
                  <Mail size={16} className="field-icon" />
                  <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required autoComplete="email" />
                </div>
                {error && <p className="login-error">{error}</p>}
                <Button size="lg" fullWidth loading={loading} icon={<ArrowRight size={16} />}>Send Reset Link</Button>
                <button type="button" className="login-link-btn" onClick={() => setMode('login')}>Back to login</button>
              </form>
            )}
          </>
        ) : (
          <>
            <button
              type="button"
              className="google-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="login-divider"><span>or</span></div>

            <div className="login-tabs">
              <button className={`login-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); }}>Login</button>
              <button className={`login-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => { setMode('signup'); setError(''); }}>Create Account</button>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {mode === 'signup' && (
                <div className="login-field">
                  <User size={16} className="field-icon" />
                  <input name="name" type="text" placeholder="Your full name" value={form.name} onChange={handleChange} required autoComplete="name" />
                </div>
              )}

              <div className="login-field">
                <Mail size={16} className="field-icon" />
                <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required autoComplete="email" />
              </div>

              <div className="login-field">
                <Lock size={16} className="field-icon" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'signup' ? 'Create a password (min 6 chars)' : 'Password'}
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {error && <p className="login-error">{error}</p>}

              <Button size="lg" fullWidth loading={loading} icon={<ArrowRight size={16} />}>
                {mode === 'signup' ? 'Create Account' : 'Login'}
              </Button>

              {mode === 'login' && (
                <button type="button" className="login-link-btn" onClick={() => { setMode('reset'); setError(''); }}>
                  Forgot password?
                </button>
              )}
            </form>
          </>
        )}

        <p className="login-guest-note">
          🛒 No account needed!{' '}
          <Link to="/">Order as guest →</Link>
        </p>
      </div>
    </div>
  );
}
