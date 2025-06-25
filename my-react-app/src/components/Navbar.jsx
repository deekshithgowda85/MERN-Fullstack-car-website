import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/Appcontext';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user } = useAppContext();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#1e1e20] py-6">
      <div className="w-full max-w-[1200px] mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/home" className="flex items-center text-3xl font-bold hover:text-gray-400 transition-colors text-white">
            <img src="/carlogo.png" alt="Carbay Logo" className="w-16 h-16 mr-2" />
            Carbay
          </Link>
          <nav>
            <ul className="flex items-center gap-6">
              <li>
                <Link to="/home" className="text-lg text-white hover:text-blue-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/car" className="text-lg text-white hover:text-blue-300">
                  Cars
                </Link>
              </li>
              <li>
                <Link to="/accessories" className="text-lg text-white hover:text-blue-300">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-lg text-white hover:text-blue-300">
                  Services
                </Link>
              </li>
              <li>
                {!user ? (
                  <Link to="/login" className="text-lg text-white hover:text-blue-300">
                    Login
                  </Link>
                ) : (
                  <Link to="/profile" className="text-lg text-gray-300 hover:text-white transition-colors">
                    Profile
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;