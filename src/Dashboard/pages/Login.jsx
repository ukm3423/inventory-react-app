import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import logo from '../assets/agg.png'; // Ensure you have a logo in your assets folder
import { ClipLoader, RingLoader, RotateLoader, ScaleLoader } from 'react-spinners'; // Import a premium spinner
import axios from 'axios';
import background from '../assets/iStock-1024926532.webp';
function AdminLogin() {
  const API = "http://192.168.1.90:8081/authservice/api";
  // const API = "http://localhost:8080/authservice/api";

  const nav = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    token: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // State to handle loading

  function handleChange(e) {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the form from being submitted to the server
    setLoading(true); // Set loading to true
    setError(''); // Clear any previous errors

    // Simulate a delay for the loading spinner (replace this with your actual authentication logic)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const response = await axios.post(`${API}/login`, {
        email: formData.email,
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const token = response.data.token;
      setFormData((prevData) => ({ ...prevData, token }));
      localStorage.setItem('token', token);
      login(token); // Assuming login function sets the authentication context
      nav('/'); // Navigate to the dashboard after login
    } catch (error) {

      if (error.response) {

        console.error('Response error:', error.response.data);
        setError('Invalid email or password');
      } else if (error.request) {
        console.error('Request error:', error.request);
        setError('Network error, please try again later');
      } else {
        console.error('Error:', error.message);
        setError('An error occurred, please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToWebsite = () => {
    nav('/');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${background})` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="md:mt-0 max-w-md w-full space-y-8 p-6 sm:p-8 bg-white bg-opacity-95 rounded-lg shadow-lg border border-gray-500 relative z-10">
        <div className="mb-4 text-center">
          <img
            src={logo}
            alt="Company Logo"
            className="w-28 h-28 mx-auto rounded-full"
          />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-6 sm:mb-8">Inventory Login </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="/" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading} // Disable button when loading
            >
              Sign in
            </button>
          </div>

        </form>

        <button
          onClick={handleBackToWebsite}
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Create a new Account
        </button>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <a href="/" className="w-full flex items-center justify-center px-3 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <img className="h-5 w-5" src="https://www.svgrepo.com/show/512120/facebook-176.svg" alt="" />
            </a>
            <a href="/" className="w-full flex items-center justify-center px-3 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <img className="h-5 w-5" src="https://www.svgrepo.com/show/513008/twitter-154.svg" alt="" />
            </a>
            <a href="/" className="w-full flex items-center justify-center px-3 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <img className="h-5 w-5" src="https://www.svgrepo.com/show/506498/google.svg" alt="" />
            </a>
          </div>
        </div>
      </div>




      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <ScaleLoader color="#fff" speedMultiplier={2} size={30} />
        </div>
      )}

    </div>
  );
}

export default AdminLogin;
