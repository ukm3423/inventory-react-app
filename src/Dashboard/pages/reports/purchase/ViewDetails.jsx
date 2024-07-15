import React from 'react';

function ViewDetails({ purchase }) {
    const { invoiceNo, invoiceDate, billNo, billDate, supplier, amount, purchaseDetailsList } = purchase;

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">View Details</h2>

            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-gray-600">Invoice No:</span>
                    <span className="text-xl text-gray-800">{invoiceNo}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-gray-600">Invoice Date:</span>
                    <span className="text-xl text-gray-800">{invoiceDate}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-gray-600">Bill No:</span>
                    <span className="text-xl text-gray-800">{billNo}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-gray-600">Bill Date:</span>
                    <span className="text-xl text-gray-800">{billDate}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-gray-600">Supplier:</span>
                    <span className="text-xl text-gray-800">{supplier}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-gray-600">Amount:</span>
                    <span className="text-xl text-gray-800">{amount}</span>
                </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Purchase Details</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-4 text-left">Product Name</th>
                            <th className="py-3 px-4 text-left">Category Name</th>
                            <th className="py-3 px-4 text-right">Quantity</th>
                            <th className="py-3 px-4 text-right">Rate</th>
                            <th className="py-3 px-4 text-right">Total Amount</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {purchaseDetailsList.map((detail, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-4 text-left">{detail.productName}</td>
                                <td className="py-3 px-4 text-left">{detail.categoryName}</td>
                                <td className="py-3 px-4 text-right">{detail.quantity}</td>
                                <td className="py-3 px-4 text-right">{detail.rate}</td>
                                <td className="py-3 px-4 text-right">{detail.totalAmount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ViewDetails;
