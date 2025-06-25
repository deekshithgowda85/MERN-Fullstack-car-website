import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        if (location.state && location.state.orderId) {
            setOrderId(location.state.orderId);
        } else {
            console.warn('No order ID found in navigation state.');
            // Optionally navigate away if no orderId is found
            // navigate('/home');
        }
    }, [location.state, navigate]);

    const handleBackToHome = () => {
        navigate('/home');
    };

    return (
        <div className="min-h-screen bg-[#1e1e20]">
            <Navbar />
            <div className="max-w-md mx-auto px-4 py-8 flex items-center justify-center h-[calc(100vh-80px)]">
                <div className="bg-gray-800 p-8 rounded-xl shadow-xl text-white text-center w-full">
                    <h1 className="text-3xl font-bold text-green-500 mb-4">Order Placed Successfully!</h1>
                    {orderId && (
                        <p className="text-gray-400 mb-6">Your Order ID is: <span className="font-semibold text-white">{orderId}</span></p>
                    )}
                    <p className="text-gray-400 mb-8">Thank you for your purchase.</p>
                    <button
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                        onClick={handleBackToHome}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage; 