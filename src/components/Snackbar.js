import React, { useEffect } from 'react';

// Snackbar.js

const Snackbar = ({ message, type, onClose }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [message, onClose]);

    if (!message) return null;

    let bgColor;
    switch (type) {
        case 'success':
            bgColor = 'bg-green-500';
            break;
        case 'error':
            bgColor = 'bg-red-500';
            break;
        default:
            bgColor = 'bg-gray-700';
    }

    return (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg text-white ${bgColor}`}>
            <div className="flex items-center">
                <span className="flex-grow">{message}</span>
                <button onClick={onClose} className="ml-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Snackbar;
