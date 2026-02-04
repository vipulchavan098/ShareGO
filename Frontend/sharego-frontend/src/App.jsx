import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RideSearch from './pages/RideSearch';
import CreateRide from './pages/CreateRide';
import BookingPage from './pages/BookingPage';
import DriverRegister from './pages/DriverRegister';

import AddVehicle from './pages/AddVehicle';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />

            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="register-driver" element={<DriverRegister />} />
              <Route path="rides/search" element={<RideSearch />} />
              <Route path="rides/create" element={<CreateRide />} />
              <Route path="vehicles/add" element={<AddVehicle />} />
              <Route path="booking/:rideId" element={<BookingPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<div className="p-8 text-center text-2xl">404: Page Not Found</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
