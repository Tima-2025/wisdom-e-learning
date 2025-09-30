const validateEmail = (req, res, next) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ 
      error: 'Email is required' 
    });
  }

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Please provide a valid email address' 
    });
  }

  next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ 
      error: 'Password is required' 
    });
  }

  // Password strength validation
  if (password.length < 8) {
    return res.status(400).json({ 
      error: 'Password must be at least 8 characters long' 
    });
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ 
      error: 'Password must contain at least one uppercase letter' 
    });
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return res.status(400).json({ 
      error: 'Password must contain at least one lowercase letter' 
    });
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return res.status(400).json({ 
      error: 'Password must contain at least one number' 
    });
  }

  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return res.status(400).json({ 
      error: 'Password must contain at least one special character' 
    });
  }

  next();
};

const validateFullName = (req, res, next) => {
  const { fullName } = req.body;
  
  if (!fullName) {
    return res.status(400).json({ 
      error: 'Full name is required' 
    });
  }

  if (fullName.trim().length < 2) {
    return res.status(400).json({ 
      error: 'Full name must be at least 2 characters long' 
    });
  }

  if (fullName.trim().length > 50) {
    return res.status(400).json({ 
      error: 'Full name must be less than 50 characters' 
    });
  }

  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateFullName
};
