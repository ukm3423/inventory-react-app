import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import ConfirmationModal from './ConfirmationModal';
import UpdateModal from './UpdateModal';
import ViewModal from './ViewModal';

export default function SaleList() {

    const perPage = 10;
    const API = `http://192.168.1.90:8082/masterservice/api/sale`;
    const storedToken = localStorage.getItem('token');  // This is temporary solution 


    const [SaleListName, setSaleListName] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setSaleList] = useState([]);

    const [SaleListList, setSaleListList] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0); // Updated state for current page

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [SaleListIdToDelete, setSaleListIdToDelete] = useState(null);
    const [courseStatusToDelete, setCourseStatusToDelete] = useState(null);


    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateCourse, setUpdateCourse] = useState({});

    const [showViewModal, setShowViewModal] = useState(false);
    const [viewSaleList, setViewSaleList] = useState({});


    // * ====================================== Order List Section Start ======================================

    const fetchSaleList = async () => {
        try {
            const response = await axios.get(`${API}/get-sale-list`, {

                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            });

            setSaleListList(response.data);
            setFilteredSaleList(response.data);
            // setPageCount(response.data.totalPages); // Update pageCount with totalPages from response
        } catch (error) {
            console.error('Error fetching SaleList list:', error);
        }
    };


    useEffect(() => {
        fetchSaleList();
    }, [currentPage]); // Trigger fetchSaleList when currentPage changes

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected); // Update currentPage state when page changes
    };

    // * ====================================== Delete Section Start ======================================
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${API}/delete/${SaleListIdToDelete}`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            });
            fetchSaleList();
            setShowConfirmationModal(false);
            toast.success((courseStatusToDelete) ? "SaleList Deactivated." : "SaleList Activated.");
        } catch (error) {
            console.error('Error deleting SaleList:', error);
        }
    };

    const handleDeleteConfirmation = (SaleListId, status) => {
        setSaleListIdToDelete(SaleListId);
        setCourseStatusToDelete(status);
        setShowConfirmationModal(true);
    };

    // * ====================================== Update Section Start ======================================

    const handleEdit = async (SaleListId) => {
        try {
            const response = await axios.get(`${API}/get/${SaleListId}`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            });
            setUpdateCourse(response.data.data);
            console.log(response.data.data);
            setShowUpdateModal(true);
        } catch (error) {
            console.error('Error fetching SaleList details:', error);
        }
    };


    // * ====================================== View Section Start ======================================

    const handleViewSaleList = async (SaleListId) => {
        try {
            const response = await axios.get(`${API}/get/${SaleListId}`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            });
            setViewSaleList(response.data.data);
            console.log(response.data.data);
            setShowViewModal(true);
        } catch (error) {
            console.error('Error fetching SaleList details:', error);
        }
    };


    // * ====================================== Filter Section Start ======================================
    const [billNumberFilter, setBillNumberFilter] = useState('');
    const [fromDateFilter, setFromDateFilter] = useState('');
    const [toDateFilter, setToDateFilter] = useState('');
    const [filteredSaleList, setFilteredSaleList] = useState(SaleListList);

    useEffect(() => {
        applyFilters();
    }, [billNumberFilter, fromDateFilter, toDateFilter]);

    const applyFilters = () => {
        let filteredList = SaleListList.filter(sale => {
            // Filter by order number
            console.log("SALE : ",sale)
            if (billNumberFilter && !sale.billNumber.toLowerCase().includes(billNumberFilter.toLowerCase())) {
                return false;
            }
            // Filter by date range
            if (fromDateFilter && toDateFilter) {
                const orderDate = new Date(sale.saleDate);
                const fromDate = new Date(fromDateFilter);
                const toDate = new Date(toDateFilter);
                if (orderDate < fromDate || orderDate > toDate) {
                    return false;
                }
            }
            return true;
        });
        setFilteredSaleList(filteredList);
    };



    return (
        <div className="p-6 m-6 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">

                <h2 className="text-2xl font-bold mb-4 text-gray-800">All Sale List</h2>

                <div className="flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0">
                    <div className="w-full lg:w-auto">
                        <input
                            type="text"
                            placeholder="Search by Bill Number"
                            className="border px-3 py-2 rounded-lg w-full"
                            value={billNumberFilter}
                            onChange={(e) => setBillNumberFilter(e.target.value)}
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
                    <h2 className="text-xl font-semibold mb-4">Order List:-</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100 uppercase">
                                <tr>
                                    <th scope="col" className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider">Sl. No.</th>
                                    <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Bill Number</th>
                                    <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Customer </th>
                                    <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Sale Date</th>

                                    <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Status</th>
                                    <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">

                                {filteredSaleList.map((course, index) => (
                                    <tr key={course.id} className="transition duration-300  ease-in-out hover:bg-gray-50">
                                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{index + 1 + currentPage * perPage}</td>
                                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{course.billNumber}</td>
                                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{course.customerName}</td>
                                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{course.saleDate}</td>

                                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">
                                            {course.status ? (
                                                <span className="text-green-500 font-medium">Delivered</span>
                                            ) : (
                                                <span className="text-red-500 font-medium">Pending</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">
                                            <div className="flex space-x-4">
                                                <button
                                                    onClick={() => handleViewSaleList(course.id)}
                                                    className="text-blue-500 hover:text-blue-700 transition font-semibold duration-300 ease-in-out"
                                                >
                                                    {/* <FaEye />   */} View
                                                </button>
                                                {/* <button
                                                    onClick={() => handleEdit(course.id)}
                                                    className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteConfirmation(course.id, course.status)}
                                                    className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out"
                                                >
                                                    <FaTrash />
                                                </button> */}
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
                status={courseStatusToDelete}
            />

            {/* Update Modal */}
            {showUpdateModal && (
                <UpdateModal
                    course={updateCourse}
                    onClose={() => setShowUpdateModal(false)}
                    onUpdate={() => {
                        fetchSaleList();
                        toast.success("SaleList Updated Successfully.");
                    }}
                />
            )}


            {/* Update Modal */}
            {showViewModal && (
                <ViewModal
                    sale={viewSaleList}
                    onClose={() => setShowViewModal(false)}
                />
            )}

            {/* Toast Container for displaying error messages */}
            <ToastContainer />
        </div>
    );
}
