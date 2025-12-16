import { useState } from 'react';
import { Heart, MessageCircle, Activity, Brain, Stethoscope, LogOut, User, Moon, Sun, Sparkles } from 'lucide-react';
import MentalHealthBot from './chatbots/MentalHealthBot';
import GeneralHealthChatbot from './chatbots/GeneralHealth';
import FitnessChatbot from './chatbots/FitnessHealth';
import HealthMateFooter from './components/footer';
import OrthopedicChatbot from './chatbots/Orthopedic_Health';

export default function Dashboard() {
  const [activeBot, setActiveBot] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  // If Mental Health bot is active, show it
  if (activeBot === 'mental-health') {
    return <MentalHealthBot onBack={() => setActiveBot(null)} />;
  }
  // If General Health Chatbot is active, show it
  if (activeBot === 'general-health') {
    return <GeneralHealthChatbot onBack={() => setActiveBot(null)} />;
  }
  // If Fitness Chatbot is active, show it
  if (activeBot === 'fitness') {
    return <FitnessChatbot onBack={() => setActiveBot(null)} />;
  }
  // If Fitness Chatbot is active, show it
  if (activeBot === 'orthopedic-health') {
    return <OrthopedicChatbot onBack={() => setActiveBot(null)} />;
  }
  const chatbots = [
    {
      id: 1,
      name: 'General Health',
      description: 'Get advice on general health, wellness, and lifestyle',
      icon: Stethoscope,
      color: '#00b894',
      gradient: 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)',
      route: 'general-health'
    },
    {
      id: 2,
      name: 'Mental Health',
      description: 'Support for mental wellness and emotional health',
      icon: Brain,
      color: '#a29bfe',
      gradient: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
      route: 'mental-health'
    },
    {
      id: 3,
      name: 'Fitness Coach',
      description: 'Workout plans, exercise tips, and fitness guidance',
      icon: Activity,
      color: '#fd79a8',
      gradient: 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)',
      route: 'fitness'
    },
    {
      id: 4,
      name: 'Orthopedic Health',
      description: 'Get advice on health bones',
      icon: Heart,
      color: '#fdcb6e',
      gradient: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
      route: 'orthopedic-health'
    }
  ];

  const containerStyle = {
    minHeight: '100vh',
    background: isDarkMode 
      ? 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)'
      : '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    transition: 'background 0.3s ease',
  };

  const navbarStyle = {
    background: isDarkMode ? 'rgba(26, 26, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '1.5rem 3rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: isDarkMode 
      ? '0 4px 20px rgba(0, 0, 0, 0.5)'
      : '0 4px 20px rgba(0, 0, 0, 0.1)',
    borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e9ecef',
  };

  const navBrandStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  };

  const brandTextStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const navRightStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  };

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 1rem',
    background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
    borderRadius: '2rem',
    color: isDarkMode ? '#fff' : '#2d3436',
    fontWeight: 500,
    border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e9ecef',
  };

  const themeToggleStyle = {
    background: isDarkMode ? 'rgba(255,255,255,0.1)' : '#f8f9fa',
    border: isDarkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid #e9ecef',
    borderRadius: '50%',
    width: '45px',
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: isDarkMode ? '#ffffff' : '#2d3436',
    transition: 'all 0.3s',
  };

  const logoutButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '2rem',
    border: 'none',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  };

  const mainContentStyle = {
    padding: '4rem 3rem',
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const welcomeStyle = {
    textAlign: 'center',
    marginBottom: '4rem',
  };

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    margin: 0,
    color: isDarkMode ? '#ffffff' : '#2d3436',
  };

  const subtitleStyle = {
    fontSize: '1.25rem',
    color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#636e72',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  };

  const cardsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
    marginTop: '3rem',
  };

  const cardStyle = {
    background: isDarkMode 
      ? 'rgba(255, 255, 255, 0.05)'
      : '#ffffff',
    backdropFilter: 'blur(10px)',
    borderRadius: '1.5rem',
    padding: '2.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: isDarkMode
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: isDarkMode 
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid #e9ecef',
    position: 'relative',
    overflow: 'hidden',
  };

  const cardGlowStyle = (gradient) => ({
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '200%',
    height: '200%',
    background: gradient,
    opacity: 0,
    borderRadius: '50%',
    transition: 'opacity 0.3s',
    pointerEvents: 'none',
  });

  const cardIconWrapperStyle = (gradient) => ({
    width: '70px',
    height: '70px',
    borderRadius: '1.25rem',
    background: gradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
  });

  const cardTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: isDarkMode ? '#ffffff' : '#2d3436',
    marginBottom: '0.75rem',
    margin: 0,
  };

  const cardDescStyle = {
    color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#636e72',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    margin: 0,
    marginBottom: '1.5rem',
  };

  const startButtonStyle = (color) => ({
    width: '100%',
    padding: '0.875rem',
    background: color,
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  });

  const statsContainerStyle = {
    marginTop: '4rem',
    background: isDarkMode 
      ? 'rgba(255, 255, 255, 0.05)'
      : '#ffffff',
    backdropFilter: 'blur(10px)',
    borderRadius: '1.5rem',
    padding: '3rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '3rem',
    border: isDarkMode 
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid #e9ecef',
    boxShadow: isDarkMode
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)',
  };

  const statItemStyle = {
    textAlign: 'center',
  };

  const statValueStyle = (color) => ({
    fontSize: '2.5rem',
    fontWeight: 'bold',
    background: `linear-gradient(135deg, ${color}, ${color}99)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
    marginBottom: '0.5rem',
  });

  const statLabelStyle = {
    color: isDarkMode ? 'rgba(255,255,255,0.6)' : '#636e72',
    fontSize: '0.95rem',
    margin: 0,
  };

  const featuresContainerStyle = {
    marginTop: '4rem',
  };

  const featuresTitleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '3rem',
    color: isDarkMode ? '#ffffff' : '#2d3436',
  };

  const featuresGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  };

  const featureItemStyle = {
    background: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : '#f8f9fa',
    borderRadius: '1rem',
    padding: '2rem',
    textAlign: 'center',
    border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e9ecef',
    transition: 'all 0.3s',
  };

  const featureIconStyle = {
    fontSize: '3rem',
    marginBottom: '1rem',
  };

  const featureItemTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: isDarkMode ? '#ffffff' : '#2d3436',
    marginBottom: '0.75rem',
    margin: 0,
  };

  const featureItemDescStyle = {
    fontSize: '0.9rem',
    color: isDarkMode ? 'rgba(255,255,255,0.6)' : '#636e72',
    lineHeight: '1.6',
    margin: 0,
  };

  const footerStyle = {
    background: isDarkMode ? 'rgba(15, 15, 30, 0.95)' : '#f8f9fa',
    borderTop: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e9ecef',
    marginTop: '5rem',
  };

  const footerContentStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '3rem 3rem 2rem 3rem',
  };

  const footerTopStyle = {
    display: 'grid',
    gridTemplateColumns: '1.5fr 2fr',
    gap: '4rem',
    marginBottom: '3rem',
  };

  const footerBrandStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };

  const footerLogoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  };

  const footerBrandTextStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const footerTaglineStyle = {
    color: isDarkMode ? 'rgba(255,255,255,0.6)' : '#636e72',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    margin: 0,
    maxWidth: '350px',
  };

  const footerLinksContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '2rem',
  };

  const footerColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  };

  const footerColumnTitleStyle = {
    fontSize: '1rem',
    fontWeight: 600,
    color: isDarkMode ? '#ffffff' : '#2d3436',
    marginBottom: '0.5rem',
    margin: 0,
  };

  const footerLinkStyle = {
    color: isDarkMode ? 'rgba(255,255,255,0.6)' : '#636e72',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'color 0.2s',
    textDecoration: 'none',
  };

  const footerBottomStyle = {
    paddingTop: '2rem',
    borderTop: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e9ecef',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  };

  const footerCopyrightStyle = {
    color: isDarkMode ? 'rgba(255,255,255,0.5)' : '#636e72',
    fontSize: '0.875rem',
    margin: 0,
  };

  const footerBadgesStyle = {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  };

  const badgeStyle = {
    padding: '0.5rem 1rem',
    background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
    border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e9ecef',
    borderRadius: '2rem',
    fontSize: '0.85rem',
    color: isDarkMode ? 'rgba(255,255,255,0.8)' : '#2d3436',
  };

  return (
    <div style={containerStyle}>
      {/* Navbar */}
      <nav style={navbarStyle}>
        <div style={navBrandStyle}>
          <Heart style={{ width: '32px', height: '32px', color: '#667eea', fill: '#667eea' }} />
          <span style={brandTextStyle}>Health Mate</span>
        </div>
        <div style={navRightStyle}>
          <div style={userInfoStyle}>
            <User size={20} />
            <span>{user.name || 'User'}</span>
          </div>
          <button 
            style={themeToggleStyle}
            onClick={() => setIsDarkMode(!isDarkMode)}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          <button 
            style={logoutButtonStyle} 
            onClick={handleLogout}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={mainContentStyle}>
        <div style={welcomeStyle}>
          <h1 style={titleStyle}>Welcome back, {user.name}! 👋</h1>
          <p style={subtitleStyle}>
            <Sparkles size={20} style={{ color: '#667eea' }} />
            Choose your AI health assistant to get started
          </p>
        </div>

        {/* Chatbot Cards */}
        <div style={cardsGridStyle}>
          {chatbots.map((bot) => {
            const Icon = bot.icon;
            return (
              <div
                key={bot.id}
                style={cardStyle}
                onClick={() => setActiveBot(bot.route)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = isDarkMode
                    ? '0 20px 40px rgba(0, 0, 0, 0.4)'
                    : '0 20px 40px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.querySelector('.card-glow').style.opacity = '0.1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = isDarkMode
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                    : '0 8px 32px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.querySelector('.card-glow').style.opacity = '0';
                }}
              >
                <div className="card-glow" style={cardGlowStyle(bot.gradient)}></div>
                <div style={cardIconWrapperStyle(bot.gradient)}>
                  <Icon size={35} color="white" />
                </div>
                <h3 style={cardTitleStyle}>{bot.name}</h3>
                <p style={cardDescStyle}>{bot.description}</p>
                <button
                  style={startButtonStyle(bot.color)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                  }}
                >
                  Start Chat
                  <MessageCircle size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div style={statsContainerStyle}>
          <div style={statItemStyle}>
            <h3 style={statValueStyle('#667eea')}>4</h3>
            <p style={statLabelStyle}>AI Health Assistants</p>
          </div>
          <div style={statItemStyle}>
            <h3 style={statValueStyle('#00b894')}>24/7</h3>
            <p style={statLabelStyle}>Available Support</p>
          </div>
          <div style={statItemStyle}>
            <h3 style={statValueStyle('#fd79a8')}>100%</h3>
            <p style={statLabelStyle}>Confidential & Secure</p>
          </div>
          <div style={statItemStyle}>
            <h3 style={statValueStyle('#fdcb6e')}>AI</h3>
            <p style={statLabelStyle}>Powered Intelligence</p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div style={featuresContainerStyle}>
          <h2 style={featuresTitleStyle}>Why Choose Health Mate?</h2>
          <div style={featuresGridStyle}>
            <div style={featureItemStyle}>
              <div style={featureIconStyle}>🎯</div>
              <h4 style={featureItemTitleStyle}>Personalized Care</h4>
              <p style={featureItemDescStyle}>Tailored health advice based on your unique needs and medical history</p>
            </div>
            <div style={featureItemStyle}>
              <div style={featureIconStyle}>🔒</div>
              <h4 style={featureItemTitleStyle}>Privacy First</h4>
              <p style={featureItemDescStyle}>Your data is encrypted and never shared with third parties</p>
            </div>
            <div style={featureItemStyle}>
              <div style={featureIconStyle}>⚡</div>
              <h4 style={featureItemTitleStyle}>Instant Responses</h4>
              <p style={featureItemDescStyle}>Get immediate answers to your health questions anytime, anywhere</p>
            </div>
            <div style={featureItemStyle}>
              <div style={featureIconStyle}>🤖</div>
              <h4 style={featureItemTitleStyle}>AI-Powered</h4>
              <p style={featureItemDescStyle}>Leveraging advanced AI to provide accurate and reliable health insights</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <HealthMateFooter />
    </div>
  );
}