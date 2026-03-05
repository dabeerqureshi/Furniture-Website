# Furniture Store - Premium E-commerce Website

A modern, responsive e-commerce website for a premium furniture store with same-day delivery and WhatsApp integration.

## 🚀 Features

### Core Functionality
- **12+ Products** across 3 categories (Sofas, Beds, Mattresses)
- **Same-day delivery** with cash on delivery option
- **WhatsApp integration** for order processing and customer support
- **Mobile-responsive design** with Tailwind CSS
- **Performance optimized** with lazy loading and image compression

### User Experience
- **Homepage** with hero section, featured products, and quick actions
- **Shop page** with filtering, search, and product grid
- **Product detail pages** with image gallery and zoom functionality
- **Order system** with validation and WhatsApp integration
- **Favorites system** with local storage persistence
- **Admin panel** for product management

### Technical Features
- **SEO optimized** with meta tags and OpenGraph integration
- **Progressive Web App** features (service worker, manifest)
- **Performance monitoring** with custom performance.js
- **Cross-browser compatibility** with modern JavaScript
- **Accessibility** with semantic HTML and ARIA labels

## 📁 Project Structure

```
Furniture-Website/
├── index.html              # Homepage
├── shop.html              # Product catalog
├── product.html           # Product detail page
├── about.html             # About us page
├── contact.html           # Contact page
├── admin.html             # Admin dashboard
├── css/
│   └── style.css          # Custom styles and animations
├── js/
│   ├── products.js        # Product data and management
│   ├── shop.js           # Shop page functionality
│   ├── product.js        # Product detail page logic
│   ├── whatsapp.js       # WhatsApp integration
│   ├── app.js            # Main application logic
│   ├── admin.js          # Admin panel functionality
│   ├── performance.js    # Performance monitoring
│   └── sw.js            # Service worker
├── images/               # Product and UI images
├── icons/               # Favicon and app icons
└── README.md            # This file
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup and modern features
- **CSS3** - Custom styles with Tailwind CSS framework
- **JavaScript ES6+** - Modern JavaScript with modules
- **Tailwind CSS** - Utility-first CSS framework
- **Font Awesome** - Icon library
- **Service Worker** - PWA functionality
- **Local Storage** - Client-side data persistence

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for local server) or any HTTP server

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/furniture-website.git
   cd furniture-website
   ```

2. **Start the local server:**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Or using Python 2
   python -m SimpleHTTPServer 8000
   
   # Or using Node.js (if available)
   npx http-server -p 8000
   ```

3. **Open in browser:**
   Navigate to `http://localhost:8000` in your web browser.

## 📱 Features Overview

### Homepage (`index.html`)
- Hero section with call-to-action
- Featured products carousel
- Quick action buttons for shop and contact
- Floating WhatsApp button
- Responsive navigation

### Shop Page (`shop.html`)
- Product filtering by category
- Search functionality
- Product grid with hover effects
- Loading states and error handling
- "Load More" pagination

### Product Detail Page (`product.html`)
- High-quality product images with zoom
- Product specifications and features
- Order form with validation
- Related products section
- Share functionality

### Admin Panel (`admin.html`)
- Secure login system
- Product management dashboard
- Add, edit, and delete products
- Real-time statistics
- Image upload with preview

### WhatsApp Integration
- Order processing via WhatsApp
- Customer support chat
- Automatic message formatting
- Contact information display

## 🔧 Configuration

### WhatsApp Integration
Update the WhatsApp number in all HTML files:
```javascript
// Replace YOURWHATSAPPNUMBER with your actual number
// Format: +[country code][number]
// Example: +15551234567
```

### Admin Password
Change the admin password in `js/admin.js`:
```javascript
const ADMIN_PASSWORD = 'your-new-password';
```

### Product Data
Modify products in `js/products.js`:
```javascript
const products = [
  {
    id: 'unique-id',
    name: 'Product Name',
    category: 'sofas|beds|mattresses',
    price: 999.99,
    images: ['image1.jpg', 'image2.jpg'],
    description: 'Product description',
    featured: true,
    new: false,
    specifications: {
      material: 'Leather',
      color: 'Brown',
      dimensions: '80" x 36" x 34"'
    },
    features: ['Feature 1', 'Feature 2'],
    delivery: 'Same day delivery available'
  }
];
```

## 🎨 Design System

### Color Palette
- **Primary**: Purple (#8b5cf6)
- **Secondary**: Gray (#1e293b)
- **Success**: Green (#22c55e)
- **Warning**: Yellow (#eab308)
- **Error**: Red (#ef4444)

### Typography
- **Font Family**: Inter (system-ui fallback)
- **Font Sizes**: Responsive scale from 0.75rem to 3rem
- **Line Heights**: 1.25 to 1.75 for optimal readability

### Spacing
- **Base Unit**: 4px (Tailwind's default)
- **Padding/Margin**: Consistent spacing scale
- **Grid System**: 12-column responsive grid

## 📈 Performance Features

### Image Optimization
- Lazy loading for product images
- WebP format with JPEG fallback
- Optimized image dimensions
- Progressive loading

### Code Splitting
- Modular JavaScript architecture
- On-demand script loading
- Minimized bundle sizes

### Caching Strategy
- Service worker for offline functionality
- Local storage for user preferences
- Browser caching optimization

## 🔒 Security Features

### Admin Panel Security
- Password protection
- Session management
- Input validation
- XSS prevention

### Data Security
- No sensitive data stored client-side
- Secure form handling
- Input sanitization

## 🌐 Browser Support

- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

## 📱 Mobile Support

- **iOS**: Safari 13+
- **Android**: Chrome 80+
- **Responsive**: All screen sizes
- **Touch-friendly**: Optimized for mobile interaction

## 🚀 Deployment

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select `main` branch and `/ (root)` folder
4. Access at `https://username.github.io/repository-name`

### Netlify
1. Connect GitHub repository
2. Set build command: (no build needed)
3. Set publish directory: `./`
4. Deploy

### Vercel
1. Import project from GitHub
2. Configure as static site
3. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact via WhatsApp (configured number)
- Email: info@furniturestore.com

## 📊 Analytics

The website includes performance monitoring:
- Page load times
- User interactions
- Error tracking
- Performance metrics

View performance data in browser console or through the performance dashboard.

---

**Built with ❤️ for modern e-commerce needs**