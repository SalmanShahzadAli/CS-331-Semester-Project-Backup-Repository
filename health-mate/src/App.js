import { useState, useEffect } from 'react';
import { Eye, EyeOff, Heart, Activity, Stethoscope, Brain, Sparkles, Moon, Sun } from 'lucide-react';
import Dashboard from './Dashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        if (!formData.email || !formData.password) {
          throw new Error('Please fill in all fields');
        }
        if (!validateEmail(formData.email)) {
          throw new Error('Invalid email format');
        }

        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        console.log('Login successful!', data);
        setIsAuthenticated(true); // THIS IS THE KEY - REDIRECTS TO DASHBOARD
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });

      } else {
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
          throw new Error('Please fill in all fields');
        }
        if (!validateEmail(formData.email)) {
          throw new Error('Invalid email format');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const response = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        console.log('Registration successful!', data);
        alert('Registration successful! Now login.');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  // If authenticated, show dashboard
  if (isAuthenticated) {
    return <Dashboard />;
  }

  // Otherwise show login/register page
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    background: isDarkMode 
      ? 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)'
      : '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    transition: 'background 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  };

  const leftPanelStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3rem',
    position: 'relative',
    zIndex: 1,
  };

  const rightPanelStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3rem',
    background: isDarkMode ? 'rgba(26, 26, 46, 0.5)' : '#f8f9fa',
    backdropFilter: 'blur(10px)',
    borderLeft: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e9ecef',
  };

  const brandContainerStyle = {
    textAlign: 'center',
    marginBottom: '3rem',
  };

  const brandLogoStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  };

  const brandTitleStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: isDarkMode ? '#ffffff' : '#2d3436',
    margin: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const brandSubtitleStyle = {
    fontSize: '1.25rem',
    color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#636e72',
    margin: 0,
  };

  const featureGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
    marginTop: '3rem',
    maxWidth: '500px',
  };

  const featureCardStyle = {
    background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#ffffff',
    border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e9ecef',
    borderRadius: '1rem',
    padding: '1.5rem',
    textAlign: 'center',
    transition: 'all 0.3s',
  };

  const featureIconStyle = {
    marginBottom: '0.75rem',
    color: '#667eea',
  };

  const featureTitleStyle = {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: isDarkMode ? '#ffffff' : '#2d3436',
    margin: 0,
  };

  const formContainerStyle = {
    width: '100%',
    maxWidth: '420px',
  };

  const themeToggleStyle = {
    position: 'absolute',
    top: '2rem',
    right: '2rem',
    background: isDarkMode ? 'rgba(255,255,255,0.1)' : '#f8f9fa',
    border: isDarkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid #e9ecef',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: isDarkMode ? '#ffffff' : '#2d3436',
    transition: 'all 0.3s',
    zIndex: 10,
  };

  const formHeaderStyle = {
    marginBottom: '2rem',
  };

  const formTitleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: isDarkMode ? '#ffffff' : '#2d3436',
    marginBottom: '0.5rem',
    margin: 0,
  };

  const formSubtitleStyle = {
    color: isDarkMode ? 'rgba(255,255,255,0.6)' : '#636e72',
    fontSize: '0.95rem',
    margin: 0,
  };

  const toggleContainerStyle = {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
    borderRadius: '0.75rem',
    padding: '0.25rem',
  };

  const toggleButtonStyle = (active) => ({
    flex: 1,
    padding: '0.75rem',
    borderRadius: '0.5rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    background: active ? (isDarkMode ? '#667eea' : '#667eea') : 'transparent',
    color: active ? '#ffffff' : (isDarkMode ? 'rgba(255,255,255,0.6)' : '#636e72'),
    transition: 'all 0.3s',
  });

  const formGroupStyle = {
    marginBottom: '1.25rem',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: isDarkMode ? 'rgba(255,255,255,0.8)' : '#2d3436',
    marginBottom: '0.5rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem 1rem',
    border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e9ecef',
    borderRadius: '0.75rem',
    fontSize: '0.95rem',
    background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#ffffff',
    color: isDarkMode ? '#ffffff' : '#2d3436',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
  };

  const passwordWrapperStyle = {
    position: 'relative',
  };

  const passwordToggleStyle = {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: isDarkMode ? 'rgba(255,255,255,0.5)' : '#636e72',
    padding: '0.25rem',
  };

  const errorStyle = {
    padding: '0.875rem',
    background: isDarkMode ? 'rgba(231, 76, 60, 0.1)' : '#fef2f2',
    border: isDarkMode ? '1px solid rgba(231, 76, 60, 0.3)' : '1px solid #fecaca',
    borderRadius: '0.75rem',
    color: isDarkMode ? '#ff7675' : '#b91c1c',
    fontSize: '0.875rem',
    marginBottom: '1rem',
  };

  const submitButtonStyle = {
    width: '100%',
    padding: '0.875rem',
    background: loading ? (isDarkMode ? '#636e72' : '#b2bec3') : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontWeight: 600,
    border: 'none',
    borderRadius: '0.75rem',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s',
    marginTop: '0.5rem',
    fontSize: '1rem',
  };

  const footerStyle = {
    textAlign: 'center',
    color: isDarkMode ? 'rgba(255,255,255,0.6)' : '#636e72',
    fontSize: '0.9rem',
    marginTop: '1.5rem',
  };

  const footerButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#667eea',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'color 0.3s',
  };

  const features = [
    { icon: Activity, title: '24/7 Health Monitoring' },
    { icon: Brain, title: 'Mental Wellness Support' },
    { icon: Stethoscope, title: 'Expert Medical Advice' },
    { icon: Sparkles, title: 'AI-Powered Insights' },
  ];

  return (
    <div style={containerStyle}>
      {/* Theme Toggle */}
      <button 
        style={themeToggleStyle}
        onClick={() => setIsDarkMode(!isDarkMode)}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Left Panel - Branding */}
      <div style={leftPanelStyle}>
        <div style={brandContainerStyle}>
          <div style={brandLogoStyle}>
            <Heart style={{ width: '60px', height: '60px', color: '#667eea', fill: '#667eea' }} />
          </div>
          <h1 style={brandTitleStyle}>Health Mate</h1>
          <p style={brandSubtitleStyle}>Your AI-Powered Health Companion</p>
        </div>

        <div style={featureGridStyle}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                style={featureCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = isDarkMode 
                    ? '0 10px 30px rgba(102, 126, 234, 0.2)' 
                    : '0 10px 30px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={featureIconStyle}>
                  <Icon size={32} />
                </div>
                <h3 style={featureTitleStyle}>{feature.title}</h3>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={rightPanelStyle}>
        <div style={formContainerStyle}>
          <div style={formHeaderStyle}>
            <h2 style={formTitleStyle}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={formSubtitleStyle}>
              {isLogin ? 'Sign in to continue your health journey' : 'Join thousands improving their health'}
            </p>
          </div>

          <div style={toggleContainerStyle}>
            <button
              style={toggleButtonStyle(isLogin)}
              onClick={() => isLogin || toggleMode()}
            >
              Login
            </button>
            <button
              style={toggleButtonStyle(!isLogin)}
              onClick={() => !isLogin || toggleMode()}
            >
              Register
            </button>
          </div>

          <div>
            {!isLogin && (
              <div style={formGroupStyle}>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                  onBlur={(e) => e.currentTarget.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.1)' : '#e9ecef'}
                />
              </div>
            )}

            <div style={formGroupStyle}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                style={inputStyle}
                onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                onBlur={(e) => e.currentTarget.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.1)' : '#e9ecef'}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Password</label>
              <div style={passwordWrapperStyle}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                  onBlur={(e) => e.currentTarget.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.1)' : '#e9ecef'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={passwordToggleStyle}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div style={formGroupStyle}>
                <label style={labelStyle}>Confirm Password</label>
                <div style={passwordWrapperStyle}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                    onBlur={(e) => e.currentTarget.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.1)' : '#e9ecef'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={passwordToggleStyle}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div style={errorStyle}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={submitButtonStyle}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </div>

          <p style={footerStyle}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={toggleMode} style={footerButtonStyle}>
              {isLogin ? 'Register now' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}