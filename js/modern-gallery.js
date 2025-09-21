/**
 * Modern Photography Gallery System
 * Replaces Flash galleries with modern JavaScript functionality
 */

class ModernGallery {
  constructor() {
    this.currentImageIndex = 0;
    this.images = [];
    this.isLightboxOpen = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.init();
  }

  init() {
    this.loadGalleryData();
    this.setupEventListeners();
    this.setupIntersectionObserver();
    this.setupKeyboardNavigation();
  }

  /**
   * Load gallery data from album description files
   */
  async loadGalleryData() {
    try {
      // Load album descriptions
      const album1Data = await this.loadAlbumData('album1.txt');
      const album2Data = await this.loadAlbumData('album2.txt');
      
      // Process album1 images
      const album1Images = this.processAlbumImages(album1Data, 'album1', 'mountains');
      
      // Process album2 images  
      const album2Images = this.processAlbumImages(album2Data, 'album2', 'landscapes');
      
      // Combine all images
      this.images = [...album1Images, ...album2Images];
      
      // Render portfolio grid
      this.renderPortfolioGrid();
      
    } catch (error) {
      console.error('Error loading gallery data:', error);
      this.fallbackGalleryData();
    }
  }

  /**
   * Load album data from text file
   */
  async loadAlbumData(filename) {
    try {
      const response = await fetch(filename);
      const text = await response.text();
      return this.parseAlbumData(text);
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      return {};
    }
  }

  /**
   * Parse album description data from text format
   */
  parseAlbumData(text) {
    const descriptions = {};
    const parts = text.split('&');
    
    parts.forEach(part => {
      if (part.includes('=')) {
        const [key, value] = part.split('=', 2);
        if (key.startsWith('desc')) {
          const imageNumber = key.replace('desc', '');
          descriptions[imageNumber] = value;
        }
      }
    });
    
    return descriptions;
  }

  /**
   * Process album images with metadata
   */
  processAlbumImages(albumData, albumName, category) {
    const images = [];
    const imageCount = albumName === 'album1' ? 11 : 108; // Based on file structure
    
    for (let i = 1; i <= imageCount; i++) {
      const description = albumData[i.toString()] || `${albumName.toUpperCase()} - Image ${i}`;
      
      images.push({
        id: `${albumName}_${i}`,
        src: `${albumName}/PAN_${i}.jpg`,
        thumbnail: `${albumName}-tn/PAN_${i}.jpg`,
        title: `Lebanese Landscape ${i}`,
        description: description,
        category: category,
        album: albumName,
        index: i - 1
      });
    }
    
    return images;
  }

  /**
   * Fallback gallery data when files can't be loaded
   */
  fallbackGalleryData() {
    this.images = [
      {
        id: 'featured_1',
        src: 'images/home_pic.jpg',
        thumbnail: 'images/home_pic.jpg',
        title: 'Ammiq Natural Reserve',
        description: 'La réserve naturelle de Ammiq, Beqaa Ouest. Lebanon, Winter 2005',
        category: 'valleys',
        album: 'featured'
      }
    ];
    
    this.renderPortfolioGrid();
  }

  /**
   * Render the portfolio grid
   */
  renderPortfolioGrid() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (!portfolioGrid) return;

    portfolioGrid.innerHTML = '';
    
    this.images.forEach((image, index) => {
      const portfolioItem = this.createPortfolioItem(image, index);
      portfolioGrid.appendChild(portfolioItem);
    });

    // Hide loading spinner
    const loadingSpinner = document.querySelector('.portfolio-loading');
    if (loadingSpinner) {
      loadingSpinner.style.display = 'none';
    }

    // Setup lazy loading
    this.setupLazyLoading();
  }

  /**
   * Create individual portfolio item element
   */
  createPortfolioItem(image, index) {
    const item = document.createElement('div');
    item.className = 'portfolio-item filter-visible';
    item.setAttribute('data-category', image.category);
    item.setAttribute('data-index', index);

    item.innerHTML = `
      <img data-src="${image.thumbnail}" alt="${image.title}" loading="lazy">
      <div class="portfolio-category">${this.formatCategory(image.category)}</div>
      <div class="portfolio-overlay">
        <h3 class="portfolio-title">${image.title}</h3>
        <p class="portfolio-description">${this.truncateText(image.description, 100)}</p>
      </div>
    `;

    // Add click listener for lightbox
    item.addEventListener('click', () => this.openLightbox(index));

    return item;
  }

  /**
   * Format category for display
   */
  formatCategory(category) {
    const categories = {
      'mountains': 'Mountains',
      'valleys': 'Valleys', 
      'coastal': 'Coastal',
      'seasons': 'Seasons',
      'landscapes': 'Landscapes'
    };
    
    return categories[category] || 'Photography';
  }

  /**
   * Truncate text to specified length
   */
  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }

  /**
   * Setup lazy loading for images
   */
  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  /**
   * Setup intersection observer for animations
   */
  setupIntersectionObserver() {
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

    // Observe portfolio items
    document.querySelectorAll('.portfolio-item').forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(item);
    });
  }

  /**
   * Open lightbox modal
   */
  openLightbox(imageIndex) {
    this.currentImageIndex = imageIndex;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxDescription = document.querySelector('.lightbox-description');
    
    const currentImage = this.images[imageIndex];
    
    lightboxImage.src = currentImage.src;
    lightboxTitle.textContent = currentImage.title;
    lightboxDescription.textContent = currentImage.description;
    
    lightbox.classList.add('active');
    this.isLightboxOpen = true;
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Add loading state
    lightboxImage.style.opacity = '0';
    lightboxImage.onload = () => {
      lightboxImage.style.opacity = '1';
    };
  }

  /**
   * Close lightbox modal
   */
  closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    this.isLightboxOpen = false;
    
    // Restore body scrolling
    document.body.style.overflow = '';
    
    setTimeout(() => {
      lightbox.style.display = 'none';
    }, 300);
  }

  /**
   * Navigate to next image in lightbox
   */
  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.updateLightboxImage();
  }

  /**
   * Navigate to previous image in lightbox
   */
  prevImage() {
    this.currentImageIndex = this.currentImageIndex === 0 
      ? this.images.length - 1 
      : this.currentImageIndex - 1;
    this.updateLightboxImage();
  }

  /**
   * Update lightbox image content
   */
  updateLightboxImage() {
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxDescription = document.querySelector('.lightbox-description');
    
    const currentImage = this.images[this.currentImageIndex];
    
    // Add fade transition
    lightboxImage.style.opacity = '0';
    
    setTimeout(() => {
      lightboxImage.src = currentImage.src;
      lightboxTitle.textContent = currentImage.title;
      lightboxDescription.textContent = currentImage.description;
      lightboxImage.style.opacity = '1';
    }, 150);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Lightbox controls
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('lightbox-close')) {
        this.closeLightbox();
      }
      
      if (e.target.classList.contains('lightbox-next')) {
        this.nextImage();
      }
      
      if (e.target.classList.contains('lightbox-prev')) {
        this.prevImage();
      }
      
      // Close lightbox when clicking outside image
      if (e.target.id === 'lightbox') {
        this.closeLightbox();
      }
    });

    // Portfolio filter buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        this.handleFilterClick(e.target);
      }
    });

    // Touch events for mobile swipe
    document.addEventListener('touchstart', (e) => {
      if (this.isLightboxOpen) {
        this.touchStartX = e.changedTouches[0].screenX;
      }
    });

    document.addEventListener('touchend', (e) => {
      if (this.isLightboxOpen) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      }
    });
  }

  /**
   * Handle portfolio filter clicks
   */
  handleFilterClick(button) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    button.classList.add('active');
    
    const filter = button.dataset.filter;
    this.filterPortfolioItems(filter);
  }

  /**
   * Filter portfolio items by category
   */
  filterPortfolioItems(filter) {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach((item, index) => {
      const category = item.dataset.category;
      const shouldShow = filter === 'all' || category === filter;
      
      if (shouldShow) {
        item.classList.remove('filter-hidden');
        item.classList.add('filter-visible');
        // Stagger animation
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, index * 50);
      } else {
        item.classList.add('filter-hidden');
        item.classList.remove('filter-visible');
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
      }
    });
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (!this.isLightboxOpen) return;
      
      switch (e.key) {
        case 'Escape':
          this.closeLightbox();
          break;
        case 'ArrowRight':
          this.nextImage();
          break;
        case 'ArrowLeft':
          this.prevImage();
          break;
      }
    });
  }

  /**
   * Handle touch swipe gestures
   */
  handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = this.touchEndX - this.touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        this.prevImage();
      } else {
        this.nextImage();
      }
    }
  }
}

/**
 * Smooth Scroll Navigation Handler
 */
class SmoothNavigation {
  constructor() {
    this.init();
  }

  init() {
    this.setupSmoothScroll();
    this.setupScrollSpy();
    this.setupMobileMenu();
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
      rootMargin: '-80px 0px -50% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const activeId = entry.target.id;
          
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  setupMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
      });

      // Close menu when clicking on links
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
        });
      });
    }
  }
}

/**
 * Contact Form Handler
 */
class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    if (this.form) {
      this.setupFormHandler();
    }
  }

  setupFormHandler() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmission();
    });
  }

  async handleFormSubmission() {
    const formData = new FormData(this.form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    // Simple client-side validation
    if (!this.validateForm(data)) {
      return;
    }

    // Show loading state
    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      // Here you would typically send to your backend
      // For now, we'll simulate success
      await this.simulateFormSubmission(data);
      
      this.showSuccessMessage();
      this.form.reset();
      
    } catch (error) {
      this.showErrorMessage();
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  validateForm(data) {
    const errors = [];
    
    if (!data.name.trim()) errors.push('Name is required');
    if (!data.email.trim()) errors.push('Email is required');
    if (!this.isValidEmail(data.email)) errors.push('Please enter a valid email');
    if (!data.subject) errors.push('Please select a subject');
    if (!data.message.trim()) errors.push('Message is required');
    
    if (errors.length > 0) {
      this.showValidationErrors(errors);
      return false;
    }
    
    return true;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  showValidationErrors(errors) {
    alert('Please correct the following errors:\n' + errors.join('\n'));
  }

  showSuccessMessage() {
    alert('Thank you! Your message has been sent successfully.');
  }

  showErrorMessage() {
    alert('Sorry, there was an error sending your message. Please try again.');
  }

  async simulateFormSubmission(data) {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }
}

/**
 * Initialize all components when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Hide loading screen
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      loadingScreen.style.visibility = 'hidden';
    }
  }, 2500);

  // Initialize components
  window.gallery = new ModernGallery();
  window.navigation = new SmoothNavigation();
  window.contactForm = new ContactForm();
  
  // Setup navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
});
