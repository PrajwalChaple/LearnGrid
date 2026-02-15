import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

export function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const result = register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'Student'
      });

      setLoading(false);
      if (result.success) {
        navigate('/');
      } else {
        alert(result.message);
      }
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-card animate-fade-in-scale">
        <div className="brand">
          <div className="logo-icon">L</div>
          <h1>LearnGrid</h1>
        </div>
        <p className="tagline">Create your account</p>

        <form onSubmit={handleRegister} className="login-form">
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input
              type="text"
              placeholder="Full Name"
              required
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              required
              className="input-field"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input
              type="password"
              placeholder="Password"
              required
              className="input-field"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>Sign Up <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <button className="btn-google">
          <svg className="google-icon" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Sign up with Google
        </button>

        <p className="create-account">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>

      <style jsx="true">{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gradient-hero);
          padding: var(--spacing-md);
          position: relative;
          overflow: hidden;
        }

        .login-container::before {
          content: '';
          position: absolute;
          width: 400px;
          height: 400px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
          top: -100px;
          left: -100px;
        }

        .login-container::after {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          background: rgba(255,255,255,0.04);
          border-radius: 50%;
          bottom: -80px;
          right: -80px;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          padding: 3rem;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          width: 100%;
          max-width: 440px;
          text-align: center;
          position: relative;
          z-index: 2;
          border: 1px solid rgba(255,255,255,0.5);
        }

        .brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-xs);
        }

        .logo-icon {
          background: var(--gradient-primary);
          color: white;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          font-weight: 800;
          font-size: 1.5rem;
        }

        h1 { font-size: 1.75rem; color: var(--color-text-main); font-weight: 800; }

        .tagline {
          color: var(--color-text-muted);
          margin-bottom: 2.5rem;
          font-size: 1.05rem;
        }

        .login-form { display: flex; flex-direction: column; gap: var(--spacing-lg); }

        .input-group { position: relative; }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
        }

        .input-field {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          font-size: 1rem;
          transition: all var(--transition-fast);
          background: white;
        }

        .input-field:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .btn-primary {
          background: var(--gradient-primary);
          color: white;
          padding: 0.875rem;
          border-radius: var(--radius-lg);
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          transition: all var(--transition-fast);
          box-shadow: 0 4px 14px rgb(99 102 241 / 0.35);
          min-height: 52px;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgb(99 102 241 / 0.45);
        }

        .btn-primary:disabled { opacity: 0.8; cursor: not-allowed; transform: none; }

        .spinner {
          width: 22px;
          height: 22px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .divider { margin: 2rem 0; position: relative; text-align: center; }

        .divider::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 100%;
          height: 1px;
          background: var(--color-border);
          z-index: 0;
        }

        .divider span {
          background: rgba(255, 255, 255, 0.95);
          padding: 0 1rem;
          color: var(--color-text-muted);
          position: relative;
          z-index: 1;
          font-size: 0.85rem;
        }

        .btn-google {
          width: 100%;
          padding: 0.875rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          background: white;
          color: var(--color-text-main);
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          transition: all var(--transition-fast);
        }

        .btn-google:hover { background: var(--color-background); border-color: #9ca3af; }

        .google-icon { width: 20px; height: 20px; }

        .create-account { margin-top: 2rem; color: var(--color-text-muted); font-size: 0.95rem; }

        .create-account a { color: var(--color-primary); font-weight: 700; }

        .create-account a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
