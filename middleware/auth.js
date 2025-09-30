const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token is required' 
      });
    }

    // Verify token with Supabase
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      return res.status(403).json({ 
        error: 'Invalid or expired token' 
      });
    }

    // Add user info to request object
    req.user = {
      id: data.user.id,
      email: data.user.email,
      access_token: token
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ 
      error: 'Token verification failed' 
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const { data, error } = await supabaseAdmin.auth.getUser(token);
      
      if (!error && data.user) {
        req.user = {
          id: data.user.id,
          email: data.user.email,
          access_token: token
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};
