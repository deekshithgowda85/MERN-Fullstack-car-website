import React from 'react'
import { Link } from 'react-router-dom';
import iconCart from '../assets/images/iconCart.png'
import { useDispatch } from 'react-redux';
import { addToCart } from '../stores/Cart';

const ProductCart = (props) => {
    const { id, name, price, image } = props.data;
    const { basePath, source } = props;
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(addToCart({
            productId: id,
            quantity: 1,
            source: source
        }));
    }

    // Construct the full image URL
    const imageUrl = image.startsWith('http') ? image : `http://localhost:5000${image}`;

    return (
        <div className='bg-gray-800 p-5 rounded-xl shadow-sm'>
            <Link to={`${basePath}/${id}`}>
                <img
                    src={imageUrl}
                    alt={name}
                    className='w-full h-80 object-cover object-top drop-shadow-[0_80px_30px_#0007]'
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                />
            </Link>
            <h3 className='text-xl py-3 text-center font-semibold text-white'>{name}</h3>
            <div className='flex justify-between items-center'>
                <p className='text-gray-300'>
                    $<span className='text-xl font-semibold text-white'>{price}</span>
                </p>
                <button
                    className='bg-blue-600 p-2 rounded-md text-sm hover:bg-blue-700 transition-colors text-white flex gap-2 items-center'
                    onClick={handleAddToCart}
                >
                    <img src={iconCart} alt="cart" className='w-5' />
                    Add To Cart
                </button>
            </div>
        </div>
    )
}

export default ProductCart;