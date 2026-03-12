import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, MapPin, Search, Menu, X, ChevronDown } from "lucide-react";
import { UserContext } from "../context/UserContext";

// Nav strip items with correct links
const NAV_ITEMS = [
  { label: "Today's Deals",    to: "/products?sort=deals" },
  { label: "Customer Service", to: "/" },
  { label: "Registry",         to: "/" },
  { label: "Gift Cards",       to: "/" },
  { label: "Sell",             to: "/" },
  { label: "Electronics",      to: "/products?category=Electronics" },
  { label: "Fashion",          to: "/products?category=Fashion" },
  { label: "Home & Kitchen",   to: "/products?category=Home%20%26%20Kitchen" },
  { label: "Books",            to: "/products?category=Books" },
  { label: "Sports",           to: "/products?category=Sports" },
  { label: "Beauty",           to: "/products?category=Beauty" },
  { label: "Toys",             to: "/products?category=Toys" },
  { label: "Grocery",          to: "/products?category=Grocery" },
];

const CATEGORIES = [
  "All", "Electronics", "Fashion", "Home & Kitchen", "Books",
  "Sports", "Toys", "Beauty", "Grocery", "Automotive",
];

const Navbar = () => {
  const [searchQuery, setSearchQuery]     = useState("");
  const [category, setCategory]           = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, cartItems } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}&category=${category}`);
    }
  };

  const cartCount = cartItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

  return (
    <header className="w-full sticky top-0 z-50">

      {/* ── Top Bar ── */}
      <div className="bg-[#131921] text-white">
        <div className="max-w-[1500px] mx-auto flex items-center gap-2 px-3 py-2">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 border-2 border-transparent hover:border-white rounded px-1 py-1 mr-1">
            <div className="flex flex-col items-center leading-none">
              <span className="text-white font-extrabold text-xl tracking-tight">amazon</span>
              <span className="text-[#FF9900] text-[10px] font-bold tracking-widest">.mini</span>
            </div>
          </Link>

          {/* Deliver To */}
          <Link to="/profile" className="hidden lg:flex flex-col border-2 border-transparent hover:border-white rounded px-2 py-1 flex-shrink-0">
            <span className="text-[#ccc] text-[11px]">Deliver to</span>
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-white" />
              <span className="text-white text-[13px] font-bold">{user?.location || "India"}</span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-1 h-10 rounded-md overflow-hidden min-w-0">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[#f3f3f3] text-[#131921] text-[12px] px-2 border-r border-gray-300 cursor-pointer outline-none hidden sm:block flex-shrink-0 max-w-[110px]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands and more…"
              className="flex-1 px-3 text-[#131921] text-sm outline-none min-w-0"
            />
            <button type="submit" className="bg-[#FF9900] hover:bg-[#e88b00] px-4 flex items-center justify-center flex-shrink-0 transition-colors">
              <Search size={20} className="text-[#131921]" />
            </button>
          </form>

          {/* Language */}
          <div className="hidden xl:flex items-center gap-1 border-2 border-transparent hover:border-white rounded px-2 py-1 cursor-pointer flex-shrink-0">
            <span className="text-white text-[13px] font-bold">EN</span>
            <ChevronDown size={12} className="text-white" />
          </div>

          {/* Account */}
          <Link to={user ? "/profile" : "/login"} className="hidden sm:flex flex-col border-2 border-transparent hover:border-white rounded px-2 py-1 flex-shrink-0">
            <span className="text-[#ccc] text-[11px]">Hello, {user?.name?.split(" ")[0] || "Sign in"}</span>
            <div className="flex items-center gap-1">
              <span className="text-white text-[13px] font-bold">Account & Lists</span>
              <ChevronDown size={12} className="text-white" />
            </div>
          </Link>

          {/* Returns */}
          <Link to="/profile" className="hidden lg:flex flex-col border-2 border-transparent hover:border-white rounded px-2 py-1 flex-shrink-0">
            <span className="text-[#ccc] text-[11px]">Returns</span>
            <span className="text-white text-[13px] font-bold">& Orders</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="flex items-end gap-1 border-2 border-transparent hover:border-white rounded px-2 py-1 relative flex-shrink-0">
            <div className="relative">
              <ShoppingCart size={34} className="text-white" />
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 bg-[#FF9900] text-[#131921] text-xs font-extrabold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {cartCount}
              </span>
            </div>
            <span className="text-white text-[13px] font-bold hidden sm:block">Cart</span>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="sm:hidden border-2 border-transparent hover:border-white rounded p-1 ml-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} className="text-white" /> : <Menu size={22} className="text-white" />}
          </button>
        </div>
      </div>

      {/* ── Nav Strip ── */}
      <div className="bg-[#232F3E] text-white text-[13px]">
        <div className="max-w-[1500px] mx-auto flex items-center gap-1 px-3 py-1 overflow-x-auto scrollbar-hide">

          {/* All button */}
          <Link
            to="/products"
            className="flex items-center gap-1 px-3 py-1.5 hover:bg-white/10 rounded whitespace-nowrap border-2 border-transparent hover:border-white font-bold flex-shrink-0"
          >
            <Menu size={16} /> All
          </Link>

          {/* Category / page links */}
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="px-3 py-1.5 hover:bg-white/10 rounded whitespace-nowrap border-2 border-transparent hover:border-white flex-shrink-0 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div className="bg-[#131921] text-white px-4 py-3 flex flex-col gap-2 sm:hidden border-t border-[#3a4553]">
          <form onSubmit={handleSearch} className="flex h-10 rounded overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search…"
              className="flex-1 px-3 text-[#131921] text-sm outline-none"
            />
            <button type="submit" className="bg-[#FF9900] px-4">
              <Search size={18} className="text-[#131921]" />
            </button>
          </form>
          <Link to={user ? "/profile" : "/login"} className="py-2 border-b border-[#3a4553]">
            👤 Hello, {user?.name?.split(" ")[0] || "Sign in"}
          </Link>
          {/* Mobile category links */}
          {NAV_ITEMS.filter(i => ["Electronics","Fashion","Home & Kitchen","Books","Sports"].includes(i.label)).map((item) => (
            <Link key={item.label} to={item.to} onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-[#3a4553] text-sm">
              {item.label}
            </Link>
          ))}
          <Link to="/cart" className="py-2">🛒 Cart ({cartCount})</Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
