// Sample Course Data for SkillUp
const coursesData = [
    {
        id: 1,
        title: "Full Stack Web Development Bootcamp",
        category: "Development",
        instructor: "Sarah Johnson",
        rating: 4.8,
        reviews: 1247,
        duration: "12 weeks",
        price: 2999,
        originalPrice: 5999,
        image: "images/courses/web-dev.jpg",
        level: "Beginner to Advanced"
    },
    {
        id: 2,
        title: "Data Science & Machine Learning",
        category: "Data Science",
        instructor: "Dr. Michael Chen",
        rating: 4.7,
        reviews: 892,
        duration: "16 weeks",
        price: 3999,
        originalPrice: 7999,
        image: "images/courses/data-science.jpg",
        level: "Intermediate"
    },
    {
        id: 3,
        title: "UI/UX Design Masterclass",
        category: "Design",
        instructor: "Emily Rodriguez",
        rating: 4.9,
        reviews: 567,
        duration: "8 weeks",
        price: 2499,
        originalPrice: 4999,
        image: "images/courses/ui-ux.jpg",
        level: "All Levels"
    },
    {
        id: 4,
        title: "Digital Marketing Certification",
        category: "Marketing",
        instructor: "Alex Thompson",
        rating: 4.6,
        reviews: 734,
        duration: "10 weeks",
        price: 1999,
        originalPrice: 3999,
        image: "images/courses/digital-marketing.jpg",
        level: "Beginner"
    },
    {
        id: 5,
        title: "Mobile App Development with React Native",
        category: "Development",
        instructor: "James Wilson",
        rating: 4.5,
        reviews: 421,
        duration: "14 weeks",
        price: 3499,
        originalPrice: 6999,
        image: "images/courses/mobile-dev.jpg",
        level: "Intermediate"
    },
    {
        id: 6,
        title: "Python for Beginners",
        category: "Programming",
        instructor: "Dr. Lisa Wang",
        rating: 4.8,
        reviews: 956,
        duration: "6 weeks",
        price: 1499,
        originalPrice: 2999,
        image: "images/courses/python.jpg",
        level: "Beginner"
    }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    loadPopularCourses();
    setupEventListeners();
    initializeAnimations();
});

// Load Popular Courses
function loadPopularCourses() {
    const coursesGrid = document.getElementById('popularCourses');
    if (!coursesGrid) return;

    coursesGrid.innerHTML = coursesData.map(course => `
        <div class="course-card" data-course-id="${course.id}">
            <img src="${course.image}" alt="${course.title}" class="course-image" onerror="this.src='https://via.placeholder.com/400x200/7c3aed/ffffff?text=${encodeURIComponent(course.category)}'">
            <div class="course-content">
                <span class="course-category">${course.category}</span>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-instructor">
                    <i class="fas fa-user"></i>
                    By ${course.instructor}
                </p>
                <div class="course-meta">
                    <div class="course-rating">
                        <div class="rating-stars">
                            ${generateStarRating(course.rating)}
                        </div>
                        <span class="rating-value">${course.rating}</span>
                        <span class="rating-count">(${course.reviews})</span>
                    </div>
                    <div class="course-duration">
                        <i class="far fa-clock"></i>
                        <span>${course.duration}</span>
                    </div>
                </div>
                <div class="course-footer">
                    <div class="course-pricing">
                        <span class="course-price">₹${course.price}</span>
                        <span class="original-price">₹${course.originalPrice}</span>
                        <span class="discount-badge">${calculateDiscount(course.originalPrice, course.price)}% OFF</span>
                    </div>
                    <button class="btn-enroll" onclick="enrollCourse(${course.id})">Enroll Now</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Generate Star Rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let stars = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Calculate Discount Percentage
function calculateDiscount(original, discounted) {
    return Math.round(((original - discounted) / original) * 100);
}

// Setup Event Listeners
function setupEventListeners() {
    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Course card clicks
    document.addEventListener('click', function(e) {
        const courseCard = e.target.closest('.course-card');
        if (courseCard) {
            const courseId = courseCard.dataset.courseId;
            window.location.href = `course-detail.html?id=${courseId}`;
        }
    });

    // Auth buttons
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            window.location.href = 'signup.html';
        });
    }

    // CTA buttons
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    ctaButtons.forEach(btn => {
        if (btn.textContent.includes('Get Started') || btn.textContent.includes('Explore Courses')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (btn.textContent.includes('Get Started')) {
                    window.location.href = 'signup.html';
                } else {
                    window.location.href = 'courses.html';
                }
            });
        }
    });
}

// Initialize Animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .course-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Enroll Course Function
function enrollCourse(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (course) {
        // Check if user is logged in
        const isLoggedIn = checkUserLogin();
        
        if (isLoggedIn) {
            // Proceed to enrollment
            window.location.href = `checkout.html?courseId=${courseId}`;
        } else {
            // Redirect to login with course info
            window.location.href = `login.html?redirect=checkout&courseId=${courseId}`;
        }
    }
}

// Check User Login Status
function checkUserLogin() {
    // Implement actual login check
    return localStorage.getItem('userToken') !== null;
}

// Newsletter Subscription
function setupNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                // Simulate newsletter subscription
                alert('Thank you for subscribing to our newsletter!');
                this.reset();
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadPopularCourses();
    setupEventListeners();
    initializeAnimations();
    setupNewsletter();
});