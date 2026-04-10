import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', age: '', phone: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      // Use /auth/signup based on backend routes
      await client.post('/auth/signup', formData);
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred during signup.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
          Create Account
        </h1>
        <p className="text-slate-500 text-center mb-8">
          Join Elderly Care Support today
        </p>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-sm font-medium text-red-600 text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="name">
              Full Name
            </label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              placeholder="Enter your full name" 
              required 
              value={formData.name} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all" 
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/3">
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="age">
                Age
              </label>
              <input 
                id="age" 
                name="age" 
                type="number" 
                placeholder="Age" 
                required 
                value={formData.age} 
                onChange={handleChange} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all" 
              />
            </div>
            <div className="w-2/3">
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="phone">
                Phone
              </label>
              <input 
                id="phone" 
                name="phone" 
                type="tel" 
                placeholder="Phone Number" 
                required 
                value={formData.phone} 
                onChange={handleChange} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="email">
              Email Address
            </label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="Enter your email" 
              required 
              value={formData.email} 
              onChange={handleChange} 
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
              placeholder="Enter your password" 
              required 
              minLength="8" 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors mt-4"
          >
            Create Account
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-slate-600">Already have an account? </span>
          <Link to="/login" className="text-blue-700 hover:text-blue-800 hover:underline font-semibold">
            Log In here
          </Link>
        </div>
      </div>
    </div>
  );
}
