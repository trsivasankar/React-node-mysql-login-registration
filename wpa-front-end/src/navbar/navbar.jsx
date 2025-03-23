import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../global_context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center fixed top-0 w-full shadow-md z-10">
      {/* Logo or App Name */}
      <h1 className="text-sm font-bold text-green-400">All Religions Media</h1>
      
      {/* Navigation Links */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="hover:text-green-300 transition">Home</Link>
        <Link to="/intro" className="hover:text-green-300 transition">About</Link>

        {/* Show Username if logged in */}
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-yellow-300 font-semibold">{user.username}</span>
            <button 
              onClick={logout} 
              className="bg-gray-800 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-700 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link 
            to="/login" 
            className="bg-gray-800 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-700 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
