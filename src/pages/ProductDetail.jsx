import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Star, StarHalf, ShoppingCart, Zap, ChevronRight,
  Shield, RotateCcw, Truck, Heart, Share2, ChevronLeft,
  ThumbsUp, Check, Minus, Plus
} from "lucide-react";
import { UserContext } from "../context/UserContext";
import ProductCard from "../components/ProductCard";
import LoadingSkeleton from "../components/LoadingSkeleton";

const API_BASE = "http://localhost:5000/api/products";

// ─── Mock single product ──────────────────────────────────────────────────────
const makeMockProduct = (id) => ({
  id,
  title: "Wireless Bluetooth Earbuds Pro Max 5.0 with Active Noise Cancellation, 30H Battery, IPX5 Waterproof",
  brand: "SoundCore",
  price: 1299,
  originalPrice: 2499,
  rating: 4.3,
  reviewCount: 4872,
  prime: true,
  category: "Electronics",
  badge: "Best Seller",
  inStock: true,
  stockCount: 12,
  images: [null, null, null, null],
  description: `Experience premium sound quality with the SoundCore Pro Max earbuds. Featuring cutting-edge Active Noise Cancellation technology, these earbuds deliver an immersive audio experience whether you're commuting, working out, or relaxing at home.`,
  features: [
    "Active Noise Cancellation with 4 microphones for crystal-clear calls",
    "30-hour total battery life with charging case (8hrs per charge)",
    "IPX5 waterproof rating — sweat and splash resistant",
    "Bluetooth 5.0 with 10m stable connection range",
    "Ergonomic design with 3 ear tip sizes included",
    "Touch controls for music, calls, and voice assistant",
  ],
  specs: {
    "Brand":           "SoundCore",
    "Model":           "Pro Max 5.0",
    "Connectivity":    "Bluetooth 5.0",
    "Battery Life":    "30 hours total",
    "Water Resistance":"IPX5",
    "Weight":          "52g (with case)",
    "Warranty":        "1 Year Manufacturer",
    "Color":           "Midnight Black",
    "In the Box":      "Earbuds, Charging Case, USB-C Cable, 3 Ear Tips",
  },
  reviews: [
    { id: 1, user: "Rahul M.", rating: 5, title: "Absolutely love these earbuds!", body: "The sound quality is incredible and the noise cancellation works perfectly on the metro. Battery life is exactly as advertised.", helpful: 142, date: "15 Jan 2025", verified: true },
    { id: 2, user: "Priya S.", rating: 4, title: "Great value for money", body: "Very comfortable to wear for long hours. Call quality is excellent. Only minor issue is the touch controls are a bit sensitive.", helpful: 89, date: "3 Feb 2025", verified: true },
    { id: 3, user: "Arjun K.", rating: 5, title: "Best earbuds under 2000!", body: "I've tried many earbuds in this price range and these are by far the best. The bass is punchy and the mids are clear.", helpful: 67, date: "22 Feb 2025", verified: true },
    { id: 4, user: "Sneha R.", rating: 3, title: "Decent but not perfect", body: "Sound is good but the fit isn't great for my ears. Kept falling out during workouts. Might work better for others.", helpful: 34, date: "10 Mar 2025", verified: false },
  ],
});

const MOCK_RELATED = Array.from({ length: 6 }, (_, i) => ({
  id: `related-${i}`,
  title: ["Sony WF-1000XM5 Earbuds", "boAt Airdopes 141", "JBL Tune 230NC TWS", "Realme Buds Air 5 Pro", "Nothing Ear (2)", "OnePlus Buds Pro 2"][i],
  price: [18990, 999, 3999, 2999, 8999, 9999][i],
  originalPrice: [24990, 1999, 5999, 4999, 11999, 12999][i],
  rating: [4.6, 4.2, 4.4, 4.3, 4.5, 4.4][i],
  reviewCount: [12450, 34200, 8930, 15670, 9870, 7650][i],
  prime: i % 2 === 0,
  category: "Electronics",
  image: null,
}));

// ─── Star Rating Bar ──────────────────────────────────────────────────────────
const RatingBar = ({ star, percent }) => (
  <div className="flex items-center gap-2 text-xs">
    <span className="text-[#007185] w-10 text-right hover:underline cursor-pointer">{star} star</span>
    <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <div className="bg-[#FF9900] h-2.5 rounded-full" style={{ width: `${percent}%` }} />
    </div>
    <span className="text-[#007185] w-8 hover:underline cursor-pointer">{percent}%</span>
  </div>
);

// ─── Star display ─────────────────────────────────────────────────────────────
const StarDisplay = ({ rating, size = 16 }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center">
      {[1,2,3,4,5].map((s) =>
        s <= full
          ? <Star key={s} size={size} className="fill-[#FF9900] text-[#FF9900]" />
          : s === full + 1 && half
          ? <StarHalf key={s} size={size} className="fill-[#FF9900] text-[#FF9900]" />
          : <Star key={s} size={size} className="text-[#FF9900]" />
      )}
    </div>
  );
};

// ─── Image Gallery ────────────────────────────────────────────────────────────
const ImageGallery = ({ images = [], title }) => {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const validImages = images.filter(Boolean);
  const count = Math.max(validImages.length, 4);

  return (
    <div className="flex gap-3">
      {/* Thumbnails */}
      <div className="flex flex-col gap-2 w-14 flex-shrink-0">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onMouseEnter={() => setActive(i)}
            onClick={() => setActive(i)}
            className={`w-14 h-14 border-2 rounded flex items-center justify-center bg-white transition-colors overflow-hidden ${
              active === i ? "border-[#FF9900]" : "border-gray-200 hover:border-gray-400"
            }`}
          >
            {validImages[i] ? (
              <img src={validImages[i]} alt={`thumb-${i}`} className="max-h-full max-w-full object-contain" />
            ) : (
              <span className="text-xl">🛍️</span>
            )}
          </button>
        ))}
      </div>

      {/* Main image */}
      <div
        className="flex-1 border border-gray-200 rounded-sm flex items-center justify-center bg-white relative overflow-hidden cursor-zoom-in"
        style={{ minHeight: 380 }}
        onClick={() => setZoomed(!zoomed)}
      >
        {validImages[active] ? (
          <img
            src={validImages[active]}
            alt={title}
            className={`max-h-[380px] max-w-full object-contain transition-transform duration-300 ${zoomed ? "scale-150" : "scale-100"}`}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <span className="text-8xl">🛍️</span>
            <span className="text-sm">Product Image</span>
          </div>
        )}

        {/* Nav arrows */}
        {count > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setActive((active - 1 + count) % count); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow border border-gray-200"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActive((active + 1) % count); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow border border-gray-200"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
        <span className="absolute bottom-2 right-2 text-[10px] text-gray-400">Click to zoom</span>
      </div>
    </div>
  );
};

// ─── Buy Box ─────────────────────────────────────────────────────────────────
const BuyBox = ({ product }) => {
  const { addToCart } = useContext(UserContext);
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart?.(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart?.(product);
    navigate("/cart");
  };

  return (
    <div className="border border-gray-200 rounded-sm p-4 bg-white sticky top-[120px]">
      {/* Price */}
      <div className="mb-3">
        {discount && (
          <span className="text-[#CC0C39] text-sm font-medium">-{discount}% </span>
        )}
        <div className="flex items-start gap-2 flex-wrap">
          <div className="flex items-start">
            <span className="text-sm mt-1">₹</span>
            <span className="text-3xl font-medium leading-none">{product.price?.toLocaleString("en-IN")}</span>
          </div>
          {product.originalPrice && (
            <div className="flex flex-col mt-1">
              <span className="text-xs text-gray-500">M.R.P.:</span>
              <span className="text-xs text-gray-500 line-through">₹{product.originalPrice?.toLocaleString("en-IN")}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">Inclusive of all taxes</p>
      </div>

      {/* Prime */}
      {product.prime && (
        <div className="flex items-center gap-1.5 mb-3 bg-[#E8F4FA] rounded px-2 py-1.5">
          <Zap size={14} className="fill-[#00A8E1] text-[#00A8E1]" />
          <span className="text-[#00A8E1] text-sm font-bold tracking-wide">prime</span>
          <span className="text-xs text-gray-700">FREE delivery <strong>Tomorrow</strong></span>
        </div>
      )}

      {/* Delivery */}
      <div className="flex items-start gap-2 text-sm mb-3">
        <Truck size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
        <div>
          <span className="text-gray-600">Deliver to </span>
          <span className="text-[#007185] font-medium cursor-pointer hover:underline">India</span>
        </div>
      </div>

      {/* Stock */}
      <p className={`text-base font-medium mb-3 ${product.inStock ? "text-[#007600]" : "text-[#CC0C39]"}`}>
        {product.inStock
          ? product.stockCount <= 5
            ? `Only ${product.stockCount} left in stock!`
            : "In stock"
          : "Currently unavailable"}
      </p>

      {/* Quantity */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-gray-600">Qty:</span>
        <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="px-4 py-1.5 text-sm font-medium border-x border-gray-300 min-w-[40px] text-center">{qty}</span>
          <button
            onClick={() => setQty(Math.min(10, qty + 1))}
            className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full py-2.5 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all ${
            added
              ? "bg-[#4CAF50] text-white"
              : "bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] border border-[#FCD200]"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {added ? <><Check size={16} /> Added to Cart</> : <><ShoppingCart size={16} /> Add to Cart</>}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!product.inStock}
          className="w-full py-2.5 rounded-full font-medium text-sm bg-[#FF9900] hover:bg-[#e88b00] text-white border border-[#e88b00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Buy Now
        </button>
      </div>

      {/* Wishlist + Share */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className="flex items-center gap-1.5 text-[#007185] hover:text-[#C7511F] text-sm"
        >
          <Heart size={15} className={wishlisted ? "fill-red-500 text-red-500" : ""} />
          {wishlisted ? "Wishlisted" : "Add to Wishlist"}
        </button>
        <button className="flex items-center gap-1.5 text-[#007185] hover:text-[#C7511F] text-sm">
          <Share2 size={15} /> Share
        </button>
      </div>

      {/* Guarantees */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Shield size={13} className="text-[#007600]" /> Secure transaction
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <RotateCcw size={13} className="text-[#007600]" /> Free returns within 30 days
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Truck size={13} className="text-[#007600]" /> Ships from MiniAmazon
        </div>
      </div>
    </div>
  );
};

// ─── Reviews Section ──────────────────────────────────────────────────────────
const ReviewsSection = ({ reviews = [], rating = 0, reviewCount = 0 }) => {
  const [helpfulMap, setHelpfulMap] = useState({});

  const dist = { 5: 68, 4: 18, 3: 8, 2: 3, 1: 3 };

  return (
    <section className="bg-white rounded-sm shadow-sm p-6 mb-4">
      <h2 className="text-xl font-bold text-[#0F1111] mb-4">Customer Reviews</h2>

      <div className="flex flex-col md:flex-row gap-8 mb-6">
        {/* Overall */}
        <div className="flex flex-col items-center md:items-start gap-1 flex-shrink-0">
          <div className="flex items-end gap-2">
            <span className="text-5xl font-medium">{rating.toFixed(1)}</span>
            <span className="text-gray-500 text-sm mb-2">out of 5</span>
          </div>
          <StarDisplay rating={rating} size={20} />
          <span className="text-sm text-gray-500">{reviewCount.toLocaleString()} global ratings</span>
        </div>

        {/* Bars */}
        <div className="flex-1 flex flex-col gap-1.5 max-w-sm">
          {[5,4,3,2,1].map((s) => (
            <RatingBar key={s} star={s} percent={dist[s]} />
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="font-bold text-base text-[#0F1111] mb-4">Top reviews</h3>
        <div className="flex flex-col gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-5 last:border-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-[#232F3E] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {review.user[0]}
                </div>
                <span className="font-medium text-sm text-[#0F1111]">{review.user}</span>
              </div>
              <StarDisplay rating={review.rating} size={14} />
              <div className="flex items-center gap-2 mt-1 mb-2 flex-wrap">
                <h4 className="font-bold text-sm text-[#0F1111]">{review.title}</h4>
                {review.verified && (
                  <span className="text-[#C7511F] text-xs">Verified Purchase</span>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xs text-gray-500">{review.date}</span>
                <span className="text-xs text-gray-400">|</span>
                <button
                  onClick={() => setHelpfulMap((p) => ({ ...p, [review.id]: !p[review.id] }))}
                  className={`flex items-center gap-1 text-xs transition-colors ${
                    helpfulMap[review.id] ? "text-[#C7511F]" : "text-[#007185] hover:text-[#C7511F]"
                  }`}
                >
                  <ThumbsUp size={12} />
                  Helpful ({review.helpful + (helpfulMap[review.id] ? 1 : 0)})
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Main ProductDetail Page ──────────────────────────────────────────────────
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setProduct(data.product || data);

        // Fetch related
        const relRes = await fetch(`${API_BASE}?category=${data.category || ""}&limit=6`);
        if (relRes.ok) {
          const relData = await relRes.json();
          setRelated((relData.products || relData || []).filter((p) => p.id !== id).slice(0, 6));
        }
      } catch {
        setProduct(makeMockProduct(id));
        setRelated(MOCK_RELATED);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EAEDED]">
        <div className="max-w-[1500px] mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr_320px] gap-4">
            <LoadingSkeleton type="card" />
            <div className="flex flex-col gap-3">
              {Array(6).fill(null).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 animate-pulse rounded" style={{ width: `${90 - i * 10}%` }} />
              ))}
            </div>
            <LoadingSkeleton type="card" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return (
    <div className="min-h-screen bg-[#EAEDED] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-[#0F1111] mb-2">Product not found</h2>
        <Link to="/products" className="text-[#007185] hover:underline">Back to Products</Link>
      </div>
    </div>
  );

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="min-h-screen bg-[#EAEDED]">
      <div className="max-w-[1500px] mx-auto px-3 sm:px-4 py-4">

        {/* Breadcrumb */}
        <nav className="text-xs text-[#007185] mb-3 flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:underline">Home</Link>
          <ChevronRight size={12} className="text-gray-400" />
          <Link to="/products" className="hover:underline">Products</Link>
          <ChevronRight size={12} className="text-gray-400" />
          {product.category && (
            <>
              <Link to={`/products?category=${product.category}`} className="hover:underline">{product.category}</Link>
              <ChevronRight size={12} className="text-gray-400" />
            </>
          )}
          <span className="text-[#0F1111] truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* ── Main 3-column layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-[420px_1fr_300px] gap-4 mb-4">

          {/* Col 1: Image Gallery */}
          <div className="bg-white rounded-sm shadow-sm p-4">
            <ImageGallery images={product.images || []} title={product.title} />
          </div>

          {/* Col 2: Product Info */}
          <div className="bg-white rounded-sm shadow-sm p-5">
            {/* Badge */}
            {product.badge && (
              <span className="inline-block bg-[#CC0C39] text-white text-xs font-bold px-2 py-0.5 rounded-sm mb-2">
                #{product.badge} in {product.category}
              </span>
            )}

            {/* Brand */}
            {product.brand && (
              <p className="text-sm text-[#007185] hover:underline cursor-pointer mb-1">
                Visit the <strong>{product.brand}</strong> Store
              </p>
            )}

            {/* Title */}
            <h1 className="text-xl font-medium text-[#0F1111] leading-snug mb-3">
              {product.title}
            </h1>

            {/* Rating row */}
            <div className="flex items-center gap-3 flex-wrap mb-3 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-1.5">
                <StarDisplay rating={product.rating} size={16} />
                <span className="text-[#007185] text-sm hover:underline cursor-pointer">
                  {product.rating?.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-[#007185] text-sm hover:underline cursor-pointer">
                {product.reviewCount?.toLocaleString()} ratings
              </span>
              {product.badge && (
                <>
                  <span className="text-gray-300">|</span>
                  <span className="text-[#CC0C39] text-sm font-medium">{product.badge}</span>
                </>
              )}
            </div>

            {/* Price block */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-baseline gap-3 flex-wrap">
                {discount && (
                  <span className="text-[#CC0C39] text-lg font-medium">-{discount}%</span>
                )}
                <div className="flex items-start">
                  <span className="text-base mt-1">₹</span>
                  <span className="text-3xl font-medium leading-none">
                    {product.price?.toLocaleString("en-IN")}
                  </span>
                </div>
                {product.originalPrice && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span>M.R.P.:</span>
                    <span className="line-through">₹{product.originalPrice?.toLocaleString("en-IN")}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
              {product.prime && (
                <div className="flex items-center gap-1.5 mt-2">
                  <Zap size={13} className="fill-[#00A8E1] text-[#00A8E1]" />
                  <span className="text-[#00A8E1] text-sm font-bold">prime</span>
                  <span className="text-sm text-gray-600">FREE Delivery by Tomorrow</span>
                </div>
              )}
            </div>

            {/* Tabs: Description / Features / Specs */}
            <div className="flex gap-0 border-b border-gray-200 mb-4">
              {["description", "features", "specs"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-[#FF9900] text-[#C7511F]"
                      : "border-transparent text-[#007185] hover:text-[#C7511F]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "description" && (
              <p className="text-sm text-[#0F1111] leading-relaxed">{product.description}</p>
            )}

            {activeTab === "features" && (
              <ul className="flex flex-col gap-2">
                {(product.features || []).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#0F1111]">
                    <Check size={15} className="text-[#007600] mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "specs" && (
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(product.specs || {}).map(([key, val]) => (
                    <tr key={key} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 pr-4 text-gray-500 font-medium w-1/3 align-top">{key}</td>
                      <td className="py-2 text-[#0F1111]">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Col 3: Buy Box */}
          <BuyBox product={product} />
        </div>

        {/* ── Reviews ── */}
        <ReviewsSection
          reviews={product.reviews || []}
          rating={product.rating}
          reviewCount={product.reviewCount}
        />

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <section className="bg-white rounded-sm shadow-sm p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#0F1111]">
                Customers who viewed this also viewed
              </h2>
              <Link to={`/products?category=${product.category}`} className="text-[#007185] text-sm hover:underline flex items-center gap-1">
                See more <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {related.map((p) => (
                <ProductCard key={p.id || p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
