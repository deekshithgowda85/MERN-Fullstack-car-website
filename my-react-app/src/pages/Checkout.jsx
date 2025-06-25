import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CartItem from '../components/CartItem';
import { apiService } from '../services/api';

const Checkout = () => {
    const navigate = useNavigate();
    const carts = useSelector(store => store.cart.items);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const productPromises = carts.map(async (item) => {
                    const response = item.source === 'cars'
                        ? await apiService.getCar(item.productId)
                        : await apiService.getAccessory(item.productId);
                    return {
                        ...response.data,
                        quantity: item.quantity
                    };
                });
                const fetchedProducts = await Promise.all(productPromises);
                setProducts(fetchedProducts);
                setError(null);
            } catch (err) {
                setError('Failed to fetch product details');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        if (carts.length > 0) {
            fetchProducts();
        } else {
            setProducts([]);
            setLoading(false);
        }
    }, [carts]);

    // Calculate totals
    const subtotal = products.reduce((total, product) => total + (product.price * product.quantity), 0);
    const deliveryFee = subtotal > 0 ? 5 : 0;
    const total = subtotal + deliveryFee;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1e1e20]">
                <Navbar />
                <div className="container mx-auto p-4">
                    <div className="text-white text-center">Loading checkout...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#1e1e20]">
                <Navbar />
                <div className="container mx-auto p-4">
                    <div className="text-red-500 text-center">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1e1e20]">
            <Navbar />
            <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
                    <h2 className="text-2xl font-bold mb-4">Delivery Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Delivery Information Form Fields */}
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">First name</label>
                            <input id="firstName" className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" type="text" />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">Last name</label>
                            <input id="lastName" className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" type="text" />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email address</label>
                            <input id="email" className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" type="email" />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-300">Address</label>
                            <input id="address" className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" type="text" />
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-300">City</label>
                            <input id="city" className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" type="text" />
                        </div>
                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-300">Country</label>
                            <input id="country" className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" type="text" />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone</label>
                            <input id="phone" className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" type="text" />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
                    <h2 className="text-2xl font-bold mb-4">Cart Totals</h2>
                    <div className="space-y-2 text-gray-300">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Fee:</span>
                            <span>${deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-white text-xl mt-4 border-t border-gray-700 pt-4">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Cart Items</h2>
                    <div className="space-y-4">
                        {carts.length > 0 ? (
                            carts.map((item, key) => (
                                <CartItem key={key} data={item} />
                            ))
                        ) : (
                            <p className="text-gray-300">Your cart is empty.</p>
                        )}
                    </div>

                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors mt-6"
                        onClick={() => navigate('/payment')}
                        disabled={carts.length === 0}
                    >
                        Proceed To Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout; 