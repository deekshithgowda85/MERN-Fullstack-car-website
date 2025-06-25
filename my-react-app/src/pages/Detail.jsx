import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { addToCart } from '../stores/Cart';
import Navbar from '../components/Navbar';
import { apiService } from '../services/api';

const Detail = () => {
    const { id } = useParams();
    const [detail, setDetail] = useState(null);
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAccessory = async () => {
            try {
                setLoading(true);
                const response = await apiService.getAccessory(id);
                setDetail(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch accessory details');
                console.error('Error fetching accessory:', err);
                navigate('/accessories');
            } finally {
                setLoading(false);
            }
        };

        fetchAccessory();
    }, [id, navigate]);

    const handleMinusQuantity = () => {
        setQuantity(prevQuantity => Math.max(1, prevQuantity - 1));
    }

    const handlePlusQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    }

    const handleAddToCart = () => {
        if (detail) {
            dispatch(addToCart({
                productId: detail.id,
                quantity: quantity,
                source: 'accessories'
            }));
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1e1e20] text-white flex justify-center items-center">
                Loading...
            </div>
        );
    }

    if (error || !detail) {
        return (
            <div className="min-h-screen bg-[#1e1e20] text-white flex justify-center items-center">
                {error || 'Accessory not found'}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1e1e20] text-white">
            <Navbar />
            <div className="w-full max-w-[1200px] mx-auto px-4 py-4">
                <button
                    onClick={() => navigate('/accessories')}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors mb-6"
                >
                    &larr; Back to Accessories
                </button>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-5'>
                    <div>
                        <img
                            src={
                                detail.image?.startsWith('http')
                                    ? detail.image
                                    : `http://localhost:5000${detail.image}`
                            }
                            alt={detail.name}
                            className='w-full h-auto object-contain'
                        />
                    </div>
                    <div className='flex flex-col gap-5'>
                        <h2 className='text-xl text-gray-300'>PRODUCT DETAIL</h2>
                        <h1 className='text-4xl uppercase font-bold'>{detail.name}</h1>
                        <p className='font-bold text-3xl text-blue-600'>
                            ${detail.price}
                        </p>
                        <div className='flex gap-4 items-center mt-4'>
                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={handleMinusQuantity}
                                    className='bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded'
                                >
                                    -
                                </button>
                                <span className='text-xl'>{quantity}</span>
                                <button
                                    onClick={handlePlusQuantity}
                                    className='bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded'
                                >
                                    +
                                </button>
                            </div>
                            <button
                                className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md shadow-lg transition-colors'
                                onClick={handleAddToCart}
                            >
                                Add To Cart
                            </button>
                        </div>
                        <p className="mt-4 text-gray-300">
                            {detail.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Detail;