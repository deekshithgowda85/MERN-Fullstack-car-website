import React from 'react';
import Navbar from '../components/Navbar';

const PaymentDetails = () => {
    // We might need to fetch order details or total amount here
    // In a real app, this would likely come from the previous step or a state management solution

    const handlePaymentSubmission = (e) => {
        e.preventDefault();
        // Handle payment processing logic here
        console.log('Processing payment...');
        // After successful payment, you would navigate to an order confirmation page
    };

    return (
        <div className="min-h-screen bg-[#1e1e20]">
            <Navbar />
            <div className="container mx-auto p-4 max-w-lg">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">Payment Details</h1>

                <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-white">
                    <h2 className="text-2xl font-bold mb-6 text-center">Enter Payment Information</h2>

                    <form onSubmit={handlePaymentSubmission} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="email@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300">Card information</label>
                            <input
                                type="text"
                                id="cardNumber"
                                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="1234 1234 1234 1234"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-300">MM / YY</label>
                                <input
                                    type="text"
                                    id="expiryDate"
                                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="MM / YY"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="cvc" className="block text-sm font-medium text-gray-300">CVC</label>
                                <input
                                    type="text"
                                    id="cvc"
                                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="CVC"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="cardName" className="block text-sm font-medium text-gray-300">Cardholder name</label>
                            <input
                                type="text"
                                id="cardName"
                                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Full name on card"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-300">Country or region</label>
                            <select
                                id="country"
                                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select Country</option>
                                <option value="India">India</option>
                                {/* Add more country options here */}
                            </select>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors mt-6">Pay Now</button>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default PaymentDetails; 