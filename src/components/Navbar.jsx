import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <nav className="bg-[#0369a1] text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Photo Gallery</Link>
        
        <div className="space-x-4">
          <Link to="/" className="hover:text-[#bae6fd]">Home</Link>
          {isAdmin() && (
            <Link to="/admin" className="hover:text-[#bae6fd]">Admin Panel</Link>
          )}
          
          {currentUser ? (
            <div className="inline-block">
              <span className="mr-2">Hello, {currentUser.username}</span>
              <button 
                onClick={handleLogout}
                className="bg-[#075985] px-3 py-1 rounded hover:bg-[#075985]"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-[#075985] px-3 py-1 rounded hover:bg-[#075985]"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;