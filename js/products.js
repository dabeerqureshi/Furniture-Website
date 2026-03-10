// Product Dataset for Furniture Store
// This file contains all product data used throughout the website

const products = [];

// Helper functions for working with products
const ProductManager = {
    // Get all products
    getAllProducts() {
        return products;
    },

    // Get products by category
    getByCategory(category) {
        return products.filter(product => product.category === category);
    },

    // Get featured products
    getFeaturedProducts() {
        return products.filter(product => product.isFeatured);
    },

    // Get new arrivals
    getNewArrivals() {
        return products.filter(product => product.isNew);
    },

    // Get product by ID
    getById(id) {
        return products.find(product => product.id === parseInt(id));
    },

    // Search products by name or description
    searchProducts(query) {
        const q = query.toLowerCase();
        return products.filter(product => 
            product.name.toLowerCase().includes(q) ||
            product.description.toLowerCase().includes(q) ||
            product.category.toLowerCase().includes(q)
        );
    },

    // Get unique categories
    getCategories() {
        const categories = [...new Set(products.map(product => product.category))];
        return categories.map(category => ({
            id: category,
            name: category.charAt(0).toUpperCase() + category.slice(1),
            count: products.filter(p => p.category === category).length
        }));
    },

    // Get price range
    getPriceRange() {
        const prices = products.map(p => p.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    },

    // Filter products
    filterProducts(filters) {
        let filtered = [...products];

        // Category filter
        if (filters.category && filters.category !== 'all') {
            filtered = filtered.filter(p => p.category === filters.category);
        }

        // Price range filter
        if (filters.minPrice || filters.maxPrice) {
            const min = filters.minPrice ? parseInt(filters.minPrice) : 0;
            const max = filters.maxPrice ? parseInt(filters.maxPrice) : Infinity;
            filtered = filtered.filter(p => p.price >= min && p.price <= max);
        }

        // In stock filter
        if (filters.inStock) {
            filtered = filtered.filter(p => p.inStock);
        }

        // Featured filter
        if (filters.featured) {
            filtered = filtered.filter(p => p.isFeatured);
        }

        // New arrivals filter
        if (filters.new) {
            filtered = filtered.filter(p => p.isNew);
        }

        return filtered;
    },

    // Sort products
    sortProducts(products, sortBy) {
        switch (sortBy) {
            case 'price-low':
                return products.sort((a, b) => a.price - b.price);
            case 'price-high':
                return products.sort((a, b) => b.price - a.price);
            case 'name':
                return products.sort((a, b) => a.name.localeCompare(b.name));
            case 'rating':
                return products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            default:
                return products;
        }
    },

    // Add new product
    addProduct(productData) {
        // Generate new ID
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        
        // Create new product object
        const newProduct = {
            id: newId,
            name: productData.name,
            category: productData.category,
            price: parseFloat(productData.price),
            description: productData.description,
            images: productData.images || [],
            specifications: {
                material: productData.specifications?.material || 'TBD',
                color: productData.specifications?.color || 'TBD',
                dimensions: {
                    width: productData.specifications?.dimensions?.width || 'TBD',
                    depth: productData.specifications?.dimensions?.depth || 'TBD',
                    height: productData.specifications?.dimensions?.height || 'TBD'
                },
                weight_capacity: productData.specifications?.weight_capacity || 'TBD',
                assembly: productData.specifications?.assembly || 'TBD'
            },
            features: productData.features || [],
            delivery: 'Same Day Available',
            inStock: true,
            isFeatured: productData.featured || false,
            isNew: productData.new || false
        };

        // Add to products array
        products.push(newProduct);
        
        // Save to localStorage
        this.saveProductsToStorage();
        
        return newProduct;
    },

    // Update existing product
    updateProduct(productId, productData) {
        const index = products.findIndex(p => p.id === parseInt(productId));
        
        if (index === -1) {
            throw new Error('Product not found');
        }

        // Update product data
        products[index] = {
            ...products[index],
            name: productData.name,
            category: productData.category,
            price: parseFloat(productData.price),
            description: productData.description,
            images: productData.images || products[index].images,
            specifications: {
                material: productData.specifications?.material || products[index].specifications.material,
                color: productData.specifications?.color || products[index].specifications.color,
                dimensions: {
                    width: productData.specifications?.dimensions?.width || products[index].specifications.dimensions.width,
                    depth: productData.specifications?.dimensions?.depth || products[index].specifications.dimensions.depth,
                    height: productData.specifications?.dimensions?.height || products[index].specifications.dimensions.height
                },
                weight_capacity: productData.specifications?.weight_capacity || products[index].specifications.weight_capacity,
                assembly: productData.specifications?.assembly || products[index].specifications.assembly
            },
            features: productData.features || products[index].features,
            inStock: productData.inStock !== undefined ? productData.inStock : products[index].inStock,
            isFeatured: productData.featured !== undefined ? productData.featured : products[index].isFeatured,
            isNew: productData.new !== undefined ? productData.new : products[index].isNew
        };

        // Save to localStorage
        this.saveProductsToStorage();
        
        return products[index];
    },

    // Delete product
    deleteProduct(productId) {
        const index = products.findIndex(p => p.id === parseInt(productId));
        
        if (index === -1) {
            throw new Error('Product not found');
        }

        // Remove product from array
        const deletedProduct = products.splice(index, 1)[0];
        
        // Save to localStorage
        this.saveProductsToStorage();
        
        return deletedProduct;
    },

    // Get product by ID (alias for getById)
    getProductById(id) {
        return this.getById(id);
    },

    // Save products to localStorage
    saveProductsToStorage() {
        try {
            localStorage.setItem('furnitureStoreProducts', JSON.stringify(products));
        } catch (error) {
            console.warn('Could not save products to localStorage:', error);
        }
    },

    // Load products from localStorage
    loadProductsFromStorage() {
        try {
            const storedProducts = localStorage.getItem('furnitureStoreProducts');
            if (storedProducts) {
                const parsedProducts = JSON.parse(storedProducts);
                // Replace the products array with stored data
                products.length = 0;
                products.push(...parsedProducts);
            }
        } catch (error) {
            console.warn('Could not load products from localStorage:', error);
        }
    },

    // Initialize product manager
    init() {
        this.loadProductsFromStorage();
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { products, ProductManager };
}

// Initialize ProductManager
if (typeof window !== 'undefined') {
    // Make ProductManager available globally for browser compatibility
    window.ProductManager = ProductManager;
    window.products = products;
    
    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            ProductManager.init();
        });
    } else {
        ProductManager.init();
    }
}

// Initialize products dataset
(function() {
    // Sofa products
    products.push(
        {
            id: 1,
            name: "Modern Leather Sofa",
            category: "sofas",
            price: 1299,
            description: "Elegant modern sofa with premium leather upholstery and comfortable cushioning.",
            images: [
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&auto=format&fit=crop&q=60'
            ],
            specifications: {
                material: "Premium Leather",
                color: "Dark Brown",
                dimensions: {
                    width: "84 inches",
                    depth: "36 inches",
                    height: "34 inches"
                },
                weight_capacity: "600 lbs",
                assembly: "Minimal assembly required"
            },
            features: [
                "Premium leather upholstery",
                "High-density foam cushioning",
                "Solid wood frame",
                "Modern design",
                "Easy to clean"
            ],
            delivery: "Same Day Available",
            inStock: true,
            isFeatured: true,
            isNew: false
        },
        {
            id: 2,
            name: "Sectional Sofa",
            category: "sofas",
            price: 1899,
            description: "Spacious sectional sofa perfect for large living rooms with family-friendly fabric.",
            images: [
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60'
            ],
            specifications: {
                material: "Family-friendly Fabric",
                color: "Gray",
                dimensions: {
                    width: "120 inches",
                    depth: "40 inches",
                    height: "36 inches"
                },
                weight_capacity: "800 lbs",
                assembly: "Professional assembly recommended"
            },
            features: [
                "Spacious sectional design",
                "Family-friendly fabric",
                "Removable cushions",
                "Sturdy construction",
                "Easy to maintain"
            ],
            delivery: "Same Day Available",
            inStock: true,
            isFeatured: false,
            isNew: true
        },
        {
            id: 3,
            name: "Classic Chesterfield Sofa",
            category: "sofas",
            price: 1599,
            description: "Timeless Chesterfield design with button-tufted leather and rolled arms.",
            images: [
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60'
            ],
            specifications: {
                material: "Top-grain Leather",
                color: "Black",
                dimensions: {
                    width: "80 inches",
                    depth: "38 inches",
                    height: "38 inches"
                },
                weight_capacity: "700 lbs",
                assembly: "Minimal assembly required"
            },
            features: [
                "Classic Chesterfield design",
                "Button-tufted upholstery",
                "Rolled arms",
                "Top-grain leather",
                "Timeless elegance"
            ],
            delivery: "Same Day Available",
            inStock: true,
            isFeatured: true,
            isNew: false
        },
        {
            id: 4,
            name: "Lounge Sofa",
            category: "sofas",
            price: 1199,
            description: "Comfortable lounge sofa with soft fabric and generous seating space.",
            images: [
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60'
            ],
            specifications: {
                material: "Soft Fabric",
                color: "Beige",
                dimensions: {
                    width: "78 inches",
                    depth: "35 inches",
                    height: "32 inches"
                },
                weight_capacity: "550 lbs",
                assembly: "Minimal assembly required"
            },
            features: [
                "Comfortable lounge design",
                "Soft fabric upholstery",
                "Generous seating space",
                "Modern style",
                "Easy to clean"
            ],
            delivery: "Same Day Available",
            inStock: true,
            isFeatured: false,
            isNew: false
        },
        {
            id: 5,
            name: "Sleeper Sofa",
            category: "sofas",
            price: 1499,
            description: "Versatile sleeper sofa that converts to a comfortable bed for guests.",
            images: [
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60'
            ],
            specifications: {
                material: "Performance Fabric",
                color: "Navy Blue",
                dimensions: {
                    width: "85 inches",
                    depth: "38 inches",
                    height: "35 inches"
                },
                weight_capacity: "650 lbs",
                assembly: "Minimal assembly required"
            },
            features: [
                "Converts to bed",
                "Performance fabric",
                "Comfortable sleeping surface",
                "Hidden storage",
                "Space-saving design"
            ],
            delivery: "Same Day Available",
            inStock: true,
            isFeatured: false,
            isNew: true
        },
        {
            id: 6,
            name: "Chaise Lounge Sofa",
            category: "sofas",
            price: 1399,
            description: "Elegant chaise lounge sofa with extended seating and modern design.",
            images: [
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60'
            ],
            specifications: {
                material: "Luxury Fabric",
                color: "Charcoal",
                dimensions: {
                    width: "90 inches",
                    depth: "42 inches",
                    height: "34 inches"
                },
                weight_capacity: "600 lbs",
                assembly: "Minimal assembly required"
            },
            features: [
                "Extended chaise design",
                "Luxury fabric upholstery",
                "Modern aesthetic",
                "Comfortable lounging",
                "Space-efficient"
            ],
            delivery: "Same Day Available",
            inStock: true,
            isFeatured: true,
            isNew: false
        }
    );
})();
