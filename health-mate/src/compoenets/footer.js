import React, { useState } from 'react';
import { Heart, Twitter, Linkedin, Github, MessageCircle, X, Activity, Brain, Stethoscope, Sparkles, Check, Mail, MapPin, Phone } from 'lucide-react';

export default function HealthMateFooter() {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalName) => {
    setActiveModal(modalName);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'unset';
  };

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, url: '#' },
    { name: 'LinkedIn', icon: Linkedin, url: '#' },
    { name: 'GitHub', icon: Github, url: '#' },
    { name: 'Discord', icon: MessageCircle, url: '#' }
  ];

  const chatbots = [
    {
      name: 'Health Monitor',
      icon: Activity,
      description: '24/7 health tracking and vital signs monitoring with real-time alerts and insights.',
      features: ['Heart rate tracking', 'Sleep analysis', 'Activity monitoring', 'Vital signs alerts']
    },
    {
      name: 'Mental Wellness',
      icon: Brain,
      description: 'AI-powered mental health support with mood tracking and personalized recommendations.',
      features: ['Mood tracking', 'Stress management', 'Meditation guides', 'Anxiety support']
    },
    {
      name: 'Medical Assistant',
      icon: Stethoscope,
      description: 'Expert medical advice and symptom analysis powered by advanced AI technology.',
      features: ['Symptom checker', 'Medicine reminders', 'Doctor consultations', 'Health records']
    },
    {
      name: 'Wellness Coach',
      icon: Sparkles,
      description: 'Personalized wellness plans with nutrition tracking and fitness recommendations.',
      features: ['Nutrition plans', 'Fitness tracking', 'Goal setting', 'Progress analytics']
    }
  ];

  const features = [
    { title: 'AI-Powered Analysis', description: 'Advanced machine learning algorithms analyze your health data' },
    { title: '24/7 Availability', description: 'Get health support anytime, anywhere, on any device' },
    { title: 'Secure & Private', description: 'Bank-level encryption ensures your health data stays private' },
    { title: 'Personalized Insights', description: 'Tailored recommendations based on your unique health profile' },
    { title: 'Multi-Device Sync', description: 'Access your health data seamlessly across all devices' },
    { title: 'Expert Verified', description: 'All medical information verified by certified healthcare professionals' }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: ['Basic health monitoring', '1 chatbot access', 'Limited insights', 'Community support'],
      popular: false
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      features: ['All chatbots access', 'Unlimited insights', 'Priority support', 'Advanced analytics', 'Custom health plans'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$29.99',
      period: '/month',
      features: ['Everything in Pro', 'Team management', 'API access', 'Dedicated support', 'Custom integrations', 'White-label options'],
      popular: false
    }
  ];

  const faqs = [
    { q: 'How does Health Mate protect my data?', a: 'We use bank-level encryption and comply with HIPAA regulations to ensure your health data is completely secure and private.' },
    { q: 'Can I use Health Mate offline?', a: 'Yes, basic features are available offline. Data syncs automatically when you reconnect to the internet.' },
    { q: 'Is Health Mate a replacement for doctors?', a: 'No, Health Mate is designed to complement professional medical care, not replace it. Always consult healthcare professionals for medical decisions.' },
    { q: 'Which devices are supported?', a: 'Health Mate works on iOS, Android, web browsers, and integrates with popular fitness trackers and smartwatches.' },
    { q: 'Can I export my health data?', a: 'Yes, you can export all your health data anytime in multiple formats including PDF, CSV, and JSON.' },
    { q: 'How accurate are the AI predictions?', a: 'Our AI models are trained on millions of data points and validated by medical professionals, achieving 95%+ accuracy in most scenarios.' }
  ];

  const ModalContent = () => {
    const modalStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      animation: 'fadeIn 0.3s ease'
    };

    const contentStyle = {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)',
      borderRadius: '1.5rem',
      maxWidth: '900px',
      width: '100%',
      maxHeight: '85vh',
      overflow: 'auto',
      position: 'relative',
      border: '1px solid rgba(102, 126, 234, 0.2)',
      animation: 'slideUp 0.3s ease'
    };

    const headerStyle = {
      position: 'sticky',
      top: 0,
      background: 'rgba(15, 15, 30, 0.95)',
      backdropFilter: 'blur(10px)',
      padding: '1.5rem 2rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 10
    };

    const bodyStyle = {
      padding: '2rem'
    };

    switch(activeModal) {
      case 'features':
        return (
          <div style={modalStyle} onClick={closeModal}>
            <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
              <div style={headerStyle}>
                <h2 style={{ margin: 0, color: '#fff', fontSize: '1.75rem' }}>Features</h2>
                <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.5rem' }}>
                  <X size={24} />
                </button>
              </div>
              <div style={bodyStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                  {features.map((feature, index) => (
                    <div key={index} style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.borderColor = '#667eea';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}>
                      <div style={{ color: '#667eea', marginBottom: '0.75rem' }}>
                        <Check size={24} />
                      </div>
                      <h3 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{feature.title}</h3>
                      <p style={{ color: 'rgba(255, 255, 255, 0.6)', margin: 0, fontSize: '0.9rem' }}>{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'chatbots':
        return (
          <div style={modalStyle} onClick={closeModal}>
            <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
              <div style={headerStyle}>
                <h2 style={{ margin: 0, color: '#fff', fontSize: '1.75rem' }}>Our AI Chatbots</h2>
                <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.5rem' }}>
                  <X size={24} />
                </button>
              </div>
              <div style={bodyStyle}>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {chatbots.map((bot, index) => {
                    const Icon = bot.icon;
                    return (
                      <div key={index} style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        display: 'flex',
                        gap: '1.5rem',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#667eea'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}>
                        <div style={{ color: '#667eea', flexShrink: 0 }}>
                          <Icon size={40} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.25rem' }}>{bot.name}</h3>
                          <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '1rem' }}>{bot.description}</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {bot.features.map((feature, idx) => (
                              <span key={idx} style={{
                                background: 'rgba(102, 126, 234, 0.2)',
                                border: '1px solid rgba(102, 126, 234, 0.4)',
                                borderRadius: '0.5rem',
                                padding: '0.25rem 0.75rem',
                                fontSize: '0.85rem',
                                color: '#fff'
                              }}>
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div style={modalStyle} onClick={closeModal}>
            <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
              <div style={headerStyle}>
                <h2 style={{ margin: 0, color: '#fff', fontSize: '1.75rem' }}>Pricing Plans</h2>
                <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.5rem' }}>
                  <X size={24} />
                </button>
              </div>
              <div style={bodyStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                  {pricingPlans.map((plan, index) => (
                    <div key={index} style={{
                      background: plan.popular ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.05)',
                      border: plan.popular ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '1rem',
                      padding: '2rem 1.5rem',
                      textAlign: 'center',
                      position: 'relative',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                      {plan.popular && (
                        <div style={{
                          position: 'absolute',
                          top: '-10px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: '#fff',
                          color: '#667eea',
                          padding: '0.25rem 1rem',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>
                          POPULAR
                        </div>
                      )}
                      <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>{plan.name}</h3>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <span style={{ color: '#fff', fontSize: '3rem', fontWeight: 'bold' }}>{plan.price}</span>
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem' }}>{plan.period}</span>
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', textAlign: 'left' }}>
                        {plan.features.map((feature, idx) => (
                          <li key={idx} style={{ color: '#fff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Check size={16} style={{ color: plan.popular ? '#fff' : '#667eea', flexShrink: 0 }} />
                            <span style={{ fontSize: '0.9rem' }}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button style={{
                        width: '100%',
                        padding: '0.875rem',
                        background: plan.popular ? '#fff' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: plan.popular ? '#667eea' : '#fff',
                        border: 'none',
                        borderRadius: '0.75rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        Choose Plan
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div style={modalStyle} onClick={closeModal}>
            <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
              <div style={headerStyle}>
                <h2 style={{ margin: 0, color: '#fff', fontSize: '1.75rem' }}>Frequently Asked Questions</h2>
                <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.5rem' }}>
                  <X size={24} />
                </button>
              </div>
              <div style={bodyStyle}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {faqs.map((faq, index) => (
                    <div key={index} style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#667eea'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}>
                      <h3 style={{ color: '#667eea', marginBottom: '0.75rem', fontSize: '1.1rem' }}>{faq.q}</h3>
                      <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, lineHeight: '1.6' }}>{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div style={modalStyle} onClick={closeModal}>
            <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
              <div style={headerStyle}>
                <h2 style={{ margin: 0, color: '#fff', fontSize: '1.75rem' }}>About Us</h2>
                <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.5rem' }}>
                  <X size={24} />
                </button>
              </div>
              <div style={bodyStyle}>
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ color: '#667eea', fontSize: '1.5rem', marginBottom: '1rem' }}>Our Mission</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                    At Health Mate, we're revolutionizing healthcare through artificial intelligence. Our mission is to make quality health support accessible to everyone, anytime, anywhere. We believe that technology should empower people to take control of their health journey.
                  </p>
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ color: '#667eea', fontSize: '1.5rem', marginBottom: '1rem' }}>Our Story</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                    Founded in 2023 by a team of healthcare professionals and AI experts, Health Mate was born from a simple observation: healthcare is often inaccessible, expensive, and overwhelming. We set out to change that by combining cutting-edge AI technology with medical expertise to create a platform that truly understands and supports your health needs.
                  </p>
                </div>
                <div style={{ background: 'rgba(102, 126, 234, 0.1)', border: '1px solid rgba(102, 126, 234, 0.3)', borderRadius: '1rem', padding: '1.5rem' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>Our Values</h3>
                  <ul style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '2', listStyle: 'none', padding: 0 }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Check size={20} style={{ color: '#667eea' }} /> Privacy First - Your data, your control
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Check size={20} style={{ color: '#667eea' }} /> Evidence-Based - Backed by medical research
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Check size={20} style={{ color: '#667eea' }} /> Accessibility - Healthcare for everyone
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Check size={20} style={{ color: '#667eea' }} /> Innovation - Constantly improving
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div style={modalStyle} onClick={closeModal}>
            <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
              <div style={headerStyle}>
                <h2 style={{ margin: 0, color: '#fff', fontSize: '1.75rem' }}>Contact Us</h2>
                <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.5rem' }}>
                  <X size={24} />
                </button>
              </div>
              <div style={bodyStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <Mail size={32} style={{ color: '#667eea', margin: '0 auto 1rem' }} />
                    <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Email</h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>support@healthmate.com</p>
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <Phone size={32} style={{ color: '#667eea', margin: '0 auto 1rem' }} />
                    <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Phone</h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>+1 (555) 123-4567</p>
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <MapPin size={32} style={{ color: '#667eea', margin: '0 auto 1rem' }} />
                    <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Address</h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>123 Health St, San Francisco, CA</p>
                  </div>
                </div>
                <form style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '1rem', padding: '2rem' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontWeight: 600 }}>Name</label>
                    <input type="text" placeholder="Your name" style={{
                      width: '100%',
                      padding: '0.875rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }} />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontWeight: 600 }}>Email</label>
                    <input type="email" placeholder="your@email.com" style={{
                      width: '100%',
                      padding: '0.875rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }} />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontWeight: 600 }}>Message</label>
                    <textarea placeholder="Your message..." rows="4" style={{
                      width: '100%',
                      padding: '0.875rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '1rem',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }} />
                  </div>
                  <button type="submit" style={{
                    width: '100%',
                    padding: '0.875rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.75rem',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        );

      case 'privacy':
      case 'terms':
      case 'cookies':
      case 'disclaimer':
        const legalContent = {
          privacy: { title: 'Privacy Policy', content: 'We take your privacy seriously. This policy outlines how we collect, use, and protect your personal health information. All data is encrypted and stored securely. We never sell your data to third parties.' },
          terms: { title: 'Terms of Service', content: 'By using Health Mate, you agree to these terms. Our service is provided "as is" and should not replace professional medical advice. Users must be 18 or older to create an account.' },
          cookies: { title: 'Cookie Policy', content: 'We use cookies to enhance your experience. Essential cookies are required for the platform to function. Analytics cookies help us improve our service.' },
          disclaimer: { title: 'Disclaimer', content: 'Health Mate provides general health information and should not be considered medical advice. Always consult qualified healthcare professionals for medical decisions. In case of emergency, contact emergency services immediately.' }
        };
        const legal = legalContent[activeModal];
        return (
          <div style={modalStyle} onClick={closeModal}>
            <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
              <div style={headerStyle}>
                <h2 style={{ margin: 0, color: '#fff', fontSize: '1.75rem' }}>{legal.title}</h2>
                <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.5rem' }}>
                  <X size={24} />
                </button>
              </div>
              <div style={bodyStyle}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '1rem',
                  padding: '2rem'
                }}>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                    {legal.content}
                  </p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: '2rem', fontSize: '0.9rem' }}>
                    Last updated: December 4, 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
      
      <footer style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#fff',
        padding: '4rem 0 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            {/* Brand Section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Heart style={{ width: '32px', height: '32px', color: '#667eea', fill: '#667eea' }} />
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Health Mate</h2>
              </div>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Your AI-powered companion for better health and wellness
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        textDecoration: 'none',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#667eea';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Product</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Features', 'Chatbots', 'Pricing', 'FAQ'].map((item) => (
                  <li key={item} style={{ marginBottom: '0.75rem' }}>
                    <button
                      onClick={() => openModal(item.toLowerCase())}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'color 0.3s',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#667eea'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Company</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { label: 'About Us', key: 'about' },
                  { label: 'Careers', key: 'careers' },
                  { label: 'Contact', key: 'contact' },
                  { label: 'Blog', key: 'blog' }
                ].map((item) => (
                  <li key={item.key} style={{ marginBottom: '0.75rem' }}>
                    <button
                      onClick={() => item.key === 'careers' || item.key === 'blog' ? null : openModal(item.key)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.95rem',
                        cursor: item.key === 'careers' || item.key === 'blog' ? 'default' : 'pointer',
                        padding: 0,
                        transition: 'color 0.3s',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => {
                        if (item.key !== 'careers' && item.key !== 'blog') {
                          e.currentTarget.style.color = '#667eea';
                        }
                      }}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Legal</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { label: 'Privacy Policy', key: 'privacy' },
                  { label: 'Terms of Service', key: 'terms' },
                  { label: 'Cookie Policy', key: 'cookies' },
                  { label: 'Disclaimer', key: 'disclaimer' }
                ].map((item) => (
                  <li key={item.key} style={{ marginBottom: '0.75rem' }}>
                    <button
                      onClick={() => openModal(item.key)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'color 0.3s',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#667eea'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>
              © 2025 Health Mate. All rights reserved.
            </p>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>
              Made with <Heart size={14} style={{ display: 'inline', color: '#667eea', fill: '#667eea', verticalAlign: 'middle' }} /> for better health
            </p>
          </div>
        </div>
      </footer>

      {/* Render Modal */}
      {activeModal && <ModalContent />}
    </>
  );
}