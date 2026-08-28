import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import SchoolLogo from '../../components/common/SchoolLogo';
import { useSite } from '../../context/SiteContext';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { settings } = useSite();

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await api('/users/login', {
        method: 'POST',
        body: { email: form.get('email'), password: form.get('password') }
      });
      const role = response.data.user.role;
      if (['admin', 'superAdmin'].includes(role)) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page-wrapper">
      <div className="login-split">
        {/* Left Side: Brand/Info */}
        <motion.div 
          className="login-brand-side"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="login-brand-content">
            <SchoolLogo footer />
            <h2>Welcome Back!</h2>
            <p className="login-tagline">
              {settings.shortDescription || "A co-ed English medium school from PG to secondary level."}
            </p>
            
            <div className="login-contact-info">
              <div className="info-item">
                <i className="bi bi-geo-alt-fill"></i>
                <p>{settings.address || "Shantinagar, Kathmandu, Nepal"}</p>
              </div>
              <div className="info-item">
                <i className="bi bi-envelope-fill"></i>
                <p>{settings.email || "info@babylonschool.edu.np"}</p>
              </div>
              <div className="info-item">
                <i className="bi bi-telephone-fill"></i>
                <p>{settings.phone || "+977-1-4108905, 4108973"}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div 
          className="login-form-side"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="login-form-container">
            <div className="login-header">
              <p className="eyebrow">ACCOUNT</p>
              <h1>Sign in</h1>
            </div>
            
            <form onSubmit={submit}>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" required placeholder="Enter your email" />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input name="password" type="password" required placeholder="Enter your password" />
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="login-error"
                >
                  {error}
                </motion.p>
              )}
              
              <div className="form-actions">
                <button className="button primary" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in'} <span>&rarr;</span>
                </button>
                
                <div className="form-links">
                  <p>Don&apos;t have an account? <Link to="/signup">Sign up</Link></p>
                  <p><Link to="/forgot-password">Forgot password?</Link></p>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
