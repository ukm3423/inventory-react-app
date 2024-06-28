// CustomToast.jsx
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomToast = ({ message, regNo }) => (
    <div className="flex flex-col items-center">
        <div className="text-green-500">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm4.707-10.707a1 1 0 00-1.414-1.414L9 10.586 6.707 8.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l5-5z"
                    clipRule="evenodd"
                />
            </svg>
        </div>
        <div className="mt-2 text-lg font-semibold">{message}</div>
        <div className="mt-1 text-sm text-gray-700">Registration No: {regNo}</div>
    </div>
);

const showCustomToast = (message, regNo) => {
    toast(<CustomToast message={message} regNo={regNo} />, {
        position: toast.POSITION.TOP_CENTER, // Ensure this is the correct usage
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};

export { showCustomToast, ToastContainer };
