const API_BASE = 'http://localhost:5000/api';

export const adminApi = {
  // Get admin overview stats
  getStats: async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Stats loaded:', data);
      return data;
    } catch (error) {
      console.error('Error in getStats:', error);
      throw error;
    }
  },

  // Get all users
  getUsers: async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Users loaded:', data);
      return data.users || [];
    } catch (error) {
      console.error('Error in getUsers:', error);
      throw error;
    }
  },

  // Get recent activity
  getActivity: async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/activity`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Activity loaded:', data);
      return data.activity || [];
    } catch (error) {
      console.error('Error in getActivity:', error);
      throw error;
    }
  },

  // Get subscription data
  getSubscriptions: async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/subscriptions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Subscriptions loaded:', data);
      return data;
    } catch (error) {
      console.error('Error in getSubscriptions:', error);
      throw error;
    }
  }
};

// Subscription API
export const subscriptionApi = {
  // Create/Update subscription
  createSubscription: async (planType, amount, cardName, cardNumber, expiryDate, cvv) => {
    try {
      const response = await fetch(`${API_BASE}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          planType,
          amount,
          cardName,
          cardNumber,
          expiryDate,
          cvv
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Subscription created:', data);
      return data;
    } catch (error) {
      console.error('Error in createSubscription:', error);
      throw error;
    }
  },

  // Get user's current subscription
  getMySubscription: async () => {
    try {
      const response = await fetch(`${API_BASE}/subscriptions/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('My subscription loaded:', data);
      return data.subscription;
    } catch (error) {
      console.error('Error in getMySubscription:', error);
      throw error;
    }
  }
};
