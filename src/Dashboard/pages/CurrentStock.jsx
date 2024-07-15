import React, { useEffect, useState } from "react";
import axios from "axios";

const CurrentStock = () => {
    const [stockData, setStockData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8082/masterservice/api/stock/get-data")
            .then(response => {
                setStockData(response.data);
                setFilteredData(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const lowercasedFilter = filter.toLowerCase();
        const filtered = stockData.filter(item =>
            item.categoryName.toLowerCase().includes(lowercasedFilter) ||
            item.productName.toLowerCase().includes(lowercasedFilter)
        );
        setFilteredData(filtered);
    }, [filter, stockData]);

    if (loading) {
        return <div className="relative p-6 m-6 bg-white rounded-lg shadow-md">Loading...</div>;
    }

    if (error) {
        return <div className="relative p-6 m-6 bg-white rounded-lg shadow-md">Error loading data: {error.message}</div>;
    }

    return (
        <div className="relative p-6 m-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">In Stock</h2>
            <input
                type="text"
                placeholder="Filter by category or product name"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="mb-4 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredData.map((item, index) => (
                    <div key={index} className="bg-white shadow-md rounded-lg p-6 border border-gray-200 transition duration-200 hover:shadow-lg">
                        <h3 className="text-lg font-bold text-gray-700 mb-2">{item.productName}</h3>
                        <p className="text-sm text-gray-600 mb-4">{item.categoryName}</p>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Purchased Qty:</span>
                            <span className="text-sm font-semibold text-gray-700">{item.purchaseQty}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Sold Qty:</span>
                            <span className="text-sm font-semibold text-gray-700">{item.saleQty}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Available Qty:</span>
                            <span className={`text-sm font-semibold ${item.availableQty === 0 ? 'text-red-500' : 'text-green-500'}`}>
                                {item.availableQty}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CurrentStock;
