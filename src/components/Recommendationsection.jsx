import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import LoadingSkeleton from "./LoadingSkeleton";

const RecommendationSection = ({ title, products = [], loading = false, viewAllLink = "/products", icon }) => {
  return (
    <section className="bg-white rounded-sm shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#0F1111] text-xl font-bold flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title}
        </h2>
        <Link to={viewAllLink} className="text-[#007185] text-sm hover:text-[#C7511F] hover:underline flex items-center gap-1">
          See all <ChevronRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array(5).fill(null).map((_, i) => <LoadingSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.slice(0, 10).map((product, i) => (
            <ProductCard key={product.id || product._id} product={product} index={i} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecommendationSection;
