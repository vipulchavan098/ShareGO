import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import registerBg from '../assets/register-side.png';
import ConfirmationModal from '../components/ConfirmationModal';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    email: '',
    password: '',
    role: 'PASSENGER'
  });

  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setDebugInfo('');

    try {
      // Step 1: Register User
      const payload = {
        email: formData.email,
        password: formData.password,
        role: formData.role
      };
      console.log("Attempting to register user with payload:", payload);
      const userRes = await api.post('/users/register', payload);

      console.log("User Registration Response:", userRes);

      const message = userRes.data?.message || "";
      const idMatch = message.match(/ID (\d+)/);

      let userId = null;
      if (idMatch) {
        userId = parseInt(idMatch[1]);
        console.log("Parsed User ID:", userId);
      } else {
        console.warn("Could not parse ID from message:", message);
        // If we created the user but can't find ID, we are stuck.
        // Let's assume we can't proceed.
        throw new Error(`Account created but failed to retrieve User ID from response: ${message}`);
      }

      // Step 2: Register Role Profile
      if (userId) {
        // Always register as Passenger first (everyone can be a passenger)
        console.log("Registering Passenger...");
        try {
          await api.post('/passengers/register', {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            address: formData.address,
            userId: userId
          });
        } catch (pErr) {
          console.error("Passenger registration warning:", pErr);
          // Continue even if this fails, though it shouldn't
        }

        // If role is DRIVER, also register as Driver
        if (formData.role === 'DRIVER') {
          console.log("Registering Driver...");
          await api.post('/drivers/register', {
            firstName: formData.firstName,
            lastName: formData.lastName,
            licenseNo: "PENDING-" + Date.now(), // Placeholder
            experience: "0",
            userId: userId
          });
        }
      }

      setIsSuccessModalOpen(true);
      // alert('Registration successful! Please log in.');
      // navigate('/login'); // Moved to modal

    } catch (err) {
      console.error('Registration error details:', err);

      let msg = 'Registration failed. Please check your inputs.';
      const rawMsg = err.response?.data?.message || err.message;

      if (rawMsg?.includes('Duplicate entry')) {
        msg = 'This email or phone number is already registered.';
      } else if (!err.response && err.request) {
        msg = 'Unable to connect to server. Please try again later.';
      } else if (err.response) {
        // Use the server's error message if available, otherwise default
        msg = rawMsg || 'Registration failed. Please check your inputs.';
      }

      setError(msg);
      // Removed debugInfo setting to hide technical details from UI
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <ConfirmationModal
        isOpen={isSuccessModalOpen}
        title="Success"
        message="Registration successful! Please log in."
        isSuccess={true}
        isDanger={false}
        onConfirm={() => navigate('/login')}
      />
      {/* Background Image & Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${registerBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-orange-900/30 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8 bg-white/90 backdrop-blur-md p-8 rounded-lg shadow-2xl border border-white/20">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700 break-words">{error}</p>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="sr-only">First Name</label>
                <input
                  name="firstName"
                  type="text"
                  required
                  className="input-field"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  required
                  className="input-field"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="sr-only">Phone Number</label>
              <input
                name="phone"
                type="tel"
                className="input-field"
                placeholder="Phone Number (Optional)"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="sr-only">Address</label>
              <input
                name="address"
                type="text"
                className="input-field"
                placeholder="Address (Optional)"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                name="email"
                type="email"
                required
                className="input-field"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                name="password"
                type="password"
                required
                className="input-field"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">I want to...</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
              >
                <option value="PASSENGER">Book a Ride (Passenger)</option>
                <option value="DRIVER">Offer a Ride (Driver)</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
