import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // New email state
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
        username,
        email, // send email
        password,
      });
      alert('Signup successful!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  // Handler for login link
  const handleLoginRedirect = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400">
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl px-10 py-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6 tracking-wide">Create Account 🚀</h2>
        <form onSubmit={handleSignup} className="space-y-5">
          {error && (
            <div className="bg-red-100 text-red-700 rounded px-3 py-2 text-sm text-center">
              {error}
            </div>
          )}
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
              placeholder="Choose a username"
              value={username}
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
              placeholder="Enter your email"
              value={email}
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
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-md hover:from-pink-500 hover:to-purple-500 transition"
            type="submit"
          >
            Sign up
          </button>
        </form>
        <div className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <button
            onClick={handleLoginRedirect}
            className="text-blue-600 font-semibold hover:underline focus:outline-none bg-transparent"
            type="button"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
