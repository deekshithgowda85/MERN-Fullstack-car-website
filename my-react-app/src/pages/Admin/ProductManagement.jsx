import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import axios from 'axios';

const ProductManagement = () => {
    const [cars, setCars] = useState([]);
    const [accessories, setAccessories] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [selectedAccessory, setSelectedAccessory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image: '',
        description: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    // Fetch cars and accessories on component mount
    useEffect(() => {
        fetchCars();
        fetchAccessories();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products/cars');
            console.log('Cars data:', response.data);
            setCars(response.data);
        } catch (error) {
            console.error('Error fetching cars:', error);
        }
    };

    const fetchAccessories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products/accessories');
            console.log('Accessories data:', response.data);
            setAccessories(response.data);
        } catch (error) {
            console.error('Error fetching accessories:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({
                    ...prev,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCarSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('description', formData.description);
            if (selectedFile) {
                formDataToSend.append('image', selectedFile);
            }

            if (selectedCar) {
                await axios.put(`http://localhost:5000/api/products/cars/${selectedCar.id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await axios.post('http://localhost:5000/api/products/cars', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            fetchCars();
            resetForm();
        } catch (error) {
            console.error('Error saving car:', error);
        }
    };

    const handleAccessorySubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('description', formData.description);
            if (selectedFile) {
                formDataToSend.append('image', selectedFile);
            }

            if (selectedAccessory) {
                await axios.put(`http://localhost:5000/api/products/accessories/${selectedAccessory.id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await axios.post('http://localhost:5000/api/products/accessories', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            fetchAccessories();
            resetForm();
        } catch (error) {
            console.error('Error saving accessory:', error);
        }
    };

    const handleEdit = (item, type) => {
        if (type === 'car') {
            setSelectedCar(item);
            setSelectedAccessory(null);
        } else {
            setSelectedAccessory(item);
            setSelectedCar(null);
        }
        setFormData({
            name: item.name,
            price: item.price,
            image: item.image,
            description: item.description
        });
        setImagePreview(item.image);
        setSelectedFile(null);
    };

    const handleDelete = async (id, type) => {
        try {
            if (type === 'car') {
                await axios.delete(`http://localhost:5000/api/products/cars/${id}`);
                fetchCars();
            } else {
                await axios.delete(`http://localhost:5000/api/products/accessories/${id}`);
                fetchAccessories();
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            image: '',
            description: ''
        });
        setSelectedCar(null);
        setSelectedAccessory(null);
        setImagePreview(null);
        setSelectedFile(null);
    };

    return (
        <div className="min-h-screen bg-[#1e1e20] text-white">
            <AdminNavbar />
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">Product Management</h1>

                {/* Add/Edit Cars Section */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-6">Cars</h2>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <p className="text-gray-400 mb-4">Use the form below to add new cars or edit existing ones.</p>
                        {/* Add/Edit Car Form */}
                        <div className="border border-gray-700 p-6 rounded-md mb-6">
                            <h3 className="text-xl font-semibold mb-4">{selectedCar ? 'Edit Car' : 'Add Car'}</h3>
                            <form onSubmit={handleCarSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="car-name" className="block text-sm font-medium text-gray-300">Name</label>
                                    <input
                                        type="text"
                                        id="car-name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="car-price" className="block text-sm font-medium text-gray-300">Price</label>
                                    <input
                                        type="number"
                                        id="car-price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="car-image" className="block text-sm font-medium text-gray-300">Image</label>
                                    <input
                                        type="file"
                                        id="car-image"
                                        name="image"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="mt-1 block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                    />
                                    {imagePreview && (
                                        <div className="mt-2">
                                            <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-md" />
                                        </div>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="car-description" className="block text-sm font-medium text-gray-300">Description</label>
                                    <textarea
                                        id="car-description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                    ></textarea>
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-4">
                                    {selectedCar && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="inline-flex justify-center py-2 px-4 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        {selectedCar ? 'Update Car' : 'Save Car'}
                                    </button>
                                </div>
                            </form>
                        </div>
                        {/* Existing Cars List */}
                        <div className="border border-gray-700 p-4 rounded-md">
                            <h3 className="text-xl font-semibold mb-4">Existing Cars</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Image</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Name</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Price</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Description</th>
                                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {cars.map(car => (
                                            <tr key={car.id}>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <img
                                                        src={`http://localhost:5000${car.image}`}
                                                        alt={car.name}
                                                        className="h-16 w-16 object-cover rounded-md"
                                                        onError={(e) => {
                                                            console.error('Image failed to load:', car.image);
                                                            e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{car.name}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">${car.price}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 overflow-hidden text-ellipsis max-w-sm">{car.description}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleEdit(car, 'car')}
                                                        className="text-blue-400 hover:text-blue-600 mr-4"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(car.id, 'car')}
                                                        className="text-red-400 hover:text-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Add/Edit Accessories Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Accessories</h2>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <p className="text-gray-400 mb-4">Use the form below to add new accessories or edit existing ones.</p>
                        {/* Add/Edit Accessory Form */}
                        <div className="border border-gray-700 p-6 rounded-md mb-6">
                            <h3 className="text-xl font-semibold mb-4">{selectedAccessory ? 'Edit Accessory' : 'Add Accessory'}</h3>
                            <form onSubmit={handleAccessorySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="accessory-name" className="block text-sm font-medium text-gray-300">Name</label>
                                    <input
                                        type="text"
                                        id="accessory-name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="accessory-price" className="block text-sm font-medium text-gray-300">Price</label>
                                    <input
                                        type="number"
                                        id="accessory-price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="accessory-image" className="block text-sm font-medium text-gray-300">Image</label>
                                    <input
                                        type="file"
                                        id="accessory-image"
                                        name="image"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="mt-1 block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                    />
                                    {imagePreview && (
                                        <div className="mt-2">
                                            <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-md" />
                                        </div>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="accessory-description" className="block text-sm font-medium text-gray-300">Description</label>
                                    <textarea
                                        id="accessory-description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                    ></textarea>
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-4">
                                    {selectedAccessory && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="inline-flex justify-center py-2 px-4 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        {selectedAccessory ? 'Update Accessory' : 'Save Accessory'}
                                    </button>
                                </div>
                            </form>
                        </div>
                        {/* Existing Accessories List */}
                        <div className="border border-gray-700 p-4 rounded-md">
                            <h3 className="text-xl font-semibold mb-4">Existing Accessories</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Image</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Name</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Price</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Description</th>
                                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {accessories.map(accessory => (
                                            <tr key={accessory.id}>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <img
                                                        src={`http://localhost:5000${accessory.image}`}
                                                        alt={accessory.name}
                                                        className="h-16 w-16 object-cover rounded-md"
                                                        onError={(e) => {
                                                            console.error('Image failed to load:', accessory.image);
                                                            e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{accessory.name}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">${accessory.price}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 overflow-hidden text-ellipsis max-w-sm">{accessory.description}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleEdit(accessory, 'accessory')}
                                                        className="text-blue-400 hover:text-blue-600 mr-4"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(accessory.id, 'accessory')}
                                                        className="text-red-400 hover:text-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
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

export default ProductManagement; 