import { useState, useEffect } from 'react';
import { X, Users, BarChart3, Settings, CreditCard, Shield, AlertCircle, Loader } from 'lucide-react';
import { adminApi } from '../utils/adminApi';

export default function AdminPanel({ isDarkMode, onClose, user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [subscriptions, setSubscriptions] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add CSS for loading animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .loader-spin {
        animation: spin 1s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Load data on mount and tab change
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        console.log('Loading overview stats...');
        const statsData = await adminApi.getStats();
        console.log('Stats received:', statsData);
        setStats(statsData);
        
        const activityData = await adminApi.getActivity();
        console.log('Activity received:', activityData);
        setActivity(activityData);
      } else if (activeTab === 'users') {
        console.log('Loading users...');
        const usersData = await adminApi.getUsers();
        console.log('Users received:', usersData);
        setUsers(usersData);
      } else if (activeTab === 'subscriptions') {
        console.log('Loading subscriptions...');
        const subsData = await adminApi.getSubscriptions();
        console.log('Subscriptions received:', subsData);
        setSubscriptions(subsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const panelStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)',
  };

  const containerStyle = {
    background: isDarkMode
      ? 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)'
      : '#ffffff',
    borderRadius: '1.5rem',
    boxShadow: isDarkMode
      ? '0 20px 60px rgba(0, 0, 0, 0.8)'
      : '0 20px 60px rgba(0, 0, 0, 0.15)',
    width: '90%',
    maxWidth: '1200px',
    height: '85vh',
    display: 'flex',
    flexDirection: 'column',
    border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e9ecef',
  };

  const headerStyle = {
    padding: '2rem',
    borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e9ecef',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const titleStyle = {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: isDarkMode ? '#ffffff' : '#2d3436',
    margin: 0,
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: isDarkMode ? '#a29bfe' : '#6c5ce7',
    fontSize: '1.5rem',
    transition: 'all 0.2s',
    padding: '0.5rem',
  };

  const contentStyle = {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  };

  const sidebarStyle = {
    width: '250px',
    background: isDarkMode ? 'rgba(255,255,255,0.03)' : '#f8f9fa',
    borderRight: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e9ecef',
    padding: '1.5rem 0',
    overflowY: 'auto',
  };

  const tabButtonStyle = (isActive) => ({
    width: '100%',
    padding: '1rem 1.5rem',
    background: isActive
      ? isDarkMode
        ? 'rgba(162, 155, 254, 0.15)'
        : 'rgba(108, 92, 231, 0.1)'
      : 'transparent',
    border: 'none',
    borderLeft: isActive ? '3px solid #a29bfe' : '3px solid transparent',
    color: isActive
      ? isDarkMode
        ? '#a29bfe'
        : '#6c5ce7'
      : isDarkMode
      ? 'rgba(255,255,255,0.6)'
      : '#636e72',
    cursor: 'pointer',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.95rem',
    fontWeight: isActive ? 600 : 500,
    transition: 'all 0.2s',
  });

  const mainContentStyle = {
    flex: 1,
    padding: '2rem',
    overflowY: 'auto',
  };

  const sectionStyle = {
    marginBottom: '2rem',
  };

  const sectionTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: isDarkMode ? '#ffffff' : '#2d3436',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  };

  const statCardStyle = {
    background: isDarkMode
      ? 'rgba(255, 255, 255, 0.05)'
      : '#ffffff',
    border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e9ecef',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
  };

  const statLabelStyle = {
    color: isDarkMode ? 'rgba(255,255,255,0.6)' : '#636e72',
    fontSize: '0.875rem',
    fontWeight: 500,
    marginBottom: '0.5rem',
  };

  const statValueStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: isDarkMode ? '#ffffff' : '#2d3436',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    background: isDarkMode ? 'rgba(255,255,255,0.02)' : '#ffffff',
    borderRadius: '1rem',
    overflow: 'hidden',
    border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e9ecef',
  };

  const thStyle = {
    padding: '1rem',
    background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
    textAlign: 'left',
    fontWeight: 600,
    color: isDarkMode ? '#ffffff' : '#2d3436',
    borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e9ecef',
    fontSize: '0.875rem',
  };

  const tdStyle = {
    padding: '1rem',
    borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e9ecef',
    color: isDarkMode ? 'rgba(255,255,255,0.8)' : '#2d3436',
    fontSize: '0.9rem',
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderOverview = () => (
    <>
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <BarChart3 size={24} style={{ color: '#667eea' }} />
          Dashboard Overview
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Total Users</div>
              <div style={statValueStyle}>{stats?.totalUsers || 0}</div>
              <div style={{ ...statLabelStyle, marginTop: '0.5rem' }}>Active accounts</div>
            </div>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Active Sessions</div>
              <div style={statValueStyle}>{stats?.activeSessions || 0}</div>
              <div style={{ ...statLabelStyle, marginTop: '0.5rem' }}>Online now</div>
            </div>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Total Chats</div>
              <div style={statValueStyle}>{stats?.totalChats || 0}</div>
              <div style={{ ...statLabelStyle, marginTop: '0.5rem' }}>All conversations</div>
            </div>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Subscription Rate</div>
              <div style={statValueStyle}>{stats?.subscriptionRate || 0}%</div>
              <div style={{ ...statLabelStyle, marginTop: '0.5rem' }}>Premium users</div>
            </div>
          </div>
        )}
      </div>

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <AlertCircle size={24} style={{ color: '#fdcb6e' }} />
          Recent Activity
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Event</th>
                <th style={thStyle}>User ID</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Time</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {activity.length > 0 ? (
                activity.map((item, idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>{item.event}</td>
                    <td style={tdStyle}>{item.userId}</td>
                    <td style={tdStyle}>{item.date}</td>
                    <td style={tdStyle}>{item.time}</td>
                    <td style={{ ...tdStyle, color: '#00b894' }}>✓ {item.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ ...tdStyle, textAlign: 'center' }}>No activity found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );

  const renderUsers = () => (
    <>
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <Users size={24} style={{ color: '#667eea' }} />
          User Management
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Join Date</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Plan</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td style={tdStyle}>{user.name}</td>
                    <td style={tdStyle}>{user.email}</td>
                    <td style={tdStyle}>{user.joinDate}</td>
                    <td style={{ ...tdStyle, color: '#00b894' }}>✓ {user.status}</td>
                    <td style={tdStyle}>{user.plan}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ ...tdStyle, textAlign: 'center' }}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );

  const renderSubscriptions = () => (
    <>
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <CreditCard size={24} style={{ color: '#667eea' }} />
          Subscription Management
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <>
            <div style={statsGridStyle}>
              {subscriptions?.plans.map((plan, idx) => (
                <div key={idx} style={statCardStyle}>
                  <div style={statLabelStyle}>{plan.name}</div>
                  <div style={statValueStyle}>{plan.users}</div>
                  <div style={{ ...statLabelStyle, marginTop: '0.5rem' }}>${plan.price}/month</div>
                </div>
              ))}
            </div>

            <div style={{ ...sectionStyle, marginTop: '2rem' }}>
              <div style={sectionTitleStyle}>Recent Subscriptions</div>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>User</th>
                    <th style={thStyle}>Plan</th>
                    <th style={thStyle}>Start Date</th>
                    <th style={thStyle}>Renewal Date</th>
                    <th style={thStyle}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions?.recentSubscriptions?.map((sub, idx) => (
                    <tr key={idx}>
                      <td style={tdStyle}>{sub.user}</td>
                      <td style={tdStyle}>{sub.plan}</td>
                      <td style={tdStyle}>{sub.startDate}</td>
                      <td style={tdStyle}>{sub.renewalDate}</td>
                      <td style={tdStyle}>${sub.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );

  const renderSecurity = () => (
    <>
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <Shield size={24} style={{ color: '#667eea' }} />
          Security Settings
        </div>
        <div style={{...statCardStyle, marginBottom: '1rem'}}>
          <div style={sectionTitleStyle}>Two-Factor Authentication</div>
          <div style={statLabelStyle}>Enable 2FA for all admin accounts</div>
          <button
            style={{
              background: '#00b894',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              marginTop: '1rem',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Configure
          </button>
        </div>

        <div style={{...statCardStyle, marginBottom: '1rem'}}>
          <div style={sectionTitleStyle}>API Keys</div>
          <div style={statLabelStyle}>Manage API access and keys</div>
          <button
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              marginTop: '1rem',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            View Keys
          </button>
        </div>

        <div style={{...statCardStyle}}>
          <div style={sectionTitleStyle}>Audit Logs</div>
          <div style={statLabelStyle}>View system activity and changes</div>
          <button
            style={{
              background: '#a29bfe',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              marginTop: '1rem',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            View Logs
          </button>
        </div>
      </div>
    </>
  );

  const renderSettings = () => (
    <>
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <Settings size={24} style={{ color: '#667eea' }} />
          Admin Settings
        </div>
        <div style={{...statCardStyle, marginBottom: '1rem'}}>
          <div style={{...sectionTitleStyle, marginBottom: '1rem'}}>General Settings</div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: isDarkMode ? '#ffffff' : '#2d3436' }}>
              Application Name
            </label>
            <input
              type="text"
              defaultValue="Health Mate"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e9ecef',
                background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                color: isDarkMode ? '#ffffff' : '#2d3436',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: isDarkMode ? '#ffffff' : '#2d3436' }}>
              Support Email
            </label>
            <input
              type="email"
              defaultValue="support@healthmate.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e9ecef',
                background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                color: isDarkMode ? '#ffffff' : '#2d3436',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Save Settings
          </button>
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'subscriptions':
        return renderSubscriptions();
      case 'security':
        return renderSecurity();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div style={panelStyle} onClick={onClose}>
      <div style={containerStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>Admin Dashboard</h2>
          <button
            style={closeButtonStyle}
            onClick={onClose}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {/* Sidebar */}
          <div style={sidebarStyle}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  style={tabButtonStyle(activeTab === tab.id)}
                  onClick={() => setActiveTab(tab.id)}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.background = isDarkMode
                        ? 'rgba(255,255,255,0.05)'
                        : '#f0f0f0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Main Content */}
          <div style={mainContentStyle}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
