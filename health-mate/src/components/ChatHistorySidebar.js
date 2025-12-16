import { Trash2, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';

export default function ChatHistorySidebar({ 
  isDarkMode, 
  isOpen, 
  chatHistory, 
  currentChatId, 
  onSelectChat, 
  onDeleteChat, 
  onNewChat 
}) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Filter chats based on search
  const filteredChats = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else if (today.getFullYear() === date.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div style={{
      width: '260px',
      background: isDarkMode ? 'rgba(15, 15, 30, 0.95)' : '#fff',
      borderRight: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : '#e9ecef'}`,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: isDarkMode ? '4px 0 15px rgba(0,0,0,0.3)' : '0 0 15px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : '#e9ecef'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ 
            margin: 0, 
            color: isDarkMode ? '#fff' : '#2d3436', 
            fontSize: '0.95rem',
            fontWeight: '600'
          }}>
            Chat History
          </h3>
          <button
            onClick={onNewChat}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              color: '#fff',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              transition: 'all 0.3s',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            title="New Chat">
            <Plus size={18} />
          </button>
        </div>

        {/* Search Box */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={16} style={{
            position: 'absolute',
            left: '0.75rem',
            color: isDarkMode ? 'rgba(255,255,255,0.4)' : '#999'
          }} />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem 0.6rem 2.25rem',
              background: isDarkMode ? 'rgba(255,255,255,0.08)' : '#f5f5f5',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : '#e9ecef'}`,
              borderRadius: '0.5rem',
              color: isDarkMode ? '#fff' : '#2d3436',
              fontSize: '0.85rem',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.12)' : '#fff';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.1)' : '#e9ecef';
              e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.08)' : '#f5f5f5';
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.5rem',
                background: 'none',
                border: 'none',
                color: isDarkMode ? 'rgba(255,255,255,0.5)' : '#999',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Chat List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem'
      }}>
        {filteredChats.length === 0 ? (
          <div style={{
            padding: '2rem 1rem',
            color: isDarkMode ? 'rgba(255,255,255,0.5)' : '#999',
            textAlign: 'center',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100px'
          }}>
            <p style={{ margin: 0 }}>
              {searchQuery ? '❌ No chats found' : '📝 No chats yet\nStart a conversation!'}
            </p>
          </div>
        ) : (
          filteredChats.map((chat, index) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              style={{
                padding: '0.75rem 0.75rem',
                background: currentChatId === chat.id 
                  ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.2) 100%)' 
                  : 'transparent',
                border: `1px solid ${currentChatId === chat.id 
                  ? 'rgba(102, 126, 234, 0.5)' 
                  : isDarkMode 
                  ? 'rgba(255,255,255,0.08)' 
                  : '#e9ecef'}`,
                borderRadius: '0.625rem',
                color: isDarkMode ? '#fff' : '#2d3436',
                textAlign: 'left',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                animation: `slideIn 0.3s ease ${index * 0.05}s forwards`,
                opacity: 0,
                animationFillMode: 'forwards'
              }}
              onMouseEnter={(e) => {
                if (currentChatId !== chat.id) {
                  e.currentTarget.style.background = isDarkMode 
                    ? 'rgba(255,255,255,0.05)' 
                    : '#f9f9f9';
                  e.currentTarget.style.borderColor = isDarkMode 
                    ? 'rgba(255,255,255,0.15)' 
                    : '#ddd';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentChatId !== chat.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = isDarkMode 
                    ? 'rgba(255,255,255,0.08)' 
                    : '#e9ecef';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}>
              <div style={{ 
                overflow: 'hidden', 
                flex: 1,
                minWidth: 0
              }}>
                <div style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: '500',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: '0.25rem'
                }}>
                  {chat.title}
                </div>
                <div style={{ 
                  fontSize: '0.7rem', 
                  color: isDarkMode ? 'rgba(255,255,255,0.4)' : '#aaa',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%'
                }}>
                  {formatDate(chat.date)}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Delete this chat?')) {
                    onDeleteChat(chat.id);
                  }
                }}
                style={{
                  background: '#ff6b6b',
                  border: 'none',
                  color: '#fff',
                  padding: '0.35rem',
                  borderRadius: '0.3rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  opacity: 0.7,
                  marginLeft: '0.5rem',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                title="Delete chat">
                <Trash2 size={13} />
              </button>
            </button>
          ))
        )}
      </div>

      {/* Add CSS Animation */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      {/* Footer */}
      <div style={{
        padding: '0.75rem',
        borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : '#e9ecef'}`,
        fontSize: '0.7rem',
        color: isDarkMode ? 'rgba(255,255,255,0.3)' : '#999',
        textAlign: 'center'
      }}>
        Mental Health Assistant
      </div>
    </div>
  );
}
