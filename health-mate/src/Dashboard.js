import { useState } from 'react';
import { Heart, MessageCircle, Activity, Brain, Stethoscope, LogOut, User } from 'lucide-react';
import MentalHealthBot from './chatbots/MentalHealthBot';

export default function Dashboard() {
  const [activeBot, setActiveBot] = useState(null);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  // If a bot is active, show that bot
  if (activeBot === 'mental-health') {
    return <MentalHealthBot onBack={() => setActiveBot(null)} />;
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
      name: 'Nutrition Expert',
      description: 'Diet plans, nutrition advice, and meal suggestions',
      icon: Heart,
      color: '#fdcb6e',
      gradient: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
      route: 'nutrition'
    }
  ];

  // ... rest of your Dashboard styles ...

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
  };

  const navbarStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const navBrandStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#667eea',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  };

  const navRightStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  };

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#2d3436',
    fontWeight: 500,
  };

  const logoutButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#667eea',
    color: 'white',
    padding: '0.5rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
  };

  const mainContentStyle = {
    padding: '3rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const welcomeStyle = {
    textAlign: 'center',
    marginBottom: '3rem',
    color: 'white',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    margin: 0,
  };

  const subtitleStyle = {
    fontSize: '1.125rem',
    opacity: 0.9,
    margin: 0,
  };

  const cardsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const cardIconWrapperStyle = (gradient) => ({
    width: '60px',
    height: '60px',
    borderRadius: '1rem',
    background: gradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  });

  const cardTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: '0.5rem',
    margin: 0,
  };

  const cardDescStyle = {
    color: '#636e72',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    margin: 0,
  };

  const startButtonStyle = (color) => ({
    marginTop: '1.5rem',
    width: '100%',
    padding: '0.75rem',
    background: color,
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
  });

  return (
    <div style={containerStyle}>
      <nav style={navbarStyle}>
        <div style={navBrandStyle}>
          <Heart style={{ width: '28px', height: '28px', fill: '#667eea' }} />
          Health Mate
        </div>
        <div style={navRightStyle}>
          <div style={userInfoStyle}>
            <User size={20} />
            <span>{user.name || 'User'}</span>
          </div>
          <button style={logoutButtonStyle} onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      <div style={mainContentStyle}>
        <div style={welcomeStyle}>
          <h1 style={titleStyle}>Welcome back, {user.name}! 👋</h1>
          <p style={subtitleStyle}>Choose a health assistant to get started</p>
        </div>

        <div style={cardsGridStyle}>
          {chatbots.map((bot) => {
            const Icon = bot.icon;
            return (
              <div
                key={bot.id}
                style={cardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={cardIconWrapperStyle(bot.gradient)}>
                  <Icon size={30} color="white" />
                </div>
                <h3 style={cardTitleStyle}>{bot.name}</h3>
                <p style={cardDescStyle}>{bot.description}</p>
                <button
                  style={startButtonStyle(bot.color)}
                  onClick={() => setActiveBot(bot.route)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Start Chat <MessageCircle size={16} style={{ display: 'inline', marginLeft: '0.5rem' }} />
                </button>
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: '3rem',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '1rem',
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
        }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', color: '#667eea', margin: 0 }}>4</h3>
            <p style={{ color: '#636e72', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>AI Health Assistants</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', color: '#00b894', margin: 0 }}>24/7</h3>
            <p style={{ color: '#636e72', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>Available Support</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', color: '#fd79a8', margin: 0 }}>100%</h3>
            <p style={{ color: '#636e72', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>Confidential</p>
          </div>
        </div>
      </div>
    </div>
  );
}