import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function ViewDetails() {
  const { purchaseId } = useParams();
  const [purchaseDetails, setPurchaseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(
        `http://192.168.1.157:8082/masterservice/api/reports/get-purchase-report/${purchaseId}`
      )
      .then((response) => {
        setPurchaseDetails(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching purchase details:", error);
        setError("Error fetching details. Please try again later.");
        setLoading(false);
        toast.error("Error fetching details. Please try again later.");
      });
  }, [purchaseId]);

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

  if (!purchaseDetails) {
    return (
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
        No details available.
      </div>
    );
  }

  const {
    invoiceNo,
    deliveryDate,
    orderNo,
    orderDate,
    supplier,
    amount,
    purchaseDetailsList,
  } = purchaseDetails;

  function handlePrint() {
    window.print();
  }

  function downloadHandle() {
    const input = document.getElementById("printSection");
    html2canvas(input, { scale: 2 }) // Increase scale for better resolution
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        // Create a new jsPDF instance
        const pdf = new jsPDF("p", "mm", "a4"); // Portrait, mm, A4 size
        const imgWidth = 290; // Set width of image
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add new page if content exceeds one page
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save("purchase-details.pdf");
      });
  }

  return (
    <div className="p-4 m-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 mt-4 lg:grid-cols-1 gap-6">
        <div id="printSection">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Order Details :-
          </h2>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <p>
              <strong>Invoice Number:</strong> {invoiceNo}
            </p>
            <p>
              <strong>Delivery Date:</strong> {deliveryDate}
            </p>
            <p>
              <strong>Order Number:</strong> {orderNo}
            </p>
            <p>
              <strong>Order Date:</strong> {orderDate}
            </p>
            <p>
              <strong>Supplier:</strong> {supplier}
            </p>
            <p>
              <strong>Amount:</strong> {amount}
            </p>
          </div>
          <h3 className="text-2xl mt-8 font-semibold text-gray-800 mb-4">
            Product List :-
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-4 text-left">Product Name</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Quantity</th>
                  <th className="py-3 px-4 text-left">Rate</th>
                  <th className="py-3 px-4 text-left">Total Amount</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-md">
                {purchaseDetailsList.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-4">{item.productName}</td>
                    <td className="py-3 px-4">{item.categoryName}</td>
                    <td className="py-3 px-4">{item.quantity}</td>
                    <td className="py-3 px-4">{item.rate}</td>
                    <td className="py-3 px-4">{item.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="mt-6 mr-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none w-32" // Reduced width
            onClick={handlePrint}
          >
            Print
          </button>

          <button
            className="mt-6 mr-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 focus:outline-none w-32" // Same reduced width
            onClick={downloadHandle}
          >
            Download
          </button>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}

export default ViewDetails;
