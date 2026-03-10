// Shopping Cart JavaScript
// Handles cart functionality, local storage, and checkout order processing

// Cart Manager
const CartManager = {
    cartKey: 'furniture_cart',
    
    // Get cart from localStorage
    getCart() {
        const cart = localStorage.getItem(this.cartKey);
        return cart ? JSON.parse(cart) : [];
    },
    
    // Save cart to localStorage
    saveCart(cart) {
        localStorage.setItem(this.cartKey, JSON.stringify(cart));
        this.updateCartUI();
    },
    
    // Add item to cart
    addToCart(product, quantity = 1) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                quantity: quantity,
                category: product.category
            });
        }
        
        this.saveCart(cart);
        this.showCartNotification(product.name);
    },
    
    // Remove item from cart
    removeFromCart(productId) {
        const cart = this.getCart();
        const updatedCart = cart.filter(item => item.id !== productId);
        this.saveCart(updatedCart);
    },
    
    // Update item quantity
    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart(cart);
            }
        }
    },
    
    // Clear entire cart
    clearCart() {
        localStorage.removeItem(this.cartKey);
        this.updateCartUI();
    },
    
    // Get cart total
    getCartTotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    // Get cart item count
    getCartCount() {
        const cart = this.getCart();
        return cart.reduce((count, item) => count + item.quantity, 0);
    },
    
    // Send cart order to checkout
    sendCartToCheckout() {
        const cart = this.getCart();
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // Store cart in session storage for checkout
        sessionStorage.setItem('checkout_cart', JSON.stringify(cart));
        
        // Redirect to checkout page
        window.location.href = 'checkout.html';
    },
    
    // Update cart UI elements
    updateCartUI() {
        // Clean up cart first to remove any unavailable products
        this.cleanCart();
        
        // Update cart count in header
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const count = this.getCartCount();
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'inline' : 'none';
        }
        
        // Update cart dropdown if exists
        this.updateCartDropdown();
        
        // Update cart page if exists
        this.updateCartPage();
    },
    
    // Update cart dropdown
    updateCartDropdown() {
        const cartDropdown = document.getElementById('cart-dropdown');
        if (!cartDropdown) return;
        
        const cart = this.getCart();
        
        if (cart.length === 0) {
            cartDropdown.innerHTML = `
                <div class="p-4 text-center text-gray-500">
                    Your cart is empty
                </div>
            `;
            return;
        }
        
        let html = '';
        cart.forEach(item => {
            html += `
                <div class="flex items-center space-x-3 p-3 border-b border-gray-100">
                    <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded">
                    <div class="flex-1">
                        <h4 class="font-medium text-gray-900">${item.name}</h4>
                        <p class="text-sm text-gray-600">$${item.price} x ${item.quantity}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold">$${item.price * item.quantity}</p>
                        <button onclick="CartManager.removeFromCart(${item.id})" 
                                class="text-red-500 hover:text-red-700 text-sm">Remove</button>
                    </div>
                </div>
            `;
        });
        
        html += `
            <div class="p-3 border-t border-gray-100">
                <div class="flex justify-between items-center mb-3">
                    <span class="text-gray-600">Total:</span>
                    <span class="font-bold text-lg">$${this.getCartTotal()}</span>
                </div>
                <div class="flex space-x-2">
                    <button onclick="window.location.href='cart.html'" 
                            class="flex-1 bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700">
                        View Cart
                    </button>
                    <button onclick="CartManager.sendCartToCheckout()" 
                            class="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                        Checkout
                    </button>
                </div>
            </div>
        `;
        
        cartDropdown.innerHTML = html;
    },
    
    // Update cart page
    updateCartPage() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalContainer = document.getElementById('cart-total');
        const cartEmptyContainer = document.getElementById('cart-empty');
        
        if (!cartItemsContainer) return;
        
        const cart = this.getCart();
        
        if (cart.length === 0) {
            cartItemsContainer.style.display = 'none';
            cartTotalContainer.style.display = 'none';
            if (cartEmptyContainer) cartEmptyContainer.style.display = 'block';
            return;
        }
        
        if (cartEmptyContainer) cartEmptyContainer.style.display = 'none';
        cartItemsContainer.style.display = 'block';
        cartTotalContainer.style.display = 'block';
        
        let html = '';
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            html += `
                <div class="cart-item bg-white p-4 rounded-lg shadow mb-4">
                    <div class="flex items-center space-x-4">
                        <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
                        <div class="flex-1">
                            <h3 class="text-lg font-semibold">${item.name}</h3>
                            <p class="text-gray-600">Category: ${item.category}</p>
                            <div class="flex items-center space-x-4 mt-2">
                                <div class="flex items-center space-x-2">
                                    <button onclick="CartManager.updateQuantity(${item.id}, ${item.quantity - 1})" 
                                            class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                                        -
                                    </button>
                                    <span class="w-8 text-center">${item.quantity}</span>
                                    <button onclick="CartManager.updateQuantity(${item.id}, ${item.quantity + 1})" 
                                            class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                                        +
                                    </button>
                                </div>
                                <span class="font-semibold">$${item.price}</span>
                                <span class="text-gray-600">Subtotal: $${itemTotal}</span>
                            </div>
                        </div>
                        <button onclick="CartManager.removeFromCart(${item.id})" 
                                class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash text-xl"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = html;
        
        if (cartTotalContainer) {
            cartTotalContainer.innerHTML = `
                <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-xl font-bold">Cart Total</span>
                        <span class="text-2xl font-bold text-primary-600">$${this.getCartTotal()}</span>
                    </div>
                    <div class="flex space-x-4">
                        <button onclick="CartManager.clearCart()" 
                                class="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400">
                            Clear Cart
                        </button>
                        <button onclick="CartManager.sendCartToCheckout()" 
                                class="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700">
                            Checkout
                        </button>
                    </div>
                </div>
            `;
        }
    },
    
    // Show cart notification
    showCartNotification(productName) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas fa-shopping-cart"></i>
                <span>Added to cart: ${productName}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 10);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    },
    
    // Show success message
    showSuccessMessage() {
        const notification = document.createElement('div');
        notification.className = 'cart-notification fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas fa-check-circle"></i>
                <span>Order sent to WhatsApp! Cart cleared.</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 10);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    },

    // Clean up cart by removing items that are no longer available
    cleanCart() {
        const cart = this.getCart();
        const cleanedCart = [];
        let hasChanges = false;

        // Check if ProductManager is available
        if (typeof window.ProductManager === 'undefined') {
            console.warn('ProductManager not available, cannot clean cart');
            return;
        }

        cart.forEach(item => {
            // Check if product still exists in the product database
            const product = window.ProductManager.getById(item.id);
            if (product) {
                cleanedCart.push(item);
            } else {
                console.log(`Product ${item.name} (ID: ${item.id}) no longer available, removing from cart`);
                hasChanges = true;
            }
        });

        if (hasChanges) {
            this.saveCart(cleanedCart);
            console.log('Cart cleaned up, removed unavailable products');
        }
    }
};

// Cart Button Handler
class CartButtonHandler {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupCartButton();
        this.setupCartModal();
        this.updateCartUI();
    }
    
    setupCartButton() {
        const cartButton = document.getElementById('cart-button');
        const cartDropdown = document.getElementById('cart-dropdown');
        
        if (cartButton && cartDropdown) {
            cartButton.addEventListener('click', (e) => {
                e.preventDefault();
                cartDropdown.classList.toggle('hidden');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!cartButton.contains(e.target) && !cartDropdown.contains(e.target)) {
                    cartDropdown.classList.add('hidden');
                }
            });
        }
    }
    
    setupCartModal() {
        // Handle "Add to Cart" buttons
        document.addEventListener('click', (e) => {
            const addToCartBtn = e.target.closest('.add-to-cart-btn');
            if (addToCartBtn) {
                e.preventDefault();
                const productId = addToCartBtn.dataset.productId;
                const product = ProductManager.getById(productId);
                
                if (product) {
                    CartManager.addToCart(product, 1);
                }
            }
        });
    }
    
    updateCartUI() {
        CartManager.updateCartUI();
    }
}

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart button handler
    new CartButtonHandler();
    
    // Update cart on page load
    CartManager.updateCartUI();
    
    // Make CartManager available globally
    window.CartManager = CartManager;
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CartManager, CartButtonHandler };
}