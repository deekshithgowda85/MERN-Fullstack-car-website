import React, { useState, useEffect } from 'react';
import { car_memberships } from '../membership.jsx';
import MembershipItem from '../components/MembershipItem';
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, toggleStatusTab } from '../stores/Cart.jsx';
import iconCart from '../assets/images/iconCart.png';
import CartTab from '../components/CartTab';

const ServicesPage = () => {
    const dispatch = useDispatch();
    const [totalQuantity, setTotalQuantity] = useState(0);
    const carts = useSelector(store => store.cart.items);

    useEffect(() => {
        let total = 0;
        carts.forEach(item => total += item.quantity);
        setTotalQuantity(total);
    }, [carts]);

    const handleBuy = (membership) => {
        dispatch(addToCart({
            productId: membership.id,
            quantity: 1,
            source: 'memberships'
        }));
        alert(`${membership.name} added to cart!`);
    };

    const handleOpenTabCart = () => {
        dispatch(toggleStatusTab());
    };

    return (
        <div className='min-h-screen' style={{ backgroundColor: '#1e1e20' }}>
            <Navbar />
            <div className='flex justify-between items-center px-8 py-5'>
                <h1 className='text-3xl text-white'>Our Services</h1>
                <div className='w-12 h-12 bg-white rounded-full flex justify-center items-center relative cursor-pointer shadow-lg hover:bg-gray-100 transition-colors z-50' onClick={handleOpenTabCart}>
                    <img src={iconCart} alt="Cart" className='w-7' />
                    {totalQuantity > 0 && (
                        <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex justify-center items-center font-bold'>
                            {totalQuantity}
                        </span>
                    )}
                </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8 max-w-6xl mx-auto'>
                {car_memberships.map((membership) => (
                    <MembershipItem key={membership.id} membership={membership} onBuy={handleBuy} />
                ))}
            </div>
            <CartTab />
        </div>
    );
};

export default ServicesPage;