import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection
import Snackbar from '../components/Snackbar'; // Import the custom Snackbar component

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [snackbar, setSnackbar] = useState({ message: '', type: '' });
    const navigate = useNavigate(); // Initialize navigate function

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                // Redirect to the home page upon successful login
                navigate('/home');
                const responseData = await response.json();
                const id = responseData.id;
                // Store the id in cache
                localStorage.setItem('userId', id);
            } else {
                // Show error message if login fails
                const errorData = await response.json();
                setSnackbar({ message: errorData.message || 'Invalid credentials', type: 'error' });
            }
        } catch (error) {
            setSnackbar({ message: 'An error occurred. Please try again.', type: 'error' });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ message: '', type: '' });
    };

    return (
        <div className="h-screen bg-gray-900 flex flex-col">
            {/* Navbar */}
            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-white text-xl font-bold">Logo</div>
                    <div>
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => window.location.href = '/signup'}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>

            <div className="flex justify-center items-center flex-grow">
                <div className="bg-gray-800 shadow-md rounded-lg px-12 py-8 mb-4 max-w-md w-full">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign in</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="flex justify-start block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="flex justify-start block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                                type="submit"
                            >
                                Sign In
                            </button>
                        </div>
                        <div className="text-center mb-4">
                            <a
                                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-400"
                                href="#"
                            >
                                Forgot Password?
                            </a>
                        </div>
                        <div className="flex justify-center">
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center w-full"
                                type="button"
                            >
                                {/* Replace with your Google icon */}
                                <span className="mr-2">G</span> Sign in with Google
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Snackbar */}
            <Snackbar
                message={snackbar.message}
                type={snackbar.type}
                onClose={handleCloseSnackbar}
            />
        </div>
    );
};

export default Login;
