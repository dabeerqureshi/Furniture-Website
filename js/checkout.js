// Checkout functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize checkout
    initCheckout();
    
    // Handle form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
});

function initCheckout() {
    // Load cart items and display them
    loadCheckoutItems();
    
    // Update cart count
    updateCartCount();
    
    // Initialize form validation
    initFormValidation();
}

function loadCheckoutItems() {
    const cartItems = getCartItems();
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const subtotalElement = document.getElementById('checkout-subtotal');
    const deliveryElement = document.getElementById('checkout-delivery');
    const totalElement = document.getElementById('checkout-total');
    
    if (!cartItems || cartItems.length === 0) {
        checkoutItemsContainer.innerHTML = '<p class="text-gray-600">Your cart is empty. <a href="shop.html" class="text-primary-600 hover:text-primary-700">Continue Shopping</a></p>';
        subtotalElement.textContent = '$0.00';
        deliveryElement.textContent = '$0.00';
        totalElement.textContent = '$0.00';
        return;
    }
    
    let subtotal = 0;
    let deliveryFee = 0;
    
    const itemsHtml = cartItems.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        return `
            <div class="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div class="flex items-center space-x-4">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                    <div>
                        <h4 class="font-medium text-gray-900">${item.name}</h4>
                        <p class="text-sm text-gray-600">Qty: ${item.quantity}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-gray-900">$${itemTotal.toFixed(2)}</p>
                </div>
            </div>
        `;
    }).join('');
    
    checkoutItemsContainer.innerHTML = itemsHtml;
    
    // Calculate delivery fee (free for orders over $100)
    if (subtotal < 100) {
        deliveryFee = 10;
    }
    
    const total = subtotal + deliveryFee;
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    deliveryElement.textContent = `$${deliveryFee.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const orderData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        city: formData.get('city'),
        postalCode: formData.get('postalCode'),
        country: formData.get('country'),
        address: formData.get('address'),
        paymentMethod: formData.get('paymentMethod'),
        notes: formData.get('notes'),
        items: getCartItems(),
        orderDate: new Date().toISOString(),
        orderNumber: generateOrderNumber(),
        status: 'pending'
    };
    
    // Calculate totals
    const totals = calculateOrderTotals(orderData.items);
    orderData.subtotal = totals.subtotal;
    orderData.deliveryFee = totals.deliveryFee;
    orderData.total = totals.total;
    
    // Validate form
    if (!validateOrderData(orderData)) {
        return;
    }
    
    // Create order
    const success = createOrder(orderData);
    
    if (success) {
        // Send email notifications
        sendOrderNotifications(orderData);
        
        // Clear cart
        clearCart();
        
        // Show success modal
        showSuccessModal();
        
        // Update cart count
        updateCartCount();
    }
}

function validateOrderData(orderData) {
    const requiredFields = ['name', 'email', 'phone', 'city', 'postalCode', 'address'];
    
    for (const field of requiredFields) {
        if (!orderData[field] || orderData[field].trim() === '') {
            alert(`Please fill in the ${field} field.`);
            return false;
        }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(orderData.email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    // Validate phone number
    if (!/^\+?[\d\s\-\(\)]{10,}$/.test(orderData.phone)) {
        alert('Please enter a valid phone number.');
        return false;
    }
    
    if (orderData.items.length === 0) {
        alert('Your cart is empty. Please add items before checking out.');
        return false;
    }
    
    return true;
}

function createOrder(orderData) {
    try {
        // Get existing orders
        const orders = getOrders();
        
        // Add new order
        orders.push(orderData);
        
        // Save orders with the correct key that admin.js expects
        localStorage.setItem('orders', JSON.stringify(orders));
        
        return true;
    } catch (error) {
        console.error('Error creating order:', error);
        alert('An error occurred while processing your order. Please try again.');
        return false;
    }
}

function sendOrderNotifications(orderData) {
    // Send customer confirmation email
    sendCustomerConfirmation(orderData);
    
    // Send admin notification email
    sendAdminNotification(orderData);
}

function sendCustomerConfirmation(orderData) {
    // EmailJS template for customer confirmation
    const templateParams = {
        to_name: orderData.name,
        to_email: orderData.email,
        order_number: orderData.orderNumber,
        order_date: new Date(orderData.orderDate).toLocaleDateString(),
        items: formatOrderItems(orderData.items),
        subtotal: `$${orderData.subtotal.toFixed(2)}`,
        delivery_fee: `$${orderData.deliveryFee.toFixed(2)}`,
        total: `$${orderData.total.toFixed(2)}`,
        customer_name: orderData.name,
        customer_email: orderData.email,
        customer_phone: orderData.phone,
        customer_address: `${orderData.address}, ${orderData.city}, ${orderData.postalCode}, ${orderData.country}`,
        payment_method: orderData.paymentMethod === 'cashOnDelivery' ? 'Cash on Delivery' : 'Bank Transfer'
    };
    
    // Note: In a real implementation, you would use your EmailJS service ID and template ID
    // emailjs.send('YOUR_SERVICE_ID', 'customer_confirmation_template', templateParams)
    //     .then(function(response) {
    //         console.log('Customer email sent successfully:', response.status, response.text);
    //     }, function(error) {
    //         console.error('Failed to send customer email:', error);
    //     });
    
    console.log('Customer confirmation email would be sent:', templateParams);
}

function sendAdminNotification(orderData) {
    // EmailJS template for admin notification
    const templateParams = {
        admin_email: 'admin@furniturestore.com',
        order_number: orderData.orderNumber,
        order_date: new Date(orderData.orderDate).toLocaleDateString(),
        customer_name: orderData.name,
        customer_email: orderData.email,
        customer_phone: orderData.phone,
        customer_address: `${orderData.address}, ${orderData.city}, ${orderData.postalCode}, ${orderData.country}`,
        items: formatOrderItems(orderData.items),
        subtotal: `$${orderData.subtotal.toFixed(2)}`,
        delivery_fee: `$${orderData.deliveryFee.toFixed(2)}`,
        total: `$${orderData.total.toFixed(2)}`,
        payment_method: orderData.paymentMethod === 'cashOnDelivery' ? 'Cash on Delivery' : 'Bank Transfer',
        notes: orderData.notes || 'No special instructions'
    };
    
    // Note: In a real implementation, you would use your EmailJS service ID and template ID
    // emailjs.send('YOUR_SERVICE_ID', 'admin_notification_template', templateParams)
    //     .then(function(response) {
    //         console.log('Admin notification email sent successfully:', response.status, response.text);
    //     }, function(error) {
    //         console.error('Failed to send admin email:', error);
    //     });
    
    console.log('Admin notification email would be sent:', templateParams);
}

function formatOrderItems(items) {
    return items.map(item => 
        `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
}

function generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp.toString().slice(-6)}-${random.toString().padStart(3, '0')}`;
}

function calculateOrderTotals(items) {
    let subtotal = 0;
    
    items.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    let deliveryFee = 0;
    if (subtotal < 100) {
        deliveryFee = 10;
    }
    
    const total = subtotal + deliveryFee;
    
    return {
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total
    };
}

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.remove('hidden');
        
        // Close modal button
        const closeBtn = document.getElementById('close-success-modal');
        if (closeBtn) {
            closeBtn.onclick = function() {
                modal.classList.add('hidden');
            };
        }
        
        // Close modal when clicking outside
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        };
    }
}

function initFormValidation() {
    const inputs = document.querySelectorAll('#checkout-form input, #checkout-form textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Remove error styling on input
            this.classList.remove('border-red-500');
            const errorElement = this.parentElement.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        });
    });
}

function validateField(field) {
    let isValid = true;
    let errorMessage = '';
    
    switch (field.name) {
        case 'name':
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Name is required';
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
        case 'phone':
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Phone number is required';
            } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
            break;
        case 'city':
        case 'postalCode':
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = `${field.name === 'city' ? 'City' : 'Postal Code'} is required`;
            }
            break;
        case 'address':
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Address is required';
            }
            break;
    }
    
    if (!isValid) {
        field.classList.add('border-red-500');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message text-red-500 text-sm mt-1';
        errorElement.textContent = errorMessage;
        field.parentElement.appendChild(errorElement);
    }
}

// Utility functions (these should be in cart.js but including here for completeness)
function getCartItems() {
    return JSON.parse(localStorage.getItem('furniture_cart') || '[]');
}

function clearCart() {
    localStorage.removeItem('furniture_cart');
}

function getOrders() {
    return JSON.parse(localStorage.getItem('furniture_orders') || '[]');
}

function updateCartCount() {
    const cartItems = getCartItems();
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    
    if (cartCountElement) {
        if (count > 0) {
            cartCountElement.textContent = count;
            cartCountElement.classList.remove('hidden');
        } else {
            cartCountElement.classList.add('hidden');
        }
    }
}