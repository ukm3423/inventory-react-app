import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PurchaseReport() {
  const [purchaseData, setPurchaseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderNumberFilter, setOrderNumberFilter] = useState("");
  const [fromDateFilter, setFromDateFilter] = useState("");
  const [toDateFilter, setToDateFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        "http://192.168.1.157:8082/masterservice/api/reports/get-purchase-report"
      )
      .then((response) => {
        setPurchaseData(response.data.data); // Set data directly
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching purchase data:", error);
        setError("Error fetching data. Please try again later.");
        setLoading(false);
        toast.error("Error fetching data. Please try again later.");
      });
  }, []);

  const handleViewClick = (invoiceNo) => {
    navigate(`/purchase-reports/view-details/${invoiceNo}`);
  };

  const filteredOrderList = purchaseData.filter((purchase) => {
    return (
      (!orderNumberFilter ||
        (purchase.invoiceNo &&
          purchase.invoiceNo
            .toLowerCase()
            .includes(orderNumberFilter.toLowerCase())) ||
        (purchase.orderNo &&
          purchase.orderNo
            .toLowerCase()
            .includes(orderNumberFilter.toLowerCase()))) &&
      (!fromDateFilter ||
        new Date(purchase.orderDate) >= new Date(fromDateFilter)) &&
      (!toDateFilter || new Date(purchase.orderDate) <= new Date(toDateFilter))
    );
  });

  if (loading) {
    return (
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 m-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Purchase Reports
        </h2>
        <div className="flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0">
          <div className="w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search by Invoice or Order Number"
              className="border px-3 py-2 rounded-lg w-full md:w-96"
              value={orderNumberFilter}
              onChange={(e) => setOrderNumberFilter(e.target.value)}
            />
          </div>

          <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-2">
            <input
              type="date"
              className="border px-3 py-2 rounded-lg w-full lg:w-auto"
              value={fromDateFilter}
              onChange={(e) => setFromDateFilter(e.target.value)}
            />
            <span className="hidden lg:inline">-</span>
            <input
              type="date"
              className="border px-3 py-2 rounded-lg w-full lg:w-auto"
              value={toDateFilter}
              onChange={(e) => setToDateFilter(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 uppercase">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider"
                  >
                    Sl. No.
                  </th>
                  <th className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider">
                    Order Number
                  </th>
                  <th className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider">
                    Order Date
                  </th>
                  <th className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider">
                    Invoice Number
                  </th>
                  <th className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider">
                    Delivery Date
                  </th>

                  <th className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrderList.map((purchase, index) => (
                  <tr
                    key={index}
                    className="transition duration-300 ease-in-out hover:bg-gray-50"
                  >
                    <td className="px-6 py-2 text-gray-800 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="px-6 py-2 text-gray-800 whitespace-nowrap">
                      {purchase.orderNo}
                    </td>
                    <td className="px-6 py-2 text-gray-800 whitespace-nowrap">
                      {purchase.orderDate}
                    </td>
                    <td className="px-6 py-2 text-gray-800 whitespace-nowrap">
                      {purchase.invoiceNo}
                    </td>
                    <td className="px-6 py-2 text-gray-800 whitespace-nowrap">
                      {purchase.orderDate}
                    </td>

                    <td className="px-6 py-2 text-gray-800 whitespace-nowrap">
                      {purchase.supplier}
                    </td>
                    <td className="px-6 py-2 text-gray-800 whitespace-nowrap">
                      {purchase.amount}
                    </td>
                    <td className="px-6 py-2 text-gray-800 whitespace-nowrap">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleViewClick(purchase.orderNo)}
                          className="text-blue-500 hover:text-blue-700 transition font-semibold duration-300 ease-in-out"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default PurchaseReport;
