import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';

const BookingPage = () => {
    const { rideId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [numberOfSeats, setNumberOfSeats] = useState(1);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    // ... (logic remains same)

    const handleBook = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // ... (passenger logic)
            // Hardcoded fetch logic for brevity as per existing code
            const usersRes = await api.get('/users');
            const currentUser = usersRes.data.find(u => u.email === user.email);

            if (!currentUser) {
                throw new Error("User not found");
            }

            // Now get passenger profile
            let passengerId;
            try {
                const passRes = await api.get(`/passengers/user/${currentUser.userId}`);
                passengerId = passRes.data.passengerId;
            } catch (err) {
                throw new Error("Passenger profile not found. Please register as a verified passenger.");
            }

            const bookingData = {
                rideId: parseInt(rideId),
                passengerId: passengerId,
                seats: parseInt(numberOfSeats)
            };

            await api.post('/bookings', bookingData);
            setIsSuccessModalOpen(true);
            // alert('Booking successful!');
            // navigate('/dashboard'); // Moved to modal confirm

        } catch (err) {
            console.error(err);
            let msg = 'Booking failed.';
            if (err.response && err.response.data) {
                // If backend returns { message: "..." }
                msg = err.response.data.message || JSON.stringify(err.response.data);
            } else if (err.message) {
                msg = err.message;
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container flex justify-center">
            <ConfirmationModal
                isOpen={isSuccessModalOpen}
                title="Booking Requested"
                message="Your booking request has been sent! Waiting for driver approval."
                isSuccess={true}
                isDanger={false}
                onConfirm={() => navigate('/dashboard')}
            // No onClose provided to hide Cancel button
            />

            <div className="w-full max-w-md bg-white card">
                <h1 className="text-2xl font-bold mb-6">Confirm Booking</h1>


                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleBook} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Seats
                        </label>
                        <select
                            value={numberOfSeats}
                            onChange={(e) => setNumberOfSeats(e.target.value)}
                            className="input-field"
                        >
                            {[1, 2, 3, 4].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full"
                    >
                        {loading ? 'Booking...' : 'Confirm Booking'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn-secondary w-full mt-2"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingPage;
