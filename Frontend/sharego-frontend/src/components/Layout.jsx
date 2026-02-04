import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow bg-gray-50">
                <Outlet />
            </main>
            <footer className="bg-gray-800 text-white py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm text-gray-400">© {new Date().getFullYear()} ShareGo. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
