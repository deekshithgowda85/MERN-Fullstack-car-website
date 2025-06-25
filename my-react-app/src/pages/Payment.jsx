import React from 'react';
import Navbar from '../components/Navbar';

const Payment = () => {
    return (
        <div className="min-h-screen bg-[#1e1e20]">
            <Navbar />
            <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left section: Order Summary (similar to the left side of Stripe page) */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
                    <h2 className="text-xl font-bold mb-3">Your Order</h2>
                    {/* Order Summary Details */}
                    <div className="space-y-3 text-gray-300">
                        {/* Individual Items (Placeholder) */}
                        <div className="flex justify-between items-center">
                            <span>Greek salad</span>
                            <span>₹24.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Peri Peri Rolls</span>
                            <span>₹36.00</span>
                        </div>
                        {/* ... more items dynamically ... */}

                        {/* Delivery Charge */}
                        <div className="flex justify-between items-center">
                            <span>Delivery Charge</span>
                            <span>₹160.00</span>
                        </div>

                        {/* Subtotal */}
                        <div className="flex justify-between items-center font-bold text-white mt-3 border-t border-gray-700 pt-3">
                            <span>Subtotal:</span>
                            <span>₹220.00</span>
                        </div>

                        {/* Gift Option (Placeholder) */}
                        <div className="mt-4">
                            <label htmlFor="giftOption" className="block text-sm font-medium text-gray-300">Gift Option:</label>
                            <input id="giftOption" type="text" placeholder="Enter gift message or code" className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>
                </div>

                {/* Right section: Payment Methods (similar to the right side of Stripe page) */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
                    <h2 className="text-xl font-bold mb-3">Pay with Card/UPI</h2>

                    {/* Card Information Section (adapted from Stripe screenshot) */}
                    <div className="space-y-3 mb-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                            <input id="email" className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" type="email" placeholder="email@example.com" />
                        </div>
                        <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300">Card information</label>
                            <input id="cardNumber" className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" type="text" placeholder="1234 1234 1234 1234" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-300">MM / YY</label>
                                <input id="expiryDate" className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" type="text" placeholder="MM / YY" />
                            </div>
                            <div>
                                <label htmlFor="cvc" className="block text-sm font-medium text-gray-300">CVC</label>
                                <input id="cvc" className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" type="text" placeholder="CVC" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="cardName" className="block text-sm font-medium text-gray-300">Cardholder name</label>
                            <input id="cardName" className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" type="text" placeholder="Full name on card" />
                        </div>
                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-300">Country or region</label>
                            <select id="country" className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="India">India</option>
                                {/* Add more country options here */}
                            </select>
                        </div>
                    </div>

                    {/* UPI and Other Options Section */}
                    <div className="space-y-3">
                        <h3 className="text-xl font-bold mb-2">Other Payment Options</h3>
                        {/* Placeholder for UPI buttons/links */}
                        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors">Pay with Google Pay</button>
                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors">Pay with PhonePe</button>
                        {/* Add more UPI or payment options as needed */}
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors mt-4">Pay</button>
                </div>
            </div>
        </div>
    );
};

export default Payment; 