import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/Appcontext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import CartItem from '../components/CartItem';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

function ProfilePage() {
    const { user } = useAppContext();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const carts = useSelector(store => store.cart.items);

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [ordersError, setOrdersError] = useState(null);
    const [expandedOrders, setExpandedOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) {
                setLoadingOrders(false);
                setOrders([]);
                return;
            }
            try {
                setLoadingOrders(true);
                const response = await apiService.getOrders();
                console.log('Orders fetched:', response.data);
                setOrders(response.data);
                setOrdersError(null);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setOrdersError('Failed to fetch orders.');
                setOrders([]);
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchOrders();
    }, [user]);

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrders(prevExpandedOrders => {
            if (prevExpandedOrders.includes(orderId)) {
                return prevExpandedOrders.filter(id => id !== orderId);
            } else {
                return [...prevExpandedOrders, orderId];
            }
        });
    };

    const renderProfileDetails = () => (
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl h-full flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-4">Profile Details</h2>
            {user ? (
                <div className="text-gray-400 space-y-4 flex-grow">
                    <div className="flex justify-between items-start">
                        <span className="font-semibold pr-2 min-w-[100px]">Username:</span>
                        <span className="text-white font-medium text-right break-words flex-1">{user.name || user.username || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-start">
                        <span className="font-semibold pr-2 min-w-[100px]">Email:</span>
                        <span className="text-white font-medium text-right break-words flex-1">{user.email || 'N/A'}</span>
                    </div>
                </div>
            ) : (
                <p className="text-gray-400 text-center flex-grow flex items-center justify-center">Please log in to see profile details.</p>
            )}
        </div>
    );

    const renderOrders = () => (
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-4">My Orders</h2>
            {loadingOrders ? (
                <div className="text-gray-400 text-center py-8">Loading orders...</div>
            ) : ordersError ? (
                <div className="text-red-400 text-center py-8">{ordersError}</div>
            ) : orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map(order => {
                        const isExpanded = expandedOrders.includes(order.id);

                        return (
                            <div key={order.id} className="bg-gray-700 p-4 rounded-lg shadow space-y-4 border border-gray-600">
                                <div className="flex justify-between items-center border-b border-gray-600 pb-3 cursor-pointer" onClick={() => toggleOrderExpansion(order.id)}>
                                    <h3 className="text-xl font-semibold text-white">Order ID: {order.id}</h3>
                                    {isExpanded ? (
                                        <FaChevronDown className="text-gray-400" />
                                    ) : (
                                        <FaChevronRight className="text-gray-400" />
                                    )}
                                </div>
                                {isExpanded && (
                                    <div className="space-y-3">
                                        {order.items && order.items.length > 0 ? (
                                            order.items.map((item, itemIndex) => (
                                                <CartItem
                                                    key={itemIndex}
                                                    data={{
                                                        id: item.productId,
                                                        name: item.productName,
                                                        price: item.price,
                                                        quantity: item.quantity,
                                                        source: item.productSource,
                                                        productId: item.productId
                                                    }}
                                                    isReadOnly={true}
                                                />
                                            ))
                                        ) : (
                                            <p className="text-gray-400 text-center">No items in this order.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-gray-400 text-center py-8">You have no previous orders.</p>
            )}
        </div>
    );

    const renderCart = () => (
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl h-full flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-4">My Cart</h2>
            <div className="space-y-4 flex-grow">
                {carts.length > 0 ? (
                    carts.map((item, key) => (
                        <CartItem key={key} data={item} />
                    ))
                ) : (
                    <p className="text-gray-400 text-center flex-grow flex items-center justify-center">Your cart is empty.</p>
                )}
            </div>
            {carts.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-700">
                    <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-colors" onClick={() => navigate('/cart')} disabled={carts.length === 0}>
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
    );

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#1e1e20] text-white">
            <Navbar />
            <div className="w-full max-w-[1200px] mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">User Profile</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 flex flex-col">
                        {renderProfileDetails()}
                    </div>
                    <div className="md:col-span-2 flex flex-col">
                        {renderCart()}
                    </div>
                </div>

                <div className="mt-8">
                    {renderOrders()}
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage; 