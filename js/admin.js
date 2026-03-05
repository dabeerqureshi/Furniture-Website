// Admin Panel JavaScript
// Handles admin authentication, product management, and dashboard functionality

// Admin Configuration
const ADMIN_CONFIG = {
    password: 'admin123', // Default password - should be changed in production
    localStorageKey: 'furnitureStoreProducts'
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
    },

    // Check if user is authenticated
    checkAuth() {
        const isAuthenticated = localStorage.getItem('adminAuthenticated');
        if (isAuthenticated === 'true') {
            this.showDashboard();
        } else {
            this.showLogin();
        }
    },

    // Handle login
    handleLogin() {
        const passwordInput = document.getElementById('admin-password');
        const loginError = document.getElementById('login-error');
        
        if (!passwordInput || !loginError) return;

        const password = passwordInput.value;

        if (password === ADMIN_CONFIG.password) {
            localStorage.setItem('adminAuthenticated', 'true');
            this.showDashboard();
            this.showMessage('Welcome to the admin panel!', 'success');
        } else {
            loginError.textContent = 'Invalid password. Please try again.';
            loginError.classList.remove('hidden');
        }
    },

    // Handle logout
    handleLogout() {
        localStorage.removeItem('adminAuthenticated');
        this.showLogin();
        this.showMessage('You have been logged out.', 'info');
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
        const formData = new FormData();
        const productData = this.getFormData();

        if (!this.validateProductData(productData)) {
            this.showMessage('Please fill in all required fields.', 'error');
            return;
        }

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