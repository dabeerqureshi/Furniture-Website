// Admin Panel JavaScript
// Handles admin authentication, product management, and dashboard functionality

// Admin Configuration
const ADMIN_CONFIG = {
    username: 'admin',
    password: 'secure123',
    localStorageKey: 'furnitureStoreProducts',
    sessionTimeout: 30 * 60 * 1000, // 30 minutes in milliseconds
    sessionKey: 'adminSession'
};

// Admin Manager
const AdminManager = {
    // Initialize admin panel
    init() {
        this.setupEventListeners();
        this.checkAuth();
    },

    // Setup event listeners
    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Add product button
        const addProductBtn = document.getElementById('add-product-btn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                this.openProductModal();
            });
        }

        // Product form
        const productForm = document.getElementById('product-form');
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProductSubmit();
            });
        }

        // Cancel product button
        const cancelProductBtn = document.getElementById('cancel-product-btn');
        if (cancelProductBtn) {
            cancelProductBtn.addEventListener('click', () => {
                this.closeProductModal();
            });
        }

        // Close product modal
        const closeProductModalBtn = document.getElementById('close-product-modal');
        if (closeProductModalBtn) {
            closeProductModalBtn.addEventListener('click', () => {
                this.closeProductModal();
            });
        }

        // Delete product button
        const deleteProductBtn = document.getElementById('delete-product-btn');
        if (deleteProductBtn) {
            deleteProductBtn.addEventListener('click', () => {
                this.handleProductDelete();
            });
        }

        // Image upload handlers
        this.setupImageUploads();
        
        // Setup activity tracking for session management
        this.setupActivityTracking();

        // Refresh orders button
        const refreshOrdersBtn = document.getElementById('refresh-orders-btn');
        if (refreshOrdersBtn) {
            refreshOrdersBtn.addEventListener('click', () => {
                this.loadOrders();
                this.showMessage('Orders refreshed successfully!', 'success');
            });
        }

        // Analytics tab buttons
        const analyticsTabs = document.querySelectorAll('.analytics-tab');
        analyticsTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchAnalyticsTab(e.target.id);
            });
        });
    },

    // Setup activity tracking
    setupActivityTracking() {
        // Track mouse movements, clicks, key presses, and scrolls
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        
        events.forEach(event => {
            document.addEventListener(event, () => {
                this.resetSessionTimer();
            }, { passive: true });
        });
    },

    // Check if user is authenticated
    checkAuth() {
        const session = this.getSession();
        if (session && this.isValidSession(session)) {
            this.showDashboard();
            this.startSessionTimer();
        } else {
            this.handleLogout();
        }
    },

    // Handle login
    handleLogin() {
        const usernameInput = document.getElementById('admin-username');
        const passwordInput = document.getElementById('admin-password');
        const loginError = document.getElementById('login-error');
        
        if (!usernameInput || !passwordInput || !loginError) return;

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (username === ADMIN_CONFIG.username && password === ADMIN_CONFIG.password) {
            this.createSession();
            this.showDashboard();
            this.startSessionTimer();
            this.showMessage('Welcome to the admin panel!', 'success');
        } else {
            loginError.textContent = 'Invalid username or password. Please try again.';
            loginError.classList.remove('hidden');
        }
    },

    // Handle logout
    handleLogout() {
        this.clearSession();
        this.stopSessionTimer();
        this.showLogin();
        this.showMessage('You have been logged out.', 'info');
    },

    // Create session
    createSession() {
        const session = {
            username: ADMIN_CONFIG.username,
            timestamp: Date.now(),
            expires: Date.now() + ADMIN_CONFIG.sessionTimeout
        };
        localStorage.setItem(ADMIN_CONFIG.sessionKey, JSON.stringify(session));
    },

    // Get session
    getSession() {
        const sessionData = localStorage.getItem(ADMIN_CONFIG.sessionKey);
        return sessionData ? JSON.parse(sessionData) : null;
    },

    // Check if session is valid
    isValidSession(session) {
        return session && session.expires > Date.now();
    },

    // Clear session
    clearSession() {
        localStorage.removeItem(ADMIN_CONFIG.sessionKey);
    },

    // Start session timer
    startSessionTimer() {
        this.stopSessionTimer(); // Clear any existing timer
        this.sessionTimer = setInterval(() => {
            const session = this.getSession();
            if (!session || !this.isValidSession(session)) {
                this.handleLogout();
                this.showMessage('Session expired. Please log in again.', 'error');
            } else {
                this.updateSessionTimerDisplay();
            }
        }, 1000);
    },

    // Stop session timer
    stopSessionTimer() {
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
            this.sessionTimer = null;
        }
    },

    // Update session timer display
    updateSessionTimerDisplay() {
        const session = this.getSession();
        if (!session) return;

        const timeLeft = Math.max(0, session.expires - Date.now());
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        
        const timerDisplay = document.getElementById('session-timer');
        if (timerDisplay) {
            timerDisplay.textContent = `Auto-logout in: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Change color when time is running low
            if (timeLeft < 300000) { // 5 minutes
                timerDisplay.classList.remove('text-gray-600');
                timerDisplay.classList.add('text-red-600', 'font-semibold');
            }
        }
    },

    // Reset session timer on activity
    resetSessionTimer() {
        const session = this.getSession();
        if (session) {
            session.expires = Date.now() + ADMIN_CONFIG.sessionTimeout;
            localStorage.setItem(ADMIN_CONFIG.sessionKey, JSON.stringify(session));
            this.updateSessionTimerDisplay();
        }
    },

    // Show login modal
    showLogin() {
        const loginModal = document.getElementById('login-modal');
        const dashboard = document.getElementById('admin-dashboard');
        
        if (loginModal) loginModal.classList.remove('hidden');
        if (dashboard) dashboard.classList.add('hidden');
        
        // Clear password field
        const passwordInput = document.getElementById('admin-password');
        if (passwordInput) passwordInput.value = '';
    },

    // Show dashboard
    showDashboard() {
        const loginModal = document.getElementById('login-modal');
        const dashboard = document.getElementById('admin-dashboard');
        
        if (loginModal) loginModal.classList.add('hidden');
        if (dashboard) dashboard.classList.remove('hidden');
        
        this.loadDashboard();
    },

    // Load dashboard data
    loadDashboard() {
        this.updateStats();
        this.loadProducts();
        this.loadOrders();
        this.loadAnalyticsData('analytics-today'); // Load default analytics data
    },

    // Load orders from localStorage
    loadOrders() {
        const orders = this.getAllOrders();
        const ordersCount = orders.length;
        
        // Update orders count in dashboard
        const ordersCountEl = document.getElementById('total-orders');
        if (ordersCountEl) {
            ordersCountEl.textContent = ordersCount;
        }

        // Load orders into table
        this.renderOrdersTable(orders);
    },

    // Render orders table
    renderOrdersTable(orders) {
        const tbody = document.getElementById('orders-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (orders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                        No orders found. Orders from the website will appear here.
                    </td>
                </tr>
            `;
            return;
        }

        orders.forEach(order => {
            const row = document.createElement('tr');
            const totalAmount = order.total;
            
            // Handle different order structures
            const customerName = order.name || order.customer?.name || 'Unknown';
            const customerPhone = order.phone || order.customer?.phone || 'Unknown';
            const customerEmail = order.email || order.customer?.email || 'Unknown';
            const customerCity = order.city || order.customer?.city || 'Unknown';
            const customerAddress = order.address || order.customer?.address || 'Unknown';
            
            // Get first item details
            const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
            const itemName = firstItem ? firstItem.name : 'Unknown Product';
            const itemQuantity = firstItem ? firstItem.quantity : 0;
            const itemImage = firstItem ? firstItem.image : '';
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${order.orderNumber || order.id || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div class="font-medium">${customerName}</div>
                    <div class="text-gray-500">${customerPhone}</div>
                    <div class="text-gray-500 text-xs">${customerEmail}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div class="flex items-center space-x-2">
                        ${itemImage ? `<img src="${itemImage}" alt="${itemName}" class="w-8 h-8 object-cover rounded">` : `<div class="w-8 h-8 bg-gray-200 rounded"></div>`}
                        <div>
                            <div class="font-medium">${itemName}</div>
                            <div class="text-gray-500">${itemQuantity}x</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    ${this.formatCurrency(totalAmount)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${this.getOrderStatusClass(order.status)}">
                        ${this.getOrderStatusText(order.status)}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${this.formatDate(order.orderDate || order.timestamp)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onclick="adminManager.viewOrderDetails('${order.orderNumber || order.id}')" 
                            class="text-blue-600 hover:text-blue-900">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${order.status !== 'delivered' && order.status !== 'cancelled' ? `
                        <button onclick="adminManager.updateOrderStatus('${order.orderNumber || order.id}', 'confirmed')" 
                                class="text-green-600 hover:text-green-900">
                            <i class="fas fa-check"></i> Confirm
                        </button>
                        <button onclick="adminManager.updateOrderStatus('${order.orderNumber || order.id}', 'in_transit')" 
                                class="text-purple-600 hover:text-purple-900">
                            <i class="fas fa-truck"></i> Transit
                        </button>
                        <button onclick="adminManager.updateOrderStatus('${order.orderNumber || order.id}', 'delivered')" 
                                class="text-green-600 hover:text-green-900">
                            <i class="fas fa-box"></i> Deliver
                        </button>
                    ` : ''}
                    ${order.status !== 'cancelled' ? `
                        <button onclick="adminManager.updateOrderStatus('${order.orderNumber || order.id}', 'cancelled')" 
                                class="text-red-600 hover:text-red-900">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    ` : ''}
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    // View order details
    viewOrderDetails(orderNumber) {
        const orders = this.getAllOrders();
        const order = orders.find(o => o.orderNumber === orderNumber);
        
        if (!order) {
            this.showMessage('Order not found.', 'error');
            return;
        }

        // Create modal for order details
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-2xl w-full p-6 animate-in slide-in-from-bottom-2 duration-300">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold text-gray-900">Order Details</h3>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-gray-900 mb-2">Order Information</h4>
                        <p><span class="text-gray-600">Order Number:</span> <span class="font-medium">${order.orderNumber}</span></p>
                        <p><span class="text-gray-600">Status:</span> 
                            <span class="px-2 py-1 rounded-full text-xs font-semibold ${this.getOrderStatusClass(order.status)}">
                                ${this.getOrderStatusText(order.status)}
                            </span>
                        </p>
                        <p><span class="text-gray-600">Date:</span> <span class="font-medium">${this.formatDate(order.orderDate)}</span></p>
                        ${order.updatedAt ? `<p><span class="text-gray-600">Updated:</span> <span class="font-medium">${this.formatDate(order.updatedAt)}</span></p>` : ''}
                    </div>
                    
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-gray-900 mb-2">Customer Information</h4>
                        <p><span class="text-gray-600">Name:</span> <span class="font-medium">${order.name}</span></p>
                        <p><span class="text-gray-600">Email:</span> <span class="font-medium">${order.email}</span></p>
                        <p><span class="text-gray-600">Phone:</span> <span class="font-medium">${order.phone}</span></p>
                        <p><span class="text-gray-600">City:</span> <span class="font-medium">${order.city}</span></p>
                        <p><span class="text-gray-600">Address:</span> <span class="font-medium">${order.address}</span></p>
                    </div>
                    
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-gray-900 mb-2">Product Information</h4>
                        ${order.items.map(item => `
                            <div class="flex items-center space-x-3 mb-3">
                                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                                <div>
                                    <p class="font-medium">${item.name}</p>
                                    <p class="text-gray-600">${this.formatCurrency(item.price)} x ${item.quantity}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-gray-900 mb-2">Order Summary</h4>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Subtotal:</span>
                                <span class="font-medium">${this.formatCurrency(order.subtotal)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Delivery Fee:</span>
                                <span class="font-medium">${this.formatCurrency(order.deliveryFee)}</span>
                            </div>
                            <div class="flex justify-between border-t pt-2">
                                <span class="font-semibold">Total:</span>
                                <span class="font-semibold">${this.formatCurrency(order.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 flex justify-end space-x-3">
                    <button onclick="this.closest('.fixed').remove()" 
                            class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        Close
                    </button>
                    ${order.status !== 'delivered' && order.status !== 'cancelled' ? `
                        <button onclick="adminManager.updateOrderStatus('${order.orderNumber}', 'delivered'); this.closest('.fixed').remove()" 
                                class="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                            Mark as Delivered
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    // Get all orders from localStorage
    getAllOrders() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        return orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },

    // Update order status
    updateOrderStatus(orderNumber, status) {
        const orders = this.getAllOrders();
        const orderIndex = orders.findIndex(order => order.orderNumber === orderNumber);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = status;
            orders[orderIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('orders', JSON.stringify(orders));
            this.loadOrders();
            this.showMessage('Order status updated successfully!', 'success');
            
            // Send email notification if order is confirmed
            if (status === 'confirmed') {
                this.sendOrderConfirmationEmail(orders[orderIndex]);
            }
            
            return true;
        }
        
        return false;
    },

    // Send order confirmation email
    sendOrderConfirmationEmail(order) {
        // EmailJS template for order confirmation
        const templateParams = {
            to_name: order.name,
            to_email: order.email,
            order_number: order.orderNumber,
            order_date: new Date(order.orderDate).toLocaleDateString(),
            items: order.items.map(item => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n'),
            subtotal: `$${order.subtotal.toFixed(2)}`,
            delivery_fee: `$${order.deliveryFee.toFixed(2)}`,
            total: `$${order.total.toFixed(2)}`,
            customer_name: order.name,
            customer_email: order.email,
            customer_phone: order.phone,
            customer_address: order.address,
            payment_method: order.paymentMethod === 'cashOnDelivery' ? 'Cash on Delivery' : 'Bank Transfer'
        };
        
        // Note: In a real implementation, you would use your EmailJS service ID and template ID
        // emailjs.send('YOUR_SERVICE_ID', 'order_confirmation_template', templateParams)
        //     .then(function(response) {
        //         console.log('Order confirmation email sent successfully:', response.status, response.text);
        //     }, function(error) {
        //         console.error('Failed to send order confirmation email:', error);
        //     });
        
        console.log('Order confirmation email would be sent:', templateParams);
    },

    // Get order status badge class
    getOrderStatusClass(status) {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'in_transit': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    },

    // Get order status display text
    getOrderStatusText(status) {
        switch (status) {
            case 'pending': return 'Pending';
            case 'confirmed': return 'Confirmed';
            case 'in_transit': return 'In Transit';
            case 'delivered': return 'Delivered';
            case 'cancelled': return 'Cancelled';
            default: return 'Unknown';
        }
    },

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Get customer management data
    getCustomerManagementData() {
        const orders = this.getAllOrders();
        const customers = {};
        
        orders.forEach(order => {
            // Handle different order structures
            const customerId = order.phone || order.customer?.phone || order.email || order.customer?.email;
            if (!customerId) return;
            
            if (!customers[customerId]) {
                customers[customerId] = {
                    name: order.name || order.customer?.name || 'Unknown',
                    email: order.email || order.customer?.email || 'Unknown',
                    phone: order.phone || order.customer?.phone || 'Unknown',
                    city: order.city || order.customer?.city || 'Unknown',
                    address: order.address || order.customer?.address || 'Unknown',
                    orderCount: 0,
                    totalSpent: 0,
                    lastOrder: order.orderDate || order.timestamp
                };
            }
            
            customers[customerId].orderCount++;
            
            // Calculate total spent from items
            if (order.items && order.items.length > 0) {
                const orderTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                customers[customerId].totalSpent += orderTotal;
            }
            
            if ((order.orderDate || order.timestamp) > customers[customerId].lastOrder) {
                customers[customerId].lastOrder = order.orderDate || order.timestamp;
            }
        });

        return Object.values(customers).sort((a, b) => b.totalSpent - a.totalSpent);
    },

    // Get sales analytics data
    getSalesAnalytics() {
        const orders = this.getAllOrders();
        const today = new Date();
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay());
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        const stats = {
            totalOrders: orders.length,
            totalRevenue: 0,
            pendingOrders: 0,
            deliveredOrders: 0,
            todayOrders: 0,
            todayRevenue: 0,
            weekOrders: 0,
            weekRevenue: 0,
            monthOrders: 0,
            monthRevenue: 0,
            popularProducts: {},
            categorySales: {}
        };

        orders.forEach(order => {
            // Process each item in the order
            if (order.items && order.items.length > 0) {
                const orderDate = new Date(order.orderDate || order.timestamp);
                let orderAmount = 0;

                // Calculate total order amount from items
                order.items.forEach(item => {
                    const itemAmount = item.price * item.quantity;
                    orderAmount += itemAmount;
                    
                    // Only include sofa items in analytics
                    if (item.category === 'sofas') {
                        // Popular products (only sofas)
                        if (!stats.popularProducts[item.name]) {
                            stats.popularProducts[item.name] = {
                                name: item.name,
                                category: item.category,
                                count: 0,
                                revenue: 0
                            };
                        }
                        stats.popularProducts[item.name].count += item.quantity;
                        stats.popularProducts[item.name].revenue += itemAmount;

                        // Category sales (only sofas)
                        const category = 'sofas';
                        if (!stats.categorySales[category]) {
                            stats.categorySales[category] = {
                                category: category,
                                count: 0,
                                revenue: 0
                            };
                        }
                        stats.categorySales[category].count += item.quantity;
                        stats.categorySales[category].revenue += itemAmount;
                    }
                });

                stats.totalRevenue += orderAmount;

                if (order.status === 'pending') stats.pendingOrders++;
                if (order.status === 'delivered') stats.deliveredOrders++;

                // Today's stats
                if (orderDate.toDateString() === today.toDateString()) {
                    stats.todayOrders++;
                    stats.todayRevenue += orderAmount;
                }

                // This week's stats
                if (orderDate >= thisWeekStart) {
                    stats.weekOrders++;
                    stats.weekRevenue += orderAmount;
                }

                // This month's stats
                if (orderDate >= thisMonthStart) {
                    stats.monthOrders++;
                    stats.monthRevenue += orderAmount;
                }
            }
        });

        // Convert objects to sorted arrays
        stats.popularProducts = Object.values(stats.popularProducts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        stats.categorySales = Object.values(stats.categorySales)
            .sort((a, b) => b.revenue - a.revenue);

        return stats;
    },

    // Get inventory status
    getInventoryStatus() {
        const products = ProductManager.getAllProducts();
        const orders = this.getAllOrders();
        
        const inventory = products.map(product => {
            // Calculate total ordered from all orders
            let totalOrdered = 0;
            
            orders.forEach(order => {
                if (order.items && order.items.length > 0) {
                    order.items.forEach(item => {
                        if (item.id === product.id) {
                            totalOrdered += item.quantity;
                        }
                    });
                }
            });
            
            return {
                ...product,
                totalOrdered,
                inStock: totalOrdered < 10, // Simple logic for demo
                lowStock: totalOrdered > 5
            };
        });

        return inventory.sort((a, b) => b.totalOrdered - a.totalOrdered);
    },

    // Export data to CSV
    exportData(type) {
        let data = [];
        let filename = '';

        if (type === 'orders') {
            const orders = this.getAllOrders();
            data = orders.map(order => {
                // Handle different order structures
                const customerName = order.name || order.customer?.name || 'Unknown';
                const customerPhone = order.phone || order.customer?.phone || 'Unknown';
                const customerEmail = order.email || order.customer?.email || 'Unknown';
                const customerCity = order.city || order.customer?.city || 'Unknown';
                const customerAddress = order.address || order.customer?.address || 'Unknown';
                
                // Get first item details
                const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
                const itemName = firstItem ? firstItem.name : 'Unknown Product';
                const itemQuantity = firstItem ? firstItem.quantity : 0;
                const itemPrice = firstItem ? firstItem.price : 0;
                const itemTotal = itemPrice * itemQuantity;
                
                return [
                    order.orderNumber || order.id || 'N/A',
                    customerName,
                    customerPhone,
                    customerEmail,
                    itemName,
                    itemQuantity,
                    this.formatCurrency(itemPrice),
                    this.formatCurrency(itemTotal),
                    this.getOrderStatusText(order.status),
                    this.formatDate(order.orderDate || order.timestamp)
                ];
            });
            filename = `orders_export_${new Date().toISOString().slice(0, 10)}.csv`;
            data.unshift(['Order Number', 'Customer Name', 'Phone', 'Email', 'Product', 'Quantity', 'Unit Price', 'Total', 'Status', 'Date']);
        } else if (type === 'customers') {
            const customers = this.getCustomerManagementData();
            data = customers.map(customer => ([
                customer.name,
                customer.phone,
                customer.email,
                customer.city,
                customer.orderCount,
                this.formatCurrency(customer.totalSpent),
                this.formatDate(customer.lastOrder)
            ]));
            filename = `customers_export_${new Date().toISOString().slice(0, 10)}.csv`;
            data.unshift(['Name', 'Phone', 'Email', 'City', 'Order Count', 'Total Spent', 'Last Order']);
        }

        const csvContent = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },

    // Search orders
    searchOrders(query) {
        const orders = this.getAllOrders();
        const q = query.toLowerCase();
        
        return orders.filter(order => {
            // Handle different order structures
            const customerName = order.name || order.customer?.name || '';
            const customerPhone = order.phone || order.customer?.phone || '';
            const customerEmail = order.email || order.customer?.email || '';
            const orderNumber = order.orderNumber || order.id || '';
            
            // Get first item details
            const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
            const itemName = firstItem ? firstItem.name : '';
            
            return orderNumber.toLowerCase().includes(q) ||
                   customerName.toLowerCase().includes(q) ||
                   customerPhone.includes(q) ||
                   customerEmail.toLowerCase().includes(q) ||
                   itemName.toLowerCase().includes(q) ||
                   order.status.toLowerCase().includes(q);
        });
    },

    // Filter orders by status
    filterOrdersByStatus(status) {
        const orders = this.getAllOrders();
        if (status === 'all') return orders;
        return orders.filter(order => order.status === status);
    },

    // Filter orders by date range
    filterOrdersByDate(startDate, endDate) {
        const orders = this.getAllOrders();
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return orders.filter(order => {
            const orderDate = new Date(order.orderDate || order.timestamp);
            return orderDate >= start && orderDate <= end;
        });
    },

    // Switch analytics tab
    switchAnalyticsTab(tabId) {
        // Update tab styling
        const tabs = document.querySelectorAll('.analytics-tab');
        tabs.forEach(tab => {
            if (tab.id === tabId) {
                tab.classList.add('bg-primary-100', 'text-primary-700');
                tab.classList.remove('text-gray-600', 'hover:text-gray-900');
            } else {
                tab.classList.remove('bg-primary-100', 'text-primary-700');
                tab.classList.add('text-gray-600', 'hover:text-gray-900');
            }
        });

        // Load analytics data for selected period
        this.loadAnalyticsData(tabId);
    },

    // Load analytics data
    loadAnalyticsData(period = 'analytics-today') {
        const analytics = this.getSalesAnalytics();
        const customers = this.getCustomerManagementData();
        const popularProducts = analytics.popularProducts;
        const categorySales = analytics.categorySales;

        // Update sales overview based on period
        let data;
        switch (period) {
            case 'analytics-today':
                data = {
                    orders: analytics.todayOrders,
                    revenue: analytics.todayRevenue,
                    pending: analytics.pendingOrders,
                    delivered: analytics.deliveredOrders
                };
                break;
            case 'analytics-week':
                data = {
                    orders: analytics.weekOrders,
                    revenue: analytics.weekRevenue,
                    pending: analytics.pendingOrders,
                    delivered: analytics.deliveredOrders
                };
                break;
            case 'analytics-month':
                data = {
                    orders: analytics.monthOrders,
                    revenue: analytics.monthRevenue,
                    pending: analytics.pendingOrders,
                    delivered: analytics.deliveredOrders
                };
                break;
            default:
                data = {
                    orders: analytics.totalOrders,
                    revenue: analytics.totalRevenue,
                    pending: analytics.pendingOrders,
                    delivered: analytics.deliveredOrders
                };
        }

        // Update sales overview cards
        const ordersEl = document.getElementById('analytics-orders');
        const revenueEl = document.getElementById('analytics-revenue');
        const pendingEl = document.getElementById('analytics-pending');
        const deliveredEl = document.getElementById('analytics-delivered');

        if (ordersEl) ordersEl.textContent = data.orders;
        if (revenueEl) revenueEl.textContent = this.formatCurrency(data.revenue);
        if (pendingEl) pendingEl.textContent = data.pending;
        if (deliveredEl) deliveredEl.textContent = data.delivered;

        // Update quick stats
        this.updateQuickStats(analytics, customers);

        // Update customer analytics table
        this.renderCustomerAnalytics(customers);

        // Update popular products
        this.renderPopularProducts(popularProducts);

        // Update category performance
        this.renderCategoryPerformance(categorySales);
    },

    // Update quick stats
    updateQuickStats(analytics, customers) {
        const bestSellingEl = document.getElementById('best-selling');
        const bestSellingCountEl = document.getElementById('best-selling-count');
        const topCategoryEl = document.getElementById('top-category');
        const topCategoryRevenueEl = document.getElementById('top-category-revenue');
        const activeCustomersEl = document.getElementById('active-customers');
        const activeCustomersCountEl = document.getElementById('active-customers-count');
        const avgOrderValueEl = document.getElementById('avg-order-value');
        const avgOrderValueAmountEl = document.getElementById('avg-order-value-amount');

        // Best selling product
        if (analytics.popularProducts.length > 0) {
            const best = analytics.popularProducts[0];
            if (bestSellingEl) bestSellingEl.textContent = best.name;
            if (bestSellingCountEl) bestSellingCountEl.textContent = best.count;
        } else {
            if (bestSellingEl) bestSellingEl.textContent = '-';
            if (bestSellingCountEl) bestSellingCountEl.textContent = '0';
        }

        // Top category
        if (analytics.categorySales.length > 0) {
            const top = analytics.categorySales[0];
            if (topCategoryEl) topCategoryEl.textContent = top.category;
            if (topCategoryRevenueEl) topCategoryRevenueEl.textContent = this.formatCurrency(top.revenue);
        } else {
            if (topCategoryEl) topCategoryEl.textContent = '-';
            if (topCategoryRevenueEl) topCategoryRevenueEl.textContent = '$0';
        }

        // Active customers (this month)
        const activeCustomers = customers.filter(c => {
            const lastOrder = new Date(c.lastOrder);
            const thisMonth = new Date();
            return lastOrder.getMonth() === thisMonth.getMonth() && 
                   lastOrder.getFullYear() === thisMonth.getFullYear();
        });

        if (activeCustomersEl) activeCustomersEl.textContent = activeCustomers.length;
        if (activeCustomersCountEl) activeCustomersCountEl.textContent = activeCustomers.length;

        // Average order value
        const totalOrders = analytics.totalOrders;
        const totalRevenue = analytics.totalRevenue;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        if (avgOrderValueEl) avgOrderValueEl.textContent = this.formatCurrency(avgOrderValue);
        if (avgOrderValueAmountEl) avgOrderValueAmountEl.textContent = this.formatCurrency(avgOrderValue);
    },

    // Render customer analytics table
    renderCustomerAnalytics(customers) {
        const tbody = document.getElementById('customers-analytics-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (customers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                        No customer data available.
                    </td>
                </tr>
            `;
            return;
        }

        customers.slice(0, 10).forEach(customer => {
            const row = document.createElement('tr');
            const lastOrderDate = new Date(customer.lastOrder);
            const isRecent = (Date.now() - lastOrderDate.getTime()) < 30 * 24 * 60 * 60 * 1000; // 30 days

            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="font-medium text-gray-900">${customer.name}</div>
                    <div class="text-gray-500">${customer.email}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${customer.orderCount}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">${this.formatCurrency(customer.totalSpent)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${this.formatDate(customer.lastOrder)}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isRecent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                        ${isRecent ? 'Active' : 'Inactive'}
                    </span>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    // Render popular products
    renderPopularProducts(products) {
        const container = document.getElementById('popular-products-list');
        if (!container) return;

        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-500 py-4">
                    No popular products data available.
                </div>
            `;
            return;
        }

        products.forEach((product, index) => {
            const item = document.createElement('div');
            item.className = 'flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors';
            item.innerHTML = `
                <div class="flex items-center space-x-3">
                    <span class="text-sm font-medium text-gray-600">${index + 1}</span>
                    <div>
                        <div class="font-medium text-gray-900">${product.name}</div>
                        <div class="text-sm text-gray-600">${product.category}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-medium text-green-600">${product.count} orders</div>
                    <div class="text-sm text-gray-600">${this.formatCurrency(product.revenue)}</div>
                </div>
            `;
            container.appendChild(item);
        });
    },

    // Render category performance
    renderCategoryPerformance(categories) {
        const container = document.getElementById('category-performance-list');
        if (!container) return;

        container.innerHTML = '';

        if (categories.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-500 py-4">
                    No category performance data available.
                </div>
            `;
            return;
        }

        categories.forEach((category, index) => {
            const item = document.createElement('div');
            item.className = 'flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors';
            
            // Calculate percentage
            const totalRevenue = categories.reduce((sum, c) => sum + c.revenue, 0);
            const percentage = totalRevenue > 0 ? (category.revenue / totalRevenue * 100).toFixed(1) : 0;

            item.innerHTML = `
                <div class="flex items-center space-x-3">
                    <span class="text-sm font-medium text-gray-600">${index + 1}</span>
                    <div>
                        <div class="font-medium text-gray-900">${category.category}</div>
                        <div class="text-sm text-gray-600">${category.count} orders</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-medium text-blue-600">${this.formatCurrency(category.revenue)}</div>
                    <div class="text-sm text-gray-600">${percentage}% of total</div>
                </div>
            `;
            container.appendChild(item);
        });
    },

    // Update dashboard statistics
    updateStats() {
        const products = ProductManager.getAllProducts();
        
        // Update total products
        const totalProductsEl = document.getElementById('total-products');
        if (totalProductsEl) totalProductsEl.textContent = products.length;

        // Update category counts
        const sofasCount = products.filter(p => p.category === 'sofas').length;
        const bedsCount = products.filter(p => p.category === 'beds').length;
        const mattressesCount = products.filter(p => p.category === 'mattresses').length;

        const sofasCountEl = document.getElementById('sofas-count');
        const bedsCountEl = document.getElementById('beds-count');
        const mattressesCountEl = document.getElementById('mattresses-count');

        if (sofasCountEl) sofasCountEl.textContent = sofasCount;
        if (bedsCountEl) bedsCountEl.textContent = bedsCount;
        if (mattressesCountEl) mattressesCountEl.textContent = mattressesCount;
    },

    // Load products into table
    loadProducts() {
        const products = ProductManager.getAllProducts();
        const tbody = document.getElementById('products-table-body');
        
        if (!tbody) return;

        tbody.innerHTML = '';

        if (products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                        No products found. Add your first product to get started.
                    </td>
                </tr>
            `;
            return;
        }

        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <img src="${product.images[0]}" alt="${product.name}" class="w-16 h-16 object-cover rounded-lg">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${product.name}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    $${product.price.toLocaleString()}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.stock || 'In Stock'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onclick="adminManager.editProduct(${product.id})" 
                            class="text-blue-600 hover:text-blue-900">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="adminManager.deleteProduct(${product.id})" 
                            class="text-red-600 hover:text-red-900">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    // Open product modal for adding new product
    openProductModal(product = null) {
        const modal = document.getElementById('product-modal');
        const title = document.getElementById('modal-title');
        const deleteBtn = document.getElementById('delete-product-btn');
        
        if (!modal || !title || !deleteBtn) return;

        // Reset form
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
        
        // Clear image previews
        this.clearImagePreviews();

        if (product) {
            // Edit mode
            title.textContent = 'Edit Product';
            deleteBtn.classList.remove('hidden');
            this.populateForm(product);
        } else {
            // Add mode
            title.textContent = 'Add New Product';
            deleteBtn.classList.add('hidden');
        }

        modal.classList.remove('hidden');
    },

    // Close product modal
    closeProductModal() {
        const modal = document.getElementById('product-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    },

    // Populate form with product data
    populateForm(product) {
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-featured').value = product.featured ? 'true' : 'false';
        document.getElementById('product-new').value = product.new ? 'true' : 'false';
        
        if (product.specifications) {
            document.getElementById('spec-material').value = product.specifications.material || '';
            document.getElementById('spec-color').value = product.specifications.color || '';
            document.getElementById('spec-width').value = product.specifications.dimensions?.width || '';
            document.getElementById('spec-depth').value = product.specifications.dimensions?.depth || '';
            document.getElementById('spec-height').value = product.specifications.dimensions?.height || '';
        }

        if (product.features) {
            document.getElementById('product-features').value = product.features.join('\n');
        }
    },

    // Handle product form submission
    handleProductSubmit() {
        const productData = this.getFormData();

        if (!this.validateProductData(productData)) {
            this.showMessage('Please fill in all required fields.', 'error');
            return;
        }

        try {
            if (productData.id) {
                // Update existing product
                ProductManager.updateProduct(productData.id, productData);
                this.showMessage('Product updated successfully!', 'success');
            } else {
                // Add new product
                ProductManager.addProduct(productData);
                this.showMessage('Product added successfully!', 'success');
            }

            this.closeProductModal();
            this.loadDashboard();
        } catch (error) {
            console.error('Error saving product:', error);
            this.showMessage('Error saving product: ' + error.message, 'error');
        }
    },

    // Get form data
    getFormData() {
        const id = document.getElementById('product-id').value;
        const name = document.getElementById('product-name').value;
        const category = document.getElementById('product-category').value;
        const description = document.getElementById('product-description').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const featured = document.getElementById('product-featured').value === 'true';
        const isNew = document.getElementById('product-new').value === 'true';
        
        const material = document.getElementById('spec-material').value;
        const color = document.getElementById('spec-color').value;
        const width = document.getElementById('spec-width').value;
        const depth = document.getElementById('spec-depth').value;
        const height = document.getElementById('spec-height').value;
        
        const features = document.getElementById('product-features').value
            .split('\n')
            .map(f => f.trim())
            .filter(f => f.length > 0);

        // Get uploaded images
        const images = this.getUploadedImages();

        return {
            id: id ? parseInt(id) : null,
            name,
            category,
            description,
            price,
            featured,
            new: isNew,
            specifications: {
                material,
                color,
                dimensions: {
                    width,
                    depth,
                    height
                }
            },
            features,
            images: images.length > 0 ? images : null
        };
    },

    // Validate product data
    validateProductData(data) {
        return data.name && data.category && data.description && 
               data.price && data.price > 0 && data.features.length > 0;
    },

    // Get uploaded images
    getUploadedImages() {
        const images = [];
        for (let i = 1; i <= 3; i++) {
            const fileInput = document.getElementById(`image-${i}`);
            if (fileInput && fileInput.files[0]) {
                // For demo purposes, we'll use placeholder image URLs
                // In a real application, you would upload these to a server
                images.push(`images/product-${Date.now()}-${i}.jpg`);
            }
        }
        return images;
    },

    // Clear image previews
    clearImagePreviews() {
        for (let i = 1; i <= 3; i++) {
            const preview = document.getElementById(`preview-${i}`);
            if (preview) {
                preview.classList.add('hidden');
                preview.src = '';
            }
        }
    },

    // Setup image upload handlers
    setupImageUploads() {
        for (let i = 1; i <= 3; i++) {
            const fileInput = document.getElementById(`image-${i}`);
            const preview = document.getElementById(`preview-${i}`);
            
            if (fileInput && preview) {
                fileInput.addEventListener('change', (e) => {
                    this.handleImageUpload(e.target, preview);
                });
            }
        }
    },

    // Handle image upload
    handleImageUpload(input, preview) {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    },

    // Edit product
    editProduct(productId) {
        const product = ProductManager.getProductById(productId);
        if (product) {
            this.openProductModal(product);
        }
    },

    // Delete product
    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            ProductManager.deleteProduct(productId);
            this.showMessage('Product deleted successfully!', 'success');
            this.loadDashboard();
        }
    },

    // Handle product delete button
    handleProductDelete() {
        const productId = document.getElementById('product-id').value;
        if (productId) {
            this.deleteProduct(parseInt(productId));
            this.closeProductModal();
        }
    },

    // Show message toast
    showMessage(message, type = 'success') {
        const toast = document.getElementById('message-toast');
        const messageText = document.getElementById('message-text');
        
        if (!toast || !messageText) return;

        messageText.textContent = message;
        toast.className = toast.className.replace('hidden', '');
        
        // Set background color based on type
        if (type === 'error') {
            toast.classList.remove('bg-green-500');
            toast.classList.add('bg-red-500');
        } else if (type === 'info') {
            toast.classList.remove('bg-green-500');
            toast.classList.add('bg-blue-500');
        } else {
            toast.classList.remove('bg-red-500', 'bg-blue-500');
            toast.classList.add('bg-green-500');
        }

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-y-4', 'opacity-0');
        }, 10);

        // Auto hide after 3 seconds
        setTimeout(() => {
            toast.classList.add('translate-y-4', 'opacity-0');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 300);
        }, 3000);
    }
};

// Initialize admin manager
const adminManager = AdminManager;

// Make available globally
window.adminManager = adminManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    adminManager.init();
});