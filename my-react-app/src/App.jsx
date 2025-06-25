import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Splashscreen from './pages/Splashscreen';
import Homescene from './pages/Homescene';
import Carpage from './pages/Carpage';
import './App.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Detail from './pages/Detail';
import ProfilePage from './pages/ProfilePage';
import Cardetail from './pages/Cardetail';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProductManagement from './pages/Admin/ProductManagement';
import UserManagement from './pages/Admin/UserManagement';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ServicesPage from './pages/ServicesPage';
import Checkout from './pages/Checkout';
import CartSummary from './pages/CartSummary';
import OrderSummaryConfirm from './pages/OrderSummaryConfirm';
import PaymentDetails from './pages/PaymentDetails';
import OrderSuccessPage from './pages/OrderSuccessPage';

function SplashOrLogin() {
  const [showSplash, setShowSplash] = useState(() => {
    // Get the splash count from sessionStorage, default to 0
    const count = parseInt(sessionStorage.getItem('splashCount') || '0', 10);
    return count < 3;
  });

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        // Increment splash count in sessionStorage
        const count = parseInt(sessionStorage.getItem('splashCount') || '0', 10) + 1;
        sessionStorage.setItem('splashCount', count.toString());
        setShowSplash(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  if (showSplash) {
    return <Splashscreen />;
  }
  return <Login />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<SplashOrLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Homescene />} />
          <Route path="/car" element={<Carpage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/accessories/:id" element={<Detail />} />
          <Route path="/car/:id" element={<Cardetail />} />
          <Route element={<Layout />}>
            <Route path='/accessories' element={<Home />} />
          </Route>
          <Route path="/cart" element={<CartSummary />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-summary" element={<OrderSummaryConfirm />} />
          <Route path="/payment-details" element={<PaymentDetails />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
        </Route>
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;