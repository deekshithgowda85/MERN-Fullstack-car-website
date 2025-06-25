import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../stores/Cart';
import { apiService } from '../services/api';
// import PlaceholderServiceImage from '../assets/images/placeholder-service.png'; // Assuming a placeholder image for services

const CartItem = ({ data, isReadOnly }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const dispatch = useDispatch();

    // Determine if the item is a service or a car (no quantity for these) or if it's read-only
    const isServiceOrCar = data.source === 'memberships' || data.source === 'cars';
    const shouldHideControls = isReadOnly || isServiceOrCar; // Hide controls if readOnly or service/car

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                let response;
                if (data.source === 'cars') {
                    response = await apiService.getCar(data.productId);
                } else if (data.source === 'accessories') {
                    response = await apiService.getAccessory(data.productId);
                } else if (data.source === 'memberships') {
                    response = await apiService.getService(data.productId);
                } else {
                    throw new Error('Unknown item source: ' + data.source);
                }

                if (response && response.data) {
                    setProduct(response.data);
                    setFetchError(null);
                } else {
                    setFetchError('Product details not found');
                    setProduct(null);
                }

            } catch (err) {
                setFetchError('Failed to fetch product details');
                console.error('Error fetching product:', err);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [data.productId, data.source]);

    const handleQuantityChange = (newQuantity) => {
        if (!shouldHideControls && newQuantity >= 1) { // Only allow change if not readOnly and not service/car
            dispatch(updateQuantity({ productId: data.productId, quantity: newQuantity, source: data.source }));
        }
    };

    const handleRemove = () => {
        if (!isReadOnly) { // Only allow removal if not readOnly
            dispatch(removeFromCart({ productId: data.productId, source: data.source }));
        }
    };

    // Determine if it's a premium service for conditional styling
    const isPremiumService = data.source === 'memberships' && product && (product.name === 'Premium Access' || product.name === 'Ultimate Care' || product.name === 'Elite Club');

    if (loading) {
        return (
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg mb-4">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (fetchError || !product) {
        return (
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg mb-4">
                <div className="text-yellow-500">Could not load item details. {<button onClick={handleRemove} className="text-red-500 hover:underline">Remove</button>}</div>
            </div>
        );
    }

    // Construct the full image URL
    const imageUrl = product.image ? (product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`) : null;

    // Use conditional class for background color
    return (
        <div className={`flex items-center justify-between p-4 rounded-lg mb-4 ${isPremiumService ? 'bg-purple-800' : 'bg-gray-800'}`}>
            <div className="flex items-center space-x-4">
                {/* Conditional rendering for image or placeholder */}
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-md"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'; // Smaller placeholder
                        }}
                    />
                ) : shouldHideControls ? ( // Don't render image area for services/cars in read-only mode
                    null
                ) : (
                    // Fallback for accessories without images if needed
                    <div className="w-20 h-20 flex items-center justify-center bg-gray-700 rounded-md text-gray-400 text-sm text-center">No Image</div>
                )}
                <div>
                    <h3 className="text-white font-semibold">{product.name}</h3>
                    {/* Display quantity if not read-only or if it's an accessory */}
                    {!shouldHideControls || data.product_source === 'accessories' ? (
                        <p className="text-gray-400">Quantity: {data.quantity}</p>
                    ) : (
                        null
                    )}
                    <p className="text-gray-400">${product.price}</p>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                {/* Conditional rendering for quantity controls and remove button */}
                {!isReadOnly ? (
                    <div className="flex items-center space-x-4">
                        {!isServiceOrCar && (
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleQuantityChange(data.quantity - 1)}
                                    className="bg-gray-700 text-white px-2 py-1 rounded"
                                >
                                    -
                                </button>
                                <span className="text-white">{data.quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(data.quantity + 1)}
                                    className="bg-gray-700 text-white px-2 py-1 rounded"
                                >
                                    +
                                </button>
                            </div>
                        )}
                        <button
                            onClick={handleRemove}
                            className="text-red-500 hover:text-red-600"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    // Display quantity and total price if in read-only mode (for orders)
                    <div className="text-gray-400 text-right">
                        {data.product_source === 'accessories' ? (
                            <p>Qty: {data.quantity}</p>
                        ) : null}
                        {/* Assuming item.price from backend is available for total calculation */}
                        {/* <p className="text-white font-semibold">${(product.price * data.quantity).toFixed(2)}</p> */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartItem;