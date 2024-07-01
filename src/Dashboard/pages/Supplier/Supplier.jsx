import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import ConfirmationModal from './ConfirmationModal';
import UpdateModal from './UpdateModal';
import ViewModal from './ViewModal';

export default function Supplier() {

  const perPage = 10;
  const API = `http://localhost:8080/masterservice/api/supplier`;
  const storedToken = localStorage.getItem('token');  // This is temporary solution 


  const [supplierName, setSupplierName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [suppliers, setSuppliers] = useState([]);

  const [SupplierList, setSupplierList] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // Updated state for current page

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [supplierIdToDelete, setSupplierIdToDelete] = useState(null);
  const [supplierstatusToDelete, setSupplierstatusToDelete] = useState(null);


  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateSupplier, setUpdateSupplier] = useState({});

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewSupplier, setViewSupplier] = useState({});

  // * ====================================== Adding A New Supplier ======================================

  const handleAddSupplier = async () => {
    try {
      const response = await axios.post(`${API}/add`, { address, supplierName, phone, emailAddress }, {
        // headers: {
        //   'Authorization': `Bearer ${storedToken}`
        // }
      });
      setSupplierName('');
      setEmailAddress('');
      setPhone('');
      setAddress('')
      fetchSupplierList();
      toast.success(response.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        console.error('Error adding Supplier:', error);
      }
    }
  };

  // * ====================================== Supplier List Section Start ======================================

  const fetchSupplierList = async () => {
    try {
      const response = await axios.get(`${API}/get-list?offset=${currentPage}&limit=${perPage} `, {

        // headers: {
        //   'Authorization': `Bearer ${storedToken}`
        // }
      });

      setSupplierList(response.data.data);
      setPageCount(response.data.totalPages); // Update pageCount with totalPages from response
    } catch (error) {
      console.error('Error fetching category list:', error);
    }
  };

  useEffect(() => {
    fetchSupplierList();
  }, [currentPage]); // Trigger fetchCategoryList when currentPage changes

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected); // Update currentPage state when page changes
  };

  // * ====================================== Delete Section Start ======================================
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${API}/delete/${supplierIdToDelete}`, {
        // headers: {
        //   'Authorization': `Bearer ${storedToken}`
        // }
      });
      fetchSupplierList();
      setShowConfirmationModal(false);
      toast.success((supplierstatusToDelete) ? "Supplier Deactivated." : "Supplier Activated.");
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleDeleteConfirmation = (supplierId, status) => {
    setSupplierIdToDelete(supplierId);
    setSupplierstatusToDelete(status);
    setShowConfirmationModal(true);
  };

  // * ====================================== Update Section Start ======================================

  const handleEdit = async (supplierId) => {
    try {
      const response = await axios.get(`${API}/get/${supplierId}`, {
        // headers: {
        //   'Authorization': `Bearer ${storedToken}`
        // }
      });
      setUpdateSupplier(response.data.data);
      console.log(response.data.data);
      setShowUpdateModal(true);
    } catch (error) {
      console.error('Error fetching category details:', error);
    }
  };


  // * ====================================== View Section Start ======================================

  const handleViewSupplier = async (supplierId) => {
    try {
      const response = await axios.get(`${API}/get/${supplierId}`, {
        // headers: {
        //   'Authorization': `Bearer ${storedToken}`
        // }
      });
      setViewSupplier(response.data.data);
      console.log(response.data.data);
      setShowViewModal(true);
    } catch (error) {
      console.error('Error fetching category details:', error);
    }
  };



  return (
    <div className="p-6 m-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="flex justify-between items-center mb-4">
          {/* <h1 className="text-3xl font-semibold text-gray-800">Suppliers</h1> */}
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add New Supplier</h2>
          <form className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="supplierName" className="text-gray-700 font-medium mb-2 block">Full Name</label>
              <input
                type="text"
                id="supplierName"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="Enter Supplier Name"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-yellow-500  sm:text-sm"
                required />
            </div>
            <div>
              <label htmlFor="emailAddress" className="text-gray-700 font-medium mb-2 block">Email-Id</label>
              <input
                type="email"
                id="emailAddress"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="Enter Supplier Email-Id"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-yellow-500 sm:text-sm"
              required />
            </div>
            <div>
              <label htmlFor="address" className="text-gray-700 font-medium mb-2 block">Address</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Supplier Address"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-yellow-500 sm:text-sm"
                required />
            </div>
            <div>
              <label htmlFor="phone" className="text-gray-700 font-medium mb-2 block">Phone</label>
              <input
                type="number"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter Phone Number"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-yellow-500 sm:text-sm"
                required />
            </div>
          </form>
          <button onClick={handleAddSupplier} className="btn bg-gradient-to-r font-medium from-blue-500 to-indigo-500 text-white px-4 py-1.5 mt-5 rounded-md hover:shadow-lg transition">Add Supplier</button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Supplier List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 uppercase">
                <tr>
                  <th scope="col" className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider">Sl. No.</th>
                  <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Supplier Name</th>
                  <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Phone</th>
                  <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Status</th>
                  <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {SupplierList.map((Supplier, index) => (
                  <tr key={Supplier.id} className="transition duration-300  ease-in-out hover:bg-gray-50">
                    <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{index + 1 + currentPage * perPage}</td>
                    <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{Supplier.supplierName}</td>
                    <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{Supplier.phone}</td>
                    <td className="px-6 py-2 text-gray-800 whitespace-nowrap">
                      {Supplier.status ? (
                        <span className="text-green-500 font-sm">Activate</span>
                      ) : (
                        <span className="text-red-500 font-sm">Deactivate</span>
                      )}
                    </td>
                    <td className="px-6 py-2 text-gray-800 whitespace-nowrap">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleViewSupplier(Supplier.id)}
                          className="text-green-500 hover:text-green-700 transition duration-300 ease-in-out"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(Supplier.id)}
                          className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirmation(Supplier.id, Supplier.status)}
                          className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out"
                        >
                          <FaTrash />
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


      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onCancel={() => setShowConfirmationModal(false)}
        onConfirm={handleDelete}
        status={supplierstatusToDelete}
      />

      {/* Update Modal */}
      {showUpdateModal && (
        <UpdateModal
          supplier={updateSupplier}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={() => {
            fetchSupplierList();
            toast.success("Supplier Updated Successfully.");
          }}
        />
      )}


      {/* Update Modal */}
      {showViewModal && (
        <ViewModal
          supplier={viewSupplier}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {/* Toast Container for displaying error messages */}
      <ToastContainer />
    </div>
  );
}
