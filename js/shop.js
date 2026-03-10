// Shop Page JavaScript
// Handles product filtering, sorting, and display

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const productsGrid = document.getElementById('products-grid');
    const resultsCount = document.getElementById('results-count');
    const emptyState = document.getElementById('empty-state');
    const searchInput = document.getElementById('search-input');
    const categoryFilters = document.getElementById('category-filters');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const minPriceDisplay = document.getElementById('min-price-display');
    const maxPriceDisplay = document.getElementById('max-price-display');
    const inStockFilter = document.getElementById('in-stock-filter');
    const featuredFilter = document.getElementById('featured-filter');
    const newArrivalsFilter = document.getElementById('new-arrivals-filter');
    const sortSelect = document.getElementById('sort-select');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    const filterCategoryBtns = document.querySelectorAll('.filter-category-btn');

    // State
    let currentProducts = [];
    let filters = {
        category: 'all',
        search: '',
        minPrice: '',
        maxPrice: '',
        inStock: false,
        featured: false,
        new: false,
        sortBy: 'name'
    };

    // Initialize
    init();

    function init() {
        console.log('Shop init called');
        console.log('window.ProductManager:', typeof window.ProductManager);
        console.log('window.CartManager:', typeof window.CartManager);
        console.log('ProductManager:', typeof ProductManager);
        console.log('CartManager:', typeof CartManager);

        // Wait for ProductManager to be available
        if (typeof window.ProductManager === 'undefined') {
            console.warn('ProductManager not available yet, waiting...');
            setTimeout(init, 100);
            return;
        }

        // Set up price range display
        const priceRange = window.ProductManager.getPriceRange();
        minPriceDisplay.textContent = priceRange.min;
        maxPriceDisplay.textContent = priceRange.max;
        
        // Set max values for price inputs
        minPriceInput.max = priceRange.max;
        maxPriceInput.max = priceRange.max;

        // Load categories
        loadCategories();

        // Load initial products
        loadProducts();

        // Set up event listeners
        setupEventListeners();
        
        // Initialize Quick View modal for shop page
        initQuickViewModalForShop();
    }

    function initQuickViewModalForShop() {
        // Initialize Quick View modal if it exists (for shop page)
        const quickViewModal = document.getElementById('quick-view-modal');
        const closeQuickViewBtn = document.getElementById('close-quick-view');
        
        if (closeQuickViewBtn) {
            closeQuickViewBtn.addEventListener('click', () => {
                if (quickViewModal) quickViewModal.classList.add('hidden');
            });
        }

        // Close modal when clicking outside
        if (quickViewModal) {
            quickViewModal.addEventListener('click', (e) => {
                if (e.target === quickViewModal) {
                    quickViewModal.classList.add('hidden');
                }
            });
        }
    }

    function setupEventListeners() {
        // Search input
        searchInput.addEventListener('input', debounce(function(e) {
            filters.search = e.target.value.trim();
            loadProducts();
        }, 300));

        // Price inputs
        minPriceInput.addEventListener('input', function(e) {
            filters.minPrice = e.target.value;
            loadProducts();
        });

        maxPriceInput.addEventListener('input', function(e) {
            filters.maxPrice = e.target.value;
            loadProducts();
        });

        // Checkbox filters
        inStockFilter.addEventListener('change', function() {
            filters.inStock = this.checked;
            loadProducts();
        });

        featuredFilter.addEventListener('change', function() {
            filters.featured = this.checked;
            loadProducts();
        });

        newArrivalsFilter.addEventListener('change', function() {
            filters.new = this.checked;
            loadProducts();
        });

        // Sort select
        sortSelect.addEventListener('change', function() {
            filters.sortBy = this.value;
            loadProducts();
        });

        // Apply filters button
        applyFiltersBtn.addEventListener('click', loadProducts);

        // Reset filters button
        resetFiltersBtn.addEventListener('click', resetFilters);

        // Clear filters button
        clearFiltersBtn.addEventListener('click', resetFilters);

        // Category quick filters
        filterCategoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active state
                filterCategoryBtns.forEach(b => b.classList.remove('bg-primary-100', 'text-primary-600', 'border-primary-200'));
                this.classList.add('bg-primary-100', 'text-primary-600', 'border-primary-200');
                
                // Update filter
                filters.category = this.dataset.category;
                loadProducts();
            });
        });
    }

    function loadCategories() {
        const categories = ProductManager.getCategories();
        categoryFilters.innerHTML = '';
        
        // Only show sofas category
        const sofasCategory = categories.find(cat => cat.id === 'sofas');
        if (sofasCategory) {
            const label = document.createElement('label');
            label.className = 'filter-option';
            label.innerHTML = `
                <input type="checkbox" data-category="${sofasCategory.id}" checked>
                <span>${sofasCategory.name} (${sofasCategory.count})</span>
            `;
            categoryFilters.appendChild(label);
        }

        // Add event listeners to category checkboxes
        categoryFilters.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                // Update filters based on checked categories
                const checkedCategories = Array.from(categoryFilters.querySelectorAll('input[type="checkbox"]:checked'))
                    .map(cb => cb.dataset.category);
                
                filters.category = checkedCategories.length > 0 ? checkedCategories : 'all';
                loadProducts();
            });
        });
    }

    function loadProducts() {
        // Apply filters
        let filteredProducts = ProductManager.filterProducts(filters);
        
        // Apply search
        if (filters.search) {
            filteredProducts = ProductManager.searchProducts(filters.search);
        }

        // Apply category filter if specific categories are selected
        if (filters.category && filters.category !== 'all' && !Array.isArray(filters.category)) {
            filteredProducts = filteredProducts.filter(p => p.category === filters.category);
        } else if (Array.isArray(filters.category) && filters.category.length > 0) {
            filteredProducts = filteredProducts.filter(p => filters.category.includes(p.category));
        }

        // Apply sorting
        filteredProducts = ProductManager.sortProducts(filteredProducts, filters.sortBy);

        // Update results count
        resultsCount.textContent = filteredProducts.length;

        // Display products or empty state
        if (filteredProducts.length === 0) {
            productsGrid.classList.add('hidden');
            emptyState.classList.remove('hidden');
        } else {
            productsGrid.classList.remove('hidden');
            emptyState.classList.add('hidden');
            renderProducts(filteredProducts);
        }

        currentProducts = filteredProducts;
    }

    function renderProducts(products) {
        productsGrid.innerHTML = '';
        
        products.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2';
        
        // Format price
        const formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(product.price);

        card.innerHTML = `
            <div class="product-image-container relative group">
                <img src="${product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/400x300?text=No+Image'}" alt="${product.name}" 
                     class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                     loading="lazy">
                
                <div class="product-badge bg-green-500 text-white">Cash on Delivery</div>
                
                <div class="heart-icon ${isFavorited(product.id) ? 'favorited' : ''}" data-product-id="${product.id}">
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
                            data-product-id="${product.id}">
                        Quick View
                    </button>
                    <button class="add-to-cart-btn w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                            data-product-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;

        // Add event listeners - use event delegation to handle multiple buttons
        card.addEventListener('click', (e) => {
            const quickViewBtn = e.target.closest('.quick-view-btn');
            const addToCartBtn = e.target.closest('.add-to-cart-btn');
            
            if (quickViewBtn) {
                e.preventDefault();
                window.handleQuickView(product.id);
            }
            if (addToCartBtn) {
                e.preventDefault();
                window.addToCart(product.id);
            }
        });

        card.querySelector('.heart-icon').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
            updateHeartIcon(card, product.id);
        });

        return card;
    }

    function updateHeartIcon(card, productId) {
        const heartIcon = card.querySelector('.heart-icon');
        if (heartIcon) {
            if (isFavorited(productId)) {
                heartIcon.classList.add('favorited');
            } else {
                heartIcon.classList.remove('favorited');
            }
        }
    }

    function resetFilters() {
        // Reset all filters
        filters = {
            category: 'all',
            search: '',
            minPrice: '',
            maxPrice: '',
            inStock: false,
            featured: false,
            new: false,
            sortBy: 'name'
        };

        // Reset UI elements
        searchInput.value = '';
        minPriceInput.value = '';
        maxPriceInput.value = '';
        inStockFilter.checked = false;
        featuredFilter.checked = false;
        newArrivalsFilter.checked = false;
        sortSelect.value = 'name';

        // Reset category buttons
        filterCategoryBtns.forEach(btn => {
            btn.classList.remove('bg-primary-100', 'text-primary-600', 'border-primary-200');
        });
        filterCategoryBtns[0].classList.add('bg-primary-100', 'text-primary-600', 'border-primary-200');

        // Reset category checkboxes
        categoryFilters.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });

        // Reload products
        loadProducts();
    }

    // Favorites functionality
    function isFavorited(productId) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        return favorites.includes(productId);
    }

    function toggleFavorite(productId) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
        if (favorites.includes(productId)) {
            favorites = favorites.filter(id => id !== productId);
        } else {
            favorites.push(productId);
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // Utility functions
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

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });

    // Add to cart function (moved inside DOMContentLoaded)
    window.addToCart = function(productId) {
        console.log('addToCart called with productId:', productId);
        console.log('ProductManager available:', typeof window.ProductManager);
        console.log('CartManager available:', typeof window.CartManager);
        
        // Ensure both managers are available
        if (!window.ProductManager) {
            console.warn('ProductManager not available yet');
            alert('Product system not ready. Please refresh the page.');
            return;
        }
        
        if (!window.CartManager) {
            console.warn('CartManager not available');
            alert('Cart system not available. Please try again.');
            return;
        }
        
        const product = window.ProductManager.getById(productId);
        if (product) {
            console.log('Product found:', product);
            console.log('Adding to cart:', product.name);
            window.CartManager.addToCart(product, 1);
        } else {
            console.warn('Product not found for ID:', productId);
            alert('Product not found. Please try again.');
        }
    };

    // Global functions for quick view and order modal
    window.handleQuickView = function(productId) {
        const product = ProductManager.getById(productId);
        if (product) {
            // Call the function from app.js
            if (typeof window.openQuickView === 'function') {
                window.openQuickView(product);
            }
        }
    }

    window.handleOrderModal = function(productId) {
        const product = ProductManager.getById(productId);
        if (product) {
            // Call the function from app.js
            if (typeof window.openOrderModal === 'function') {
                window.openOrderModal(product);
            }
        }
    }
});
