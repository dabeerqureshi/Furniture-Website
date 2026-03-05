// WhatsApp Integration JavaScript
// Handles WhatsApp order processing and messaging

// WhatsApp Configuration
const WHATSAPP_CONFIG = {
    phoneNumber: 'YOURWHATSAPPNUMBER', // Replace with actual number
    businessName: 'Furniture Store',
    currency: 'USD',
    currencySymbol: '$'
};

// WhatsApp Message Generator
const WhatsAppManager = {
    // Generate order message for WhatsApp
    generateOrderMessage(product, customer) {
        const formattedPrice = this.formatPrice(product.price);
        const totalPrice = this.formatPrice(product.price * customer.quantity);
        
        const message = `NEW FURNITURE ORDER

Product: ${product.name}
Price: ${formattedPrice}
Quantity: ${customer.quantity}
Total Price: ${totalPrice}

Customer Name: ${customer.name}
Phone: ${customer.phone}
City: ${customer.city}
Address: ${customer.address}

Payment Method: Cash on Delivery
Delivery: Same Day (if available)

Thank you for your order! We will contact you shortly.`;

        return message;
    },

    // Generate product inquiry message
    generateInquiryMessage(product) {
        const formattedPrice = this.formatPrice(product.price);
        
        const message = `Hello! I'm interested in your ${product.name}.

Product Details:
- Name: ${product.name}
- Price: ${formattedPrice}
- Category: ${this.getCategoryDisplayName(product.category)}

Could you please provide more information about this product?`;

        return message;
    },

    // Generate general inquiry message
    generateGeneralInquiry() {
        const message = `Hello! I'm interested in your furniture products.

Could you please help me find the right furniture for my needs?`;
        
        return message;
    },

    // Open WhatsApp with pre-filled message
    openWhatsApp(message, phoneNumber = null) {
        const targetNumber = phoneNumber || WHATSAPP_CONFIG.phoneNumber;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodedMessage}`;
        
        // Validate phone number format
        if (!this.validatePhoneNumber(targetNumber)) {
            console.warn('Invalid WhatsApp number. Please update the configuration.');
            alert('Unable to connect to WhatsApp. Please contact us directly.');
            return;
        }

        window.open(whatsappUrl, '_blank');
    },

    // Format price with currency
    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: WHATSAPP_CONFIG.currency,
            maximumFractionDigits: 0
        }).format(price);
    },

    // Get display name for category
    getCategoryDisplayName(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    },

    // Validate phone number format
    validatePhoneNumber(phoneNumber) {
        // Basic validation for international format
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
    },

    // Send order to WhatsApp
    sendOrderToWhatsApp(product, customer) {
        const message = this.generateOrderMessage(product, customer);
        this.openWhatsApp(message);
        
        // Log the order for tracking
        this.logOrder(product, customer);
    },

    // Send inquiry to WhatsApp
    sendInquiryToWhatsApp(product) {
        const message = this.generateInquiryMessage(product);
        this.openWhatsApp(message);
    },

    // Send general inquiry to WhatsApp
    sendGeneralInquiry() {
        const message = this.generateGeneralInquiry();
        this.openWhatsApp(message);
    },

    // Log order for tracking (can be extended to save to localStorage or send to server)
    logOrder(product, customer) {
        const order = {
            id: this.generateOrderId(),
            product: {
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.category
            },
            customer: customer,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        // Save to localStorage for order tracking
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        console.log('Order logged:', order);
    },

    // Generate unique order ID
    generateOrderId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `ORD-${timestamp}-${random}`.toUpperCase();
    },

    // Get order history
    getOrderHistory() {
        return JSON.parse(localStorage.getItem('orders')) || [];
    },

    // Update order status
    updateOrderStatus(orderId, status) {
        const orders = this.getOrderHistory();
        const orderIndex = orders.findIndex(order => order.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = status;
            localStorage.setItem('orders', JSON.stringify(orders));
            return true;
        }
        
        return false;
    }
};

// Order Form Handler
class OrderFormHandler {
    constructor() {
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupFormSubmission();
    }

    setupFormValidation() {
        const form = document.getElementById('order-form');
        if (!form) return;

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                // Clear error message on input
                const errorElement = input.parentElement.querySelector('.error-message');
                if (errorElement) {
                    errorElement.remove();
                }
            });
        });
    }

    validateField(input) {
        const value = input.value.trim();
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message text-red-500 text-sm mt-1 block';
        
        let isValid = true;
        let errorMessage = '';

        switch (input.type) {
            case 'tel':
                if (!this.validatePhone(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
            case 'number':
                if (!this.validateQuantity(value)) {
                    isValid = false;
                    errorMessage = 'Quantity must be at least 1';
                }
                break;
            default:
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'This field is required';
                }
        }

        if (!isValid) {
            input.classList.add('border-red-500');
            input.classList.remove('border-gray-300');
            errorElement.textContent = errorMessage;
            input.parentElement.appendChild(errorElement);
        } else {
            input.classList.remove('border-red-500');
            input.classList.add('border-gray-300');
        }

        return isValid;
    }

    validatePhone(phone) {
        // Basic phone validation - allows international format
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/;
        return phoneRegex.test(phone);
    }

    validateQuantity(quantity) {
        const num = parseInt(quantity);
        return !isNaN(num) && num >= 1;
    }

    setupFormSubmission() {
        const form = document.getElementById('order-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                this.processOrder();
            }
        });
    }

    validateForm() {
        const form = document.getElementById('order-form');
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    processOrder() {
        const form = document.getElementById('order-form');
        const formData = new FormData(form);
        
        const customer = {
            name: formData.get('customer-name'),
            phone: formData.get('customer-phone'),
            city: formData.get('customer-city'),
            address: formData.get('customer-address'),
            quantity: parseInt(formData.get('product-quantity'))
        };

        const product = {
            id: parseInt(document.getElementById('product-name').value),
            name: document.getElementById('modal-product-name').textContent,
            price: parseInt(document.getElementById('product-price').value.replace(/[^0-9]/g, ''))
        };

        // Send order to WhatsApp
        WhatsAppManager.sendOrderToWhatsApp(product, customer);
        
        // Show success modal
        this.showSuccessModal();
        
        // Close order modal
        this.closeOrderModal();
    }

    showSuccessModal() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    closeOrderModal() {
        const modal = document.getElementById('order-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
}

// Modal Management
class ModalManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupModalEvents();
    }

    setupModalEvents() {
        // Close order modal
        const closeModalBtn = document.getElementById('close-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                document.getElementById('order-modal').classList.add('hidden');
            });
        }

        // Close success modal
        const closeSuccessModalBtn = document.getElementById('close-success-modal');
        if (closeSuccessModalBtn) {
            closeSuccessModalBtn.addEventListener('click', () => {
                document.getElementById('success-modal').classList.add('hidden');
            });
        }

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            const orderModal = document.getElementById('order-modal');
            const successModal = document.getElementById('success-modal');
            
            if (orderModal && e.target === orderModal) {
                orderModal.classList.add('hidden');
            }
            
            if (successModal && e.target === successModal) {
                successModal.classList.add('hidden');
            }
        });
    }

    openOrderModal(product) {
        if (!product) return;

        // Set product details in modal
        document.getElementById('product-name').value = product.id;
        document.getElementById('product-price').value = product.price;
        document.getElementById('modal-product-name').textContent = product.name;
        
        const totalPrice = product.price;
        document.getElementById('modal-total-price').textContent = WhatsAppManager.formatPrice(totalPrice);

        // Show modal
        document.getElementById('order-modal').classList.remove('hidden');
    }
}

// Initialize WhatsApp integration
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form handler
    new OrderFormHandler();
    
    // Initialize modal manager
    new ModalManager();
    
    // Make functions available globally
    window.WhatsAppManager = WhatsAppManager;
    window.openOrderModal = function(product) {
        const modalManager = new ModalManager();
        modalManager.openOrderModal(product);
    };
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WhatsAppManager, OrderFormHandler, ModalManager };
}