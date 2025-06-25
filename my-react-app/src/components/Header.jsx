import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import iconCart from '../assets/images/iconCart.png'
import { useSelector, useDispatch } from 'react-redux'
import { toggleStatusTab } from '../stores/Cart'
import { setSearchQuery } from '../stores/Search'

const Header = () => {
    const [totalQuantity, setTotalQuantity] = useState(0);
    const carts = useSelector(store => store.cart.items);
    const dispatch = useDispatch();
    const searchQuery = useSelector(store => store.search.searchQuery);

    useEffect(() => {
        let total = 0;
        carts.forEach(item => total += item.quantity);
        setTotalQuantity(total);
    }, [carts])

    const handleOpenTabCart = () => {
        dispatch(toggleStatusTab());
    }

    const handleSearchInputChange = (event) => {
        dispatch(setSearchQuery(event.target.value));
    }

    return (
        <header className='flex justify-between items-center py-4 px-6'>



            <div
                className="ml-8 p-5 overflow-hidden w-[60px] h-[60px] hover:w-[270px] bg-gray-700 shadow-[2px_2px_20px_rgba(0,0,0,0.08)] rounded-full flex group items-center hover:duration-300 duration-300"
            >
                <div className="flex items-center justify-center fill-white">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="Isolation_Mode"
                        data-name="Isolation Mode"
                        viewBox="0 0 24 24"
                        width="22"
                        height="22">
                        <path d="M18.9,16.776A10.539,10.539,0,1,0,16.776,18.9l5.1,5.1L24,21.88ZM10.5,18A7.5,7.5,0,1,1,18,10.5,7.507,7.507,0,0,1,10.5,18Z" ></path>
                    </svg>
                </div>
                <input
                    type="text"
                    className="outline-none text-[20px] bg-transparent w-full text-white font-normal px-4"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                />
            </div>

            {/* Cart Icon on Right */}
            <div className='w-10 h-10 bg-gray-100 rounded-full flex justify-center items-center relative cursor-pointer ml-auto' onClick={handleOpenTabCart}>
                <img src={iconCart} alt="Cart" className='w-6' />
                {totalQuantity > 0 && (
                    <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex justify-center items-center'>
                        {totalQuantity}
                    </span>
                )}
            </div>
        </header>
    )
}

export default Header