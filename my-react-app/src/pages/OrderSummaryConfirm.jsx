import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CartItem from '../components/CartItem';
import { apiService } from '../services/api';
import { removeFromCart, clearCart } from '../stores/Cart';

// Ensure the Razorpay checkout script is included in your index.html file:
// <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

const OrderSummaryConfirm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { deliveryInfo, carts: initialCarts } = location.state || {};
    const dispatch = useDispatch();

    const [carts, setCarts] = useState(initialCarts || []);
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
            if (!location.state) {
                navigate('/cart');
            }
            setProducts([]);
            setLoading(false);
        }
    }, [carts, location.state, navigate]);

    const subtotal = products.reduce((total, product) => total + (product.price * product.quantity), 0);
    const deliveryFee = subtotal > 0 ? 5 : 0;
    const total = subtotal + deliveryFee;

    const handleProceedToPayment = async () => {
        if (carts.length === 0) return;

        try {
            // Create order in backend
            const orderResponse = await apiService.createOrder({
                deliveryInfo: deliveryInfo,
                carts: carts,
            });

            const { orderId } = orderResponse;

            // Show payment gateway
            const paymentWindow = window.open('', 'Payment Gateway', 'width=500,height=700');
            paymentWindow.document.write(`
                <html>
                    <head>
                        <title>Secure Payment</title>
                        <link href="https://fonts.googleapis.com/css2?family=Lexend+Deca&display=swap" rel="stylesheet">
                        <style>
                            * {
                                margin: 0;
                                padding: 0;
                                box-sizing: border-box;
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                            }
                            body {
                                background: #f7fafc;
                                color: #1a202c;
                                line-height: 1.5;
                            }
                            .payment-container {
                                max-width: 500px;
                                margin: 0 auto;
                                padding: 20px;
                            }
                            .header {
                                background: #fff;
                                padding: 20px;
                                border-bottom: 1px solid #e2e8f0;
                                text-align: center;
                            }
                            .header h2 {
                                color: #2d3748;
                                font-size: 24px;
                                margin-bottom: 8px;
                            }
                            .header p {
                                color: #718096;
                                font-size: 14px;
                            }
                            .payment-form {
                                background: #fff;
                                padding: 24px;
                                border-radius: 8px;
                                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                                margin-top: 20px;
                                display: none;
                            }
                            .amount-display {
                                text-align: center;
                                padding: 20px;
                                background: #f8fafc;
                                border-radius: 8px;
                                margin-bottom: 24px;
                            }
                            .amount-display .label {
                                color: #718096;
                                font-size: 14px;
                                margin-bottom: 4px;
                            }
                            .amount-display .value {
                                color: #2d3748;
                                font-size: 32px;
                                font-weight: 600;
                            }
                            .form-group {
                                margin-bottom: 20px;
                            }
                            .form-group label {
                                display: block;
                                color: #4a5568;
                                font-size: 14px;
                                margin-bottom: 8px;
                                font-weight: 500;
                            }
                            .form-control {
                                width: 100%;
                                padding: 12px;
                                border: 1px solid #e2e8f0;
                                border-radius: 6px;
                                font-size: 16px;
                                transition: border-color 0.2s;
                                background: #f8fafc;
                            }
                            .form-control:focus {
                                outline: none;
                                border-color: #4299e1;
                                box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
                            }
                            .card-row {
                                display: flex;
                                gap: 12px;
                            }
                            .card-row .form-group {
                                flex: 1;
                            }
                            .pay-button {
                                width: 100%;
                                padding: 14px;
                                background: #4299e1;
                                color: white;
                                border: none;
                                border-radius: 6px;
                                font-size: 16px;
                                font-weight: 600;
                                cursor: pointer;
                                transition: background-color 0.2s;
                            }
                            .pay-button:hover {
                                background: #3182ce;
                            }
                            .secure-badge {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 8px;
                                margin-top: 16px;
                                color: #718096;
                                font-size: 14px;
                            }
                            .secure-badge svg {
                                width: 16px;
                                height: 16px;
                            }

                            /* Animation Styles */
                            .container {
                                background-color: #1e1e2f;
                                display: flex;
                                width: 460px;
                                height: 120px;
                                position: relative;
                                border-radius: 6px;
                                transition: 0.3s ease-in-out;
                                margin: 20px auto;
                                animation: container-animation 6s infinite;
                            }

                            @keyframes container-animation {
                                0% { transform: scale(1); width: 460px; }
                                25% { transform: scale(1.03); width: 220px; }
                                50% { transform: scale(1.03); width: 220px; }
                                75% { transform: scale(1); width: 460px; }
                                100% { transform: scale(1); width: 460px; }
                            }

                            .container:hover {
                                animation-play-state: paused;
                            }

                            .left-side {
                                background-color: #3b82f6;
                                width: 130px;
                                height: 120px;
                                border-radius: 4px;
                                position: relative;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                cursor: pointer;
                                transition: 0.3s;
                                flex-shrink: 0;
                                overflow: hidden;
                            }

                            .container:hover .left-side {
                                width: 100%;
                            }

                            .right-side {
                                width: calc(100% - 130px);
                                display: flex;
                                align-items: center;
                                overflow: hidden;
                                cursor: pointer;
                                justify-content: space-between;
                                white-space: nowrap;
                                transition: 0.3s;
                            }

                            .right-side:hover {
                                background-color: #2a2a3d;
                            }

                            .arrow {
                                width: 20px;
                                height: 20px;
                                margin-right: 20px;
                            }

                            .new {
                                font-size: 23px;
                                font-family: "Lexend Deca", sans-serif;
                                margin-left: 20px;
                                color: #d1d5db;
                            }

                            .card {
                                width: 70px;
                                height: 46px;
                                background-color: #93c5fd;
                                border-radius: 6px;
                                position: absolute;
                                display: flex;
                                z-index: 10;
                                flex-direction: column;
                                align-items: center;
                                box-shadow: 9px 9px 9px -2px rgba(59, 130, 246, 0.5);
                                animation: slide-top 6s infinite;
                            }

                            .card-line {
                                width: 65px;
                                height: 13px;
                                background-color: #60a5fa;
                                border-radius: 2px;
                                margin-top: 7px;
                            }

                            .buttons {
                                width: 8px;
                                height: 8px;
                                background-color: #1e40af;
                                box-shadow: 0 -10px 0 0 #1e3a8a, 0 10px 0 0 #3b82f6;
                                border-radius: 50%;
                                margin-top: 5px;
                                transform: rotate(90deg);
                                margin: 10px 0 0 -30px;
                            }

                            .post {
                                width: 63px;
                                height: 75px;
                                background-color: #4b5563;
                                position: absolute;
                                z-index: 11;
                                bottom: 10px;
                                top: 120px;
                                border-radius: 6px;
                                overflow: hidden;
                                animation: slide-post 6s infinite;
                            }

                            .post-line {
                                width: 47px;
                                height: 9px;
                                background-color: #1f2937;
                                position: absolute;
                                border-radius: 0px 0px 3px 3px;
                                right: 8px;
                                top: 8px;
                            }

                            .post-line:before {
                                content: "";
                                position: absolute;
                                width: 47px;
                                height: 9px;
                                background-color: #374151;
                                top: -8px;
                            }

                            .screen {
                                width: 47px;
                                height: 23px;
                                background-color: #e5e7eb;
                                position: absolute;
                                top: 22px;
                                right: 8px;
                                border-radius: 3px;
                            }

                            .numbers {
                                width: 12px;
                                height: 12px;
                                background-color: #6b7280;
                                box-shadow: 0 -18px 0 0 #6b7280, 0 18px 0 0 #6b7280;
                                border-radius: 2px;
                                position: absolute;
                                transform: rotate(90deg);
                                left: 25px;
                                top: 52px;
                            }

                            .numbers-line2 {
                                width: 12px;
                                height: 12px;
                                background-color: #9ca3af;
                                box-shadow: 0 -18px 0 0 #9ca3af, 0 18px 0 0 #9ca3af;
                                border-radius: 2px;
                                position: absolute;
                                transform: rotate(90deg);
                                left: 25px;
                                top: 68px;
                            }

                            .dollar {
                                position: absolute;
                                font-size: 16px;
                                font-family: "Lexend Deca", sans-serif;
                                width: 100%;
                                left: 0;
                                top: 0;
                                color: #93c5fd;
                                text-align: center;
                                animation: fade-in-fwd 6s infinite;
                            }

                            @keyframes slide-top {
                                0% { transform: translateY(0) rotate(0deg); }
                                20% { transform: translateY(-70px) rotate(90deg); }
                                40% { transform: translateY(-70px) rotate(90deg); }
                                60% { transform: translateY(-8px) rotate(90deg); }
                                80% { transform: translateY(-8px) rotate(90deg); }
                                100% { transform: translateY(0) rotate(0deg); }
                            }

                            @keyframes slide-post {
                                0% { transform: translateY(0); }
                                20% { transform: translateY(-70px); }
                                40% { transform: translateY(-70px); }
                                60% { transform: translateY(-70px); }
                                80% { transform: translateY(0); }
                                100% { transform: translateY(0); }
                            }

                            @keyframes fade-in-fwd {
                                0% {
                                    opacity: 0;
                                    transform: translateY(-5px);
                                }
                                20% {
                                    opacity: 1;
                                    transform: translateY(0);
                                }
                                40% {
                                    opacity: 1;
                                    transform: translateY(0);
                                }
                                60% {
                                    opacity: 1;
                                    transform: translateY(0);
                                }
                                80% {
                                    opacity: 0;
                                    transform: translateY(-5px);
                                }
                                100% {
                                    opacity: 0;
                                    transform: translateY(-5px);
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="payment-container">
                            <div class="header">
                                <h2>Secure Payment</h2>
                                <p>Order #${orderId}</p>
                            </div>
                            
                            <!-- Payment Animation -->
                            <div class="container" id="paymentAnimation">
                                <div class="left-side">
                                    <div class="card">
                                        <div class="card-line"></div>
                                        <div class="buttons"></div>
                                    </div>
                                    <div class="post">
                                        <div class="post-line"></div>
                                        <div class="screen">
                                            <div class="dollar">$</div>
                                        </div>
                                        <div class="numbers"></div>
                                        <div class="numbers-line2"></div>
                                    </div>
                                </div>
                                <div class="right-side">
                                    <div class="new">New Transaction</div>
                                    <svg class="arrow" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 451.846 451.847">
                                        <path d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z" class="active-path" fill="#a1a1ff"></path>
                                    </svg>
                                </div>
                            </div>

                            <div class="payment-form" id="paymentForm">
                                <div class="amount-display">
                                    <div class="label">Total Amount</div>
                                    <div class="value">$${total.toFixed(2)}</div>
                                </div>
                                <div class="form-group">
                                    <label>Card Number</label>
                                    <input type="text" class="form-control" value="4111 1111 1111 1111" readonly>
                                </div>
                                <div class="card-row">
                                    <div class="form-group">
                                        <label>Expiry Date</label>
                                        <input type="text" class="form-control" value="12/25" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label>CVV</label>
                                        <input type="text" class="form-control" value="123" readonly>
                                    </div>
                                </div>
                                <button class="pay-button" onclick="window.opener.postMessage('payment_success', '*'); window.close();">
                                    Pay $${total.toFixed(2)}
                                </button>
                                <div class="secure-badge">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    </svg>
                                    Secure Payment
                                </div>
                            </div>
                        </div>

                        <script>
                            // Show payment form after animation completes
                            setTimeout(() => {
                                document.getElementById('paymentForm').style.display = 'block';
                            }, 2000);
                        </script>
                    </body>
                </html>
            `);

            // Listen for payment success message
            window.addEventListener('message', function (event) {
                if (event.data === 'payment_success') {
                    // Clear cart and navigate to success page
                    dispatch(clearCart());
                    navigate('/order-success', {
                        state: {
                            orderId: orderId,
                            paymentStatus: 'success'
                        }
                    });
                }
            });

        } catch (err) {
            console.error('Error during checkout process:', err);
            setError(`Checkout failed: ${err.message || 'Unknown error'}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1e1e20]">
                <Navbar />
                <div className="flex justify-center items-center h-[calc(100vh-80px)]">
                    <div className="text-white text-xl">Loading order summary...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#1e1e20]">
                <Navbar />
                <div className="flex justify-center items-center h-[calc(100vh-80px)]">
                    <div className="text-red-500 text-xl">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1e1e20]">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-white mb-12 text-center">Order Summary</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Cart Items Section */}
                    <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-700 pb-4">
                            <h2 className="text-2xl font-bold text-white">Order Items</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {carts.length > 0 ? (
                                carts.map((item, key) => (
                                    <CartItem key={key} data={item} isReadOnly={true} />
                                ))
                            ) : (
                                <p className="text-gray-400 text-center py-4">Your cart is empty.</p>
                            )}
                        </div>
                    </div>

                    {/* Delivery Information Section */}
                    <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-700 pb-4">
                            <h2 className="text-2xl font-bold text-white">Delivery Information</h2>
                        </div>
                        <div className="p-6">
                            {deliveryInfo ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-400 font-semibold">Name</span>
                                        <span className="text-white font-medium text-right flex-1 break-words">{deliveryInfo.name}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-400 font-semibold">Address</span>
                                        <span className="text-white font-medium text-right flex-1 break-words">{deliveryInfo.address}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-400 font-semibold">City</span>
                                        <span className="text-white font-medium text-right flex-1 break-words">{deliveryInfo.city}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-400 font-semibold">Country</span>
                                        <span className="text-white font-medium text-right flex-1 break-words">{deliveryInfo.country}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-400 font-semibold">Phone</span>
                                        <span className="text-white font-medium text-right flex-1 break-words">{deliveryInfo.phone}</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400 text-center">No delivery information provided.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-700 pb-4">
                        <h2 className="text-2xl font-bold text-white">Order Summary</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
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
                                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-6 rounded-lg transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleProceedToPayment}
                                disabled={carts.length === 0}
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummaryConfirm;