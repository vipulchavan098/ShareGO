import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const DriverDashboard = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        // Fetch driver rides
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rides:', err);
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Driver Dashboard</h1>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">Ride ID</th>
                    <th className="px-6 py-3 text-left">Passenger</th>
                    <th className="px-6 py-3 text-left">From</th>
                    <th className="px-6 py-3 text-left">To</th>
                    <th className="px-6 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rides.map((ride) => (
                    <tr key={ride.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-3">{ride.id}</td>
                      <td className="px-6 py-3">{ride.passenger}</td>
                      <td className="px-6 py-3">{ride.from}</td>
                      <td className="px-6 py-3">{ride.to}</td>
                      <td className="px-6 py-3">{ride.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DriverDashboard;
