// Real product images from Unsplash (free, no API key needed)
// These are used as fallbacks when backend doesn't supply images.
// Once your backend sends real product images, they auto-replace these.

export const CATEGORY_IMAGES = {
  Electronics: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", // headphones
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80", // sunglasses
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", // watch
    "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80", // perfume
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80", // shoes
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80", // camera
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", // shoes red
    "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80", // bottle
  ],
  Fashion: [
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80", // clothing
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", // shoes
    "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80", // hoodie
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80", // jacket
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80", // bag
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80", // tshirt
  ],
  Home: [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", // sofa
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", // kitchen
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80", // mug
    "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80", // lamp
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80", // bottle
  ],
  "Home & Kitchen": [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80",
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80",
  ],
  Books: [
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80", // book
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80", // books
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80", // library
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80", // books shelf
  ],
  Sports: [
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80", // running shoes
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80", // yoga mat
    "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80", // workout
    "https://images.unsplash.com/photo-1547919307-1ecb10702e6f?w=400&q=80", // weights
  ],
  Beauty: [
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80", // makeup
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80", // skincare
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80", // lipstick
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80", // beauty
  ],
  Toys: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", // lego
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&q=80", // toys
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80", // toys
  ],
  Grocery: [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80", // grocery
    "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&q=80", // fruits
    "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=400&q=80", // vegetables
  ],
  Automotive: [
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80", // car
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=80", // car parts
  ],
  default: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80",
  ],
};

// Returns a consistent image for a product based on its category + index
export const getProductImage = (product, index = 0) => {
  if (product?.image) return product.image; // use real image if available
  const category = product?.category || "default";
  const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.default;
  return images[index % images.length];
};
