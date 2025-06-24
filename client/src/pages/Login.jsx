import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState(''); // Changed from username to email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        email, // Send email instead of username
        password,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  // Handler for signup link
  const handleSignupRedirect = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400">
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl px-10 py-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6 tracking-wide">Welcome Back 👋</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-100 text-red-700 rounded px-3 py-2 text-sm text-center">
              {error}
            </div>
          )}
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              placeholder="Enter your email"
              value={email}
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg shadow-md hover:from-purple-500 hover:to-blue-500 transition"
            type="submit"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>
        <div className="mt-4 text-center text-gray-600 text-sm">
          Don&apos;t have an account?{' '}
          <button
            onClick={handleSignupRedirect}
            className="text-purple-600 font-semibold hover:underline focus:outline-none bg-transparent"
            type="button"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
