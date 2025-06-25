import React, { useState, useEffect } from 'react'
import ProductCart from '../components/ProductCart'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { apiService } from '../services/api'

const Home = () => {
  const location = useLocation();
  const basePath = location.pathname.startsWith('/accessories') ? '/accessories' : '/store';
  const searchQuery = useSelector(store => store.search.searchQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = location.pathname.startsWith('/accessories')
          ? await apiService.getAccessories()
          : await apiService.getCars();
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.pathname]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className='min-h-screen' style={{ backgroundColor: '#1e1e20' }}>
        <div className='flex justify-center items-center h-screen'>
          <div className='text-white text-xl'>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen' style={{ backgroundColor: '#1e1e20' }}>
        <div className='flex justify-center items-center h-screen'>
          <div className='text-red-500 text-xl'>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen' style={{ backgroundColor: '#1e1e20' }}>
      <h1 className='text-3xl my-5 ml-8 text-white'>List Products</h1>
      <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5'>
        {filteredProducts.map((product, key) =>
          <ProductCart
            key={key}
            data={product}
            basePath={basePath}
            source={location.pathname.startsWith('/accessories') ? 'accessories' : 'cars'}
          />
        )}
      </div>
    </div>
  )
}

export default Home