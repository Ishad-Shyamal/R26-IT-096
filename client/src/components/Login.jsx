import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Activity } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Retrieve registered user data from localStorage
    const savedUser = localStorage.getItem('user');

    if (!savedUser) {
      alert('No registered account found. Please sign up first.');
      navigate('/signup');
      return;
    }

    const user = JSON.parse(savedUser);

    // Verify email and password
    if (user.email !== email) {
      setError('No account associated with this email. Please sign up.');
      return;
    }

    if (user.password !== password) {
      setError('Incorrect password. Please try again.');
      return;
    }

    // Successful login -> Redirect to Settings/Dashboard
    alert('Login successful!');
    navigate('/settings');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Redirecting to sign up to reset or create a new account.');
    navigate('/signup');
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <div className="brand-icon auth-logo">
            <Activity size={28} />
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to continue to InsightCric</p>
        </div>

        {error && (
          <div style={{ color: '#ff4d4d', marginBottom: '16px', fontSize: '0.9rem', textAlign: 'center' }}>
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
              <a href="#forgot" onClick={handleForgotPassword}>Forgot Password?</a>
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