import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        window.location.href = '/home';
      } else {
        setError(result.msg || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  };

const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
        console.log('Google OAuth Response:', response);
        console.log('ID Token:', response.id_token); // Note: `access_token` is logged here

        try {
            const res = await fetch('http://localhost:5000/users/google-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: response.access_token }), // Use `access_token` for id_token
            });

            const result = await res.json();

            if (res.ok) {
                window.location.href = '/home';
            } else {
                setError(result.msg || 'Google login failed');
            }
        } catch (err) {
            console.error('Server error:', err);
            setError('Server error');
        }
    },
    onError: () => {
        setError('Google login failed');
    },
});



const handleGoogleLogin = async () => {
    googleLogin();
};
  

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-xl font-bold">Logo</div>
          <div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
              onClick={() => window.location.href = '/'}
            >
              Login
            </button>
          </div>
        </div>
      </nav>
      <div className="flex justify-center items-center flex-grow py-12">
        <div className="bg-gray-800 shadow-md rounded-lg px-12 py-8 mb-4 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                value={name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                value={password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>
            {error && (
              <div className="mb-4 text-red-500 text-center">
                {error}
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
              >
                Sign Up
              </button>
            </div>
            <div className="flex justify-center mb-4">
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center w-full"
                type="button"
                onClick={() => googleLogin()}
              >
                <FcGoogle className="mr-2" /> Sign up with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
