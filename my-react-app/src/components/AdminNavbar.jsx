import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
    return (
        <nav className="bg-gray-900 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <span className="text-xl font-bold">Admin Panel</span>
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/admin" className="hover:text-gray-300">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/admin/products" className="hover:text-gray-300">Products</Link>
                    </li>
                    <li>
                        <Link to="/admin/users" className="hover:text-gray-300">Users</Link>
                    </li>
                    {/* Add a link back to the main site if needed */}
                    <li>
                        <Link to="/home" className="hover:text-gray-300">View Site</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default AdminNavbar; 