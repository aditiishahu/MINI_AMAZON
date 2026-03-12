import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  SlidersHorizontal, ChevronDown, ChevronUp, ChevronRight,
  LayoutGrid, List, X, Star, Zap
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import LoadingSkeleton from "../components/LoadingSkeleton";

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:5000/api/products";

const CATEGORIES = [
  "All",
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Books",
  "Sports",
  "Toys",
  "Beauty",
  "Grocery",
  "Automotive",
];

const SORT_OPTIONS = [
  { label: "Featured",           value: "featured" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Avg. Customer Review", value: "rating" },
  { label: "Newest Arrivals",    value: "newest" },
];

const PRICE_RANGES = [
  { label: "Under ₹500",          min: 0,    max: 500 },
  { label: "₹500 – ₹1,000",      min: 500,  max: 1000 },
  { label: "₹1,000 – ₹5,000",    min: 1000, max: 5000 },
  { label: "₹5,000 – ₹10,000",   min: 5000, max: 10000 },
  { label: "Over ₹10,000",        min: 10000, max: Infinity },
];

// ─── Mock fallback data ───────────────────────────────────────────────────────
const MOCK_PRODUCTS = Array.from({ length: 24 }, (_, i) => ({
  id: `mock-${i}`,
  title: [
    "Wireless Bluetooth Earbuds Pro Max 5.0 with Noise Cancellation",
    "Premium Cotton Kurta Set for Men – Festive Collection",
    "Stainless Steel Insulated Water Bottle 1L",
    "React & Node.js Full Stack Development Book",
    "Non-Stick Cookware Set 5 Piece – Granite Finish",
    "Running Shoes Lightweight Mesh – Breathable",
    "Moisturizing Vitamin C Face Serum 30ml",
    "LEGO Classic Creative Brick Box 484 Pieces",
    "Mechanical Keyboard RGB Backlit – TKL Layout",
    "Yoga Mat Anti-Slip 6mm Thick with Carry Strap",
    "Smart LED Desk Lamp with USB Charging Port",
    "Leather Wallet RFID Blocking – Slim Design",
  ][i % 12],
  price: [1299, 799, 499, 399, 2499, 1999, 699, 3499, 2999, 899, 1499, 599][i % 12],
  originalPrice: [2499, 1299, 799, 699, 3999, 2999, 1099, 4999, 4499, 1499, 2499, 999][i % 12],
  rating: 3.5 + (i % 10) * 0.15,
  reviewCount: 120 + i * 53,
  prime: i % 3 === 0,
  category: CATEGORIES.slice(1)[i % (CATEGORIES.length - 1)],
  badge: i % 5 === 0 ? "Best Seller" : i % 7 === 0 ? "New" : null,
  image: null,
  sponsored: i % 8 === 0,
}));

// ─── Star Rating display ──────────────────────────────────────────────────────
const StarRow = ({ value, onChange, active }) => (
  <button
    onClick={() => onChange(value)}
    className={`flex items-center gap-1.5 w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 transition-colors ${active ? "bg-orange-50" : ""}`}
  >
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= value ? "fill-[#FF9900] text-[#FF9900]" : "text-gray-300"}
        />
      ))}
    </div>
    <span className="text-sm text-[#007185]">{value === 4 ? "& Up" : value === 3 ? "& Up" : value === 2 ? "& Up" : value === 1 ? "& Up" : ""}</span>
  </button>
);

// ─── Sidebar Filter Panel ─────────────────────────────────────────────────────
const FilterSidebar = ({ filters, onChange, onClear, totalResults }) => {
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    rating: true,
    prime: true,
  });

  const toggle = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const Section = ({ id, title, children }) => (
    <div className="border-b border-gray-200 py-3">
      <button
        onClick={() => toggle(id)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-bold text-sm text-[#0F1111]">{title}</span>
        {openSections[id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {openSections[id] && <div className="mt-2">{children}</div>}
    </div>
  );

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold text-[#0F1111] text-base">Filters</h2>
        {(filters.category !== "All" || filters.priceRange || filters.rating || filters.prime) && (
          <button
            onClick={onClear}
            className="text-[#007185] text-xs hover:underline hover:text-[#C7511F]"
          >
            Clear all
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-3">{totalResults.toLocaleString()} results</p>

      {/* Category */}
      <Section id="category" title="Category">
        <ul className="flex flex-col gap-0.5">
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => onChange("category", cat)}
                className={`w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-100 transition-colors flex items-center gap-1 ${
                  filters.category === cat
                    ? "text-[#C7511F] font-semibold"
                    : "text-[#007185] hover:text-[#C7511F]"
                }`}
              >
                {filters.category === cat && <ChevronRight size={12} />}
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </Section>

      {/* Price */}
      <Section id="price" title="Price">
        <ul className="flex flex-col gap-0.5">
          {PRICE_RANGES.map((range) => (
            <li key={range.label}>
              <button
                onClick={() => onChange("priceRange", filters.priceRange?.label === range.label ? null : range)}
                className={`w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-100 transition-colors ${
                  filters.priceRange?.label === range.label
                    ? "text-[#C7511F] font-semibold"
                    : "text-[#007185] hover:text-[#C7511F]"
                }`}
              >
                {range.label}
              </button>
            </li>
          ))}
        </ul>
      </Section>

      {/* Rating */}
      <Section id="rating" title="Avg. Customer Review">
        <div className="flex flex-col gap-0.5">
          {[4, 3, 2, 1].map((val) => (
            <StarRow
              key={val}
              value={val}
              onChange={(v) => onChange("rating", filters.rating === v ? null : v)}
              active={filters.rating === val}
            />
          ))}
        </div>
      </Section>

      {/* Prime */}
      <Section id="prime" title="Prime">
        <label className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100 rounded">
          <input
            type="checkbox"
            checked={filters.prime}
            onChange={(e) => onChange("prime", e.target.checked)}
            className="accent-[#FF9900] w-4 h-4"
          />
          <div className="flex items-center gap-1">
            <Zap size={13} className="fill-[#00A8E1] text-[#00A8E1]" />
            <span className="text-sm text-[#007185] font-bold">prime</span>
          </div>
        </label>
      </Section>
    </aside>
  );
};

// ─── Active Filter Chips ──────────────────────────────────────────────────────
const ActiveFilters = ({ filters, onChange }) => {
  const chips = [];
  if (filters.category !== "All") chips.push({ label: filters.category, key: "category", reset: "All" });
  if (filters.priceRange) chips.push({ label: filters.priceRange.label, key: "priceRange", reset: null });
  if (filters.rating) chips.push({ label: `${filters.rating}★ & up`, key: "rating", reset: null });
  if (filters.prime) chips.push({ label: "Prime", key: "prime", reset: false });

  if (!chips.length) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap mb-3">
      <span className="text-xs text-gray-500 font-medium">Active:</span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={() => onChange(chip.key, chip.reset)}
          className="flex items-center gap-1 bg-[#E8F4F8] text-[#007185] text-xs px-2.5 py-1 rounded-full border border-[#007185]/30 hover:bg-red-50 hover:text-red-500 hover:border-red-300 transition-colors"
        >
          {chip.label}
          <X size={11} />
        </button>
      ))}
    </div>
  );
};

// ─── Main Products Page ───────────────────────────────────────────────────────
const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [sortBy, setSortBy] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "All",
    priceRange: null,
    rating: null,
    prime: false,
  });

  // ── Fetch products from API ──
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== "All") {
        params.set("category", filters.category);
      }
      if (searchParams.get("search")) {
        params.set("search", searchParams.get("search"));
      }

      const url = `${API_BASE}?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setProducts(data.products || data || []);
    } catch (err) {
      console.warn("API unavailable, using mock data:", err.message);
      setError(null); // Don't show error — just use mock
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, [filters.category, searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── Sync category from URL param ──
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setFilters((prev) => ({ ...prev, category: cat }));
  }, []);

  // ── Client-side filter + sort ──
  const processedProducts = (() => {
    let result = [...products];

    // Price filter
    if (filters.priceRange) {
      result = result.filter(
        (p) => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
      );
    }

    // Rating filter
    if (filters.rating) {
      result = result.filter((p) => (p.rating || 0) >= filters.rating);
    }

    // Prime filter
    if (filters.prime) {
      result = result.filter((p) => p.prime);
    }

    // Sort
    switch (sortBy) {
      case "price_asc":  result.sort((a, b) => a.price - b.price); break;
      case "price_desc": result.sort((a, b) => b.price - a.price); break;
      case "rating":     result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case "newest":     result.sort((a, b) => (b.id > a.id ? 1 : -1)); break;
      default: break;
    }

    return result;
  })();

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === "category") {
      setSearchParams(value !== "All" ? { category: value } : {});
    }
  };

  const clearAllFilters = () => {
    setFilters({ category: "All", priceRange: null, rating: null, prime: false });
    setSearchParams({});
  };

  const searchQuery = searchParams.get("search");

  return (
    <div className="min-h-screen bg-[#EAEDED]">
      <div className="max-w-[1500px] mx-auto px-3 sm:px-4 py-4">

        {/* ── Breadcrumb ── */}
        <nav className="text-xs text-[#007185] mb-3 flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:underline">Home</Link>
          <ChevronRight size={12} className="text-gray-400" />
          {filters.category !== "All" ? (
            <>
              <Link to="/products" className="hover:underline">Products</Link>
              <ChevronRight size={12} className="text-gray-400" />
              <span className="text-[#0F1111]">{filters.category}</span>
            </>
          ) : (
            <span className="text-[#0F1111]">{searchQuery ? `Search: "${searchQuery}"` : "All Products"}</span>
          )}
        </nav>

        <div className="flex gap-4">
          {/* ── Desktop Sidebar ── */}
          <div className="hidden md:block w-56 flex-shrink-0">
            <div className="bg-white rounded-sm shadow-sm p-4 sticky top-[120px]">
              <FilterSidebar
                filters={filters}
                onChange={handleFilterChange}
                onClear={clearAllFilters}
                totalResults={processedProducts.length}
              />
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">

            {/* Top bar */}
            <div className="bg-white rounded-sm shadow-sm px-4 py-3 mb-3 flex items-center gap-3 flex-wrap">
              {/* Mobile filter button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                <SlidersHorizontal size={15} /> Filters
              </button>

              {/* Results count */}
              <p className="text-sm text-[#0F1111] flex-1">
                {loading ? (
                  <span className="text-gray-400">Loading…</span>
                ) : (
                  <>
                    {searchQuery && (
                      <span>Results for <strong>"{searchQuery}"</strong>: </span>
                    )}
                    <span className="font-medium">{processedProducts.length.toLocaleString()}</span>
                    <span className="text-gray-500"> results</span>
                    {filters.category !== "All" && (
                      <span className="text-gray-500"> in <strong>{filters.category}</strong></span>
                    )}
                  </>
                )}
              </p>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 whitespace-nowrap hidden sm:block">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-[#FF9900] cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* View toggle */}
              <div className="flex border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-[#FF9900] text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-[#FF9900] text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {/* Active filter chips */}
            <ActiveFilters filters={filters} onChange={handleFilterChange} />

            {/* ── Product Grid ── */}
            {loading ? (
              <div className={`grid gap-3 ${viewMode === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
                {Array(12).fill(null).map((_, i) => <LoadingSkeleton key={i} />)}
              </div>
            ) : processedProducts.length === 0 ? (
              <div className="bg-white rounded-sm shadow-sm p-12 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-bold text-[#0F1111] mb-2">No results found</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Try adjusting your filters or search for something else.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-medium px-6 py-2 rounded-full text-sm"
                >
                  Clear all filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {processedProducts.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            ) : (
              // List view
              <div className="flex flex-col gap-3">
                {processedProducts.map((product) => (
                  <Link
                    key={product.id || product._id}
                    to={`/product/${product.id || product._id}`}
                    className="bg-white rounded-sm shadow-sm p-4 flex gap-4 hover:shadow-md transition-shadow group"
                  >
                    <div className="w-36 h-36 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="text-4xl">🛍️</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#0F1111] font-medium text-base group-hover:text-[#C7511F] line-clamp-2">{product.title}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={13} className={s <= Math.round(product.rating || 0) ? "fill-[#FF9900] text-[#FF9900]" : "text-gray-300"} />
                        ))}
                        <span className="text-[#007185] text-xs ml-1">{product.reviewCount?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-baseline gap-2 mt-2 flex-wrap">
                        <span className="text-xl font-medium text-[#0F1111]">₹{product.price?.toLocaleString("en-IN")}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice?.toLocaleString("en-IN")}</span>
                        )}
                        {product.originalPrice && (
                          <span className="text-sm text-[#CC0C39] font-medium">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                          </span>
                        )}
                      </div>
                      {product.prime && (
                        <div className="flex items-center gap-1 mt-1">
                          <Zap size={12} className="fill-[#00A8E1] text-[#00A8E1]" />
                          <span className="text-[#00A8E1] text-xs font-bold">prime</span>
                          <span className="text-xs text-gray-600">FREE Delivery</span>
                        </div>
                      )}
                      <p className="text-xs text-[#007600] mt-1">In stock</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="relative bg-white w-72 max-w-[85vw] h-full overflow-y-auto p-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-[#0F1111]">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onChange={(key, val) => { handleFilterChange(key, val); }}
              onClear={() => { clearAllFilters(); setShowMobileFilters(false); }}
              totalResults={processedProducts.length}
            />
            <button
              onClick={() => setShowMobileFilters(false)}
              className="mt-4 w-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-bold py-2.5 rounded-full"
            >
              See {processedProducts.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
