# 🛒 MINI AMAZON — Scalable AI Recommender
### Frontend UI — React + Tailwind CSS

![Mini Amazon](https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80)

---

## 🚀 Live Preview

> Run locally with `npm run dev` → open `http://localhost:5173`

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏠 **Home Page** | Hero carousel, lightning deals, category grid, AI recommendations |
| 🛍️ **Products Page** | Filter by category, sort by price/rating, grid & list view |
| 📦 **Product Detail** | Image gallery, buy box, reviews, related products |
| 🛒 **Cart + Checkout** | Quantity controls, promo codes, 4-step checkout flow |
| 🔐 **Login / Register** | Form validation, password strength meter, remember me |
| 👤 **User Profile** | Order history, personal info, security settings |
| 📊 **AI Dashboard** | Trending products, category suggestions, activity summary |

---

## 🎨 Tech Stack

```
⚛️  React 18          — UI Framework
⚡  Vite              — Build Tool
🎨  Tailwind CSS v4   — Styling
🔗  React Router v6   — Navigation
🎯  Lucide React      — Icons
🌐  Unsplash API      — Product Images
```

---

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html
└── src/
    ├── api/
    │   └── api.js                  # API configuration
    ├── assets/                     # Static assets
    ├── components/
    │   ├── Footer.jsx              # Site footer
    │   ├── LoadingSkeleton.jsx     # Shimmer loaders
    │   ├── Navbar.jsx              # Top navigation bar
    │   ├── ProductCard.jsx         # Reusable product card
    │   └── RecommendationSection.jsx # AI recommendations grid
    ├── context/
    │   └── UserContext.jsx         # Global auth + cart state
    ├── hooks/
    │   └── useRecommendations.js   # AI recommendations hook
    ├── pages/
    │   ├── Cart.jsx                # Cart + full checkout flow
    │   ├── Dashboard.jsx           # AI recommendations dashboard
    │   ├── Home.jsx                # Landing page
    │   ├── ProductDetail.jsx       # Single product page
    │   ├── Products.jsx            # Product listing + filters
    │   └── UserProfile.jsx         # Login / Register / Profile
    ├── utils/
    │   └── productImages.js        # Category-based image mapper
    ├── App.jsx                     # Routes
    ├── index.css                   # Tailwind imports
    └── main.jsx                    # Entry point
```

---

## 🔌 API Integration

All API calls connect to the backend at `http://localhost:5000`

| Endpoint | Method | Description |
|---|---|---|
| `/api/users/login` | POST | User login |
| `/api/users/register` | POST | User registration |
| `/api/products` | GET | All products (supports `?category=`) |
| `/api/products/:id` | GET | Single product |
| `/api/recommendations` | GET | AI recommendations |
| `/api/recommendations/trending` | GET | Trending products |
| `/api/recommendations/category` | GET | Category suggestions |
| `/api/recommendations/recent` | GET | Recently viewed |
| `/api/recommendations/activity` | GET | User activity stats |

> 💡 If backend is offline, mock data loads automatically so the UI always looks complete.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/aditiishahu/MINI_AMAZON.git

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Install Tailwind PostCSS plugin
npm install -D @tailwindcss/postcss

# Start development server
npm run dev
```

### Open in browser
```
http://localhost:5173
```

---

## 🎯 Pages Walkthrough

### 🏠 Home Page
- Auto-rotating hero carousel with 4 slides
- Lightning deals with live countdown timer
- Shop by category grid
- AI-powered recommendation sections
- Trending products strip

### 🛍️ Products Page
- Sidebar filters: Category, Price range, Rating, Prime
- Sort by: Featured, Price, Rating, Newest
- Toggle between Grid and List view
- URL-synced filters (shareable links)
- Mobile drawer filters

### 📦 Product Detail Page
- Image gallery with zoom on click
- Add to Cart / Buy Now buttons
- Tabbed info: Description / Features / Specs
- Star rating distribution bars
- Related products section

### 🛒 Cart + Checkout
- Quantity +/− controls
- Save for later
- Promo codes: `SAVE10` · `FLAT200` · `MINI100`
- 4-step checkout: Address → Delivery → Payment → Review
- Order success screen with order ID

### 📊 AI Dashboard
- Personalized greeting
- Activity stats: Views, Orders, Wishlist, Spent
- Recently viewed products
- Trending products
- Category-based suggestions

---

## 🎨 Design System

| Color | Hex | Usage |
|---|---|---|
| Amazon Dark | `#131921` | Navbar background |
| Amazon Navy | `#232F3E` | Nav strip, footer |
| Amazon Yellow | `#FFD814` | Primary buttons |
| Amazon Orange | `#FF9900` | Accents, icons |
| Amazon Teal | `#007185` | Links |
| Amazon Red | `#CC0C39` | Badges, discounts |

---

## 👥 Team

> **Group Project** — Scalable AI Recommender (Mini Amazon)

| Role | Name |
|---|---|
| 🎨 Frontend | Aditi Shahu |
| ⚙️ Backend | Ayush Naukarkar |
| 🤖 AI/ML | Archita Ramchandani |

---

## 📄 License

This project is built for educational purposes as part of a group project.

---

<div align="center">
  <strong>Built with ❤️ using React + Tailwind CSS</strong><br/>
  <sub>⭐ Star this repo if you found it helpful!</sub>
</div>
