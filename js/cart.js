// Shopping Cart JavaScript
// Handles cart functionality, local storage, and WhatsApp order processing

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
    
    // Send cart order to WhatsApp
    sendCartToWhatsApp() {
        const cart = this.getCart();
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // Show checkout form modal
        this.showCheckoutForm();
    },
    
    // Show checkout form modal
    showCheckoutForm() {
        const modal = document.getElementById('checkout-modal');
        if (!modal) {
            this.createCheckoutModal();
        } else {
            modal.classList.remove('hidden');
        }
    },
    
    // Create checkout modal
    createCheckoutModal() {
        const modal = document.createElement('div');
        modal.id = 'checkout-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 hidden overflow-y-auto';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-md w-full mx-auto my-4 p-4 sm:p-6 relative animate-in slide-in-from-bottom-2 duration-300 max-h-[90vh] overflow-y-auto">
                <button id="close-checkout-modal" class="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 z-10 bg-white rounded-full p-1 sm:p-2 shadow-md">
                    <i class="fas fa-times text-xl sm:text-2xl"></i>
                </button>
                
                <div class="text-center mb-4 sm:mb-6 mt-2">
                    <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Checkout</h3>
                    <p class="text-sm sm:text-base text-gray-600">Fill in your details to place your order</p>
                </div>
                
                <form id="checkout-form" class="space-y-3 sm:space-y-4">
                    <input type="hidden" id="checkout-products">
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input type="text" id="checkout-name" required
                               class="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input type="email" id="checkout-email" required
                               class="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input type="tel" id="checkout-phone" required
                               class="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input type="text" id="checkout-city" required
                               class="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                        <input type="text" id="checkout-postal-code" required
                               class="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <textarea id="checkout-address" required rows="3"
                                  class="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"></textarea>
                    </div>
                    
                    <div class="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm sm:text-base text-gray-600">Items:</span>
                            <span id="checkout-items-count" class="font-semibold">0</span>
                        </div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm sm:text-base text-gray-600">Subtotal:</span>
                            <span id="checkout-subtotal" class="font-semibold">$0</span>
                        </div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm sm:text-base text-gray-600">Delivery:</span>
                            <span class="text-green-600 font-semibold">Free</span>
                        </div>
                        <div class="flex justify-between items-center border-t border-gray-300 pt-2">
                            <span class="text-sm sm:text-base text-gray-600 font-medium">Total:</span>
                            <span id="checkout-total" class="text-lg sm:text-xl font-bold text-primary-600">$0</span>
                        </div>
                    </div>
                    
                    <button type="submit" 
                            class="w-full bg-primary-600 text-white py-2 sm:py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Checkout via WhatsApp
                    </button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupCheckoutForm();
        this.updateCheckoutForm();
        modal.classList.remove('hidden');
    },
    
    // Setup checkout form
    setupCheckoutForm() {
        const form = document.getElementById('checkout-form');
        const closeModalBtn = document.getElementById('close-checkout-modal');
        const modal = document.getElementById('checkout-modal');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processCheckout();
            });
        }
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        }
    },
    
    // Update checkout form with cart data
    updateCheckoutForm() {
        const cart = this.getCart();
        const itemsCount = this.getCartCount();
        const subtotal = this.getCartTotal();
        const total = subtotal; // No delivery fee
        
        document.getElementById('checkout-items-count').textContent = itemsCount;
        document.getElementById('checkout-subtotal').textContent = `$${subtotal}`;
        document.getElementById('checkout-total').textContent = `$${total}`;
    },
    
    // Process checkout
    processCheckout() {
        const form = document.getElementById('checkout-form');
        const customer = {
            name: document.getElementById('checkout-name').value,
            email: document.getElementById('checkout-email').value,
            phone: document.getElementById('checkout-phone').value,
            city: document.getElementById('checkout-city').value,
            postalCode: document.getElementById('checkout-postal-code').value,
            address: document.getElementById('checkout-address').value
        };
        
        // Validate required fields
        if (!customer.name || !customer.email || !customer.phone || !customer.city || !customer.postalCode || !customer.address) {
            alert('Please fill in all required fields.');
            return;
        }
        
        const cart = this.getCart();
        const total = this.getCartTotal();
        
        // Generate WhatsApp message with customer details
        const message = this.generateCheckoutMessage(cart, customer, total);
        const whatsappUrl = `https://wa.me/923144781120?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
        
        // Clear cart after sending order
        this.clearCart();
        
        // Close modal
        document.getElementById('checkout-modal').classList.add('hidden');
        
        // Show success message
        this.showSuccessMessage();
    },
    
    // Generate checkout message with customer details
    generateCheckoutMessage(cart, customer, total) {
        let message = `NEW FURNITURE ORDER FROM CART\n\n`;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            message += `${index + 1}. ${item.name}\n`;
            message += `   Price: $${item.price}\n`;
            message += `   Quantity: ${item.quantity}\n`;
            message += `   Total: $${itemTotal}\n\n`;
        });
        
        message += `SUBTOTAL: $${total}\n`;
        message += `Payment Method: Cash on Delivery\n`;
        message += `Delivery: Same Day (if available)\n\n`;
        message += `Customer Details:\n`;
        message += `Name: ${customer.name}\n`;
        message += `Email: ${customer.email}\n`;
        message += `Phone: ${customer.phone}\n`;
        message += `City: ${customer.city}\n`;
        message += `Postal Code: ${customer.postalCode}\n`;
        message += `Address: ${customer.address}\n\n`;
        message += `Thank you for your order! We will contact you shortly.`;
        
        return message;
    },
    
    // Update cart UI elements
    updateCartUI() {
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
                    <button onclick="CartManager.sendCartToWhatsApp()" 
                            class="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                        Order Now
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
                        <button onclick="CartManager.sendCartToWhatsApp()" 
                                class="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700">
                            Confirm Order
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