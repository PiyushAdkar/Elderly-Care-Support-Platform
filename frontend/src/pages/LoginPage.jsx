import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const response = await client.post('/auth/login', formData);
      const { token, user } = response.data.data;
      
      // Save token (also handled by AuthContext but safely duped here just in case)
      localStorage.setItem('token', token);
      
      // Update app context globally
      login(user);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Invalid email or password. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-slate-500 text-center mb-8">
          Sign in to your Elderly Care Support account
        </p>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-sm font-medium text-red-600 text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="email">
              Email Address
            </label>
            <input 
              id="email"
              name="email"
              type="email" 
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="password">
              Password
            </label>
            <input 
              id="password"
              name="password"
              type="password" 
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors mt-4"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-slate-600">Don't have an account? </span>
          <Link to="/signup" className="text-blue-700 hover:text-blue-800 hover:underline font-semibold">
            Create one here
          </Link>
        </div>
      </div>
    </div>
  );
}
