import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function CurrentStock() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [stockInfo, setStockInfo] = useState(null);

    const API = `http://192.168.1.90:8082/masterservice/api`;

    useEffect(() => {
        // Fetch categories and products when component mounts
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API}/category/get-categories`); // Replace with your API endpoint
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async (categoryId) => {
        try {
            const response = await axios.get(`${API}/products/get-products/${categoryId}`); // Replace with your API endpoint
            setProducts(response.data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setSelectedProduct(''); // Reset selected product when category changes
        fetchProducts(categoryId);
    };

    const handleProductChange = (productId) => {
        setSelectedProduct(productId);
    };

    const handleSearch = async () => {
        if (!selectedCategory || !selectedProduct) {
            // alert('Please select both Category and Product.');
            toast.error('Please select both Category and Product.');
            return;
        }

        try {
            const response = await axios.get(`${API}/stock?category=${selectedCategory}&product=${selectedProduct}`); // Replace with your API endpoint
            setStockInfo(response.data);
        } catch (error) {
            console.error('Error fetching stock information:', error);
            alert('Error fetching stock information. Please try again later.');
        }
    };

    return (
        <div className="relative p-6 m-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">In Stock</h2>

            {/* Category Dropdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Product Dropdown */}
                <div className="mb-4">
                    <label htmlFor="product" className="block text-sm font-medium text-gray-700">
                        Product
                    </label>
                    <select
                        id="product"
                        name="product"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={selectedProduct}
                        onChange={(e) => handleProductChange(e.target.value)}
                    >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.productName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Search Button */}
            <button
                type="button"
                className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
                onClick={handleSearch}
            >
                Search
            </button>

            {/* Display Stock Information */}
            {stockInfo && (
                <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-800">Stock Information</h3>
                    <p className="mt-2 text-gray-600">
                        Category: {stockInfo.categoryName}, Product: {stockInfo.productName}, Stock: {stockInfo.stock}
                    </p>
                </div>
            )}
        </div>
    );
}

export default CurrentStock;
