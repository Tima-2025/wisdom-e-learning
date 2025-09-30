// API Configuration
const API_BASE_URL = window.location.origin + '/api';

// Utility Functions
const showError = (elementId, message) => {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
};

const hideError = (elementId) => {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.classList.remove('show');
    }
};

const showSuccess = (message) => {
    // Create success message element if it doesn't exist
    let successElement = document.querySelector('.success-message');
    if (!successElement) {
        successElement = document.createElement('div');
        successElement.className = 'success-message';
        document.querySelector('.auth-form').prepend(successElement);
    }
    
    successElement.textContent = message;
    successElement.classList.add('show');
    
    // Hide after 5 seconds
    setTimeout(() => {
        successElement.classList.remove('show');
    }, 5000);
};

const setLoading = (button, isLoading) => {
    const btnText = button.querySelector('.btn-text');
    const btnSpinner = button.querySelector('.btn-spinner');
    
    if (isLoading) {
        button.disabled = true;
        btnText.style.display = 'none';
        btnSpinner.style.display = 'block';
    } else {
        button.disabled = false;
        btnText.style.display = 'block';
        btnSpinner.style.display = 'none';
    }
};

// Password Strength Checker
const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = [];
    
    if (password.length >= 8) score++;
    else feedback.push('At least 8 characters');
    
    if (/[a-z]/.test(password)) score++;
    else feedback.push('Lowercase letter');
    
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Uppercase letter');
    
    if (/\d/.test(password)) score++;
    else feedback.push('Number');
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    else feedback.push('Special character');
    
    return { score, feedback };
};

const updatePasswordStrength = (password) => {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthFill || !strengthText) return;
    
    const { score, feedback } = checkPasswordStrength(password);
    
    strengthFill.className = 'strength-fill';
    strengthText.textContent = 'Password strength';
    
    if (password.length === 0) {
        strengthFill.style.width = '0%';
        strengthText.textContent = 'Enter a password';
    } else if (score <= 2) {
        strengthFill.classList.add('weak');
        strengthText.textContent = 'Weak - ' + feedback.join(', ');
    } else if (score === 3) {
        strengthFill.classList.add('fair');
        strengthText.textContent = 'Fair - ' + feedback.join(', ');
    } else if (score === 4) {
        strengthFill.classList.add('good');
        strengthText.textContent = 'Good - ' + feedback.join(', ');
    } else {
        strengthFill.classList.add('strong');
        strengthText.textContent = 'Strong password';
    }
};

// Form Validation
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    const { score } = checkPasswordStrength(password);
    return score >= 3; // Require at least "fair" strength
};

const validateFullName = (name) => {
    return name.trim().length >= 2 && name.trim().length <= 50;
};

// Password Toggle Functionality
const setupPasswordToggle = (toggleId, inputId) => {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    
    if (toggle && input) {
        toggle.addEventListener('click', () => {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            const icon = toggle.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
};

// Authentication Functions
const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};

const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};

const logoutUser = async () => {
    try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });
        }
        
        // Clear local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        // Redirect to home page
        window.location.href = '/';
    } catch (error) {
        console.error('Logout error:', error);
        // Still clear local storage and redirect even if logout fails
        localStorage.clear();
        window.location.href = '/';
    }
};

const getCurrentUser = async () => {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) return null;
        
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Invalid token');
        }
        
        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error('Get user error:', error);
        return null;
    }
};

// Session Management
const saveSession = (sessionData) => {
    localStorage.setItem('access_token', sessionData.session.access_token);
    localStorage.setItem('refresh_token', sessionData.session.refresh_token);
    localStorage.setItem('user', JSON.stringify(sessionData.user));
};

const isAuthenticated = () => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    return !!(token && user);
};

const checkAuthStatus = () => {
    if (isAuthenticated()) {
        const user = JSON.parse(localStorage.getItem('user'));
        updateUserInterface(user);
    }
};

const updateUserInterface = (user) => {
    // Update user name in dashboard
    const userNameElements = document.querySelectorAll('#userName, #dashboardUserName');
    userNameElements.forEach(element => {
        if (element) {
            element.textContent = user.full_name || user.email;
        }
    });
};

// Form Handlers
const handleRegister = async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const userData = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword')
    };
    
    // Clear previous errors
    ['fullNameError', 'emailError', 'passwordError', 'confirmPasswordError', 'termsError'].forEach(hideError);
    
    // Validate form
    let hasErrors = false;
    
    if (!validateFullName(userData.fullName)) {
        showError('fullNameError', 'Full name must be 2-50 characters long');
        hasErrors = true;
    }
    
    if (!validateEmail(userData.email)) {
        showError('emailError', 'Please enter a valid email address');
        hasErrors = true;
    }
    
    if (!validatePassword(userData.password)) {
        showError('passwordError', 'Password must be at least 8 characters with uppercase, lowercase, number, and special character');
        hasErrors = true;
    }
    
    if (userData.password !== userData.confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        hasErrors = true;
    }
    
    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms.checked) {
        showError('termsError', 'You must agree to the terms and conditions');
        hasErrors = true;
    }
    
    if (hasErrors) return;
    
    const registerBtn = document.getElementById('registerBtn');
    setLoading(registerBtn, true);
    
    try {
        const result = await registerUser({
            fullName: userData.fullName,
            email: userData.email,
            password: userData.password
        });
        
        showSuccess('Registration successful! Please log in with your credentials.');
        form.reset();
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
        
    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.message.includes('email')) {
            showError('emailError', error.message);
        } else if (error.message.includes('password')) {
            showError('passwordError', error.message);
        } else {
            showError('emailError', error.message);
        }
    } finally {
        setLoading(registerBtn, false);
    }
};

const handleLogin = async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const credentials = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    // Clear previous errors
    ['emailError', 'passwordError'].forEach(hideError);
    
    // Validate form
    let hasErrors = false;
    
    if (!validateEmail(credentials.email)) {
        showError('emailError', 'Please enter a valid email address');
        hasErrors = true;
    }
    
    if (!credentials.password) {
        showError('passwordError', 'Password is required');
        hasErrors = true;
    }
    
    if (hasErrors) return;
    
    const loginBtn = document.getElementById('loginBtn');
    setLoading(loginBtn, true);
    
    try {
        const result = await loginUser(credentials);
        
        // Save session data
        saveSession(result);
        
        showSuccess('Login successful! Redirecting to dashboard...');
        
        // Redirect to dashboard after 1 second
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        
        if (error.message.includes('email') || error.message.includes('password')) {
            showError('emailError', 'Invalid email or password');
            showError('passwordError', 'Invalid email or password');
        } else {
            showError('emailError', error.message);
        }
    } finally {
        setLoading(loginBtn, false);
    }
};

// User Menu Functionality
const setupUserMenu = () => {
    const userBtn = document.getElementById('userBtn');
    const userDropdown = document.getElementById('userDropdown');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (userBtn && userDropdown) {
        userBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await logoutUser();
        });
    }
};

// Supabase OAuth
let supabaseClient = null;

const ensureSupabase = async () => {
    if (supabaseClient) return supabaseClient;
    try {
        const res = await fetch('/api/config/public');
        const cfg = await res.json();
        if (!cfg.supabaseUrl || !cfg.supabaseAnonKey) return null;
        supabaseClient = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
            auth: {
                persistSession: false
            }
        });
        return supabaseClient;
    } catch (e) {
        return null;
    }
};

const oauthSignIn = async (provider) => {
    const client = await ensureSupabase();
    if (!client) {
        alert('Supabase not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY.');
        return;
    }

    const redirectTo = window.location.origin + '/login';
    const { data, error } = await client.auth.signInWithOAuth({
        provider,
        options: { redirectTo }
    });
    if (error) {
        console.error('OAuth error:', error);
        alert(error.message || 'OAuth failed');
    }
};

// Initialize Application
const init = () => {
    // Setup password toggles
    setupPasswordToggle('passwordToggle', 'password');
    setupPasswordToggle('confirmPasswordToggle', 'confirmPassword');
    
    // Setup user menu
    setupUserMenu();
    
    // Check authentication status
    checkAuthStatus();
    
    // Setup form handlers
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        
        // Password strength indicator
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                updatePasswordStrength(e.target.value);
            });
        }
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Social buttons
    const googleBtns = document.querySelectorAll('.btn-google');
    googleBtns.forEach(btn => btn.addEventListener('click', () => oauthSignIn('google')));
    const githubBtns = document.querySelectorAll('.btn-github');
    githubBtns.forEach(btn => btn.addEventListener('click', () => oauthSignIn('github')));
    
    // Protect dashboard route
    if (window.location.pathname === '/dashboard' && !isAuthenticated()) {
        window.location.href = '/login';
    }
    
    // Redirect authenticated users away from auth pages
    if ((window.location.pathname === '/login' || window.location.pathname === '/register') && isAuthenticated()) {
        window.location.href = '/dashboard';
    }
    
    // Add fade-in animation to main content
    const main = document.querySelector('.main');
    if (main) {
        main.classList.add('fade-in');
    }
};

// Auto-refresh token
const refreshToken = async () => {
    try {
        const refreshTokenValue = localStorage.getItem('refresh_token');
        if (!refreshTokenValue) return false;
        
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshTokenValue }),
        });
        
        if (!response.ok) {
            throw new Error('Token refresh failed');
        }
        
        const data = await response.json();
        localStorage.setItem('access_token', data.session.access_token);
        localStorage.setItem('refresh_token', data.session.refresh_token);
        
        return true;
    } catch (error) {
        console.error('Token refresh error:', error);
        logoutUser();
        return false;
    }
};

// Setup token refresh interval
const setupTokenRefresh = () => {
    // Refresh token every 50 minutes (tokens typically expire in 1 hour)
    setInterval(async () => {
        if (isAuthenticated()) {
            await refreshToken();
        }
    }, 50 * 60 * 1000);
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    setupTokenRefresh();
});

// Handle page visibility change to refresh token when user returns
document.addEventListener('visibilitychange', async () => {
    if (!document.hidden && isAuthenticated()) {
        await refreshToken();
    }
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        validatePassword,
        validateFullName,
        checkPasswordStrength
    };
}
