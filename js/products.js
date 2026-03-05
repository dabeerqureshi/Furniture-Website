// Product Dataset for Furniture Store
// This file contains all product data used throughout the website

const products = [
    // Sofas Category
    {
        id: 1,
        name: "Modern 3-Seater Sofa",
        category: "sofas",
        price: 1299,
        description: "Elegant 3-seater sofa with premium fabric upholstery and solid wood frame. Perfect for modern living rooms.",
        images: [
            "images/sofas/sofa-1-1.jpg",
            "images/sofas/sofa-1-2.jpg", 
            "images/sofas/sofa-1-3.jpg"
        ],
        specifications: {
            material: "Premium Fabric & Solid Wood",
            color: "Charcoal Gray",
            dimensions: "84\" W x 36\" D x 34\" H",
            weight_capacity: "600 lbs",
            assembly: "Minimal assembly required"
        },
        features: [
            "Premium fabric upholstery",
            "Solid wood frame construction",
            "High-density foam cushions",
            "Modern tufted design",
            "Easy to clean fabric"
        ],
        delivery: "Same Day Available",
        inStock: true,
        isFeatured: true,
        isNew: false
    },
    {
        id: 2,
        name: "Luxury Sectional Sofa",
        category: "sofas",
        price: 2499,
        description: "Spacious L-shaped sectional sofa with chaise lounge. Ultimate comfort for large living spaces.",
        images: [
            "images/sofas/sofa-2-1.jpg",
            "images/sofas/sofa-2-2.jpg",
            "images/sofas/sofa-2-3.jpg"
        ],
        specifications: {
            material: "Genuine Leather",
            color: "Dark Brown",
            dimensions: "108\" W x 96\" D x 36\" H",
            weight_capacity: "800 lbs",
            assembly: "Professional assembly included"
        },
        features: [
            "Genuine leather upholstery",
            "Reversible chaise design",
            "Memory foam cushions",
            "Sturdy hardwood frame",
            "Stain-resistant finish"
        ],
        delivery: "Same Day Available",
        inStock: true,
        isFeatured: true,
        isNew: false
    },
    {
        id: 3,
        name: "Compact 2-Seater Sofa",
        category: "sofas",
        price: 899,
        description: "Space-saving 2-seater sofa perfect for small apartments and cozy corners.",
        images: [
            "images/sofas/sofa-3-1.jpg",
            "images/sofas/sofa-3-2.jpg",
            "images/sofas/sofa-3-3.jpg"
        ],
        specifications: {
            material: "Microfiber & Engineered Wood",
            color: "Navy Blue",
            dimensions: "60\" W x 32\" D x 30\" H",
            weight_capacity: "400 lbs",
            assembly: "Easy assembly"
        },
        features: [
            "Space-saving design",
            "Durable microfiber fabric",
            "Removable cushion covers",
            "Compact footprint",
            "Scratch-resistant"
        ],
        delivery: "Same Day Available",
        inStock: true,
        isFeatured: false,
        isNew: true
    },
    {
        id: 4,
        name: "Classic Chesterfield Sofa",
        category: "sofas",
        price: 1899,
        description: "Timeless Chesterfield design with deep button tufting and rolled arms.",
        images: [
            "images/sofas/sofa-4-1.jpg",
            "images/sofas/sofa-4-2.jpg",
            "images/sofas/sofa-4-3.jpg"
        ],
        specifications: {
            material: "Top-grain Leather",
            color: "Antique Brown",
            dimensions: "78\" W x 38\" D x 36\" H",
            weight_capacity: "500 lbs",
            assembly: "Minimal assembly"
        },
        features: [
            "Authentic Chesterfield design",
            "Top-grain leather",
            "Deep button tufting",
            "Rolled arms",
            "Antique finish"
        ],
        delivery: "Same Day Available",
        inStock: true,
        isFeatured: false,
        isNew: false
    },
    {
        id: 5,
        name: "Modern Loveseat Sofa",
        category: "sofas",
        price: 749,
        description: "Stylish loveseat with clean lines and comfortable seating for two.",
        images: [
            "images/sofas/sofa-5-1.jpg",
            "images/sofas/sofa-5-2.jpg",
            "images/sofas/sofa-5-3.jpg"
        ],
        specifications: {
            material: "Performance Fabric",
            color: "Slate Gray",
            dimensions: "54\" W x 34\" D x 32\" H",
            weight_capacity: "350 lbs",
            assembly: "Easy assembly"
        },
        features: [
            "Performance fabric",
            "Compact design",
            "High-resilience foam",
            "Modern aesthetic",
            "Pet-friendly material"
        ],
        delivery: "Same Day Available",
        inStock: true,
        isFeatured: false,
        isNew: false
    },
    {
        id: 6,
        name: "Reclining Sofa Set",
        category: "sofas",
        price: 1599,
        description: "Comfortable reclining sofa with power recline function and USB charging ports.",
        images: [
            "images/sofas/sofa-6-1.jpg",
            "images/sofas/sofa-6-2.jpg",
            "images/sofas/sofa-6-3.jpg"
        ],
        specifications: {
            material: "Faux Leather",
            color: "Black",
            dimensions: "80\" W x 38\" D x 40\" H",
            weight_capacity: "500 lbs",
            assembly: "Professional assembly"
        },
        features: [
            "Power recline function",
            "USB charging ports",
            "Faux leather upholstery",
            "Memory foam padding",
            "Wall-hugger design"
        ],
        delivery: "Same Day Available",
        inStock: true,
        isFeatured: true,
        isNew: true
    },

    // Beds Category
    {
        id: 7,
        name: "King Size Platform Bed",
        category: "beds",
        price: 1499,
        description: "Modern platform bed with sleek design and sturdy construction. No box spring needed.",
        images: [
            "images/beds/bed-1-1.jpg",
            "images/beds/bed-1-2.jpg",
            "images/beds/bed-1-3.jpg"
        ],
        specifications: {
            material: "Solid Wood & Metal",
            color: "Natural Oak",
            dimensions: "80\" W x 86\" D x 42\" H",
            weight_capacity: "1000 lbs",
            assembly: "Easy assembly"
        },
        features: [
            "No box spring required",
            "Solid wood slats",
            "Modern platform design",
            "Heavy-duty metal frame",
            "Scratch-resistant finish"
        ],
        delivery: "Same Day Available",
        inStock: true,
        isFeatured: true,
        isNew: false
    },
    {
        id: 8,
        name: "Queen Size Upholstered Bed",
        category: "beds",
        price: 1299,
        description: "Elegant upholstered bed with tufted headboard and soft fabric finish.",
        images: [
            "images/beds/bed-2-1.jpg",
            "images/beds/bed-2-2.jpg",
            "images/beds/bed-2-3.jpg"
        ],
        specifications: {
            material: "Fabric & Wood",
            color: "Light Gray",
            dimensions: "66\" W x 86\" D x 52\" H",
            weight_capacity: "800 lbs",
            assembly: "Easy assembly"
        },
        features: [
            "Tufted headboard",
            "Soft fabric upholstery",
            "Sturdy wood frame",
            "Noise-free construction",
            "Easy to clean"
        ],
        delivery: "Same Day Available",
        inStock: true,
        isFeatured: true,
        isNew: false
    },
    {
        id: 9,
        name: "Twin Size Loft Bed",
        category: "beds",
        price: 699,
        description: "Space-saving loft bed perfect for small rooms and dormitories.",
        images: [
            "images/beds/bed-3-1.jpg",
            "images/beds/bed-3-2.jpg",
            "images/beds/bed-3-3.jpg"
        ],
        specifications: {
            material: "Metal & Wood",
            color: "White",
            dimensions: "42\" W x 86\" D x 72\" H",
            weight_capacity: "400 lbs",
            assembly: "Professional assembly"
        },
        features: [
            "Space-saving design",
            "Durable metal frame",
            "Safety guardrails",
            "Under-bed storage space",
            "Easy to assemble"
        ],
        delivery: "Same Day Available",
        inStock: true,
        isFeatured: false,
        isNew: true
    },
    {
        id: 10,
        name: "California King Bed Frame",
        category: "beds",
        price: 1699,
        description: "Extra-long bed frame with elegant design and premium materials.",
        images: [
            "images/beds/bed-4-1.jpg",
            "images/beds/bed-4-2.jpg",
            "images/beds/bed-4-3.jpg"
        ],
        specifications: {
            material: "Solid Wood",
            color: "Walnut Finish",
            dimensions: "76\" W x 90\" D x 48\" H",
            weight_capacity: "1200 lbs",
            assembly: "Easy assembly"
        },
        features: [
            "Extra-long design",
            "Solid wood construction",
            "Elegant walnut finish",
            "Heavy-duty slats",
            "Classic design"
        ],
        delivery: "Same Day Available",
        inStock: true,
        isFeatured: false,
        isNew: false
    },
    {
        id: 11,
        name: "Full Size Storage Bed",
        category: "beds",
        price: 1099,
        description: "Bed with built-in storage drawers for maximizing bedroom organization.",
        images: [
            "images/beds/bed-5-1.jpg",
            "images/beds/bed-5-2.jpg",
            "images/beds/bed-5-3.jpg"
        ],
        specifications: {
            material: "Engineered Wood",
            color: "White",
            dimensions: "56\" W x 80\" D x 44\" H",
            weight_capacity: "600 lbs",
            assembly: "Easy assembly"
        },
        features: [
            "Built-in storage drawers",
            "Space-saving design",
            "Smooth drawer glides",
            "Durable engineered wood",
            "Modern white finish"
        ],
        delivery: "Same Day Available",
        inStock: true,
        isFeatured: false,
        isNew: false
    },
    {
        id: 12,
        name: "Canopy Bed Frame",
        category: "beds",
        price: 1899,
        description: "Romantic canopy bed with elegant posts and classic design.",
        images: [
            "images/beds/bed-6-1.jpg",
            "images/beds/bed-6-2.jpg",
            "images/beds/bed-6-3.jpg"
        ],
        specifications: {
            material: "Solid Wood",
            color: "Antique White",
            dimensions: "66\" W x 86\" D x 96\" H",
            weight_capacity: "800 lbs",
            assembly: "Professional assembly"
        },
        features: [
            "Elegant canopy design",
            "Solid wood construction",
            "Antique white finish",
            "Romantic aesthetic",
            "Heavy-duty frame"
        ],
        delivery: "Same Day Available",
        inStock: true,
        isFeatured: true,
        isNew: false
    },

    // Mattresses Category
    {
        id: 13,
        name: "Memory Foam Mattress",
        category: "mattresses",
        price: 799,
        description: "Premium memory foam mattress with pressure relief and temperature regulation.",
        images: [
            "images/mattresses/mattress-1-1.jpg",
            "images/mattresses/mattress-1-2.jpg",
            "images/mattresses/mattress-1-3.jpg"
        ],
        specifications: {
            material: "Memory Foam",
            color: "White",
            dimensions: "Queen: 60\" x 80\" x 12\"",
            firmness: "Medium",
            warranty: "10 years",
            cooling: "Gel-infused foam"
        },
        features: [
            "Pressure-relieving memory foam",
            "Gel-infused for cooling",
            "Motion isolation",
            "Hypoallergenic",
            "10-year warranty"
        ],
        delivery: "Same Day Available",
        inStock: true,
        isFeatured: true,
        isNew: false
    },
    {
        id: 14,
        name: "Hybrid Mattress",
        category: "mattresses",
        price: 1199,
        description: "Combines pocketed coils with memory foam for the perfect balance of support and comfort.",
        images: [
            "images/mattresses/mattress-2-1.jpg",
            "images/mattresses/mattress-2-2.jpg",
            "images/mattresses/mattress-2-3.jpg"
        ],
        specifications: {
            material: "Hybrid (Coils + Foam)",
            color: "White",
            dimensions: "King: 76\" x 80\" x 14\"",
            firmness: "Medium-Firm",
            warranty: "15 years",
            cooling: "Airflow design"
        },
        features: [
            "Pocketed coil support",
            "Memory foam comfort layer",
            "Excellent airflow",
            "Motion isolation",
            "Edge support"
        ],
        delivery: "Same Day Available",
        inStock: true,
        isFeatured: true,
        isNew: false
    },
    {
        id: 15,
        name: "Orthopedic Mattress",
        category: "mattresses",
        price: 999,
        description: "Firm orthopedic mattress designed for back and joint pain relief.",
        images: [
            "images/mattresses/mattress-3-1.jpg",
            "images/mattresses/mattress-3-2.jpg",
            "images/mattresses/mattress-3-3.jpg"
        ],
        specifications: {
            material: "High-Density Foam",
            color: "White",
            dimensions: "Twin: 39\" x 75\" x 10\"",
            firmness: "Extra Firm",
            warranty: "12 years",
            cooling: "Breathable cover"
        },
        features: [
            "Orthopedic support",
            "Extra firm comfort",
            "Pressure point relief",
            "Spinal alignment",
            "Breathable materials"
        ],
        delivery: "Same Day Available",
        inStock: true,
        isFeatured: false,
        isNew: true
    },
    {
        id: 16,
        name: "Latex Mattress",
        category: "mattresses",
        price: 1399,
        description: "Natural latex mattress with responsive support and natural cooling properties.",
        images: [
            "images/mattresses/mattress-4-1.jpg",
            "images/mattresses/mattress-4-2.jpg",
            "images/mattresses/mattress-4-3.jpg"
        ],
        specifications: {
            material: "Natural Latex",
            color: "Natural",
            dimensions: "Full: 54\" x 75\" x 12\"",
            firmness: "Medium-Firm",
            warranty: "20 years",
            cooling: "Natural latex"
        },
        features: [
            "100% natural latex",
            "Responsive support",
            "Natural cooling",
            "Hypoallergenic",
            "Long-lasting durability"
        ],
        delivery: "Same Day Available",
        inStock: true,
        isFeatured: false,
        isNew: false
    },
    {
        id: 17,
        name: "Cooling Gel Mattress",
        category: "mattresses",
        price: 899,
        description: "Advanced cooling technology with gel-infused memory foam for temperature regulation.",
        images: [
            "images/mattresses/mattress-5-1.jpg",
            "images/mattresses/mattress-5-2.jpg",
            "images/mattresses/mattress-5-3.jpg"
        ],
        specifications: {
            material: "Gel Memory Foam",
            color: "White",
            dimensions: "Queen: 60\" x 80\" x 12\"",
            firmness: "Medium",
            warranty: "10 years",
            cooling: "Advanced gel technology"
        },
        features: [
            "Advanced gel cooling",
            "Temperature regulation",
            "Pressure relief",
            "Motion isolation",
            "Hypoallergenic"
        ],
        delivery: "Same Day Available",
        inStock: true,
        isFeatured: true,
        isNew: true
    },
    {
        id: 18,
        name: "Pillow Top Mattress",
        category: "mattresses",
        price: 1099,
        description: "Luxurious pillow top mattress with extra cushioning for ultimate comfort.",
        images: [
            "images/mattresses/mattress-6-1.jpg",
            "images/mattresses/mattress-6-2.jpg",
            "images/mattresses/mattress-6-3.jpg"
        ],
        specifications: {
            material: "Memory Foam + Pillow Top",
            color: "White",
            dimensions: "King: 76\" x 80\" x 14\"",
            firmness: "Plush",
            warranty: "12 years",
            cooling: "Breathable cover"
        },
        features: [
            "Extra cushioning layer",
            "Plush comfort",
            "Pressure relief",
            "Temperature regulation",
            "Luxury feel"
        ],
        delivery: "Same Day Available",
        inStock: true,
        isFeatured: false,
        isNew: false
    }
];

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
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { products, ProductManager };
}