import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const handleLogout = () => {
    if (logout) logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-8 md:px-16 lg:px-24 py-2 flex justify-between items-center w-full">
      {/* Brand/Logo */}
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold text-blue-800">
          Elderly Care
        </Link>
      </div>

      {/* Center Links */}
      <div className="flex-1 flex justify-center gap-8 hidden md:flex">
        <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">
          Home
        </Link>
        {!isAuthenticated ? (
          <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">
            About
          </Link>
        ) : (
          <>
            <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">
              Dashboard
            </Link>
            <Link to="/contacts" className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">
              Contacts
            </Link>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {!isAuthenticated ? (
          <>
            <button 
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-blue-800 bg-white border border-gray-300 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors hidden sm:block"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="text-sm font-medium text-white bg-blue-800 px-4 py-2 rounded-md hover:bg-blue-900 transition-colors hidden sm:block"
            >
              Create Account
            </button>
          </>
        ) : (
          <button 
            onClick={handleLogout}
            className="text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-md transition-colors hidden sm:block"
          >
            Logout
          </button>
        )}
      </div>
      </div>
    </nav>
  );
}
