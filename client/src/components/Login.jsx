import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Activity, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Fetch stored user details from localStorage
    const storedUser = JSON.parse(localStorage.getItem('userData') || '{}');

    // Validate if an account exists
    if (!storedUser.email) {
      setError('No registered user found. Please sign up first.');
      return;
    }

    // Clean inputs for reliable comparison
    const inputEmail = email.trim().toLowerCase();
    const inputPassword = password.trim();
    const storedEmail = storedUser.email.trim().toLowerCase();
    const storedPassword = (storedUser.password || '').trim();

    // Validate credentials
    if (storedEmail !== inputEmail || storedPassword !== inputPassword) {
      setError('Invalid email or password.');
      return;
    }

    // Credentials valid -> Navigate to Dashboard
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')} 
        className="back-btn"
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'transparent',
          border: 'none',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="auth-card glass-panel">
        <div className="auth-header">
          <div className="brand-icon auth-logo">
            <Activity size={28} />
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to continue to InsightCric</p>
        </div>

        {/* Error Notification Banner */}
        {error && (
          <div style={{
            background: 'rgba(255, 51, 102, 0.15)',
            border: '1px solid #ff3366',
            color: '#ff3366',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="forgot-password">
              <a href="#forgot">Forgot Password?</a>
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit">
            Sign In <ArrowRight size={20} />
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;