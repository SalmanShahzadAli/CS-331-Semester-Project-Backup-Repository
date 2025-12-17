const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // Replace with your password
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

// Secret key for JWT
const JWT_SECRET = 'your_secret_key_here_change_this'; // Change this!
// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database!');
    release();
  }
});

// REGISTER Route
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: 'User registered successfully!',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// LOGIN Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ============================================
// CHAT HISTORY ROUTES
// ============================================

// POST - Save a new chat
app.post('/api/chats', authenticateToken, async (req, res) => {
  try {
    const { botType, title, messages } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      'INSERT INTO chats (user_id, bot_type, title, messages) VALUES ($1, $2, $3, $4) RETURNING id, title, created_at as date',
      [userId, botType, title, JSON.stringify(messages)]
    );

    res.json({ id: result.rows[0].id, success: true });
  } catch (error) {
    console.error('Error saving chat:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET - Get all chats for user
app.get('/api/chats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { botType } = req.query;

    let query = 'SELECT id, title, created_at as date FROM chats WHERE user_id = $1';
    let params = [userId];

    if (botType) {
      query += ' AND bot_type = $2';
      params.push(botType);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    res.json({ chats: result.rows });
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET - Get specific chat with messages
app.get('/api/chats/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      'SELECT id, title, messages, created_at as date FROM chats WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const chat = result.rows[0];
    res.json({
      id: chat.id,
      title: chat.title,
      messages: typeof chat.messages === 'string' ? JSON.parse(chat.messages) : chat.messages,
      date: chat.date
    });
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete a chat
app.delete('/api/chats/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      'DELETE FROM chats WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT - Update chat title
app.put('/api/chats/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      'UPDATE chats SET title = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING id, title',
      [title, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json({ success: true, chat: result.rows[0] });
  } catch (error) {
    console.error('Error updating chat:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ADMIN ENDPOINTS
// ============================================

// GET - Admin Overview Stats
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    // Get total users
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(usersResult.rows[0].count);

    // Get active sessions (users with recent chats)
    const activeResult = await pool.query(
      "SELECT COUNT(DISTINCT user_id) as count FROM chats WHERE created_at > NOW() - INTERVAL '24 hours'"
    );
    const activeSessions = parseInt(activeResult.rows[0].count);

    // Get total chats
    const chatsResult = await pool.query('SELECT COUNT(*) as count FROM chats');
    const totalChats = parseInt(chatsResult.rows[0].count);

    res.json({
      totalUsers,
      activeSessions,
      totalChats,
      subscriptionRate: 68,
      totalRevenue: 24500,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET - All Users (Admin)
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users ORDER BY created_at DESC"
    );
    
    const users = result.rows.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      joinDate: new Date(user.created_at).toLocaleDateString(),
      status: 'Active',
      plan: 'Premium'
    }));

    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET - Recent Activity
app.get('/api/admin/activity', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, created_at, bot_type FROM chats 
       ORDER BY created_at DESC LIMIT 10`
    );

    const activity = result.rows.map(chat => ({
      id: chat.id,
      event: `Chat with ${chat.bot_type.replace('-', ' ')}`,
      userId: chat.user_id,
      date: new Date(chat.created_at).toLocaleDateString(),
      time: new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Active'
    }));

    res.json({ activity });
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET - Subscription Data
app.get('/api/admin/subscriptions', authenticateToken, async (req, res) => {
  try {
    // Get subscription plan counts from database
    const planCountResult = await pool.query(
      "SELECT plan_type, COUNT(*) as count FROM subscriptions GROUP BY plan_type"
    );

    const planCounts = {
      'Free Plan': 0,
      'Basic Plan': 0,
      'Premium Plan': 0
    };

    planCountResult.rows.forEach(row => {
      planCounts[row.plan_type] = parseInt(row.count);
    });

    // Get recent subscriptions
    const recentResult = await pool.query(
      `SELECT s.id, u.name, s.plan_type, s.start_date, s.renewal_date, s.amount 
       FROM subscriptions s
       JOIN users u ON s.user_id = u.id
       ORDER BY s.created_at DESC LIMIT 10`
    );

    const recentSubscriptions = recentResult.rows.map(row => ({
      user: row.name,
      plan: row.plan_type,
      startDate: new Date(row.start_date).toLocaleDateString(),
      renewalDate: new Date(row.renewal_date).toLocaleDateString(),
      amount: parseFloat(row.amount)
    }));

    res.json({
      plans: [
        {
          name: 'Free Plan',
          users: planCounts['Free Plan'],
          price: 0
        },
        {
          name: 'Basic Plan',
          users: planCounts['Basic Plan'],
          price: 9.99
        },
        {
          name: 'Premium Plan',
          users: planCounts['Premium Plan'],
          price: 19.99
        }
      ],
      recentSubscriptions
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// SUBSCRIPTION ENDPOINTS
// ============================================

// POST - Create/Update Subscription
app.post('/api/subscriptions', authenticateToken, async (req, res) => {
  try {
    const { planType, amount, cardName, cardNumber, expiryDate, cvv } = req.body;
    const userId = req.user.userId;

    // Ensure amount is a valid number
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return res.status(400).json({ error: 'Invalid amount format' });
    }

    // Calculate renewal date (30 days from now)
    const startDate = new Date();
    const renewalDate = new Date(startDate);
    renewalDate.setDate(renewalDate.getDate() + 30);

    // Check if user already has a subscription
    const existingResult = await pool.query(
      'SELECT id FROM subscriptions WHERE user_id = $1',
      [userId]
    );

    let result;
    if (existingResult.rows.length > 0) {
      // Update existing subscription
      result = await pool.query(
        'UPDATE subscriptions SET plan_type = $1, amount = $2, renewal_date = $3, updated_at = CURRENT_TIMESTAMP WHERE user_id = $4 RETURNING *',
        [planType, parsedAmount, renewalDate, userId]
      );
    } else {
      // Create new subscription
      result = await pool.query(
        'INSERT INTO subscriptions (user_id, plan_type, amount, renewal_date, payment_status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [userId, planType, parsedAmount, renewalDate, 'completed']
      );
    }

    console.log('Subscription created/updated:', result.rows[0]);
    res.json({
      success: true,
      message: 'Payment successful!',
      subscription: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET - User's Current Subscription
app.get('/api/subscriptions/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({ subscription: null });
    }

    res.json({ subscription: result.rows[0] });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
