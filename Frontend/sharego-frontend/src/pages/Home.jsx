import { Link } from 'react-router-dom';
import heroBg from '../assets/hero-bg.png';

const Home = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative text-white overflow-hidden" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-900 to-black opacity-75"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                            <span className="block">Travel together,</span>
                            <span className="block text-orange-200">save together.</span>
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-base text-orange-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                            ShareGo connects drivers with empty seats to passengers looking for a ride. affordable, safe, and convenient carpooling for everyone.
                        </p>
                        <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                            <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                                <Link
                                    to="/rides/search"
                                    className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-orange-700 bg-white hover:bg-gray-50 sm:px-8"
                                >
                                    Find a Ride
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-500 bg-opacity-60 hover:bg-opacity-70 sm:px-8"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base font-semibold text-orange-600 tracking-wide uppercase">Features</h2>
                        <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
                            Why choose ShareGo?
                        </p>
                    </div>

                    <div className="mt-12 text-center grid gap-8 grid-cols-1 md:grid-cols-3">
                        <div className="card hover:shadow-lg transition-shadow">
                            <div className="text-orange-600 mb-4">
                                {/* Icon placeholder */}
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Affordable Rides</h3>
                            <p className="mt-2 text-base text-gray-500">
                                Save money on your daily commute or long-distance travel by sharing the cost.
                            </p>
                        </div>

                        <div className="card hover:shadow-lg transition-shadow">
                            <div className="text-orange-600 mb-4">
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Safe & Secure</h3>
                            <p className="mt-2 text-base text-gray-500">
                                Verified drivers and passengers. Your safety is our top priority.
                            </p>
                        </div>

                        <div className="card hover:shadow-lg transition-shadow">
                            <div className="text-orange-600 mb-4">
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Eco-Friendly</h3>
                            <p className="mt-2 text-base text-gray-500">
                                Reduce your carbon footprint by carpooling. Less cars, less pollution.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
