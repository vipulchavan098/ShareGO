import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import loginSide from '../assets/login-side.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on change
    setDebugInfo('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setDebugInfo('');

    try {
      console.log("Attempting login...");
      const response = await api.post('/users/login', formData);
      console.log("Login response:", response);

      const { token } = response.data;

      // Fetch User Details to get Name
      let firstName = '';
      let userId = null;
      let role = null;

      try {
        // 1. Get User ID (Legacy lookup since login doesn't return it)
        const usersRes = await api.get('/users');
        const currentUser = usersRes.data.find(u => u.email === formData.email);

        if (currentUser) {
          userId = currentUser.userId;

          // 2. Try to get Passenger Profile
          try {
            const passRes = await api.get(`/passengers/user/${userId}`);
            firstName = passRes.data.firstName;
            role = 'PASSENGER';
          } catch (e) {
            // Not a passenger, try Driver
            try {
              const driverRes = await api.get(`/drivers/user/${userId}`);
              firstName = driverRes.data.firstName;
              role = 'DRIVER';
            } catch (e2) {
              console.warn("No profile found");
            }
          }
        }
      } catch (profileErr) {
        console.error("Error fetching profile:", profileErr);
      }

      const userData = {
        sub: formData.email,
        email: formData.email,
        userId: userId,
        firstName: firstName,
        role: role
      };

      login(userData, token);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);

      let msg = 'Invalid email or password.';
      const rawMsg = err.response?.data?.message || err.message;

      // Map technical errors to user-friendly messages
      if (rawMsg?.includes('Bad credentials') || rawMsg?.includes('User not found')) {
        msg = 'Invalid email or password.';
      } else if (!err.response && err.request) {
        msg = 'Unable to connect to server. Please try again later.';
      } else if (err.response) {
        msg = rawMsg || 'Login failed.';
      }

      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-white">
      {/* Left side - Image */}
      <div className="hidden md:flex md:w-1/2 bg-orange-50 items-center justify-center relative overflow-hidden">
        <img
          src={loginSide}
          alt="Carpooling illustration"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-orange-900 opacity-10"></div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:px-12 lg:px-16 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link to="/register" className="font-medium text-orange-600 hover:text-orange-500">
                create a new account
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex flex-col">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  className="input-field rounded-t-md rounded-b-none"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input-field rounded-t-none rounded-b-md"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-orange-600 hover:text-orange-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div >
    </div >
  );
};

export default Login;
