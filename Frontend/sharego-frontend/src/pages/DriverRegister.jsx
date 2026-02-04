import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';

const DriverRegister = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        licenseNo: '',
        phone: '',
        experience: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [debugInfo, setDebugInfo] = useState('');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setDebugInfo('');

        try {
            // Fetch User ID
            const usersRes = await api.get('/users');
            const currentUser = usersRes.data.find(u => u.email === user.email);

            if (!currentUser) {
                throw new Error("User session invalid. Please log in again.");
            }

            // DriverRegDTO: { firstName, lastName, phone, licenseNo, experience, userId }
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                licenseNo: formData.licenseNo,
                experience: formData.experience,
                userId: currentUser.userId
            };

            console.log("Sending Driver Registration Payload:", payload);

            await api.post('/drivers/register', payload);

            setIsSuccessModalOpen(true);
            // alert('You are now registered as a Driver!');
            // navigate('/dashboard'); // Moved to Modal

        } catch (err) {
            console.error(err);
            let msg = 'Failed to register as driver.';
            if (err.response) {
                msg = `Server Error: ${err.response.status} - ${err.response.data?.message || JSON.stringify(err.response.data)}`;
                setDebugInfo(JSON.stringify(err.response.data, null, 2));
            } else if (err.request) {
                msg = 'No response from server.';
            } else {
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
                title="Success"
                message="You are now registered as a Driver!"
                isSuccess={true}
                isDanger={false}
                onConfirm={() => navigate('/dashboard')}
            />
            <div className="w-full max-w-md bg-white card">
                <h1 className="text-2xl font-bold mb-6">Become a Driver</h1>

                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">
                        <p>{error}</p>
                        {debugInfo && (
                            <details className="mt-2 text-xs text-red-600">
                                <summary>Technical Details</summary>
                                <pre className="whitespace-pre-wrap">{debugInfo}</pre>
                            </details>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            name="phone"
                            type="text"
                            required
                            className="input-field"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                        <input
                            name="licenseNo"
                            type="text"
                            required
                            className="input-field"
                            placeholder="License Number"
                            value={formData.licenseNo}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Driving Experience (Years/Level)</label>
                        <input
                            name="experience"
                            type="text"
                            required
                            className="input-field"
                            placeholder="e.g. 5 Years"
                            value={formData.experience}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full mt-4"
                    >
                        {loading ? 'Registering...' : 'Register as Driver'}
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

export default DriverRegister;
