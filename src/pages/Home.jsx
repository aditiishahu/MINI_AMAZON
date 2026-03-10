import { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Zap, Tag, TrendingUp, Star } from "lucide-react";
import RecommendationSection from "../components/Recommendationsection.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ProductCard from "../components/ProductCard";
import { UserContext } from "../context/UserContext";
import useRecommendations from "../hooks/useRecommendations";
import { getProductImage } from "../utils/productImages";

// ─── Hero Carousel ────────────────────────────────────────────────────────────
const SLIDES = [
  { id:1, bg:"from-[#1a1a2e] to-[#16213e]", tag:"NEW LAUNCH",     tagColor:"#FF9900", headline:"Next-Gen Electronics",      sub:"Up to 40% off on smartphones, laptops & more", cta:"Shop Electronics", link:"/products?category=Electronics", emoji:"📱", accent:"#FF9900" },
  { id:2, bg:"from-[#0d3b2e] to-[#1a5c47]", tag:"DEAL OF THE DAY",tagColor:"#4ade80", headline:"Home & Kitchen Essentials",  sub:"Transform your space — starting at just ₹299",  cta:"Explore Now",      link:"/products?category=Home",        emoji:"🏠", accent:"#4ade80" },
  { id:3, bg:"from-[#3b0764] to-[#5b21b6]", tag:"BESTSELLERS",    tagColor:"#c084fc", headline:"Fashion Forward",            sub:"Top brands up to 60% off — Limited time only",  cta:"Shop Fashion",     link:"/products?category=Fashion",     emoji:"👗", accent:"#c084fc" },
  { id:4, bg:"from-[#7c1d1d] to-[#9f1239]", tag:"PRIME EXCLUSIVE",tagColor:"#fbbf24", headline:"Books & More",               sub:"Expand your mind — thousands of titles on sale", cta:"Browse Books",     link:"/products?category=Books",       emoji:"📚", accent:"#fbbf24" },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const go = (idx) => {
    if (animating) return;
    setAnimating(true);
    setCurrent((idx + SLIDES.length) % SLIDES.length);
    setTimeout(() => setAnimating(false), 400);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => go(current + 1), 5000);
    return () => clearInterval(timerRef.current);
  }, [current]);

  const slide = SLIDES[current];

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "clamp(220px, 38vw, 460px)" }}>
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} transition-opacity duration-500 ${animating ? "opacity-0" : "opacity-100"}`}>
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: slide.accent }} />
        <div className="max-w-[1500px] mx-auto h-full flex items-center px-8 sm:px-16 gap-8">
          <div className="flex-1">
            <span className="inline-block text-[11px] sm:text-xs font-bold tracking-widest px-3 py-1 rounded-full mb-3 sm:mb-4"
              style={{ backgroundColor: slide.accent + "25", color: slide.accent, border: `1px solid ${slide.accent}50` }}>
              {slide.tag}
            </span>
            <h1 className="text-white font-extrabold text-2xl sm:text-4xl lg:text-5xl leading-tight mb-2 sm:mb-3">{slide.headline}</h1>
            <p className="text-gray-300 text-sm sm:text-base mb-5 sm:mb-8 max-w-md">{slide.sub}</p>
            <Link to={slide.link}
              className="inline-flex items-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: slide.accent, color: "#0F1111" }}>
              {slide.cta} →
            </Link>
          </div>
          <div className="hidden sm:flex items-center justify-center text-8xl lg:text-[120px] select-none flex-shrink-0 w-48 lg:w-64"
            style={{ filter: "drop-shadow(0 0 40px " + slide.accent + "60)" }}>
            {slide.emoji}
          </div>
        </div>
      </div>
      <button onClick={() => go(current - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 z-10"><ChevronLeft size={20} /></button>
      <button onClick={() => go(current + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 z-10"><ChevronRight size={20} /></button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => go(i)} className="rounded-full transition-all duration-300"
            style={{ width: i === current ? 24 : 8, height: 8, backgroundColor: i === current ? slide.accent : "rgba(255,255,255,0.4)" }} />
        ))}
      </div>
    </div>
  );
};

// ─── Deal Timer ───────────────────────────────────────────────────────────────
const DealTimer = ({ endsAt }) => {
  const [timeLeft, setTimeLeft] = useState({ h:0, m:0, s:0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, endsAt - Date.now());
      setTimeLeft({ h: Math.floor(diff/3600000), m: Math.floor((diff%3600000)/60000), s: Math.floor((diff%60000)/1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-1 text-white text-sm font-mono">
      <span className="bg-[#232F3E] px-1.5 py-0.5 rounded">{pad(timeLeft.h)}</span>
      <span className="text-[#FF9900]">:</span>
      <span className="bg-[#232F3E] px-1.5 py-0.5 rounded">{pad(timeLeft.m)}</span>
      <span className="text-[#FF9900]">:</span>
      <span className="bg-[#232F3E] px-1.5 py-0.5 rounded">{pad(timeLeft.s)}</span>
    </div>
  );
};

// ─── Category Grid ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name:"Electronics",   emoji:"📱", color:"bg-blue-50 hover:bg-blue-100",   link:"/products?category=Electronics" },
  { name:"Fashion",       emoji:"👗", color:"bg-pink-50 hover:bg-pink-100",   link:"/products?category=Fashion" },
  { name:"Home & Kitchen",emoji:"🏠", color:"bg-yellow-50 hover:bg-yellow-100",link:"/products?category=Home" },
  { name:"Books",         emoji:"📚", color:"bg-green-50 hover:bg-green-100", link:"/products?category=Books" },
  { name:"Sports",        emoji:"⚽", color:"bg-orange-50 hover:bg-orange-100",link:"/products?category=Sports" },
  { name:"Toys",          emoji:"🧸", color:"bg-purple-50 hover:bg-purple-100",link:"/products?category=Toys" },
  { name:"Beauty",        emoji:"💄", color:"bg-red-50 hover:bg-red-100",     link:"/products?category=Beauty" },
  { name:"Grocery",       emoji:"🛒", color:"bg-lime-50 hover:bg-lime-100",   link:"/products?category=Grocery" },
];

const CategoryGrid = () => (
  <section className="bg-white rounded-sm shadow-sm p-4 mb-4">
    <h2 className="text-[#0F1111] text-xl font-bold mb-4">Shop by Category</h2>
    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
      {CATEGORIES.map((cat) => (
        <Link key={cat.name} to={cat.link}
          className={`${cat.color} rounded-lg p-3 flex flex-col items-center gap-2 transition-all hover:shadow-md hover:-translate-y-0.5 group`}>
          <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
          <span className="text-[10px] sm:text-xs text-[#0F1111] font-medium text-center leading-tight">{cat.name}</span>
        </Link>
      ))}
    </div>
  </section>
);

// ─── Mini Banners ─────────────────────────────────────────────────────────────
const MiniBanners = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
    {[
      { title:"Today's Deals",      sub:"Limited-time savings",          icon:<Tag size={20}/>,        color:"from-[#FF9900] to-[#FF6B00]",  link:"/products?sort=deals" },
      { title:"AI Picks for You",   sub:"Personalized recommendations",  icon:<Star size={20}/>,       color:"from-[#00A8E1] to-[#0076A3]",  link:"/products?sort=recommended" },
      { title:"Trending Now",       sub:"What others are buying",        icon:<TrendingUp size={20}/>, color:"from-[#6B21A8] to-[#4C1D95]",  link:"/products?sort=trending" },
      { title:"Prime Deals",        sub:"Exclusive member savings",      icon:<Zap size={20}/>,        color:"from-[#00A8E1] to-[#1D4ED8]",  link:"/products?prime=true" },
    ].map((b) => (
      <Link key={b.title} to={b.link}
        className={`bg-gradient-to-br ${b.color} rounded-lg p-5 text-white flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all group`}>
        <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform">{b.icon}</div>
        <div>
          <div className="font-bold text-sm sm:text-base">{b.title}</div>
          <div className="text-white/80 text-xs mt-0.5">{b.sub}</div>
        </div>
      </Link>
    ))}
  </div>
);

// ─── Flash Deals Strip ────────────────────────────────────────────────────────
const FlashDealsStrip = ({ products = [], loading }) => {
  const dealEndsAt = useRef(Date.now() + 3 * 3600 * 1000).current;
  const claimedRef = useRef(products.map(() => Math.floor(Math.random() * 60 + 20)));

  return (
    <section className="bg-white rounded-sm shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-[#0F1111] text-xl font-bold flex items-center gap-2">
            <Zap size={20} className="text-[#FF9900] fill-[#FF9900]" /> Lightning Deals
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">Ends in</span>
            <DealTimer endsAt={dealEndsAt} />
          </div>
        </div>
        <Link to="/products?sort=deals" className="text-[#007185] text-sm hover:underline flex items-center gap-1">
          See all deals <ChevronRight size={14} />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {loading
          ? Array(6).fill(null).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-44 sm:w-48"><LoadingSkeleton /></div>
            ))
          : products.slice(0, 8).map((product, i) => {
              const claimed = claimedRef.current[i] || Math.floor(Math.random() * 60 + 20);
              const imgUrl  = getProductImage(product, i);
              return (
                <Link key={product.id || product._id} to={`/product/${product.id || product._id}`}
                  className="flex-shrink-0 w-44 sm:w-48 bg-white border border-gray-200 rounded hover:shadow-lg transition-shadow group">

                  {/* ── Product image ── */}
                  <div className="h-40 flex items-center justify-center p-3 overflow-hidden bg-gray-50 rounded-t">
                    <img
                      src={imgUrl}
                      alt={product.title}
                      onError={(e) => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                    />
                    {/* emoji fallback (hidden by default) */}
                    <div className="w-full h-full items-center justify-center text-4xl" style={{ display:"none" }}>
                      {{ Electronics:"📱", Fashion:"👗", Home:"🏠", Books:"📚", Sports:"⚽", Beauty:"💄", Toys:"🧸", Grocery:"🛒" }[product.category] || "🛍️"}
                    </div>
                  </div>

                  {/* Deal progress bar */}
                  <div className="px-2 pt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                      <div className="bg-[#CC0C39] h-1.5 rounded-full" style={{ width: `${claimed}%` }} />
                    </div>
                    <p className="text-[10px] text-[#CC0C39] font-bold mb-1">{claimed}% claimed</p>
                  </div>
                  <div className="px-2 pb-2">
                    <p className="text-xs text-[#0F1111] line-clamp-2">{product.title}</p>
                    <p className="text-sm font-bold text-[#0F1111] mt-1">₹{product.price?.toLocaleString("en-IN")}</p>
                  </div>
                </Link>
              );
            })}
      </div>
    </section>
  );
};

// ─── Mock Products ────────────────────────────────────────────────────────────
const MOCK_PRODUCTS = Array.from({ length: 20 }, (_, i) => ({
  id: `mock-${i}`,
  title: [
    "Wireless Bluetooth Earbuds Pro Max 5.0",
    "Premium Cotton Kurta Set for Men",
    "Stainless Steel Water Bottle 1L",
    "React & Node.js Full Stack Development",
    "Non-Stick Cookware Set 5 Piece",
    "Running Shoes Lightweight Mesh",
    "Moisturizing Face Serum 30ml",
    "LEGO Classic Brick Box 484 Pieces",
    "Mechanical Keyboard RGB Backlit",
    "Yoga Mat Anti-Slip 6mm Thick",
  ][i % 10],
  price:         [1299,  799, 499, 399, 2499, 1999,  699, 3499, 2999,  899][i % 10],
  originalPrice: [2499, 1299, 799, 699, 3999, 2999, 1099, 4999, 4499, 1499][i % 10],
  rating:        3.5 + (i % 15) * 0.1,
  reviewCount:   100 + i * 47,
  prime:         i % 3 === 0,
  category:      ["Electronics","Fashion","Home","Books","Home & Kitchen","Sports","Beauty","Toys"][i % 8],
  badge:         i % 5 === 0 ? "Best Seller" : i % 7 === 0 ? "New" : null,
  image:         null,
}));

// ─── Home Page ────────────────────────────────────────────────────────────────
const Home = () => {
  const { user } = useContext(UserContext);
  const { recommendations, loading } = useRecommendations();

  const products  = recommendations?.length ? recommendations : MOCK_PRODUCTS;
  const featured  = products.slice(0, 10);
  const trending  = [...products].sort(() => Math.random() - 0.5).slice(0, 10);
  const deals     = products.filter((_, i) => i % 2 === 0).slice(0, 8);

  return (
    <div className="min-h-screen bg-[#EAEDED]">
      <HeroCarousel />

      <main className="max-w-[1500px] mx-auto px-3 sm:px-4 py-4 -mt-16 relative z-10">

        {/* Quick cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { title:"Sign in for the best experience",  cta:"Sign in securely",   link:"/login" },
            { title:"Bestsellers in Electronics",        cta:"Shop now",           link:"/products?category=Electronics" },
            { title:"Deals in Home & Kitchen",           cta:"See all deals",      link:"/products?category=Home" },
            { title: user ? `Welcome back, ${user.name?.split(" ")[0]}!` : "New arrivals in Fashion",
              cta: user ? "Go to your picks" : "Discover now",
              link: user ? "/dashboard" : "/products?category=Fashion" },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-sm shadow-sm p-4 flex flex-col justify-between min-h-[120px]">
              <h3 className="text-[#0F1111] font-bold text-sm sm:text-base leading-snug">{card.title}</h3>
              <Link to={card.link} className="text-[#007185] text-xs sm:text-sm hover:text-[#C7511F] hover:underline mt-2 inline-block">{card.cta}</Link>
            </div>
          ))}
        </div>

        <CategoryGrid />
        <MiniBanners />
        <FlashDealsStrip products={deals} loading={loading} />

        {/* Recently viewed */}
        <section className="bg-white rounded-sm shadow-sm p-4 mb-4">
          <h2 className="text-[#0F1111] text-xl font-bold mb-3">🕐 Keep shopping for</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {MOCK_PRODUCTS.slice(5, 10).map((product, i) => (
              <Link key={product.id} to={`/product/${product.id}`}
                className="flex items-center gap-3 p-2 border border-gray-100 rounded hover:shadow-md transition-shadow group">
                <div className="w-16 h-16 bg-gray-50 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img
                    src={getProductImage(product, i)}
                    alt={product.title}
                    onError={(e) => { e.target.style.display="none"; }}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-[#0F1111] line-clamp-2 group-hover:text-[#C7511F]">{product.title}</p>
                  <p className="text-sm font-bold mt-1">₹{product.price?.toLocaleString("en-IN")}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <RecommendationSection title="Recommended for You" icon="🤖" products={featured} loading={loading} viewAllLink="/products?sort=recommended" />
        <RecommendationSection title="Trending in Your Area" icon="🔥" products={trending} loading={loading} viewAllLink="/products?sort=trending" />
      </main>
    </div>
  );
};

export default Home;
