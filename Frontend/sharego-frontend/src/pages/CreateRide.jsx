import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

import createRideBg from '../assets/create-ride-bg.png';

const CreateRide = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // CreateRideDTO: { source, destination, startTime, fare, driverId, vehicleId, availableSeats }

    const [formData, setFormData] = useState({
        source: '',
        destination: '',
        startTime: '',
        fare: '',
        vehicleId: '',
        availableSeats: 3
    });

    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const fetchDriverData = async () => {
            try {
                const usersRes = await api.get('/users');
                const currentUser = usersRes.data.find(u => u.email === user.email);

                if (!currentUser) {
                    setError("User not found. Please log in again.");
                    return;
                }

                // Get driver profile
                const driverRes = await api.get(`/drivers/user/${currentUser.userId}`);
                const driverId = driverRes.data.driverId;
                setFormData(prev => ({ ...prev, driverId: driverId }));

                // Fetch vehicles
                try {
                    const vehiclesRes = await api.get(`/vehicles/driver/${driverId}`);
                    setVehicles(vehiclesRes.data);

                    // Auto-select first vehicle if available
                    if (vehiclesRes.data.length > 0) {
                        setFormData(prev => ({ ...prev, vehicleId: vehiclesRes.data[0].vehicleId }));
                    }
                } catch (err) {
                    console.log("No vehicles found or error fetching", err);
                }

            } catch (err) {
                console.error(err);
                setError("You must be a registered driver to post a ride.");
            }
        };

        if (user) {
            fetchDriverData();
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const [datePart, timePart] = formData.startTime.split('T');

            const payload = {
                source: formData.source,
                destination: formData.destination,
                rideDate: datePart,
                rideTime: timePart,
                pricePerSeat: parseFloat(formData.fare),
                availableSeats: parseInt(formData.availableSeats),
                driverId: formData.driverId,
                vehicleId: parseInt(formData.vehicleId)
            };

            await api.post('/rides', payload);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to create ride.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="w-full min-h-[calc(100vh-64px)] flex justify-start items-start py-12 px-4 sm:px-12 lg:px-24"
            style={{
                backgroundImage: `url(${createRideBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="w-full max-w-lg bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-white/20 my-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-4 border-gray-200">Post a New Ride</h1>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                        <div className="relative group">
                            <label className="block text-sm font-bold text-gray-700 mb-1">From</label>
                            <input
                                name="source"
                                type="text"
                                required
                                className="input-field w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500 transition-shadow group-hover:shadow-sm"
                                placeholder="City"
                                value={formData.source}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative group">
                            <label className="block text-sm font-bold text-gray-700 mb-1">To</label>
                            <input
                                name="destination"
                                type="text"
                                required
                                className="input-field w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500 transition-shadow group-hover:shadow-sm"
                                placeholder="City"
                                value={formData.destination}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Departure Time</label>
                        <input
                            name="startTime"
                            type="datetime-local"
                            required
                            className="input-field w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                            value={formData.startTime}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Fare (₹)</label>
                            <input
                                name="fare"
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                className="input-field w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                                value={formData.fare}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Seats Available</label>
                            <input
                                name="availableSeats"
                                type="number"
                                required
                                min="1"
                                max="8"
                                className="input-field w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                                value={formData.availableSeats}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Select Vehicle</label>
                        {vehicles.length > 0 ? (
                            <select
                                name="vehicleId"
                                required
                                className="input-field w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500 bg-white"
                                value={formData.vehicleId}
                                onChange={handleChange}
                            >
                                <option value="">-- Choose a Vehicle --</option>
                                {vehicles.map(v => (
                                    <option key={v.vehicleId} value={v.vehicleId}>
                                        {v.vehicleName} ({v.vehicleNo})
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 text-sm text-orange-800 flex items-center justify-between">
                                <span>No vehicles found.</span>
                                <a href="/vehicles/add" className="font-bold underline hover:text-orange-900">Add a vehicle first</a>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !formData.driverId}
                        className="w-full py-3.5 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all transform hover:-translate-y-0.5"
                    >
                        {loading ? 'Publishing...' : 'Publish Ride'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateRide;
