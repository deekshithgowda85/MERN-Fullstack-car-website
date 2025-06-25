import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import CartTab from './CartTab'
import { useSelector } from 'react-redux'
import Navbar from './Navbar'

const Layout = () => {
  const statusTabCart = useSelector(store => store.cart.statusTab);
  return (
    <div className='min-h-screen'>
      <div>
        <Navbar />
        <Header />
        <main className={`transform transition-transform duration-500
        ${statusTabCart === false ? "" : "-translate-x-56"}`} style={{ backgroundColor: '#1e1e20' }}>
          <Outlet />
        </main>
      </div>
      <CartTab />
    </div>
  )
}

export default Layout