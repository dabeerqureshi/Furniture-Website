// Performance Optimization JavaScript
// Handles lazy loading, image optimization, and performance enhancements

// Performance Manager
const PerformanceManager = {
    // Initialize performance optimizations
    init() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupIntersectionObserver();
        this.setupPerformanceMonitoring();
    },

    // Setup lazy loading for images
    setupLazyLoading() {
        // Use Intersection Observer for better performance
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;
                        
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            
                            // Add fade-in effect
                            img.classList.add('fade-in');
                            
                            // Stop observing once loaded
                            observer.unobserve(img);
                        }
                    }
                });
            });

            // Observe all lazy images
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            this.loadImagesFallback();
        }
    },

    // Fallback for browsers without Intersection Observer
    loadImagesFallback() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const loadImage = (img) => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('fade-in');
        };

        // Load images immediately for fallback
        lazyImages.forEach(loadImage);
    },

    // Setup image optimization
    setupImageOptimization() {
        // Optimize product images
        this.optimizeProductImages();
        
        // Setup responsive images
        this.setupResponsiveImages();
    },

    // Optimize product images
    optimizeProductImages() {
        const productImages = document.querySelectorAll('.product-image, .gallery-image');
        
        productImages.forEach(img => {
            // Add loading="lazy" attribute
            img.loading = 'lazy';
            
            // Add alt text if missing
            if (!img.alt) {
                img.alt = 'Product Image';
            }
            
            // Add error handling
            img.onerror = () => {
                img.src = 'images/placeholder.jpg';
                img.alt = 'Image not available';
            };
        });
    },

    // Setup responsive images
    setupResponsiveImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        images.forEach(img => {
            const src = img.dataset.src;
            
            // Create srcset for responsive images
            if (src) {
                const baseName = src.replace(/\.[^/.]+$/, "");
                const extension = src.split('.').pop();
                
                img.srcset = `
                    ${baseName}-small.${extension} 480w,
                    ${baseName}-medium.${extension} 768w,
                    ${baseName}-large.${extension} 1200w
                `;
                img.sizes = '(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px';
            }
        });
    },

    // Setup Intersection Observer for various elements
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            // Observer for animations
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe elements that should animate on scroll
            document.querySelectorAll('.product-card, .feature-card, .testimonial-card').forEach(el => {
                animationObserver.observe(el);
            });
        }
    },

    // Setup performance monitoring
    setupPerformanceMonitoring() {
        // Monitor page load performance
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                const timing = window.performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                
                // Log performance metrics
                console.log(`Page load time: ${loadTime}ms`);
                
                // Warn if page is slow
                if (loadTime > 3000) {
                    console.warn('Page load time is slow. Consider optimizing images and code.');
                }
            });
        }

        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
                    console.warn('High memory usage detected. Consider cleaning up unused data.');
                }
            }, 30000);
        }
    },

    // Debounce function for scroll events
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for resize events
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Optimize event listeners
    optimizeEventListeners() {
        // Use event delegation for dynamic content
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Handle product quick view
            if (target.closest('.quick-view-btn')) {
                const productCard = target.closest('.product-card');
                if (productCard) {
                    const productId = productCard.dataset.productId;
                    if (productId) {
                        this.handleQuickView(productId);
                    }
                }
            }
            
            // Handle favorite buttons
            if (target.closest('.heart-icon')) {
                const heart = target.closest('.heart-icon');
                const productId = heart.dataset.productId;
                if (productId) {
                    this.handleFavoriteToggle(productId, heart);
                }
            }
        });
    },

    // Handle quick view with optimization
    handleQuickView(productId) {
        // Check if modal is already open
        const modal = document.getElementById('quick-view-modal');
        if (modal && !modal.classList.contains('hidden')) {
            return;
        }
        
        // Load product data
        const product = ProductManager.getProductById(productId);
        if (product) {
            this.loadQuickViewModal(product);
        }
    },

    // Load quick view modal with optimization
    loadQuickViewModal(product) {
        const modal = document.getElementById('quick-view-modal');
        const content = modal.querySelector('.quick-view-content');
        
        if (!content) return;

        // Create optimized content
        const optimizedImages = product.images.map(img => this.getOptimizedImageSrc(img));
        
        content.innerHTML = `
            <div class="gallery-container">
                <div class="gallery-main">
                    <img src="${optimizedImages[0]}" alt="${product.name}" 
                         class="w-full h-96 object-cover rounded-xl lazy" 
                         loading="lazy">
                </div>
                <div class="gallery-thumbnails">
                    ${optimizedImages.map((img, index) => `
                        <img src="${img}" alt="Product image ${index + 1}" 
                             class="thumbnail ${index === 0 ? 'active' : ''}"
                             loading="lazy"
                             onclick="changeQuickViewImage('${img}', this)">
                    `).join('')}
                </div>
            </div>
            <div class="product-details">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${this.formatPrice(product.price)}</p>
                <p class="product-description">${product.description}</p>
                
                <div class="product-features">
                    <h4 class="text-lg font-semibold text-gray-900 mb-4">Features</h4>
                    ${product.features.map(feature => `
                        <div class="feature-item">
                            <i class="fas fa-check text-green-500"></i>
                            <span>${feature}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="bg-gray-50 p-4 rounded-lg mb-6">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-gray-600">Product:</span>
                        <span class="font-semibold">${product.name}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Price:</span>
                        <span class="text-xl font-bold text-primary-600">${this.formatPrice(product.price)}</span>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-4">
                    <button class="order-now-btn flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 transform hover:scale-105"
                            onclick="window.openOrderModal(${JSON.stringify(product).replace(/"/g, '"')})">
                        <i class="fas fa-shopping-cart mr-2"></i>
                        Order Now
                    </button>
                    <button class="whatsapp-btn flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
                            onclick="window.openWhatsAppChat(${JSON.stringify(product).replace(/"/g, '"')})">
                        <i class="fab fa-whatsapp mr-2"></i>
                        Chat on WhatsApp
                    </button>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
    },

    // Get optimized image source
    getOptimizedImageSrc(originalSrc) {
        // For demo purposes, return the original src
        // In a real application, you would return optimized versions
        return originalSrc;
    },

    // Format price with optimization
    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(price);
    },

    // Handle favorite toggle with optimization
    handleFavoriteToggle(productId, element) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
        if (favorites.includes(productId)) {
            favorites = favorites.filter(id => id !== productId);
            element.classList.remove('favorited');
        } else {
            favorites.push(productId);
            element.classList.add('favorited');
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // Add visual feedback
        element.style.transform = 'scale(1.2)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    },

    // Cleanup unused resources
    cleanup() {
        // Clear unused timers
        // Clear unused event listeners
        // Clear unused data from memory
    },

    // Preload critical resources
    preloadCriticalResources() {
        // Preload critical images
        const criticalImages = [
            'images/hero-bg.jpg',
            'images/logo.png'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });

        // Preload critical CSS
        const criticalCSS = document.createElement('link');
        criticalCSS.rel = 'preload';
        criticalCSS.as = 'style';
        criticalCSS.href = 'css/style.css';
        document.head.appendChild(criticalCSS);
    }
};

// Initialize performance optimizations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    PerformanceManager.init();
    PerformanceManager.preloadCriticalResources();
    PerformanceManager.optimizeEventListeners();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PerformanceManager };
}