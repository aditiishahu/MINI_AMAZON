import { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp, Clock, LayoutGrid, BarChart2,
  ChevronRight, ChevronLeft, Star, Zap,
  ShoppingBag, Eye, Package, Heart, RefreshCw
} from "lucide-react";
import { UserContext } from "../context/UserContext";
import ProductCard from "../components/ProductCard";
import LoadingSkeleton from "../components/LoadingSkeleton";

const API_BASE = "http://localhost:5000/api/recommendations";

// ─── Mock data fallback ───────────────────────────────────────────────────────
const makeProducts = (offset = 0) =>
  Array.from({ length: 10 }, (_, i) => ({
    id: `mock-${offset + i}`,
    title: [
      "Wireless Bluetooth Earbuds Pro Max 5.0",
      "Premium Cotton Kurta Set for Men",
      "Stainless Steel Water Bottle 1L",
      "React & Node.js Full Stack Book",
      "Non-Stick Cookware Set 5 Piece",
      "Running Shoes Lightweight Mesh",
      "Vitamin C Face Serum 30ml",
      "LEGO Classic Brick Box 484 Pcs",
      "Mechanical Keyboard RGB Backlit",
      "Yoga Mat Anti-Slip 6mm Thick",
    ][i % 10],
    price:         [1299, 799, 499, 399, 2499, 1999, 699, 3499, 2999, 899][i % 10],
    originalPrice: [2499,1299, 799, 699, 3999, 2999,1099, 4999, 4499,1499][i % 10],
    rating:   3.5 + (i % 10) * 0.15,
    reviewCount: 120 + (offset + i) * 53,
    prime:    i % 3 === 0,
    category: ["Electronics","Fashion","Home","Books","Kitchen","Sports","Beauty","Toys"][i % 8],
    badge:    i % 5 === 0 ? "Best Seller" : i % 7 === 0 ? "New" : null,
    image:    null,
  }));

const MOCK_TRENDING   = makeProducts(0);
const MOCK_RECENT     = makeProducts(10);
const MOCK_CATEGORIES = makeProducts(20);

const MOCK_ACTIVITY = {
  totalViewed:    47,
  totalPurchased:  8,
  wishlistCount:  12,
  totalSpent:   8492,
  recentViewed: makeProducts(30).slice(0, 6),
};

const CATEGORIES = [
  { name: "Electronics", emoji: "📱", color: "bg-blue-50 border-blue-200 hover:bg-blue-100" },
  { name: "Fashion",     emoji: "👗", color: "bg-pink-50 border-pink-200 hover:bg-pink-100" },
  { name: "Home",        emoji: "🏠", color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100" },
  { name: "Books",       emoji: "📚", color: "bg-green-50 border-green-200 hover:bg-green-100" },
  { name: "Sports",      emoji: "⚽", color: "bg-orange-50 border-orange-200 hover:bg-orange-100" },
  { name: "Beauty",      emoji: "💄", color: "bg-red-50 border-red-200 hover:bg-red-100" },
  { name: "Toys",        emoji: "🧸", color: "bg-purple-50 border-purple-200 hover:bg-purple-100" },
  { name: "Grocery",     emoji: "🛒", color: "bg-lime-50 border-lime-200 hover:bg-lime-100" },
];

// ─── Horizontal scroll section ────────────────────────────────────────────────
const ScrollSection = ({ title, icon, products, loading, viewAllLink, badge }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white rounded-sm shadow-sm p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#0F1111] flex items-center gap-2">
          {icon} {title}
          {badge && (
            <span className="text-[10px] font-bold bg-[#CC0C39] text-white px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
            <ChevronLeft size={14} />
          </button>
          <button onClick={() => scroll(1)} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
            <ChevronRight size={14} />
          </button>
          <Link to={viewAllLink} className="text-[#007185] text-sm hover:underline hover:text-[#C7511F] flex items-center gap-1 ml-1">
            See all <ChevronRight size={13} />
          </Link>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {loading
          ? Array(6).fill(null).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-44 sm:w-48">
                <LoadingSkeleton />
              </div>
            ))
          : products.map((product) => (
              <div key={product.id || product._id} className="flex-shrink-0 w-44 sm:w-48">
                <ProductCard product={product} />
              </div>
            ))}
      </div>
    </section>
  );
};

// ─── Activity stat card ───────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color, sub }) => (
  <div className={`${color} rounded-sm border p-4 flex items-center gap-4`}>
    <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-bold text-[#0F1111] leading-none">{value}</p>
      <p className="text-sm font-medium text-[#0F1111] mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Recently viewed horizontal strip ────────────────────────────────────────
const RecentlyViewed = ({ products, loading }) => (
  <section className="bg-white rounded-sm shadow-sm p-5 mb-4">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-[#0F1111] flex items-center gap-2">
        <Clock size={18} className="text-[#FF9900]" /> Recently Viewed
      </h2>
      <Link to="/products" className="text-[#007185] text-sm hover:underline flex items-center gap-1">
        See all <ChevronRight size={13} />
      </Link>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
      {loading
        ? Array(6).fill(null).map((_, i) => <LoadingSkeleton key={i} />)
        : products.slice(0, 6).map((product) => (
            <Link
              key={product.id || product._id}
              to={`/product/${product.id || product._id}`}
              className="flex flex-col items-center gap-2 p-3 border border-gray-100 rounded hover:shadow-md hover:border-gray-300 transition-all group"
            >
              <div className="w-full h-24 bg-gray-50 rounded flex items-center justify-center overflow-hidden">
                {product.image
                  ? <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                  : <span className="text-3xl">🛍️</span>
                }
              </div>
              <p className="text-xs text-[#0F1111] line-clamp-2 text-center group-hover:text-[#C7511F]">{product.title}</p>
              <p className="text-sm font-bold text-[#0F1111]">₹{product.price?.toLocaleString("en-IN")}</p>
            </Link>
          ))}
    </div>
  </section>
);

// ─── Category suggestions ─────────────────────────────────────────────────────
const CategorySuggestions = ({ products, loading, activeCategory, onCategory }) => (
  <section className="bg-white rounded-sm shadow-sm p-5 mb-4">
    <h2 className="text-lg font-bold text-[#0F1111] mb-4 flex items-center gap-2">
      <LayoutGrid size={18} className="text-[#FF9900]" /> Browse by Category
    </h2>

    {/* Category pills */}
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onCategory(cat.name)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border flex-shrink-0 transition-all ${
            activeCategory === cat.name
              ? "bg-[#232F3E] text-white border-[#232F3E]"
              : "bg-white text-[#0F1111] border-gray-300 hover:border-[#FF9900] hover:text-[#C7511F]"
          }`}
        >
          <span>{cat.emoji}</span> {cat.name}
        </button>
      ))}
    </div>

    {/* Products grid */}
    {loading ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array(5).fill(null).map((_, i) => <LoadingSkeleton key={i} />)}
      </div>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {products
          .filter((p) => !activeCategory || activeCategory === "All" || p.category === activeCategory)
          .slice(0, 10)
          .map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
      </div>
    )}
  </section>
);

// ─── Activity Summary ─────────────────────────────────────────────────────────
const ActivitySummary = ({ activity, loading }) => (
  <section className="bg-white rounded-sm shadow-sm p-5 mb-4">
    <h2 className="text-lg font-bold text-[#0F1111] mb-4 flex items-center gap-2">
      <BarChart2 size={18} className="text-[#FF9900]" /> Your Activity Summary
    </h2>

    {loading ? (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array(4).fill(null).map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-sm" />
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Eye size={22} className="text-blue-500" />}
          label="Products Viewed"
          value={activity.totalViewed}
          color="bg-blue-50 border-blue-200"
          sub="This month"
        />
        <StatCard
          icon={<Package size={22} className="text-green-600" />}
          label="Orders Placed"
          value={activity.totalPurchased}
          color="bg-green-50 border-green-200"
          sub="All time"
        />
        <StatCard
          icon={<Heart size={22} className="text-red-500" />}
          label="Wishlist Items"
          value={activity.wishlistCount}
          color="bg-red-50 border-red-200"
          sub="Saved for later"
        />
        <StatCard
          icon={<ShoppingBag size={22} className="text-[#FF9900]" />}
          label="Total Spent"
          value={`₹${activity.totalSpent.toLocaleString("en-IN")}`}
          color="bg-orange-50 border-orange-200"
          sub="Lifetime"
        />
      </div>
    )}
  </section>
);

// ─── Dashboard Header ─────────────────────────────────────────────────────────
const DashboardHeader = ({ user, onRefresh, refreshing }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="bg-gradient-to-r from-[#131921] to-[#232F3E] rounded-sm shadow-sm p-6 mb-4 flex items-center justify-between flex-wrap gap-4">
      <div>
        <p className="text-[#FF9900] text-sm font-medium mb-1">{greeting} 👋</p>
        <h1 className="text-white text-2xl font-bold">
          {user?.name ? `Welcome back, ${user.name.split(" ")[0]}!` : "Your AI Dashboard"}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Here's what we picked for you today — powered by AI 🤖
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 rounded-full transition-colors border border-white/20"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing…" : "Refresh picks"}
        </button>
        <Link
          to="/products"
          className="flex items-center gap-2 bg-[#FF9900] hover:bg-[#e88b00] text-[#0F1111] font-bold text-sm px-4 py-2 rounded-full transition-colors"
        >
          Browse all <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
const Dashboard = () => {
  const { user } = useContext(UserContext);

  const [trending,       setTrending]       = useState([]);
  const [categoryProds,  setCategoryProds]  = useState([]);
  const [recentViewed,   setRecentViewed]   = useState([]);
  const [activity,       setActivity]       = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [refreshing,     setRefreshing]     = useState(false);
  const [activeCategory, setActiveCategory] = useState("Electronics");
  const [error,          setError]          = useState(false);

  const fetchAll = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(false);

    try {
      const headers = { "Content-Type": "application/json" };
      const userId  = user?.id || user?._id || "";

      // Fire all requests in parallel
      const [trendRes, catRes, recentRes, activityRes] = await Promise.allSettled([
        fetch(`${API_BASE}/trending?userId=${userId}`,  { headers }),
        fetch(`${API_BASE}/category?userId=${userId}`,  { headers }),
        fetch(`${API_BASE}/recent?userId=${userId}`,    { headers }),
        fetch(`${API_BASE}/activity?userId=${userId}`,  { headers }),
      ]);

      // Parse each — fall back to mock if any fail
      const parse = async (result, fallback) => {
        if (result.status === "fulfilled" && result.value.ok) {
          const data = await result.value.json();
          return data.products || data.items || data || fallback;
        }
        return fallback;
      };

      setTrending(      await parse(trendRes,    MOCK_TRENDING));
      setCategoryProds( await parse(catRes,      MOCK_CATEGORIES));
      setRecentViewed(  await parse(recentRes,   MOCK_RECENT));

      // Activity is slightly different shape
      if (activityRes.status === "fulfilled" && activityRes.value.ok) {
        const d = await activityRes.value.json();
        setActivity(d.activity || d || MOCK_ACTIVITY);
      } else {
        setActivity(MOCK_ACTIVITY);
      }
    } catch {
      // Full fallback
      setTrending(MOCK_TRENDING);
      setCategoryProds(MOCK_CATEGORIES);
      setRecentViewed(MOCK_RECENT);
      setActivity(MOCK_ACTIVITY);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAll(); }, [user]);

  return (
    <div className="min-h-screen bg-[#EAEDED]">
      <div className="max-w-[1500px] mx-auto px-3 sm:px-4 py-4">

        {/* Breadcrumb */}
        <nav className="text-xs text-[#007185] mb-3 flex items-center gap-1">
          <Link to="/" className="hover:underline">Home</Link>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-[#0F1111]">Your Dashboard</span>
        </nav>

        {/* API offline notice */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-sm px-4 py-2.5 mb-4 text-sm text-yellow-800 flex items-center gap-2">
            ⚠️ Showing sample data — connect your backend at <code className="bg-yellow-100 px-1 rounded text-xs">{API_BASE}</code> to see real recommendations.
          </div>
        )}

        {/* Header */}
        <DashboardHeader user={user} onRefresh={() => fetchAll(true)} refreshing={refreshing} />

        {/* Activity Summary */}
        <ActivitySummary activity={activity || MOCK_ACTIVITY} loading={loading} />

        {/* Recently Viewed */}
        <RecentlyViewed
          products={recentViewed.length ? recentViewed : MOCK_ACTIVITY.recentViewed}
          loading={loading}
        />

        {/* Trending Products */}
        <ScrollSection
          title="Trending Right Now"
          icon={<TrendingUp size={18} className="text-[#FF9900]" />}
          products={trending}
          loading={loading}
          viewAllLink="/products?sort=trending"
          badge="HOT"
        />

        {/* Category Suggestions */}
        <CategorySuggestions
          products={categoryProds}
          loading={loading}
          activeCategory={activeCategory}
          onCategory={(cat) => setActiveCategory(cat === activeCategory ? "All" : cat)}
        />

        {/* Prime Banner */}
        <div className="bg-gradient-to-r from-[#00A8E1] to-[#1D4ED8] rounded-sm shadow-sm p-6 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <Zap size={28} className="fill-white text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">Try Prime FREE for 30 days</p>
              <p className="text-white/80 text-sm">Fast delivery · Exclusive deals · Ad-free experience</p>
            </div>
          </div>
          <button className="bg-white text-[#1D4ED8] font-bold px-6 py-2.5 rounded-full text-sm hover:bg-gray-100 transition-colors flex-shrink-0">
            Try Prime Free
          </button>
        </div>

        {/* Top Rated */}
        <ScrollSection
          title="Top Rated Products"
          icon={<Star size={18} className="fill-[#FF9900] text-[#FF9900]" />}
          products={[...trending].sort((a, b) => (b.rating || 0) - (a.rating || 0))}
          loading={loading}
          viewAllLink="/products?sort=rating"
        />

      </div>
    </div>
  );
};

export default Dashboard;
