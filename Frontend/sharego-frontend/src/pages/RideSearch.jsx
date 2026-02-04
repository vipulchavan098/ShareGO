import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import rideSearchBg from '../assets/ride-search-bg.png';

const RideSearch = () => {
    const [searchParams, setSearchParams] = useState({
        source: '',
        destination: '',
        rideDate: ''
    });
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // GET /rides/search?source=X&destination=Y
            const response = await api.get('/rides/search', {
                params: {
                    source: searchParams.source,
                    destination: searchParams.destination,
                    rideDate: searchParams.rideDate
                }
            });
            setRides(response.data);
            if (response.data.length === 0) {
                if (searchParams.rideDate) {
                    setError(`No rides found from ${searchParams.source} to ${searchParams.destination} on ${searchParams.rideDate}.`);
                } else {
                    setError(`No rides found from ${searchParams.source} to ${searchParams.destination}.`);
                }
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch rides. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (rideId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        // Logic to book ride - maybe navigate to a booking details page or open a modal
        // For simplicity, let's navigate to a booking page
        navigate(`/booking/${rideId}`);
    };

    return (
        <div
            className="w-full min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8 bg-gray-50"
            style={{
                backgroundImage: `url(${rideSearchBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg mb-8 max-w-5xl mx-auto mt-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Find a Ride</h1>
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                        <input
                            type="text"
                            name="source"
                            required
                            className="input-field"
                            placeholder="City or Location"
                            value={searchParams.source}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                        <input
                            type="text"
                            name="destination"
                            required
                            className="input-field"
                            placeholder="City or Location"
                            value={searchParams.destination}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            name="rideDate"
                            className="input-field"
                            value={searchParams.rideDate}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full h-11"
                        >
                            {loading ? 'Searching...' : 'Search Rides'}
                        </button>
                    </div>
                </form>
            </div>

            {error && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <p className="text-sm text-yellow-700">{error}</p>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {rides.map((ride) => (
                    <div key={ride.rideId} className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/95">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {ride.source} <span className="text-gray-400">→</span> {ride.destination}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {ride.rideDate} at {ride.rideTime}
                                </p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ₹{ride.pricePerSeat}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 mb-6">
                            {/* Status is not in DTO yet, assuming Scheduled */}
                            <p>Status: <span className="capitalize text-green-600">Available</span></p>
                        </div>

                        <button
                            onClick={() => handleBook(ride.rideId)}
                            className="w-full btn-outline hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200"
                        >
                            Book Seat
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RideSearch;
