import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const PassengerDashboard = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        // Fetch passenger rides
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rides:', err);
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  const handleBookRide = () => {
    // Handle ride booking
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Passenger Dashboard</h1>

          <div className="mb-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Book a Ride</h2>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="From"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                placeholder="To"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={handleBookRide}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                Find Rides
              </button>
            </div>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {rides.map((ride) => (
                <div key={ride.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg">
                  <h3 className="font-semibold">{ride.driver}</h3>
                  <p className="text-sm text-gray-600">{ride.from} → {ride.to}</p>
                  <p className="text-lg font-bold text-orange-500">₹{ride.price}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PassengerDashboard;
