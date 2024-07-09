import { useState, useEffect } from 'react';

const ViewModal = ({ order, onClose }) => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);


    useEffect(() => {
        if (isOpen) {
            const timeout = setTimeout(() => {
                setModalOpen(true);
            }, 50);
            return () => clearTimeout(timeout);
        } else {
            setModalOpen(false);
        }
    }, [isOpen]);

    useEffect(() => {
        setIsOpen(true);
    }, []);

    useEffect(() => {
        setOrderDetails(order);
        console.log(order)
        setIsLoading(false);
    }, [order]);

    return (
        <div className={`fixed z-50 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4 sm:p-6 lg:p-8  ${onClose ? 'opacity-100 bg-gray-900 bg-opacity-50' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-white w-full max-w-6xl rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300  ${modalOpen ? 'scale-100' : 'scale-90'}`}>
                <div className="bg-gradient-to-r from-pink-400 to-red-500 px-4 py-4 sm:px-6 sm:py-4">
                    <h3 className="text-lg leading-6 font-medium text-white">View order Details</h3>
                </div>
                <div className="bg-white p-4 sm:p-6">
                    {isLoading ? (
                        <p className="text-center">Loading...</p>
                    ) : (
                        <div className="overflow-x-auto">
                          
                            <table className="min-w-full divide-y divide-gray-200">
                                
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            SL.No
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category 
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product 
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity 
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rate  
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount  
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {/* <tr>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Order Number </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{orderDetails.orderNumber}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Supplier </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{orderDetails.supplierName}</td>
                                    </tr>

                                    <tr>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">order Category</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{orderDetails.orderDate}</td>
                                    </tr> */}
                                    {orderDetails.orderDetailsList.map((ord, index) => (
                                        <tr key={ord.id} className="transition duration-300  ease-in-out hover:bg-gray-50">
                                            <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{index + 1}</td>
                                            <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{ord.categoryName}</td>
                                            <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{ord.productName}</td>

                                            <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{ord.quantity}</td>
                                            <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{ord.rate}</td>

                                            <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{ord.quantity * ord.rate}</td>

                                            
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex justify-center items-center px-4 py-1.5 border border-transparent rounded-md shadow-sm text-base font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewModal;
