// Main Application JavaScript
// Handles homepage functionality, quick view modal, and global features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components with proper error handling
    init();
});

function init() {
    try {
        // Initialize mobile menu
        initMobileMenu();
        
        // Initialize quick view modal
        initQuickViewModal();
        
        // Initialize order modal
        initOrderModal();
        
        // Initialize cart manager with error handling
        initCartManager();
        
        // Initialize homepage featured products
        initFeaturedProducts();
        
        // Initialize favorites
        initFavorites();
        
        // Initialize search functionality
        initSearch();
        
        // Initialize category navigation
        initCategoryNavigation();
        
        // Set up cart button event listener
        setupCartButton();
        
        console.log('All components initialized successfully');
    } catch (error) {
        console.error('Error during initialization:', error);
        showInitializationError(error);
    }
}

// Initialize cart manager with proper error handling
function initCartManager() {
    if (typeof window.CartManager !== 'undefined' && typeof CartManager.init === 'function') {
        try {
            CartManager.init();
            updateCartCount();
            console.log('Cart manager initialized successfully');
        } catch (error) {
            console.error('Error initializing cart manager:', error);
        }
    } else {
        console.warn('CartManager not available or not properly initialized');
    }
}

// Show initialization error to user
function showInitializationError(error) {
    const mainContent = document.querySelector('main');
    if (mainContent) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-50 border border-red-200 rounded-lg p-6 m-6';
        errorDiv.innerHTML = `
            <div class="flex items-center mb-4">
                <i class="fas fa-exclamation-triangle text-red-500 text-2xl mr-3"></i>
                <h3 class="text-lg font-semibold text-red-900">Application Error</h3>
            </div>
            <p class="text-red-700 mb-4">An error occurred while loading the application. Please refresh the page and try again.</p>
            <div class="flex space-x-3">
                <button onclick="window.location.reload()" 
                        class="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                    Refresh Page
                </button>
                <button onclick="console.log('Error details:', arguments[0])" 
                        class="border border-red-300 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors">
                    View Details
                </button>
            </div>
        `;
        mainContent.insertBefore(errorDiv, mainContent.firstChild);
    }
}

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

// Quick View Modal Functionality
function initQuickViewModal() {
    const quickViewModal = document.getElementById('quick-view-modal');
    const closeQuickViewBtn = document.getElementById('close-quick-view');
    
    if (closeQuickViewBtn) {
        closeQuickViewBtn.addEventListener('click', () => {
            closeQuickViewModal();
        });
    }

    // Close modal when clicking outside
    if (quickViewModal) {
        quickViewModal.addEventListener('click', (e) => {
            if (e.target === quickViewModal) {
                closeQuickViewModal();
            }
        });
    }
}

function openQuickView(product) {
    const modal = document.getElementById('quick-view-modal');
    
    if (modal) {
        // Update modal content
        const mainImage = document.getElementById('quick-view-main-image');
        const productName = document.getElementById('quick-view-product-name');
        const productPrice = document.getElementById('quick-view-product-price');
        const productDescription = document.getElementById('quick-view-product-description');
        const featuresContainer = document.getElementById('quick-view-features');
        const thumbnailsContainer = document.getElementById('quick-view-thumbnails');
        
        if (mainImage) mainImage.src = product.images[0];
        if (productName) productName.textContent = product.name;
        if (productPrice) productPrice.textContent = formatPrice(product.price);
        if (productDescription) productDescription.textContent = product.description;
        
        // Update features
        if (featuresContainer) {
            featuresContainer.innerHTML = '';
            product.features.forEach(feature => {
                const featureItem = document.createElement('div');
                featureItem.className = 'flex items-center space-x-3';
                featureItem.innerHTML = `
                    <i class="fas fa-check text-green-500"></i>
                    <span class="text-gray-600">${feature}</span>
                `;
                featuresContainer.appendChild(featureItem);
            });
        }
        
        // Update thumbnails
        if (thumbnailsContainer) {
            thumbnailsContainer.innerHTML = '';
            product.images.forEach((img, index) => {
                const thumbnail = document.createElement('img');
                thumbnail.src = img;
                thumbnail.alt = `Product image ${index + 1}`;
                thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
                thumbnail.onclick = () => changeQuickViewImage(img, thumbnail);
                thumbnailsContainer.appendChild(thumbnail);
            });
        }

        modal.classList.remove('hidden');
        
        // Set up button event listeners
        setupQuickViewModalButtons(product);
    }
}

// Add event listeners for Quick View modal buttons
function setupQuickViewModalButtons(product) {
    const addToCartBtn = document.getElementById('quick-view-add-to-cart');
    const whatsappBtn = document.getElementById('quick-view-whatsapp');
    
    if (addToCartBtn) {
        addToCartBtn.onclick = () => {
            if (window.CartManager) {
                window.CartManager.addToCart(product, 1);
                updateCartCount();
            }
        };
    }
    
    if (whatsappBtn) {
        whatsappBtn.onclick = () => {
            const message = `I'm interested in your ${product.name} (${formatPrice(product.price)}). Can you provide more details?`;
            const whatsappUrl = `https://wa.me/923144781120?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        };
    }
}

function closeQuickViewModal() {
    const modal = document.getElementById('quick-view-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function changeQuickViewImage(imageSrc, thumbnailElement) {
    const mainImage = document.querySelector('.quick-view-content .gallery-main img');
    if (mainImage) {
        mainImage.src = imageSrc;
    }
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    thumbnailElement.classList.add('active');
}

// Order Modal Functionality
function initOrderModal() {
    const orderModal = document.getElementById('order-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const successModal = document.getElementById('success-modal');
    const closeSuccessModalBtn = document.getElementById('close-success-modal');
    const orderForm = document.getElementById('order-form');

    // Close order modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            orderModal.classList.add('hidden');
        });
    }

    // Close success modal
    if (closeSuccessModalBtn) {
        closeSuccessModalBtn.addEventListener('click', () => {
            successModal.classList.add('hidden');
        });
    }

    // Close modals when clicking outside
    if (orderModal) {
        orderModal.addEventListener('click', (e) => {
            if (e.target === orderModal) {
                orderModal.classList.add('hidden');
            }
        });
    }

    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.add('hidden');
            }
        });
    }

    // Form submission
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            processOrder();
        });
    }
}

function openOrderModal(product) {
    if (!product) return;

    // Set product details in modal
    document.getElementById('product-name').value = product.id;
    document.getElementById('product-price').value = product.price;
    document.getElementById('modal-product-name').textContent = product.name;
    
    const totalPrice = product.price;
    document.getElementById('modal-total-price').textContent = formatPrice(totalPrice);

    // Show modal
    document.getElementById('order-modal').classList.remove('hidden');
}

function processOrder() {
    const form = document.getElementById('order-form');
    const formData = new FormData(form);
    
    const customer = {
        name: formData.get('customer-name'),
        email: formData.get('customer-email'),
        phone: formData.get('customer-phone'),
        city: formData.get('customer-city'),
        postalCode: formData.get('customer-postal-code'),
        address: formData.get('customer-address'),
        quantity: parseInt(formData.get('product-quantity'))
    };

    const product = {
        id: parseInt(document.getElementById('product-name').value),
        name: document.getElementById('modal-product-name').textContent,
        price: parseInt(document.getElementById('product-price').value.replace(/[^0-9]/g, ''))
    };

    // Send order to WhatsApp
    window.WhatsAppManager.sendOrderToWhatsApp(product, customer);
    
    // Show success modal
    document.getElementById('success-modal').classList.remove('hidden');
    
    // Close order modal
    document.getElementById('order-modal').classList.add('hidden');
    
    // Reset form
    form.reset();
}

// Homepage Featured Products
function initFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    
    if (!featuredProductsContainer) {
        console.warn('Featured products container not found');
        return;
    }

    // Check if ProductManager is available
    if (typeof ProductManager === 'undefined') {
        console.error('ProductManager is not available');
        showFeaturedProductsError(featuredProductsContainer);
        return;
    }

    try {
        const featuredProducts = ProductManager.getFeaturedProducts();
        
        if (featuredProducts && featuredProducts.length > 0) {
            featuredProductsContainer.innerHTML = '';
            
            // Filter to only show sofas
            const sofaProducts = featuredProducts.filter(product => product.category === 'sofas');
            
            // Limit to first 3 sofa products
            const displayProducts = sofaProducts.slice(0, 3);
            
            displayProducts.forEach(product => {
                try {
                    const productCard = createProductCard(product);
                    featuredProductsContainer.appendChild(productCard);
                } catch (error) {
                    console.error('Error creating product card:', error);
                }
            });
            
            console.log(`Successfully loaded ${displayProducts.length} featured sofa products`);
        } else {
            console.warn('No featured products found');
            showNoFeaturedProducts(featuredProductsContainer);
        }
    } catch (error) {
        console.error('Error loading featured products:', error);
        showFeaturedProductsError(featuredProductsContainer);
    }
}

// Show error state for featured products
function showFeaturedProductsError(container) {
    container.innerHTML = `
        <div class="col-span-full text-center py-8">
            <div class="text-red-500 mb-4">
                <i class="fas fa-exclamation-triangle text-4xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Unable to Load Featured Products</h3>
            <p class="text-gray-600 mb-4">Please try refreshing the page or contact support if the problem persists.</p>
            <button onclick="window.location.reload()" 
                    class="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Refresh Page
            </button>
        </div>
    `;
}

// Show no products state
function showNoFeaturedProducts(container) {
    container.innerHTML = `
        <div class="col-span-full text-center py-8">
            <div class="text-gray-400 mb-4">
                <i class="fas fa-box-open text-4xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">No Featured Products</h3>
            <p class="text-gray-600">Check back soon for our featured furniture selections.</p>
        </div>
    `;
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2';
    
    const formattedPrice = formatPrice(product.price);

    card.innerHTML = `
        <div class="product-image-container relative group">
            <img src="${product.images[0]}" alt="${product.name}" 
                 class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                 loading="lazy">
            
            <div class="product-badge bg-green-500 text-white">Cash on Delivery</div>
            
            <div class="product-overlay">
                <button class="quick-view-btn bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors mr-2"
                        onclick="window.openQuickView(${JSON.stringify(product).replace(/"/g, '"')})">
                    Quick View
                </button>
                <button class="order-now-btn bg-primary-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-700 transition-colors"
                        onclick="window.openOrderModal(${JSON.stringify(product).replace(/"/g, '"')})">
                    Order Now
                </button>
            </div>
            
            <div class="heart-icon ${isFavorited(product.id) ? 'favorited' : ''}" onclick="toggleFavorite(${product.id}, this)">
                <i class="fas fa-heart"></i>
            </div>
        </div>
        
        <div class="p-6">
            <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-bold text-gray-900">${product.name}</h3>
                <span class="text-sm text-gray-500">${product.category}</span>
            </div>
            
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">${product.description}</p>
            
            <div class="flex justify-between items-center mb-4">
                <span class="text-2xl font-bold text-primary-600">${formattedPrice}</span>
                <span class="text-sm text-green-600 font-semibold">${product.delivery}</span>
            </div>
            
            <div class="flex space-x-2">
                <button class="quick-view-btn w-full bg-gray-100 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        onclick="window.openQuickView(${JSON.stringify(product).replace(/"/g, '"')})">
                    Quick View
                </button>
                <button class="add-to-cart-btn w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                        data-product-id="${product.id}"
                        onclick="addToCartFromCard(${JSON.stringify(product).replace(/"/g, '"')})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;

    return card;
}

// Favorites Functionality
function initFavorites() {
    // Update all heart icons on page load
    document.querySelectorAll('.heart-icon').forEach(icon => {
        const productId = icon.dataset.productId;
        if (productId && isFavorited(productId)) {
            icon.classList.add('favorited');
        }
    });
}

function toggleFavorite(productId, element) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (favorites.includes(productId)) {
        favorites = favorites.filter(id => id !== productId);
        element.classList.remove('favorited');
    } else {
        favorites.push(productId);
        element.classList.add('favorited');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function isFavorited(productId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.includes(productId);
}

// Search Functionality
function initSearch() {
    const searchInput = document.getElementById('search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const query = e.target.value.trim();
            
            if (query.length > 2) {
                const results = ProductManager.searchProducts(query);
                showSearchResults(results, query);
            } else {
                hideSearchResults();
            }
        }, 300));
    }
}

function showSearchResults(results, query) {
    // This would typically show a dropdown with search results
    // For now, we'll redirect to shop page with search query
    if (results.length > 0) {
        // You could implement a dropdown here
        console.log(`Found ${results.length} results for "${query}"`);
    }
}

function hideSearchResults() {
    // Hide search results dropdown
}

// Category Navigation
function initCategoryNavigation() {
    // Handle category links
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            window.location.href = `shop.html?category=${category}`;
        });
    });
}

// Cart Button Setup
function setupCartButton() {
    const cartButton = document.getElementById('cart-button');
    const cartCount = document.getElementById('cart-count');
    
    if (cartButton && cartCount && window.CartManager) {
        // Update cart count on page load
        updateCartCount();
        
        // Add click listener for cart button
        cartButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount && window.CartManager) {
        const count = CartManager.getCartCount();
        if (count > 0) {
            cartCount.textContent = count;
            cartCount.classList.remove('hidden');
        } else {
            cartCount.classList.add('hidden');
        }
    }
}

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(price);
}

function debounce(func, wait) {
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

// Global functions for quick view and order modal
window.openQuickView = function(product) {
    openQuickView(product);
};

window.openOrderModal = function(product) {
    openOrderModal(product);
};

window.openWhatsAppChat = function(product) {
    const message = `I'm interested in your ${product.name} (${formatPrice(product.price)}). Can you provide more details?`;
    const whatsappUrl = `https://wa.me/923144781120?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
};

// WhatsApp chat function for product detail page
window.openWhatsAppChat = function(product) {
    if (window.WhatsAppManager) {
        window.WhatsAppManager.sendInquiryToWhatsApp(product);
    } else {
        const message = `I'm interested in your ${product.name} (${formatPrice(product.price)}). Can you provide more details?`;
        const whatsappUrl = `https://wa.me/923144781120?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
};

// Make functions available globally
window.toggleFavorite = toggleFavorite;
window.isFavorited = isFavorited;

// Add to cart function for homepage cards
function addToCartFromCard(product) {
    if (window.CartManager) {
        window.CartManager.addToCart(product, 1);
        updateCartCount();
    }
}

// Make function available globally
window.addToCartFromCard = addToCartFromCard;
