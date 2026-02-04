import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';

import addVehicleBg from '../assets/add-vehicle-bg-v3.png';

const AddVehicle = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        isDanger: false,
        onConfirm: null
    });

    // VehicleDTO: { vehicleName, vehicleNo, vehicleType, seats, rentPerDay, driverId }
    const [formData, setFormData] = useState({
        vehicleName: '',
        vehicleNo: '',
        vehicleType: 'Car',
        seats: 4,
        rentPerDay: 10,
        driverId: null
    });

    useEffect(() => {
        const fetchDriverId = async () => {
            try {
                const usersRes = await api.get('/users');
                const currentUser = usersRes.data.find(u => u.email === user.email);

                if (currentUser && currentUser.userId) {
                    const driverRes = await api.get(`/drivers/user/${currentUser.userId}`);
                    setFormData(prev => ({ ...prev, driverId: driverRes.data.driverId }));
                } else {
                    console.error("Could not match your logged-in email to a user record.");
                }
            } catch (err) {
                console.error("Error fetching driver details:", err);
                // setError("Could not retrieve driver profile. Are you registered as a driver?");
            }
        };

        if (user) {
            fetchDriverId();
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.driverId) {
            setModalConfig({
                isOpen: true,
                title: 'Error',
                message: 'Driver ID not loaded yet. Please wait or refresh the page.',
                isDanger: true,
                onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
            });
            setLoading(false);
            return;
        }

        try {
            await api.post('/vehicles', {
                ...formData,
                seats: parseInt(formData.seats),
                rentPerDay: parseFloat(formData.rentPerDay)
            });
            setModalConfig({
                isOpen: true,
                title: 'Success',
                message: 'Vehicle added successfully!',
                isSuccess: true,
                isDanger: false,
                onConfirm: () => navigate('/dashboard')
            });
        } catch (err) {
            console.error(err);
            let msg = err.response?.data?.message || "Failed to add vehicle.";

            // Parse raw backend errors for better user experience
            if (msg.includes("Duplicate entry")) {
                msg = "A vehicle with this license number already exists.";
            } else if (msg.includes("could not execute statement")) {
                msg = "Database error. Please check your input.";
            }

            setModalConfig({
                isOpen: true,
                title: 'Error',
                message: msg,
                isDanger: true,
                onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="w-full relative flex justify-end items-center py-12 px-4 sm:px-12 lg:px-24"
            style={{
                minHeight: 'calc(100vh - 64px)'
            }}
        >
            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                isDanger={modalConfig.isDanger}
                isSuccess={modalConfig.isSuccess}
                onConfirm={modalConfig.onConfirm}
            />
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${addVehicleBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
            </div>

            <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/20 relative z-10">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Add a New Vehicle</h1>

                {/* {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm rounded">
                        {error}
                    </div>
                )} */}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Vehicle Name / Model</label>
                        <input
                            name="vehicleName"
                            type="text"
                            required
                            className="input-field w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="e.g. Honda City"
                            value={formData.vehicleName}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Vehicle License Number</label>
                        <input
                            name="vehicleNo"
                            type="text"
                            required
                            className="input-field w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="e.g. MH 12 AB 1234"
                            value={formData.vehicleNo}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Vehicle Type</label>
                            <select
                                name="vehicleType"
                                className="input-field w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                                value={formData.vehicleType}
                                onChange={handleChange}
                            >
                                <option value="Car">Car</option>
                                <option value="Bike">Bike</option>
                                <option value="SUV">SUV</option>
                                <option value="Van">Van</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Total Seats</label>
                            <input
                                name="seats"
                                type="number"
                                required
                                min="1"
                                max="10"
                                className="input-field w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                                value={formData.seats}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Rent Per Day (₹)</label>
                        <input
                            name="rentPerDay"
                            type="number"
                            required
                            min="1"
                            step="0.01"
                            className="input-field w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                            value={formData.rentPerDay}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all transform hover:scale-[1.02]"
                    >
                        {loading ? 'Adding Vehicle...' : 'Add Vehicle'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddVehicle;
