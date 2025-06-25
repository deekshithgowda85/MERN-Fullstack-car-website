import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CartItem from './CartItem';
import { toggleStatusTab } from '../stores/Cart';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const CartTab = () => {
    const carts = useSelector(store => store.cart.items);
    const statusTab = useSelector(store => store.cart.statusTab);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const calculateTotal = async () => {
            let total = 0;
            for (const item of carts) {
                try {
                    let response;
                    if (item.source === 'cars') {
                        response = await apiService.getCar(item.productId);
                    } else if (item.source === 'accessories') {
                        response = await apiService.getAccessory(item.productId);
                    } else if (item.source === 'memberships') {
                        response = await apiService.getService(item.productId);
                    }

                    if (response && response.data) {
                        total += response.data.price * item.quantity;
                    }
                } catch (error) {
                    console.error('Error fetching product price:', error);
                }
            }
            setTotalPrice(total);
        };

        calculateTotal();
    }, [carts]);

    const handleCloseTabCart = () => {
        dispatch(toggleStatusTab());
    }

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-500 z-40
                ${statusTab ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={handleCloseTabCart}
            />

            {/* Cart Panel */}
            <div className={`fixed top-0 right-0 h-full w-[400px] bg-[#1e1e20] shadow-2xl 
                transform transition-transform duration-500 z-50
                ${statusTab ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className='p-6 border-b border-gray-700'>
                    <div className='flex justify-between items-center'>
                        <h2 className='text-2xl font-semibold text-white'>Shopping Cart</h2>
                        <button
                            onClick={handleCloseTabCart}
                            className='text-gray-400 hover:text-white transition-colors'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Cart Items */}
                <div className='p-6 overflow-y-auto h-[calc(100%-180px)]'>
                    {carts.length === 0 ? (
                        <div className='text-center text-gray-400 py-8'>
                            Your cart is empty
                        </div>
                    ) : (
                        carts.map((item, key) =>
                            <CartItem key={key} data={item} />
                        )
                    )}
                </div>

                {/* Footer */}
                <div className='absolute bottom-0 left-0 right-0 p-6 bg-[#1e1e20] border-t border-gray-700'>
                    <div className='flex justify-between items-center mb-4'>
                        <span className='text-gray-400'>Total:</span>
                        <span className='text-xl font-semibold text-white'>${totalPrice.toFixed(2)}</span>
                    </div>
                    <button
                        className='w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        onClick={() => navigate('/cart')}
                        disabled={carts.length === 0}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </>
    )
}

export default CartTab