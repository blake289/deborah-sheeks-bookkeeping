/* ============================================
   BOOKKEEPING STRATEGIES LLC - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functionality
  initMobileMenu();
  initNavScroll();
  initScrollAnimations();
  initSmoothScroll();
});

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const body = document.body;
  const mobileLinks = document.querySelectorAll('.mobile-menu-link, .mobile-submenu-link');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    body.classList.toggle('menu-open');
  });

  // Close menu when clicking a link
  mobileLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      body.classList.remove('menu-open');
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      body.classList.remove('menu-open');
    }
  });
}

/* ============================================
   NAV SCROLL SHADOW
   ============================================ */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let lastScroll = 0;
  const scrollThreshold = 50;

  function handleScroll() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > scrollThreshold) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Check initial state
}

/* ============================================
   SCROLL-TRIGGERED ANIMATIONS
   ============================================ */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Only animate once - unobserve after triggering
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(function(el) {
    observer.observe(el);
  });
}

/* ============================================
   SMOOTH SCROLLING FOR ANCHOR LINKS
   ============================================ */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') return;

      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const navHeight = document.querySelector('.nav')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ============================================
   FORM VALIDATION (for contact page)
   ============================================ */
function initFormValidation() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form fields
    const email = form.querySelector('input[type="email"]');
    const phone = form.querySelector('input[type="tel"]');
    const business = form.querySelector('input[name="business"]');
    
    let isValid = true;

    // Basic validation
    if (email && !isValidEmail(email.value)) {
      showError(email, 'Please enter a valid email address');
      isValid = false;
    }

    if (phone && !isValidPhone(phone.value)) {
      showError(phone, 'Please enter a valid phone number');
      isValid = false;
    }

    if (business && business.value.trim() === '') {
      showError(business, 'Please enter your type of business');
      isValid = false;
    }

    if (isValid) {
      // Form is valid - you would typically submit to a server here
      showSuccess(form);
    }
  });

  // Clear errors on input
  form.querySelectorAll('input, textarea').forEach(function(input) {
    input.addEventListener('input', function() {
      clearError(this);
    });
  });
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isValidPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10;
}

function showError(input, message) {
  const formGroup = input.closest('.form-group');
  if (!formGroup) return;
  
  // Remove existing error
  clearError(input);
  
  // Add error styling
  input.style.borderColor = 'var(--color-error)';
  
  // Add error message
  const errorEl = document.createElement('span');
  errorEl.className = 'form-error';
  errorEl.textContent = message;
  errorEl.style.cssText = 'color: var(--color-error); font-size: 13px; margin-top: 4px; display: block;';
  formGroup.appendChild(errorEl);
}

function clearError(input) {
  const formGroup = input.closest('.form-group');
  if (!formGroup) return;
  
  input.style.borderColor = '';
  
  const existingError = formGroup.querySelector('.form-error');
  if (existingError) {
    existingError.remove();
  }
}

function showSuccess(form) {
  // Show success message
  const successHTML = `
    <div class="form-success" style="text-align: center; padding: 40px;">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2" style="margin: 0 auto 16px;">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
      <h3 style="color: var(--color-navy); margin-bottom: 8px;">Message Sent!</h3>
      <p style="color: var(--color-medium-gray);">Thank you for contacting us. We'll get back to you soon.</p>
    </div>
  `;
  
  form.innerHTML = successHTML;
}

// Initialize form validation when DOM is ready
document.addEventListener('DOMContentLoaded', initFormValidation);
