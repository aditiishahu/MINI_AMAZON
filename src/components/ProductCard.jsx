import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Star, StarHalf, ShoppingCart, Heart, Zap } from "lucide-react";
import { UserContext } from "../context/UserContext";
import { getProductImage } from "../utils/productImages";

const StarRating = ({ rating = 0, count = 0 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Star key={i} size={13} className="fill-[#FF9900] text-[#FF9900]" />);
    } else if (i === fullStars && hasHalf) {
      stars.push(<StarHalf key={i} size={13} className="fill-[#FF9900] text-[#FF9900]" />);
    } else {
      stars.push(<Star key={i} size={13} className="text-[#FF9900]" />);
    }
  }

  return (
    <div className="flex items-center gap-1 mt-1">
      <div className="flex items-center">{stars}</div>
      <span className="text-[#007185] text-xs hover:text-[#C7511F] cursor-pointer">
        {count.toLocaleString()}
      </span>
    </div>
  );
};

const ProductCard = ({ product, index = 0 }) => {
  const [wishListed, setWishListed]   = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imgError, setImgError]       = useState(false);
  const { addToCart } = useContext(UserContext);

  if (!product) return null;

  const {
    id,
    title        = "Product Title",
    price        = 0,
    originalPrice,
    rating       = 4,
    reviewCount  = 0,
    badge,
    prime        = false,
    sponsored    = false,
    category,
  } = product;

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  // Get image — real one from backend, or category-based placeholder
  const imageUrl = imgError ? null : getProductImage(product, index);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart?.(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishListed(!wishListed);
  };

  return (
    <div className="bg-white rounded border border-gray-200 hover:shadow-xl transition-all duration-200 group relative flex flex-col h-full overflow-hidden">

      {/* Wishlist */}
      <button
        onClick={handleWishlist}
        className="absolute top-2 right-2 z-10 bg-white rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Heart size={16} className={wishListed ? "fill-red-500 text-red-500" : "text-gray-400"} />
      </button>

      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {badge && <span className="bg-[#CC0C39] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">{badge}</span>}
        {discount && <span className="bg-[#CC0C39] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">-{discount}%</span>}
        {sponsored && <span className="bg-gray-100 text-gray-500 text-[9px] px-1.5 py-0.5 rounded-sm border border-gray-300">Sponsored</span>}
      </div>

      {/* Image */}
      <Link to={`/product/${id}`} className="block">
        <div className="flex items-center justify-center p-3 h-48 bg-white overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              onError={() => setImgError(true)}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            // Emoji fallback if image fails to load
            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded text-5xl">
              {{ Electronics:"📱", Fashion:"👗", Home:"🏠", "Home & Kitchen":"🍳", Books:"📚", Sports:"⚽", Beauty:"💄", Toys:"🧸", Grocery:"🛒", Automotive:"🚗" }[category] || "🛍️"}
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 px-3 pb-3 pt-1 justify-between">

        {/* Top content */}
        <div className="flex flex-col gap-1">
          {category && <span className="text-[10px] text-gray-500 uppercase tracking-wide">{category}</span>}

          <Link to={`/product/${id}`}>
            <h3 className="text-sm text-[#0F1111] leading-snug line-clamp-2 hover:text-[#C7511F] cursor-pointer">
              {title}
            </h3>
          </Link>

          <StarRating rating={rating} count={reviewCount} />

          <div className="mt-1 flex items-baseline gap-2 flex-wrap">
            <div className="flex items-start">
              <span className="text-xs text-[#0F1111] mt-0.5">₹</span>
              <span className="text-xl font-medium text-[#0F1111] leading-none">
                {price.toLocaleString("en-IN")}
              </span>
            </div>
            {originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {discount && (
            <span className="text-xs text-[#CC0C39] font-medium">
              Save ₹{(originalPrice - price).toLocaleString("en-IN")} ({discount}%)
            </span>
          )}

          {prime && (
            <div className="flex items-center gap-1 mt-0.5">
              <Zap size={12} className="fill-[#00A8E1] text-[#00A8E1]" />
              <span className="text-[#00A8E1] text-xs font-bold">prime</span>
              <span className="text-xs text-gray-600">FREE Delivery</span>
            </div>
          )}

          <span className="text-xs text-[#007600] mt-0.5">In stock</span>
        </div>

        {/* Add to Cart — always pinned to bottom */}
        <button
          onClick={handleAddToCart}
          className={`mt-3 w-full py-1.5 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-all border ${
            addedToCart
              ? "bg-[#4CAF50] border-[#4CAF50] text-white"
              : "bg-[#FFD814] border-[#FCD200] text-[#0F1111] hover:bg-[#F7CA00]"
          }`}
        >
          {addedToCart ? "✓ Added!" : <><ShoppingCart size={14} /> Add to Cart</>}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
