import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CartItem from '../components/CartItem';
import { apiService } from '../services/api';

const CartSummary = () => {
    const carts = useSelector(store => store.cart.items);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deliveryInfo, setDeliveryInfo] = useState({
        name: '',
        address: '',
        city: '',
        country: '',
        phone: ''
    });

    // Check if all delivery fields are filled
    const isDeliveryInfoComplete = () => {
        return Object.values(deliveryInfo).every(value => value.trim() !== '');
    };

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

    const handleDeliveryInputChange = (e) => {
        const { name, value } = e.target;
        setDeliveryInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleProceedToCheckout = () => {
        if (isDeliveryInfoComplete()) {
            navigate('/order-summary', { state: { deliveryInfo, carts } });
        }
    };

    // Calculate totals
    const subtotal = products.reduce((total, product) => total + (product.price * product.quantity), 0);
    const deliveryFee = subtotal > 0 ? 5 : 0;
    const total = subtotal + deliveryFee;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1e1e20]">
                <Navbar />
                <div className="max-w-7xl mx-auto p-6">
                    <div className="text-white text-center">Loading cart...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#1e1e20]">
                <Navbar />
                <div className="max-w-7xl mx-auto p-6">
                    <div className="text-red-500 text-center">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1e1e20]">
            <Navbar />
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">Shopping Cart Summary</h1>

                {/* Two columns on top: Cart Items and Delivery Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Cart Items Section */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
                        <h2 className="text-2xl font-bold mb-6">Items</h2>
                        <div className="space-y-6">
                            {carts.length > 0 ? (
                                carts.map((item, key) => (
                                    <CartItem key={key} data={item} />
                                ))
                            ) : (
                                <p className="text-gray-300">Your cart is empty.</p>
                            )}
                        </div>
                    </div>

                    {/* Delivery Information Section */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
                        <h2 className="text-2xl font-bold mb-6">Delivery Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="delivery-name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                <input
                                    type="text"
                                    id="delivery-name"
                                    name="name"
                                    value={deliveryInfo.name}
                                    onChange={handleDeliveryInputChange}
                                    className="w-full border border-gray-600 rounded-lg shadow-sm p-2.5 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="delivery-address" className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                                <input
                                    type="text"
                                    id="delivery-address"
                                    name="address"
                                    value={deliveryInfo.address}
                                    onChange={handleDeliveryInputChange}
                                    className="w-full border border-gray-600 rounded-lg shadow-sm p-2.5 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your address"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="delivery-city" className="block text-sm font-medium text-gray-300 mb-1">City</label>
                                <input
                                    type="text"
                                    id="delivery-city"
                                    name="city"
                                    value={deliveryInfo.city}
                                    onChange={handleDeliveryInputChange}
                                    className="w-full border border-gray-600 rounded-lg shadow-sm p-2.5 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your city"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="delivery-country" className="block text-sm font-medium text-gray-300 mb-1">Country</label>
                                <input
                                    type="text"
                                    id="delivery-country"
                                    name="country"
                                    value={deliveryInfo.country}
                                    onChange={handleDeliveryInputChange}
                                    className="w-full border border-gray-600 rounded-lg shadow-sm p-2.5 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your country"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="delivery-phone" className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                                <input
                                    type="text"
                                    id="delivery-phone"
                                    name="phone"
                                    value={deliveryInfo.phone}
                                    onChange={handleDeliveryInputChange}
                                    className="w-full border border-gray-600 rounded-lg shadow-sm p-2.5 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your phone number"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom section: Order Summary */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white mt-6">
                    <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between text-gray-300">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Delivery Fee</span>
                            <span>${deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-700 pt-4 mt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold text-white">Total</span>
                                <span className="text-xl font-bold text-white">${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-colors mt-6
                                ${isDeliveryInfoComplete() && carts.length > 0
                                    ? 'bg-amber-600 hover:bg-amber-700'
                                    : 'bg-gray-600 cursor-not-allowed'}`}
                            onClick={handleProceedToCheckout}
                            disabled={!isDeliveryInfoComplete() || carts.length === 0}
                        >
                            {!isDeliveryInfoComplete()
                                ? 'Please fill in all delivery details'
                                : 'Proceed to Checkout'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSummary; 