import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import ConfirmationModal from './ConfirmationModal';
import UpdateModal from './UpdateModal';
import ViewModal from './ViewModal';

export default function OrderRequestList() {

    const perPage = 10;
    const API = `http://192.168.1.90:8082/masterservice/api/order`;
    const storedToken = localStorage.getItem('token');  // This is temporary solution 


    const [OrderListName, setOrderListName] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setOrderList] = useState([]);

    const [OrderListList, setOrderListList] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0); // Updated state for current page

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [OrderListIdToDelete, setOrderListIdToDelete] = useState(null);
    const [courseStatusToDelete, setCourseStatusToDelete] = useState(null);


    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateOrder, setUpdateOrder] = useState({});

    const [showViewModal, setShowViewModal] = useState(false);
    const [viewOrderList, setViewOrderList] = useState({});

    // * ====================================== Adding A New Course ======================================

    const handleAddCourse = async () => {
        try {
            const response = await axios.post(`${API}/add`, { OrderListName, description }, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            });
            setOrderListName('');
            setDescription('');
            fetchOrderListList();
            toast.success(response.data.message);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                console.error('Error adding course:', error);
            }
        }
    };

    // * ====================================== Order List Section Start ======================================

    const fetchOrderListList = async () => {
        try {
            const response = await axios.get(`${API}/get-order-list`, {

                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            });

            setOrderListList(response.data);
            setFilteredOrderList(response.data);
            // setPageCount(response.data.totalPages); // Update pageCount with totalPages from response
        } catch (error) {
            console.error('Error fetching OrderList list:', error);
        }
    };


    useEffect(() => {
        fetchOrderListList();
    }, [currentPage]); // Trigger fetchOrderListList when currentPage changes

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected); // Update currentPage state when page changes
    };

    // * ====================================== Delete Section Start ======================================
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${API}/delete/${OrderListIdToDelete}`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            });
            fetchOrderListList();
            setShowConfirmationModal(false);
            toast.success((courseStatusToDelete) ? "OrderList Deactivated." : "OrderList Activated.");
        } catch (error) {
            console.error('Error deleting OrderList:', error);
        }
    };

    const handleDeleteConfirmation = (OrderListId, status) => {
        setOrderListIdToDelete(OrderListId);
        setCourseStatusToDelete(status);
        setShowConfirmationModal(true);
    };

    // * ====================================== Update Section Start ======================================

    const handleEdit = async (OrderListId) => {
        try {
            const response = await axios.get(`${API}/get/${OrderListId}`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            });
            setUpdateOrder(response.data.data);
            // console.log(response.data.data);
            setShowUpdateModal(true);
        } catch (error) {
            console.error('Error fetching OrderList details:', error);
        }
    };


    // * ====================================== View Section Start ======================================

    const handleViewOrderList = async (OrderListId) => {
        try {
            const response = await axios.get(`${API}/get/${OrderListId}`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            });
            setViewOrderList(response.data.data);
            console.log(response.data.data);
            setShowViewModal(true);
        } catch (error) {
            console.error('Error fetching OrderList details:', error);
        }
    };


    // * ====================================== Filter Section Start ======================================
    const [orderNumberFilter, setOrderNumberFilter] = useState('');
    const [fromDateFilter, setFromDateFilter] = useState('');
    const [toDateFilter, setToDateFilter] = useState('');
    const [filteredOrderList, setFilteredOrderList] = useState(OrderListList);

    useEffect(() => {
        applyFilters();
    }, [orderNumberFilter, fromDateFilter, toDateFilter]);

    const applyFilters = () => {
        let filteredList = OrderListList.filter(order => {
            // Filter by order number
            if (orderNumberFilter && !order.orderNumber.toLowerCase().includes(orderNumberFilter.toLowerCase())) {
                return false;
            }
            // Filter by date range
            if (fromDateFilter && toDateFilter) {
                const orderDate = new Date(order.orderDate);
                const fromDate = new Date(fromDateFilter);
                const toDate = new Date(toDateFilter);
                if (orderDate < fromDate || orderDate > toDate) {
                    return false;
                }
            }
            return true;
        });
        setFilteredOrderList(filteredList);
    };



    return (
        <div className="p-6 m-6 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">

                <h2 className="text-2xl font-bold mb-4 text-gray-800">All OrderList</h2>

                <div className="flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0">
                    <div className="w-full lg:w-auto">
                        <input
                            type="text"
                            placeholder="Search by Order Number"
                            className="border px-3 py-2 rounded-lg w-full"
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
                    <h2 className="text-xl font-semibold mb-4">Order Requested :-</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100 uppercase">
                                <tr>
                                    <th scope="col" className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider">Sl. No.</th>
                                    <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Order Number</th>
                                    <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Supplier</th>
                                    <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Order Date</th>

                                    <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Status</th>
                                    <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">

                                {filteredOrderList.map((course, index) => (
                                    <tr key={course.id} className="transition duration-300  ease-in-out hover:bg-gray-50">
                                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{index + 1 + currentPage * perPage}</td>
                                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{course.orderNumber}</td>
                                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{course.supplier.supplierName}</td>
                                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{course.orderDate}</td>

                                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">
                                            {course.status ? (
                                                <span className="text-green-500 font-medium">Delivery</span>
                                            ) : (
                                                <span className="text-red-500 font-medium">Pending</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">
                                            <div className="flex space-x-4">
                                                <button
                                                    onClick={() => handleViewOrderList(course.id)}
                                                    className="text-green-500 hover:text-green-700 transition font-semibold duration-300 ease-in-out"
                                                >
                                                    <FaEye />   
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(course.id)}
                                                    className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out"
                                                >
                                                    <FaEdit />
                                                </button>
                                                {/* <button
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
                    order={updateOrder}
                    onClose={() => setShowUpdateModal(false)}
                    onUpdate={() => {
                        fetchOrderListList();
                        toast.success("OrderList Updated Successfully.");
                    }}
                />
            )}


            {/* Update Modal */}
            {showViewModal && (
                <ViewModal
                    order={viewOrderList}
                    onClose={() => setShowViewModal(false)}
                />
            )}

            {/* Toast Container for displaying error messages */}
            <ToastContainer />
        </div>
    );
}
