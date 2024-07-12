import { useState, useEffect } from 'react';

const ConfirmationModal = ({ isOpen, onCancel, onConfirm, status }) => {
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        console.log("\n\nStatus : ", status);
        if (isOpen) {
            // If modal is being opened, wait a bit before setting modalOpen to true
            const timeout = setTimeout(() => {
                setModalOpen(true);
            }, 50);
            return () => clearTimeout(timeout);
        } else {
            // If modal is being closed, set modalOpen to false immediately
            setModalOpen(false);
        }
    }, [isOpen]);

    const handleBackdropClick = (e) => {
        // Prevent closing modal when clicking inside the modal content
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100 bg-gray-900 bg-opacity-50' : 'opacity-0 pointer-events-none'}`} onClick={handleBackdropClick}>
            <div className={`bg-white w-full max-w-md p-8 rounded-lg shadow-lg transform transition-transform duration-300 ${modalOpen ? 'scale-100' : 'scale-90'}`}>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Confirmation </h2>
                <p className="text-gray-700 mb-6">
                    {status ? 'Do you want ot delete?' : 'Do you want to delete?'}
                </p>
                <div className="flex justify-end">
                    <button onClick={onCancel} className="px-4 py-2 mr-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300 ease-in-out">
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white rounded-md transition-colors duration-300 ease-in-out ${status ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                        {status ? 'Delete' : 'Activate'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;