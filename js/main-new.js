/**
 * Main JavaScript for Pascal Beaudenon Photography Portfolio
 * Handles general site interactions and enhancements
 */

class PortfolioWebsite {
  constructor() {
    this.init();
  }

  init() {
    this.setupPerformanceOptimizations();
    this.setupScrollAnimations();
    this.setupParallaxEffects();
    this.setupImageOptimization();
    this.setupProgressiveEnhancement();
  }

  /**
   * Performance optimizations
   */
  setupPerformanceOptimizations() {
    // Preload critical resources
    this.preloadCriticalImages();
    
    // Setup resource hints
    this.setupResourceHints();
    
    // Defer non-critical scripts
    this.deferNonCriticalScripts();
  }

  preloadCriticalImages() {
    const criticalImages = [
      'images/home_pic.jpg',
      'images/book_new.jpg'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  setupResourceHints() {
    // DNS prefetch for external resources
    const dnsPrefetches = [
      'fonts.googleapis.com',
      'fonts.gstatic.com'
    ];

    dnsPrefetches.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });
  }

  deferNonCriticalScripts() {
    // Move non-critical scripts to load after page interaction
    const deferredScripts = [];
    
    window.addEventListener('load', () => {
      deferredScripts.forEach(script => {
        const scriptElement = document.createElement('script');
        scriptElement.src = script;
        scriptElement.async = true;
        document.body.appendChild(scriptElement);
      });
    });
  }

  /**
   * Scroll-based animations
   */
  setupScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          fadeInObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements that should fade in
    const fadeInElements = document.querySelectorAll(
      '.section-header, .featured-item, .publication-card, .contact-form'
    );
    
    fadeInElements.forEach(el => {
      el.classList.add('fade-in-element');
      fadeInObserver.observe(el);
    });

    // Add CSS for fade-in animation
    this.addFadeInStyles();
  }

  addFadeInStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .fade-in-element {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
      }
      
      .animate-fade-in {
        opacity: 1;
        transform: translateY(0);
      }
      
      .stagger-children > * {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      
      .stagger-children.animate-children > * {
        opacity: 1;
        transform: translateY(0);
      }
      
      .stagger-children.animate-children > *:nth-child(1) { transition-delay: 0.1s; }
      .stagger-children.animate-children > *:nth-child(2) { transition-delay: 0.2s; }
      .stagger-children.animate-children > *:nth-child(3) { transition-delay: 0.3s; }
      .stagger-children.animate-children > *:nth-child(4) { transition-delay: 0.4s; }
      .stagger-children.animate-children > *:nth-child(5) { transition-delay: 0.5s; }
      .stagger-children.animate-children > *:nth-child(6) { transition-delay: 0.6s; }
    `;
    document.head.appendChild(style);
  }

  /**
   * Parallax effects for hero section
   */
  setupParallaxEffects() {
    let ticking = false;
    
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.hero-image');
      
      parallaxElements.forEach(el => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
      
      ticking = false;
    };

    const requestParallaxUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    // Only enable parallax on desktop for performance
    if (window.innerWidth > 768) {
      window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    }
  }

  /**
   * Image optimization and lazy loading enhancements
   */
  setupImageOptimization() {
    // Add loading="lazy" to images that don't have it
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      if (!this.isInViewport(img)) {
        img.loading = 'lazy';
      }
    });

    // Progressive image loading with blur-up effect
    this.setupProgressiveImageLoading();
    
    // WebP support detection
    this.detectWebPSupport();
  }

  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  setupProgressiveImageLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    images.forEach(img => {
      // Add blur effect while loading
      img.style.filter = 'blur(5px)';
      img.style.transition = 'filter 0.3s ease';
      
      img.addEventListener('load', () => {
        img.style.filter = 'none';
        img.classList.add('loaded');
      });
    });
  }

  detectWebPSupport() {
    const webp = new Image();
    webp.onload = webp.onerror = () => {
      if (webp.height === 2) {
        document.documentElement.classList.add('webp-support');
      }
    };
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }

  /**
   * Progressive enhancement features
   */
  setupProgressiveEnhancement() {
    // Add 'js-enabled' class for CSS hooks
    document.documentElement.classList.add('js-enabled');
    
    // Enhanced form interactions
    this.enhanceFormInteractions();
    
    // Keyboard navigation improvements
    this.improveKeyboardNavigation();
    
    // Touch gesture enhancements
    this.setupTouchGestures();
    
    // Performance monitoring
    this.setupPerformanceMonitoring();
  }

  enhanceFormInteractions() {
    // Add floating labels
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      const wrapper = document.createElement('div');
      wrapper.className = 'form-input-wrapper';
      
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);
      
      // Add focus/blur handlers
      input.addEventListener('focus', () => wrapper.classList.add('focused'));
      input.addEventListener('blur', () => {
        if (!input.value) wrapper.classList.remove('focused');
      });
      
      // Check initial state
      if (input.value) wrapper.classList.add('focused');
    });
  }

  improveKeyboardNavigation() {
    // Skip link for accessibility
    const skipLink = document.createElement('a');
    skipLink.href = '#portfolio';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 10000;
      border-radius: 0 0 4px 4px;
      transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Focus management for modal
    this.setupModalFocusManagement();
  }

  setupModalFocusManagement() {
    const lightbox = document.getElementById('lightbox');
    let lastFocusedElement;
    
    // When lightbox opens, trap focus
    const trapFocus = (e) => {
      if (!lightbox.classList.contains('active')) return;
      
      const focusableElements = lightbox.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };
    
    document.addEventListener('keydown', trapFocus);
    
    // Store and restore focus
    const lightboxObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('active')) {
          lastFocusedElement = document.activeElement;
          setTimeout(() => {
            const closeButton = lightbox.querySelector('.lightbox-close');
            if (closeButton) closeButton.focus();
          }, 100);
        } else if (lastFocusedElement) {
          lastFocusedElement.focus();
        }
      });
    });
    
    lightboxObserver.observe(lightbox, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  setupTouchGestures() {
    // Enhanced touch interactions for mobile
    let touchStartY = 0;
    let touchStartX = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaY = touchStartY - touchEndY;
      const deltaX = touchStartX - touchEndX;
      
      // Detect swipe gestures
      if (Math.abs(deltaY) > 50 && Math.abs(deltaX) < 100) {
        if (deltaY > 0) {
          // Swipe up - scroll to next section
          this.scrollToNextSection();
        } else {
          // Swipe down - scroll to previous section
          this.scrollToPrevSection();
        }
      }
    }, { passive: true });
  }

  scrollToNextSection() {
    const sections = document.querySelectorAll('section');
    const currentScroll = window.pageYOffset;
    
    for (let section of sections) {
      if (section.offsetTop > currentScroll + 100) {
        section.scrollIntoView({ behavior: 'smooth' });
        break;
      }
    }
  }

  scrollToPrevSection() {
    const sections = Array.from(document.querySelectorAll('section')).reverse();
    const currentScroll = window.pageYOffset;
    
    for (let section of sections) {
      if (section.offsetTop < currentScroll - 100) {
        section.scrollIntoView({ behavior: 'smooth' });
        break;
      }
    }
  }

  setupPerformanceMonitoring() {
    // Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.log('LCP:', entry.startTime);
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // First Input Delay
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.log('FID:', entry.processingStart - entry.startTime);
        }
      }).observe({ entryTypes: ['first-input'] });
      
      // Cumulative Layout Shift
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            console.log('CLS:', entry.value);
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }
}

/**
 * Utility functions
 */
class Utils {
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  static getViewportHeight() {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  }

  static getViewportWidth() {
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  }

  static isRetina() {
    return window.devicePixelRatio > 1;
  }

  static isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  static supportsWebP() {
    return document.documentElement.classList.contains('webp-support');
  }

  static preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = src;
    });
  }

  static formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
}

// Initialize the website when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.portfolioSite = new PortfolioWebsite();
  });
} else {
  window.portfolioSite = new PortfolioWebsite();
}

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PortfolioWebsite, Utils };
}
