import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import UpdateModal from './UpdateModal';

export default function OrderRequestList() {

    const perPage = 10;
    const API = `http://192.168.1.90:8082/masterservice/api/order`;
    const storedToken = localStorage.getItem('token');  // This is temporary solution 


    const [purchaseData, setPurchaseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


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


    // * ====================================== Order List Section Start ======================================

    const fetchOrderListList = async () => {
        axios.get('http://localhost:8082/masterservice/api/reports/get-purchase-report')
            .then(response => {
                setPurchaseData(response.data.data);
                setLoading(false);
                setFilteredOrderList(response.data.data);


            })
            .catch(error => {
                console.error("Error fetching purchase data:", error);
                setError('Error fetching data. Please try again later.');
                setLoading(false);
            });
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

                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Purchase Reports</h2>

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
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100 uppercase">
                                <tr>
                                    <th scope="col" className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider">Sl. No.</th>
                                    <th className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider">Invoice Number</th>
                                    <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Bill Number</th>

                                    <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Supplier</th>
                                    <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Amount</th>

                                    <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">

                                {/* {filteredOrderList.map((course, index) => (
                                    <tr key={course.id} className="transition duration-300  ease-in-out hover:bg-gray-50">
                                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{index + 1 + currentPage * perPage}</td>
                                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{course.orderNumber}</td>
                                        <td className="px-6 py-2 whitespace-nowrap">
                                            {course.invoiceNumber ? (
                                                <span className="text-gray-800">{course.invoiceNumber}</span>
                                            ) : (
                                                <span className="text-red-500 font-semibold">Pending</span>
                                            )}
                                        </td>

                                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{course.supplier.supplierName}</td>
                                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{course.orderDate}</td>

                                        <td className="px-6 py-2 whitespace-nowrap">
                                            {course.deliveryDate ? (
                                                <span className="text-gray-800">{course.deliveryDate}</span>
                                            ) : (
                                                <span className="text-red-500 font-semibold">Pending</span>
                                            )}
                                        </td>

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
                                                    onClick={() => handleEdit(course.id)}
                                                    className="text-blue-500 hover:text-blue-700 transition font-semibold duration-300 ease-in-out"
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))} */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            {/* Update Modal */}
            {showUpdateModal && (
                <UpdateModal
                    order={updateOrder}
                    onClose={() => setShowUpdateModal(false)}
                    onUpdate={() => {
                        fetchOrderListList();
                        toast.success("Order Deliver Successfully.");
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
