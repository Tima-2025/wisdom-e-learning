const express = require('express');
const { supabaseAdmin } = require('../config/supabase');
const { validateEmail, validatePassword, validateFullName } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Register endpoint
router.post('/register', validateEmail, validatePassword, validateFullName, async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Create new user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for demo purposes
      user_metadata: {
        full_name: fullName
      }
    });

    if (error) {
      console.error('Registration error:', error);
      // Normalize duplicate user error
      const message = (error.message || '').toLowerCase();
      if (message.includes('already') && message.includes('registered')) {
        return res.status(400).json({ error: 'User already exists with this email address' });
      }
      return res.status(400).json({ error: error.message || 'Registration failed' });
    }

    // Return success response (without sensitive data)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error during registration' 
    });
  }
});

// Login endpoint
router.post('/login', validateEmail, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authenticate user
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Login error:', error);
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Return success response with session data
    res.json({
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error during login' 
    });
  }
});

// Logout endpoint
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (refresh_token) {
      const { error } = await supabaseAdmin.auth.signOut(refresh_token);
      if (error) {
        console.error('Logout error:', error);
      }
    }

    res.json({ message: 'Logout successful' });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      error: 'Internal server error during logout' 
    });
  }
});

// Get current user endpoint
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(req.user.access_token);

    if (error) {
      return res.status(401).json({ 
        error: 'Invalid or expired token' 
      });
    }

    res.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name,
        created_at: data.user.created_at
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ 
        error: 'Refresh token is required' 
      });
    }

    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token
    });

    if (error) {
      return res.status(401).json({ 
        error: 'Invalid refresh token' 
      });
    }

    res.json({
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

module.exports = router;
