import { useState, useEffect } from "react";

const ViewModal = ({ course, onClose }) => {
  const [categoryDetails, setCategoryDetails] = useState(null);
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
    setCategoryDetails(course);
    setIsLoading(false);
  }, [course]);

  return (
    <div
      className={`fixed z-50 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4 sm:p-6 lg:p-8  ${
        onClose
          ? "opacity-100 bg-gray-900 bg-opacity-50"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white w-full max-w-4xl rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300  ${
          modalOpen ? "scale-100" : "scale-90"
        }`}
      >
        <div className="bg-gradient-to-r from-pink-400 to-red-500 px-4 py-4 sm:px-6 sm:py-5">
          <h3 className="text-lg leading-6 font-medium text-white">
            View Category Details
          </h3>
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
                      Field
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Name{" "}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {categoryDetails.categoryName}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Description{" "}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {categoryDetails.categoryDescription}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Status{" "}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {categoryDetails.status}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Creation Date
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {categoryDetails.createdAt}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Updation Date
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {categoryDetails.updatedAt}
                    </td>
                  </tr>
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
