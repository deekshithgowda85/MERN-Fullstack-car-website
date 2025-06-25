import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { apiService } from '../../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        totalSales: 0,
        pendingOrdersCount: 0,
        completedOrdersCount: 0,
        productsSoldCount: 0,
        recentOrders: [],
        revenueByType: {
            cars: 0,
            accessories: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await apiService.getDashboardData();
                console.log('Dashboard data received:', data); // Debug log
                if (data) {
                    setDashboardData(data);
                } else {
                    setError('No data received from server');
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to fetch dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Add null checks for the data
    const recentOrders = dashboardData?.recentOrders || [];
    const revenueByType = dashboardData?.revenueByType || { cars: 0, accessories: 0 };

    const revenueDoughnutData = {
        labels: ['Cars', 'Accessories'],
        datasets: [
            {
                data: [revenueByType.cars || 0, revenueByType.accessories || 0],
                backgroundColor: ['#4CAF50', '#2196F3'],
                borderColor: ['#1E1E20', '#1E1E20'],
                borderWidth: 2,
            },
        ],
    };

    const revenueDoughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#fff'
                }
            },
            title: {
                display: true,
                text: 'Revenue by Product Type',
                color: '#fff'
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        return `${label}: $${value.toFixed(2)}`;
                    }
                }
            }
        },
    };

    const handleCompleteOrder = async (orderId) => {
        try {
            setLoading(true);
            setError(null);

            console.log('Completing order:', orderId);

            // Call your API to update the order status
            const result = await apiService.updateOrderStatus(orderId, 'completed');
            console.log('Order update result:', result);

            // Refresh the dashboard data
            const data = await apiService.getDashboardData();
            console.log('Refreshed dashboard data:', data);
            setDashboardData(data);
        } catch (err) {
            console.error('Error updating order status:', err);
            setError(err.response?.data?.message || 'Failed to update order status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#1e1e20] text-white">
            <AdminNavbar />
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                {/* Sales Overview Section */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-6">Sales Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Sales Card */}
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-2">Total Sales</h3>
                            {loading ? (
                                <p className="text-gray-300 text-lg">Loading...</p>
                            ) : error ? (
                                <p className="text-red-500 text-lg">{error}</p>
                            ) : (
                                <p className="text-green-400 text-lg">$ {dashboardData.totalSales.toFixed(2)}</p>
                            )}
                        </div>
                        {/* Orders Pending Card */}
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-2">Orders Pending</h3>
                            {loading ? (
                                <p className="text-gray-300 text-lg">Loading...</p>
                            ) : error ? (
                                <p className="text-red-500 text-lg">{error}</p>
                            ) : (
                                <p className="text-yellow-400 text-lg">{dashboardData.pendingOrdersCount}</p>
                            )}
                        </div>
                        {/* Orders Completed Card */}
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-2">Orders Completed</h3>
                            {loading ? (
                                <p className="text-gray-300 text-lg">Loading...</p>
                            ) : error ? (
                                <p className="text-red-500 text-lg">{error}</p>
                            ) : (
                                <p className="text-blue-400 text-lg">{dashboardData.completedOrdersCount}</p>
                            )}
                        </div>
                        {/* Products Sold Card */}
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-2">Products Sold</h3>
                            {loading ? (
                                <p className="text-gray-300 text-lg">Loading...</p>
                            ) : error ? (
                                <p className="text-red-500 text-lg">{error}</p>
                            ) : (
                                <p className="text-purple-400 text-lg">{dashboardData.productsSoldCount}</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Revenue Distribution Chart */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-6">Revenue Distribution</h2>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-80 flex items-center justify-center">
                        <div style={{ width: '250px', height: '250px' }}>
                            <Doughnut data={revenueDoughnutData} options={revenueDoughnutOptions} />
                        </div>
                    </div>
                </section>

                {/* Recent Orders Section */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-6">Recent Orders</h2>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        {loading ? (
                            <p className="text-gray-300">Loading...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : recentOrders.length === 0 ? (
                            <p className="text-gray-300">No recent orders found</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="text-left py-3 px-4">Order ID</th>
                                            <th className="text-left py-3 px-4">Items</th>
                                            <th className="text-left py-3 px-4">Total Amount</th>
                                            <th className="text-left py-3 px-4">Status</th>
                                            <th className="text-left py-3 px-4">Date</th>
                                            <th className="text-left py-3 px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map((order) => (
                                            <tr key={order.id} className="border-b border-gray-700">
                                                <td className="py-3 px-4">#{order.id}</td>
                                                <td className="py-3 px-4">
                                                    {order.items?.map((item, index) => (
                                                        <div key={index} className="text-sm">
                                                            {item.productName || 'Unknown Product'} x {item.quantity || 0}
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="py-3 px-4">
                                                    ${parseFloat(order.totalAmount || 0).toFixed(2)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                                                        }`}>
                                                        {order.status || 'pending'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {order.status !== 'completed' && (
                                                        <button
                                                            onClick={() => handleCompleteOrder(order.id)}
                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                                                        >
                                                            Complete
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;