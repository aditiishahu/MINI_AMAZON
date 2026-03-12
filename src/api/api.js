// MOCK DATA (No backend required)

export const getProducts = () => {
  return Promise.resolve({
    data: [
      { id: 1, name: "Laptop", category: "Electronics", price: 1299, rating: 4.8, reviews: 324, image: "https://images.unsplash.com/photo-1517336714202-798f3f3d7f30?w=400&h=300&fit=crop" },
      { id: 2, name: "Headphones", category: "Audio", price: 199, rating: 4.6, reviews: 156, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop" },
      { id: 3, name: "Smartphone", category: "Mobile", price: 899, rating: 4.9, reviews: 512, image: "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=300&fit=crop" },
      { id: 4, name: "Camera", category: "Photography", price: 599, rating: 4.7, reviews: 243, image: "https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=400&h=300&fit=crop" },
      { id: 5, name: "Smartwatch", category: "Wearables", price: 349, rating: 4.5, reviews: 178, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop" },
      { id: 6, name: "VR Headset", category: "Gaming", price: 449, rating: 4.4, reviews: 98, image: "https://images.unsplash.com/photo-1617638924702-92f37c418019?w=400&h=300&fit=crop" },
      { id: 7, name: "Bluetooth Speaker", category: "Audio", price: 129, rating: 4.3, reviews: 287, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop" },
      { id: 8, name: "Gaming Laptop", category: "Electronics", price: 1999, rating: 4.9, reviews: 456, image: "https://images.unsplash.com/photo-1588872657378-6e3d0fcdc737?w=400&h=300&fit=crop" },
      { id: 9, name: "Drone", category: "Gadgets", price: 499, rating: 4.6, reviews: 134, image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop" },
      { id: 10, name: "Action Camera", category: "Photography", price: 349, rating: 4.5, reviews: 189, image: "https://images.unsplash.com/photo-1597618212624-969e0b69b58f?w=400&h=300&fit=crop" },
      // fashion subcategories
      { id: 11, name: "Men's Jacket", category: "Fashion/Men", price: 129, rating: 4.2, reviews: 58, image: "https://images.unsplash.com/photo-1585386959984-a415522d6b40?w=400&h=300&fit=crop" },
      { id: 12, name: "Men's Sneakers", category: "Fashion/Men", price: 89, rating: 4.5, reviews: 112, image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop" },
      { id: 13, name: "Women's Dress", category: "Fashion/Women", price: 79, rating: 4.6, reviews: 95, image: "https://images.unsplash.com/photo-1520975911494-798dc45626f7?w=400&h=300&fit=crop" },
      { id: 14, name: "Women's Handbag", category: "Fashion/Women", price: 149, rating: 4.7, reviews: 123, image: "https://images.unsplash.com/photo-1562158070-39b1a5c3c96d?w=400&h=300&fit=crop" },
      { id: 15, name: "Kid's T-shirt", category: "Fashion/Kids", price: 19, rating: 4.3, reviews: 67, image: "https://images.unsplash.com/photo-1577398163574-f6e3b66d6b87?w=400&h=300&fit=crop" },
      { id: 16, name: "Kid's Sneakers", category: "Fashion/Kids", price: 39, rating: 4.4, reviews: 81, image: "https://images.unsplash.com/photo-1541807084-5c52b6b777a5?w=400&h=300&fit=crop" },
    ],
  });
};

export const getRecommendations = (userId, model) => {
  const common = model === "A"
    ? [
        { id: 101, name: "Gaming Laptop", category: "Electronics", price: 1999, rating: 4.9, reviews: 456, image: "https://images.unsplash.com/photo-1588872657378-6e3d0fcdc737?w=400&h=300&fit=crop" },
        { id: 102, name: "Wireless Earbuds", category: "Audio", price: 249, rating: 4.7, reviews: 321, image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop" },
        { id: 103, name: "Smartphone Pro", category: "Mobile", price: 1099, rating: 4.8, reviews: 678, image: "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=300&fit=crop" },
      ]
    : [
        { id: 201, name: "Action Camera", category: "Photography", price: 349, rating: 4.5, reviews: 189, image: "https://images.unsplash.com/photo-1597618212624-969e0b69b58f?w=400&h=300&fit=crop" },
        { id: 202, name: "VR Headset", category: "Gaming", price: 449, rating: 4.4, reviews: 98, image: "https://images.unsplash.com/photo-1617638924702-92f37c418019?w=400&h=300&fit=crop" },
        { id: 203, name: "Smartwatch", category: "Wearables", price: 349, rating: 4.5, reviews: 178, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop" },
      ];
  return Promise.resolve({ data: common });
};

export const trackEvent = (data) => {
  console.log("Tracking:", data);
  return Promise.resolve();
};