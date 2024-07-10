import { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateModal = ({ order, onClose, onUpdate }) => {
    const storedToken = localStorage.getItem('token');

    const [modalOpen, setModalOpen] = useState(false);
    const [orderCode, setOrderCode] = useState(order.orderNumber);
    const [supplierName, setSupplierName] = useState(order.supplierName);
    const [orderDate, setOrderDate] = useState(order.orderDate);
    const [products, setProducts] = useState(order.orderDetailsList);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (modalOpen) {
            const timeout = setTimeout(() => {
                setModalOpen(true);
            }, 50);
            return () => clearTimeout(timeout);
        } else {
            setModalOpen(false);
        }
    }, [modalOpen]);

    useEffect(() => {
        setModalOpen(true);
    }, []);

    // Calculate Grand Total
    const grandTotal = products.reduce((total, product) => {
        return total + (product.quantity * product.rate);
    }, 0);

    // Format Grand Total with comma separators and two decimal places
    const formattedGrandTotal = grandTotal.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR'
    });

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://192.168.1.90:8082/masterservice/api/delivery/make-delivery`, {
                orderCode: orderCode,
                supplierName: supplierName,
                orderDate: orderDate,
                orderDetailsList: products,
            }, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            });

            onUpdate();
            closeModal();
        } catch (error) {
            console.error('Error updating order:', error);
            if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
                const errorMessage = error.response.data.errors[0].message;
                setErrorMessage(errorMessage);
            } else {
                setErrorMessage(error.response.data.message || 'An error occurred while updating the order.');
            }
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setTimeout(onClose, 200);
    };

    return (
        <div className={`fixed z-50 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4 sm:p-6 lg:p-8  ${onClose ? 'opacity-100 bg-gray-900 bg-opacity-50' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-white w-full max-w-6xl rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300  ${modalOpen ? 'scale-100' : 'scale-90'}`}>
                <div className="bg-gradient-to-r from-pink-400 to-red-500 px-4 py-3 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-white">Deliver Order</h3>
                </div>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                    <form onSubmit={handleUpdate}>
                        <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">Order ID</label>
                                <input
                                    type="text"
                                    id="orderId"
                                    value={orderCode}
                                    onChange={(e) => setOrderCode(e.target.value)}
                                    className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500 transition duration-150 ease-in-out"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label htmlFor="supplierName" className="block text-sm font-medium text-gray-700">Supplier Name</label>
                                <input
                                    type="text"
                                    id="supplierName"
                                    value={supplierName}
                                    onChange={(e) => setSupplierName(e.target.value)}
                                    className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500 transition duration-150 ease-in-out"
                                />
                            </div>
                            <div>
                                <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700">Order Date</label>
                                <input
                                    type="text"
                                    id="orderDate"
                                    value={orderDate}
                                    onChange={(e) => setOrderDate(e.target.value)}
                                    className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500 transition duration-150 ease-in-out"
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <h4 className="text-lg font-medium mb-2">List of Products</h4>
                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL. No</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>

                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.map((product, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{product.productName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{product.categoryName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{product.rate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{product.rate * product.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Grand Total */}
                        <div className="flex justify-start items-center mb-2">
                            <span className="text-lg font-medium">Grand Total:</span>
                            <span className="ml-2 text-lg font-medium text-blue-600">{formattedGrandTotal}</span>
                        </div>
                        {/* Error Message */}
                        {errorMessage && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                                <p className="font-bold">Error:</p>
                                <p>{errorMessage}</p>
                            </div>
                        )}
                        <div className="flex flex-col sm:flex-row justify-end items-center gap-2 sm:gap-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="mt-2 sm:mt-0 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                            >
                                Deliver
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateModal;
