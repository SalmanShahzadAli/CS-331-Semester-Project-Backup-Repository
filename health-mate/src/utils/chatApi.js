const API_BASE = 'http://localhost:5000/api';

export const chatApi = {
  // Save a new chat
  saveChat: async (botType, title, messages) => {
    try {
      const response = await fetch(`${API_BASE}/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          botType,
          title,
          messages,
          createdAt: new Date()
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Chat saved:', data);
      return data;
    } catch (error) {
      console.error('Error in saveChat:', error);
      throw error;
    }
  },

  // Get all chats for user
  getChats: async (botType) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Loading chats with token:', token ? 'YES' : 'NO');
      
      const response = await fetch(`${API_BASE}/chats?botType=${botType}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Chats loaded:', data);
      return data;
    } catch (error) {
      console.error('Error in getChats:', error);
      throw error;
    }
  },

  // Get specific chat
  getChat: async (chatId) => {
    try {
      const response = await fetch(`${API_BASE}/chats/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Chat loaded:', data);
      return data;
    } catch (error) {
      console.error('Error in getChat:', error);
      throw error;
    }
  },

  // Delete chat
  deleteChat: async (chatId) => {
    try {
      const response = await fetch(`${API_BASE}/chats/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Chat deleted:', data);
      return data;
    } catch (error) {
      console.error('Error in deleteChat:', error);
      throw error;
    }
  },

  // Update chat title
  updateChatTitle: async (chatId, newTitle) => {
    try {
      const response = await fetch(`${API_BASE}/chats/${chatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title: newTitle })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Chat title updated:', data);
      return data;
    } catch (error) {
      console.error('Error in updateChatTitle:', error);
      throw error;
    }
  }
};