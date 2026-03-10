const LoadingSkeleton = ({ type = "card" }) => {
  if (type === "banner") {
    return (
      <div className="w-full h-[300px] sm:h-[400px] bg-gray-200 animate-pulse rounded-sm" />
    );
  }

  if (type === "category") {
    return (
      <div className="flex flex-col items-center gap-2 animate-pulse">
        <div className="w-24 h-24 bg-gray-200 rounded-full" />
        <div className="w-16 h-3 bg-gray-200 rounded" />
      </div>
    );
  }

  // Default: product card skeleton
  return (
    <div className="bg-white border border-gray-200 rounded p-3 flex flex-col gap-2 animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-44 bg-gray-200 rounded" />
      {/* Title lines */}
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-4/5" />
      {/* Stars */}
      <div className="h-3 bg-gray-200 rounded w-2/5" />
      {/* Price */}
      <div className="h-5 bg-gray-200 rounded w-1/3 mt-1" />
      {/* Button */}
      <div className="h-8 bg-gray-200 rounded-full w-full mt-2" />
    </div>
  );
};

export default LoadingSkeleton;
