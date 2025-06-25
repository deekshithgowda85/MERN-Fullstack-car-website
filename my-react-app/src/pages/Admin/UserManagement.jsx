import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { apiService } from '../../services/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await apiService.getUsers();
            setUsers(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch users');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await apiService.updateUserRole(userId, { role: newRole });
            setUsers(users.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ));
        } catch (err) {
            console.error('Error updating user role:', err);
            alert('Failed to update user role.');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await apiService.deleteUser(userId);
                setUsers(users.filter(user => user.id !== userId));
            } catch (err) {
                console.error('Error deleting user:', err);
                alert('Failed to delete user.');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1e1e20] text-white flex justify-center items-center">
                Loading users...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#1e1e20] text-white flex justify-center items-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1e1e20] text-white">
            <AdminNavbar />
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">User Management</h1>

                {/* Manage Users Section - Only listing existing users */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Existing Users</h2>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        {/* Existing Users List */}
                        <div className="border border-gray-700 p-4 rounded-md">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Name</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Email</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Role</th>
                                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {users.length > 0 ? (
                                            users.map(user => (
                                                <tr key={user.id}>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{user.username || user.name || 'N/A'}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                            className="rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-1"
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="text-red-400 hover:text-red-600"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-4 py-4 text-center text-sm text-gray-400">No users found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserManagement; 