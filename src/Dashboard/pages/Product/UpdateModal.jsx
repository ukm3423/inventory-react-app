import { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateModal = ({ product, onClose, categoryList, onUpdate }) => {
    const storedToken = localStorage.getItem('token');

    const [modalOpen, setModalOpen] = useState(false);
    const [productCode, setproductId] = useState(product.productCode);
    const [productName, setproductName] = useState(product.productName);
    const [price, setPrice] = useState(product.price);
    const [categoryId, setCategoryId] = useState(product.category.id);
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (isOpen) {
            console.log(product);
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

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/masterservice/api/products/update/${product.id}`, {
                productCode: productCode,
                productName: productName,
                price: price,
                categoryId: categoryId,
            }, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            });

            onUpdate();
            closeModal();
        } catch (error) {
            console.error('Error updating product:', error);
            if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
                const errorMessage = error.response.data.errors[0].message;
                setErrorMessage(errorMessage);
            } else {
                setErrorMessage(error.response.data.message || 'An error occurred while updating the product.');
            }
        }
    };

    const closeModal = () => {
        setIsOpen(false);
        setTimeout(onClose, 200);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={`fixed z-50 inset-0 flex items-center justify-center transition-opacity ${isOpen ? 'opacity-100 bg-gray-900 bg-opacity-50' : 'opacity-0 pointer-events-none'}`} onClick={handleBackdropClick}>
            <div className={`bg-white w-full max-w-md shadow-lg transform transition-transform price-300 ${modalOpen ? 'scale-100' : 'scale-90'}`}>

                <div className="bg-gradient-to-r from-pink-400 to-red-500 px-4 py-3 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-white">Update product</h3>
                </div>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <form onSubmit={handleUpdate}>
                        <div className="sm:items-start">

                            {categoryList && categoryList.data && (
                                <div className='mb-4'>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                    <select id="category" value={product.category.id} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 px-4 py-1.5 border border-gray-300 rounded-md w-full sm:text-sm focus:outline-none focus:border-yellow-500 transition price-150 ease-in-out" required>
                                        <option value="">Select Category</option>
                                        {categoryList.data.map((category) => (
                                            <option key={category.id} value={category.id}>{category.categoryName}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="mb-4">
                                <label htmlFor="productId" className="block text-sm font-medium text-gray-700">Product Code </label>
                                <input
                                    type="text"
                                    id="productId"
                                    value={productCode}
                                    onChange={(e) => setproductId(e.target.value)}
                                    className="mt-1 px-4 py-1 border border-gray-300 rounded-md w-full focus:outline-none focus:border-yellow-500 transition price-150 ease-in-out" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
                                <input
                                    type="text"
                                    id="productName"
                                    value={productName}
                                    onChange={(e) => setproductName(e.target.value)}
                                    className="mt-1 px-4 py-1 border border-gray-300 rounded-md w-full focus:outline-none focus:border-yellow-500 transition price-150 ease-in-out" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="text"
                                    id="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="mt-1 px-4 py-1 border border-gray-300 rounded-md w-full focus:outline-none focus:border-yellow-500 transition price-150 ease-in-out" />
                            </div>
                            
                        </div>
                        {errorMessage && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                                <p className="font-bold">Error:</p>
                                <p>{errorMessage}</p>
                            </div>
                        )}
                        <div className="flex justify-end">
                            <button type="button" onClick={closeModal} className="mr-4 inline-flex justify-center items-center px-4 py-1.5 border border-transparent rounded-md shadow-sm text-base font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition price-150 ease-in-out">
                                Cancel
                            </button>
                            <button type="submit" className="inline-flex justify-center items-center px-4 py-1.5 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition price-150 ease-in-out">
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateModal;
