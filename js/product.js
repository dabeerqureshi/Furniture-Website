// Product Detail Page JavaScript
// Handles product display, gallery, and related functionality

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loadingState = document.getElementById('loading-state');
    const productContent = document.getElementById('product-content');
    const errorState = document.getElementById('error-state');
    
    // Product display elements
    const mainImage = document.getElementById('main-image');
    const productTitle = document.getElementById('product-title');
    const productPrice = document.getElementById('product-price');
    const productDescription = document.getElementById('product-description');
    const productSpecs = document.getElementById('product-specs');
    const productFeatures = document.getElementById('product-features');
    const productDelivery = document.getElementById('product-delivery');
    const categoryLink = document.getElementById('category-link');
    const productNameBreadcrumb = document.getElementById('product-name-breadcrumb');
    const galleryThumbnails = document.getElementById('gallery-thumbnails');
    const favoriteBtn = document.getElementById('favorite-btn');
    const orderNowBtn = document.getElementById('order-now-btn');
    const whatsappChatBtn = document.getElementById('whatsapp-chat-btn');
    const relatedProducts = document.getElementById('related-products');

    // State
    let currentProduct = null;

    // Initialize
    init();

    function init() {
        // Get product ID from URL
        const productId = getProductIdFromUrl();
        
        if (productId) {
            loadProduct(productId);
        } else {
            showError();
        }
    }

    function getProductIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    function loadProduct(productId) {
        const product = ProductManager.getById(productId);
        
        if (product) {
            currentProduct = product;
            displayProduct(product);
            setupEventListeners(product);
            loadingState.classList.add('hidden');
            productContent.classList.remove('hidden');
            errorState.classList.add('hidden');
        } else {
            showError();
        }
    }

    function displayProduct(product) {
        // Format price
        const formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(product.price);

        // Update main content
        productTitle.textContent = product.name;
        productPrice.textContent = formattedPrice;
        productDescription.textContent = product.description;
        productDelivery.textContent = product.delivery;
        
        // Update breadcrumb
        categoryLink.href = `shop.html?category=${product.category}`;
        categoryLink.textContent = getCategoryDisplayName(product.category);
        productNameBreadcrumb.textContent = product.name;

        // Update main image
        mainImage.src = product.images[0];
        mainImage.alt = product.name;

        // Update specifications
        renderSpecifications(product.specifications);

        // Update features
        renderFeatures(product.features);

        // Update gallery thumbnails
        renderGalleryThumbnails(product.images);

        // Update favorite button state
        updateFavoriteButton(product.id);

        // Update related products
        renderRelatedProducts(product.category, product.id);
    }

    function renderSpecifications(specs) {
        productSpecs.innerHTML = '';
        
        Object.entries(specs).forEach(([key, value]) => {
            const specItem = document.createElement('div');
            specItem.className = 'bg-white p-4 rounded-lg border border-gray-200';
            specItem.innerHTML = `
                <h4 class="text-sm font-medium text-gray-500 mb-1">${formatSpecKey(key)}</h4>
                <p class="text-gray-900 font-semibold">${value}</p>
            `;
            productSpecs.appendChild(specItem);
        });
    }

    function renderFeatures(features) {
        productFeatures.innerHTML = '';
        
        features.forEach(feature => {
            const featureItem = document.createElement('li');
            featureItem.className = 'flex items-center space-x-3';
            featureItem.innerHTML = `
                <i class="fas fa-check text-green-500"></i>
                <span class="text-gray-600">${feature}</span>
            `;
            productFeatures.appendChild(featureItem);
        });
    }

    function renderGalleryThumbnails(images) {
        galleryThumbnails.innerHTML = '';
        
        images.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.innerHTML = `
                <img src="${image}" alt="Product image ${index + 1}" 
                     onclick="changeMainImage('${image}', this)">
            `;
            galleryThumbnails.appendChild(thumbnail);
        });
    }

    function renderRelatedProducts(category, currentProductId) {
        relatedProducts.innerHTML = '';
        
        const related = products
            .filter(p => p.category === category && p.id !== currentProductId)
            .slice(0, 3);

        if (related.length === 0) {
            // If no related products in same category, get from all products
            related = products
                .filter(p => p.id !== currentProductId)
                .slice(0, 3);
        }

        related.forEach(product => {
            const productCard = createRelatedProductCard(product);
            relatedProducts.appendChild(productCard);
        });
    }

    function createRelatedProductCard(product) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer';
        
        const formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(product.price);

        card.innerHTML = `
            <div class="relative">
                <img src="${product.images[0]}" alt="${product.name}" 
                     class="w-full h-64 object-cover">
                <div class="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">Cash on Delivery</div>
            </div>
            <div class="p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-2">${product.name}</h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-2xl font-bold text-primary-600">${formattedPrice}</span>
                    <button class="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                            onclick="window.location.href='product.html?id=${product.id}'">
                        View Details
                    </button>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `product.html?id=${product.id}`;
        });

        return card;
    }

    function setupEventListeners(product) {
        // Favorite button
        favoriteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleFavorite(product.id);
            updateFavoriteButton(product.id);
        });

        // Order now button
        orderNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openOrderModal(product);
        });

        // WhatsApp chat button
        whatsappChatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openWhatsAppChat(product);
        });

        // Image zoom functionality
        mainImage.addEventListener('mouseenter', () => {
            mainImage.style.transform = 'scale(1.5)';
            mainImage.style.transition = 'transform 0.3s ease';
        });

        mainImage.addEventListener('mouseleave', () => {
            mainImage.style.transform = 'scale(1)';
        });

        // Share buttons
        setupShareButtons(product);
    }

    function updateFavoriteButton(productId) {
        if (isFavorited(productId)) {
            favoriteBtn.innerHTML = '<i class="fas fa-heart text-red-500"></i>';
            favoriteBtn.classList.add('text-red-500');
        } else {
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
            favoriteBtn.classList.remove('text-red-500');
        }
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

    function isFavorited(productId) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        return favorites.includes(productId);
    }

    function openOrderModal(product) {
        // This will be handled by the main app.js file
        window.openOrderModal(product);
    }

    function openWhatsAppChat(product) {
        const message = `I'm interested in your ${product.name} (${product.price}). Can you provide more details?`;
        const whatsappUrl = `https://wa.me/YOURWHATSAPPNUMBER?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    function setupShareButtons(product) {
        // Facebook share
        document.querySelector('[href="#"]').addEventListener('click', (e) => {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(product.name);
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`, '_blank');
        });

        // Twitter share
        document.querySelectorAll('[href="#"]')[1].addEventListener('click', (e) => {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent(`Check out this amazing ${product.name}!`);
            window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
        });

        // Instagram share (opens in new tab with instructions)
        document.querySelectorAll('[href="#"]')[2].addEventListener('click', (e) => {
            e.preventDefault();
            alert('To share on Instagram, please take a screenshot of this product and share it on Instagram with your followers!');
        });

        // LinkedIn share
        document.querySelectorAll('[href="#"]')[3].addEventListener('click', (e) => {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(product.name);
            const summary = encodeURIComponent(product.description);
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`, '_blank');
        });
    }

    function showError() {
        loadingState.classList.add('hidden');
        productContent.classList.add('hidden');
        errorState.classList.remove('hidden');
    }

    // Utility functions
    function formatSpecKey(key) {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .replace(/_/g, ' ');
    }

    function getCategoryDisplayName(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    // Global functions for image gallery
    window.changeMainImage = function(imageSrc, thumbnailElement) {
        mainImage.src = imageSrc;
        
        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.classList.remove('active');
        });
        thumbnailElement.parentElement.classList.add('active');
    };

    window.zoomImage = function(event) {
        const image = event.target;
        const rect = image.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        
        if (event.deltaY < 0) {
            // Zoom in
            image.style.transformOrigin = `${xPercent}% ${yPercent}%`;
            image.style.transform = 'scale(2)';
        } else {
            // Zoom out
            image.style.transform = 'scale(1)';
        }
    };

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
});