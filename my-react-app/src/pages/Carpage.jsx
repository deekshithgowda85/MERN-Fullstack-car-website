import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MainBanner from '../components/MainBanner';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { apiService } from '../services/api';
import ProductCart from '../components/ProductCart';
import { useSelector, useDispatch } from 'react-redux';
import { toggleStatusTab } from '../stores/Cart';
import iconCart from '../assets/images/iconCart.png';
import { setSearchQuery } from '../stores/Search';
import CartTab from '../components/CartTab';

function Carpage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const carts = useSelector(store => store.cart.items);
  const dispatch = useDispatch();
  const searchQuery = useSelector(store => store.search.searchQuery);

  useEffect(() => {
    let total = 0;
    carts.forEach(item => total += item.quantity);
    setTotalQuantity(total);
  }, [carts]);

  const handleOpenTabCart = () => {
    console.log('Cart button clicked!');
    dispatch(toggleStatusTab());
  };

  const handleSearchInputChange = (event) => {
    dispatch(setSearchQuery(event.target.value));
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await apiService.getCars();
        setCars(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch cars');
        console.error('Error fetching cars:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1e1e20]">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1e1e20]">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1e1e20]">
      <Navbar />

      {/* Wrap banner and cart button in a flex column for correct stacking */}
      <div className="flex flex-col">
        {/* MainBanner should be full width */}
        <div className="w-full mt-[-1px]">
          <MainBanner />
        </div>

        {/* Cart Button was here */}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Full-width content with gap */}
        <div className="pb-8" id="featured-products">
          {/* Container for heading, search, and cart button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-2xl font-bold">Featured Products</h2>

            {/* Search Input */}
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
                placeholder="Search..."
              />
            </div>

            {/* Cart Button */}
            <div className='w-12 h-12 bg-white rounded-full flex justify-center items-center relative cursor-pointer shadow-lg hover:bg-gray-100 transition-colors z-50' onClick={handleOpenTabCart}>
              <img src={iconCart} alt="Cart" className='w-7' />
              {totalQuantity > 0 && (
                <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex justify-center items-center font-bold'>
                  {totalQuantity}
                </span>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5 p-8">
            {/* Filter cars based on searchQuery before mapping */}
            {cars
              .filter(car =>
                car.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((car) => (
                <ProductCart
                  key={car.id}
                  data={car}
                  basePath="/car"
                  source="cars"
                />
              ))}
          </div>
        </div>
      </div>
      {/* Render CartTab directly on Carpage */}
      <CartTab />
    </div>
  );
}

export default Carpage;