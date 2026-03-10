import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";

const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with your actual API endpoint
        const endpoint = user
          ? `/api/recommendations?userId=${user.id}`
          : `/api/recommendations/popular`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to fetch recommendations");
        const data = await res.json();
        setRecommendations(data.products || data || []);
      } catch (err) {
        // Silently fail — Home.jsx will use mock data as fallback
        setError(err.message);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  return { recommendations, loading, error };
};

export default useRecommendations;
