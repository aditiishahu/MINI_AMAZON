import { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("amazon_mini_user");
      const savedCart = localStorage.getItem("amazon_mini_cart");
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedCart) setCartItems(JSON.parse(savedCart));
    } catch (e) {
      console.error("Context load error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Persist cart
  useEffect(() => {
    localStorage.setItem("amazon_mini_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("amazon_mini_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("amazon_mini_user");
  };

  const addToCart = (product) => {
    setCartItems((prev) => {
      const id = product.id || product._id;
      const existing = prev.find((item) => (item.id || item._id) === id);
      if (existing) {
        return prev.map((item) =>
          (item.id || item._id) === id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => (item.id || item._id) !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        (item.id || item._id) === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
