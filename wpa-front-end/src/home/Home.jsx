import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../global_context/AuthContext"; // Ensure correct path

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      console.log("🚫 No user found, redirecting to login...");
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-16"> {/* Prevent navbar overlap */}
      <h2 className="text-center text-2xl">Welcome to Home Page</h2>
      {user && <p className="text-center mt-4">Hello, {user.username}!</p>}
    </div>
  );
};

export default Home;
