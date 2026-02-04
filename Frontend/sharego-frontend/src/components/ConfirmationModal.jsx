import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isDanger = false, isSuccess = false }) => {
    if (!isOpen) return null;

    const getIconColor = () => {
        if (isDanger) return 'bg-red-100 text-red-600';
        if (isSuccess) return 'bg-green-100 text-green-600';
        return 'bg-orange-100 text-orange-600';
    };

    const getButtonColor = () => {
        if (isDanger) return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
        if (isSuccess) return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
        return 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all scale-100 opacity-100">
                <div className="p-6 text-center">
                    <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${getIconColor().split(' ')[0]}`}>
                        {isDanger ? (
                            <svg className={`h-6 w-6 ${getIconColor().split(' ')[1]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        ) : isSuccess ? (
                            <svg className={`h-6 w-6 ${getIconColor().split(' ')[1]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className={`h-6 w-6 ${getIconColor().split(' ')[1]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>
                    <h3 className="text-lg leading-6 font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 mb-6">{message}</p>
                    <div className="flex justify-center gap-3">
                        {onClose && (
                            <button
                                type="button"
                                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="button"
                            className={`px-4 py-2 text-white rounded-lg text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${getButtonColor()}`}
                            onClick={onConfirm}
                        >
                            {isDanger ? 'Confirm' : 'OK'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
