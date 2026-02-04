import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';

const Dashboard = () => {
    const { user } = useAuth();
    const [passengerProfile, setPassengerProfile] = useState(null);
    const [driverProfile, setDriverProfile] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [driverBookings, setDriverBookings] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Edit Driver State
    const [isEditDriverModalOpen, setIsEditDriverModalOpen] = useState(false);
    const [editDriverData, setEditDriverData] = useState({ licenseNo: '', experience: '', phone: '' });

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);

    // ... (fetchData useEffect remains same)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get User ID
                const usersRes = await api.get('/users');
                const currentUser = usersRes.data.find(u => u.email === user.email);

                if (!currentUser) return;
                setCurrentUserId(currentUser.userId);

                // 2. Check Roles
                // Try get passenger
                try {
                    const passRes = await api.get(`/passengers/user/${currentUser.userId}`);
                    setPassengerProfile(passRes.data);

                    // If exists, get bookings
                    try {
                        const bookingsRes = await api.get(`/bookings/passenger/${passRes.data.passengerId}`);
                        setBookings(bookingsRes.data);
                    } catch (ignore) {
                        // maybe no bookings API valid response if empty?
                    }

                } catch (e) {
                    // Not a passenger
                }

                // Try get driver
                try {
                    const driverRes = await api.get(`/drivers/user/${currentUser.userId}`);
                    setDriverProfile(driverRes.data);

                    // Get vehicles
                    try {
                        const vehiclesRes = await api.get(`/vehicles/driver/${driverRes.data.driverId}`);
                        setVehicles(vehiclesRes.data);
                    } catch (e) {
                        // no vehicles
                    }

                    // Get driver bookings
                    try {
                        const dBookingsRes = await api.get(`/bookings/driver/${driverRes.data.driverId}`);
                        setDriverBookings(dBookingsRes.data);
                    } catch (e) {
                        console.error("Failed to fetch driver bookings", e);
                    }

                } catch (e) {
                    // Not a driver
                }

            } catch (err) {
                console.error("Dashboard fetch error", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    const initiateCancel = (bookingId) => {
        setBookingToCancel(bookingId);
        setIsModalOpen(true);
    };

    const handleConfirmCancel = async () => {
        if (!bookingToCancel || !passengerProfile) return;

        try {
            await api.put(`/bookings/cancel/${bookingToCancel}/passenger/${passengerProfile.passengerId}`);
            window.location.reload();
        } catch (e) {
            console.error("Failed to cancel", e);
        } finally {
            setIsModalOpen(false);
            setBookingToCancel(null);
        }
    };

    // New Handler for Driver Actions
    const [actionModal, setActionModal] = useState({ open: false, type: '', bookingId: null, title: '', message: '' });

    const handleDriverAction = (bookingId, type) => {
        if (type === 'APPROVE') {
            setActionModal({
                open: true,
                type: 'APPROVE',
                bookingId,
                title: 'Approve Booking',
                message: 'Are you sure you want to approve this booking? The passenger will be notified to make payment.',
                isDanger: false,
                isSuccess: true
            });
        } else if (type === 'REJECT') {
            setActionModal({
                open: true,
                type: 'REJECT',
                bookingId,
                title: 'Reject Booking',
                message: 'Are you sure you want to reject this booking? This cannot be undone.',
                isDanger: true,
                isSuccess: false
            });
        }
    };

    const confirmDriverAction = async () => {
        if (!actionModal.bookingId || !driverProfile) return;

        try {
            if (actionModal.type === 'APPROVE') {
                await api.put(`/bookings/${actionModal.bookingId}/approve/driver/${driverProfile.driverId}`);
            } else {
                await api.put(`/bookings/${actionModal.bookingId}/reject/driver/${driverProfile.driverId}`);
            }
            window.location.reload();
        } catch (e) {
            console.error("Action failed", e);
            // Could update modal to show error here if needed
        } finally {
            setActionModal({ ...actionModal, open: false });
        }
    };

    const [updateError, setUpdateError] = useState('');

    const openEditDriverModal = () => {
        setEditDriverData({
            licenseNo: driverProfile.licenseNo,
            experience: driverProfile.experience,
            phone: driverProfile.phone || passengerProfile?.phone || ''
        });
        setUpdateError('');
        setIsEditDriverModalOpen(true);
    };

    const handleUpdateDriver = async (e) => {
        e.preventDefault();
        setUpdateError('');
        try {
            await api.put(`/drivers/${driverProfile.driverId}`, {
                ...editDriverData,
                firstName: driverProfile.firstName, // Backend might require these or ignore
                lastName: driverProfile.lastName,
                userId: currentUserId
            });
            window.location.reload();
        } catch (err) {
            console.error("Update failed", err);
            setUpdateError(err.response?.data?.message || err.message || "Failed to update profile.");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="page-container">
            <ConfirmationModal
                isOpen={isModalOpen}
                title="Cancel Booking"
                message="Are you sure you want to cancel this booking? This action cannot be undone."
                isDanger={true}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmCancel}
            />

            <ConfirmationModal
                isOpen={actionModal.open}
                title={actionModal.title}
                message={actionModal.message}
                isDanger={actionModal.isDanger}
                isSuccess={actionModal.isSuccess}
                onClose={() => setActionModal({ ...actionModal, open: false })}
                onConfirm={confirmDriverAction}
            />

            {/* Incomplete Profile Alert */}
            {driverProfile && driverProfile.licenseNo && driverProfile.licenseNo.startsWith('PENDING') && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 shadow-sm">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                <span className="font-bold">Action Required:</span> Your driver profile is incomplete. You must update your License Number and Experience before you can post a ride.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Driver Modal */}
            {isEditDriverModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold mb-4">Edit Driver Details</h3>

                        {updateError && (
                            <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-200">
                                {updateError}
                            </div>
                        )}

                        <form onSubmit={handleUpdateDriver} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">License Number</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field w-full mt-1"
                                    value={editDriverData.licenseNo}
                                    onChange={(e) => setEditDriverData({ ...editDriverData, licenseNo: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field w-full mt-1"
                                    value={editDriverData.experience}
                                    onChange={(e) => setEditDriverData({ ...editDriverData, experience: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="text"
                                    className="input-field w-full mt-1"
                                    value={editDriverData.phone}
                                    onChange={(e) => setEditDriverData({ ...editDriverData, phone: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsEditDriverModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-orange-600 hover:bg-orange-700 rounded-md"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl shadow-xl p-8 mb-8 text-white">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Welcome back, {user?.email?.split('@')[0]}!</h1>
                        <p className="text-orange-100 mt-1">Manage your rides, vehicles, and bookings from here.</p>
                    </div>
                    <div className="flex gap-3">
                        {!driverProfile && (
                            <Link to="/register-driver" className="px-4 py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors shadow-sm">
                                Become a Driver
                            </Link>
                        )}
                        {driverProfile && (
                            <>
                                {driverProfile.licenseNo && driverProfile.licenseNo.startsWith('PENDING') ? (
                                    <button
                                        onClick={openEditDriverModal}
                                        className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-semibold hover:bg-yellow-200 transition-colors shadow-sm flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        Complete Profile to Post Ride
                                    </button>
                                ) : (
                                    <Link to="/rides/create" className="px-4 py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors shadow-sm flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        Post a Ride
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Sidebar - Profile */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800">My Profile</h2>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-2xl font-bold">
                                    {user?.email?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Signed in as</p>
                                    <p className="font-medium text-gray-900 break-all">{user?.email}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {driverProfile && (
                                    <div className="p-4 bg-green-50 rounded-lg border border-green-100 relative group">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 bg-green-200 text-green-800 text-xs font-bold rounded-full">DRIVER</span>
                                            </div>
                                            <button
                                                onClick={openEditDriverModal}
                                                className="text-xs text-green-700 hover:text-green-900 bg-green-100 hover:bg-green-200 px-2 py-1 rounded transition-colors"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-700"><span className="font-medium">License:</span> {driverProfile.licenseNo}</p>
                                        <p className="text-sm text-gray-700"><span className="font-medium">Exp:</span> {driverProfile.experience} years</p>
                                    </div>
                                )}

                                {passengerProfile ? (
                                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 bg-orange-200 text-orange-800 text-xs font-bold rounded-full">
                                                {driverProfile ? 'PERSONAL DETAILS' : 'PASSENGER'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700"><span className="font-medium">Name:</span> {passengerProfile.firstName} {passengerProfile.lastName}</p>
                                        <p className="text-sm text-gray-700"><span className="font-medium">Phone:</span> {passengerProfile.phone}</p>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-sm text-yellow-700">
                                        Complete your passenger profile to start booking rides.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Driver Actions: My Vehicles */}
                    {driverProfile && (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-800">My Vehicles</h2>
                                <Link to="/vehicles/add" className="text-sm font-medium text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-1 rounded-md transition-colors">
                                    + Add Vehicle
                                </Link>
                            </div>

                            <div className="p-6">
                                {vehicles.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {vehicles.map(v => (
                                            <div key={v.vehicleId} className="group border border-gray-200 rounded-xl p-4 hover:border-orange-200 hover:shadow-md transition-all">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900">{v.vehicleName}</h3>
                                                        <p className="text-sm text-gray-500">{v.vehicleNo}</p>
                                                    </div>
                                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md uppercase font-semibold">{v.vehicleType}</span>
                                                </div>
                                                <div className="mt-4 flex items-center text-sm text-gray-500">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                                    {v.seats} Seats Available
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                        <p className="text-gray-500">No vehicles added yet.</p>
                                        <Link to="/vehicles/add" className="text-orange-600 font-medium hover:underline mt-2 inline-block">Add your first vehicle</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Driver Actions: Incoming Bookings */}
                    {driverProfile && (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-800">Incoming Bookings</h2>
                            </div>
                            <div className="p-6">
                                {driverBookings.length > 0 ? (
                                    <div className="space-y-4">
                                        {driverBookings.map(booking => (
                                            <div key={booking.bookingId} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200">
                                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-bold text-gray-900 text-lg">#{booking.bookingId}</span>
                                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${booking.bookingStatus === 'CONFIRMED' ? 'bg-green-50 text-green-700 border-green-200' :
                                                                booking.bookingStatus === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' :
                                                                    booking.bookingStatus === 'PAID' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                                }`}>
                                                                {booking.bookingStatus}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <span className="font-semibold text-indigo-600">{booking.passengerName}</span>
                                                            <span className="text-gray-400">•</span>
                                                            <span>{booking.seats} Seat(s)</span>
                                                        </div>
                                                        <div className="text-sm text-gray-500 flex flex-col gap-1">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                                                {booking.rideSource} <span className="text-gray-400">→</span> {booking.rideDestination}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                                                {booking.rideDate} at {booking.rideTime}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-3">
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-2xl font-bold text-gray-900">₹{booking.totalFare}</span>
                                                            <span className="text-xs text-gray-500 uppercase font-medium tracking-wider">Total Booking Value</span>
                                                        </div>

                                                        {booking.bookingStatus === 'PENDING' && (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        // Set state to trigger modal instead of window.confirm
                                                                        setBookingToCancel(booking.bookingId);
                                                                        // We can reuse the cancel modal logic or create a new one. 
                                                                        // For now, let's use a specialized function for rejection.
                                                                        handleDriverAction(booking.bookingId, 'REJECT');
                                                                    }}
                                                                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors border border-red-100"
                                                                >
                                                                    Reject
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDriverAction(booking.bookingId, 'APPROVE')}
                                                                    className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm font-semibold hover:bg-green-100 transition-colors border border-green-100 flex items-center gap-1"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                                    Approve
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                        <div className="mx-auto h-12 w-12 text-orange-200 mb-2">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <p className="text-gray-500">No active bookings for your rides yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Bookings Section */}
                    {passengerProfile && (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-800">My Bookings</h2>
                            </div>
                            <div className="p-6">
                                {bookings.length > 0 ? (
                                    <div className="space-y-4">
                                        {bookings.map(booking => (
                                            <div key={booking.bookingId} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 relative overflow-hidden">
                                                {/* Left Border Accent */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${booking.bookingStatus === 'CONFIRMED' ? 'bg-green-500' :
                                                    booking.bookingStatus === 'CANCELLED' ? 'bg-red-500' :
                                                        booking.bookingStatus === 'PAID' ? 'bg-orange-500' :
                                                            'bg-yellow-500'
                                                    }`}></div>

                                                <div className="pl-4 flex flex-col md:flex-row justify-between gap-4">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-3">
                                                            <h3 className="font-bold text-gray-900 text-lg">Booking #{booking.bookingId}</h3>
                                                            <span className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase ${booking.bookingStatus === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                                                booking.bookingStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                                    booking.bookingStatus === 'PAID' ? 'bg-orange-100 text-orange-800' :
                                                                        'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {booking.bookingStatus}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            <p className="font-medium">{booking.rideSource} <span className="mx-1 text-gray-400">→</span> {booking.rideDestination}</p>
                                                            <p className="text-gray-500 mt-1">{booking.rideDate} at {booking.rideTime}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-end gap-3">
                                                        <div className="text-right">
                                                            <p className="text-2xl font-bold text-gray-900">₹{booking.totalFare}</p>
                                                            <p className="text-xs text-gray-500">{booking.seats} Seat(s)</p>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            {booking.bookingStatus !== 'CANCELLED' && booking.bookingStatus !== 'PAID' && (
                                                                <button
                                                                    onClick={() => initiateCancel(booking.bookingId)}
                                                                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}

                                                            {booking.bookingStatus === 'CONFIRMED' && (
                                                                <button
                                                                    onClick={async () => {
                                                                        try {
                                                                            // 1. Get Razorpay Key
                                                                            const keyRes = await api.get('/pg/key');
                                                                            const rzpKey = keyRes.data.key;

                                                                            // 2. Create Order at Backend
                                                                            const orderRes = await api.post('/pg/create-order', {
                                                                                amount: booking.totalFare
                                                                            });
                                                                            // Parse if string (Razorpay toString() returns JSON string)
                                                                            const order = typeof orderRes.data === 'string' ? JSON.parse(orderRes.data) : orderRes.data;

                                                                            // 3. Open Razorpay Options
                                                                            const options = {
                                                                                key: rzpKey,
                                                                                amount: order.amount,
                                                                                currency: "INR",
                                                                                name: "ShareGo",
                                                                                description: `Payment for Booking #${booking.bookingId}`,
                                                                                order_id: order.id,
                                                                                handler: async function (response) {
                                                                                    // 4. On Payment Success, Save to DB
                                                                                    try {
                                                                                        await api.post('/pg/handle-payment', {
                                                                                            bookingId: booking.bookingId,
                                                                                            userId: currentUserId,
                                                                                            amount: booking.totalFare,
                                                                                            paymentDate: new Date().toISOString().split('T')[0]
                                                                                        });
                                                                                        // Optional: Show success toast
                                                                                        window.location.reload();
                                                                                    } catch (e) {
                                                                                        console.error("Save failed", e);
                                                                                        // Optional: Show error toast
                                                                                    }
                                                                                },
                                                                                prefill: {
                                                                                    email: user?.email
                                                                                },
                                                                                theme: {
                                                                                    color: "#ea580c"
                                                                                }
                                                                            };

                                                                            const rzp = new window.Razorpay(options);
                                                                            rzp.open();

                                                                        } catch (e) {
                                                                            console.error("Payment init failed", e);
                                                                            // alert('Could not initiate payment. Check console.');
                                                                        }
                                                                    }}
                                                                    className="px-4 py-1.5 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm transition-colors"
                                                                >
                                                                    Pay Now
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                        <div className="mx-auto h-12 w-12 text-orange-200 mb-2">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                                        </div>
                                        <p className="text-gray-500 mb-2">No active bookings found.</p>
                                        <Link to="/rides/search" className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700">
                                            Book your first ride
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {!passengerProfile && !driverProfile && (
                        <div className="bg-white card text-center py-12">
                            <p className="text-gray-500 mb-4">You have not set up a profile yet.</p>
                            <p className="text-gray-500">Please contact support or register explicitly as a Passenger/Driver (Feature pending backend support for separate registration after initial signup).</p>
                            {/* Note: In real app, we'd have a form here to POST to /passengers/register */}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
