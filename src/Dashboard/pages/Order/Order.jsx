import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from './ConfirmationModal';
import UpdateModal from './UpdateModal';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import ViewModal from './ViewModal';

const Order = () => {
  const [OrderCode, setOrderCode] = useState('');
  const [OrderName, setOrderName] = useState('');
  const [price, setPrice] = useState('');
  const [OrderId, setOrderId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [productId, setProductId] = useState('');


  const [quantity, setQuantity] = useState('');
  const [rate, setRate] = useState('');

  
  const [setList, setProductDetailsList] = useState([]);

  const [categoryList, setCategoryList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);

  const [productList, setProductList] = useState([]);

  // const [image, setImage] = useState(null);
  const [OrderList, setOrderList] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [OrderIdToDelete, setOrderIdToDelete] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateOrder, setUpdateOrder] = useState({});

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewOrder, setViewOrder] = useState({});
  const [OrderStatusToDelete, setOrderStatusToDelete] = useState(null);


  const perPage = 100;
  const API = `http://192.168.1.90:8082/masterservice/api/Orders`;
  const storedToken = localStorage.getItem('token');

  const [date, setDate] = useState('');

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  useEffect(() => {

    const currentDate = new Date().toISOString().substr(0, 10); // Format: YYYY-MM-DD
    setDate(currentDate);

    fetchCategoryList();
    fetchProductList();
    fetchSupplierList();
    fetchOrderList();
  }, []);

  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(`http://192.168.1.90:8082/masterservice/api/category/get-list`);
      setCategoryList(response.data);

    } catch (error) {
      console.error('Error fetching category list:', error);
    }
  };

  const fetchProductList = async () => {
    try {
      const response = await axios.get(`http://192.168.1.90:8082/masterservice/api/products/get-list`);
      setProductList(response.data);

    } catch (error) {
      console.error('Error fetching category list:', error);
    }
  };

  const fetchSupplierList = async () => {
    try {
      const response = await axios.get(`http://192.168.1.90:8082/masterservice/api/supplier/get-list`);
      setSupplierList(response.data);

    } catch (error) {
      console.error('Error fetching category list:', error);
    }
  };

  const fetchOrderList = async () => {
    try {
      const response = await axios.get(`${API}/get-list?offset=${currentPage}&limit=${perPage}`);
      setOrderList(response.data.data);
      setPageCount(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching Order list:', error);
    }
  };

  // * ====================================== Adding A New Order ======================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const response = await axios.post(`${API}/add`, { OrderName, OrderCode, price, categoryId }, {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });
      setOrderName('');
      setOrderCode('');
      setPrice('');
      setCategoryId('');
      // setImage(null);
      toast.success(response.data.message);
      fetchOrderList();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        console.error('Error adding Order:', error);
      }
    }
  };

  const handleDeleteConfirmation = (OrderId, status) => {
    setOrderIdToDelete(OrderId);
    setOrderStatusToDelete(status);
    setShowConfirmationModal(true);

  };

  // * ====================================== Delete Section Start ======================================
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${API}/delete/${OrderIdToDelete}`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });
      fetchOrderList();
      setShowConfirmationModal(false);
      toast.success((OrderStatusToDelete) ? "Category Deactivated." : "Category Activated.");
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // * ====================================== Update Section Start ======================================

  const handleEdit = async (OrderId) => {
    try {
      const response = await axios.get(`${API}/get/${OrderId}`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });
      setUpdateOrder(response.data.data);
      console.log(response.data.data);
      setShowUpdateModal(true);
    } catch (error) {
      console.error('Error fetching category details:', error);
    }
  };

  // * ====================================== View Section Start ======================================

  const handleViewOrder = async (OrderId) => {
    try {
      const response = await axios.get(`${API}/get/${OrderId}`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });
      setViewOrder(response.data.data);
      console.log(response.data.data);
      setShowViewModal(true);
    } catch (error) {
      console.error('Error fetching category details:', error);
    }
  };

  // * ====================================== Add Product in List ====================================== 

  // Handle adding a product to the list
  const handleAddProduct = () => {
    const product = {
      categoryId,
      productId,
      quantity,
      rate,
    };
    setProductDetailsList([...setList, product]);
    
    // Clear fields after adding product
    setCategoryId('');
    setProductId('');
    setQuantity('');
    setRate('');
    setOrderCode('');
    setOrderName('');
   
  };
  return (
    <div className="p-6 m-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold text-gray-800">Purchase Order</h1>
        </div>
        <div className="mb-4">
          <form onSubmit={handleSubmit} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Details :-</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="form-group">
                <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">
                  Order Id
                </label>
                <input
                  type="text"
                  id="orderId"
                  // value={orderId}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full sm:text-sm"
                  placeholder="Auto-generated Order Id"
                  disabled
                />
              </div>
              {supplierList && supplierList.data && (
                <div>
                  <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">Supplier</label>
                  <select id="supplier" value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full sm:text-sm" required>
                    <option value="">Select Supplier</option>
                    {supplierList.data.map((category) => (
                      <option key={category.id} value={category.id}>{category.supplierName}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={handleDateChange}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full sm:text-sm"
                  placeholder="Select Date"
                  required
                />
              </div>

            </div>

            <div className='mt-8'>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 ">Product Details :-</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {categoryList && categoryList.data && (
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full sm:text-sm" required>
                      <option value="">Select Category</option>
                      {categoryList.data.map((category) => (
                        <option key={category.id} value={category.id}>{category.categoryName}</option>
                      ))}
                    </select>
                  </div>
                )}
                {productList && productList.data && (
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Product</label>
                    <select id="category" value={productId} onChange={(e) => setProductId(e.target.value)} className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full sm:text-sm" required>
                      <option value="">Select Product</option>
                      {productList.data.map((product) => (
                        <option key={product.id} value={product.id}>{product.productName}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full sm:text-sm" placeholder="Enter Quantity" required />
                </div>
                <div>
                  <label htmlFor="rate" className="block text-sm font-medium text-gray-700">Rate</label>
                  <input type="number" id="rate" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full sm:text-sm" placeholder="Enter Rate" required />
                </div>

              </div>
            </div>

            <button type="button" onClick={handleAddProduct} className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4">Add Product</button>


            <div className='mt-8'>
              <h2 className="text-xl font-semibold mb-4">Product List :-</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100 uppercase">
                    <tr>
                      <th scope="col" className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider">Product</th>
                      <th scope="col" className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider">Quantity</th>
                      <th scope="col" className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider">Rate</th>
                      <th scope="col" className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {setList.map((product, index) => (
                      <tr key={index} className="transition duration-300  ease-in-out hover:bg-gray-50">
                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{product.categoryId}</td>
                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{product.productId}</td>
                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{product.quantity}</td>
                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{product.rate}</td>
                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{product.quantity * product.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button type="submit" className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mt-4 uppercase">Submit</button>
          </form>

          

          {/* <div className="mt-4">
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              breakLabel={'...'}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination flex justify-center'}
              activeClassName={'bg-blue-500 text-white'}
              previousClassName={'px-3 py-1 bg-gray-200 rounded-md mr-2 hover:bg-gray-300'}
              nextClassName={'px-3 py-1 bg-gray-200 rounded-md ml-2 hover:bg-gray-300'}
              disabledClassName={'px-3 py-1 bg-gray-200 rounded-md mr-2'}
            />
          </div> */}
        </div>

        <ConfirmationModal
          isOpen={showConfirmationModal}
          onCancel={() => setShowConfirmationModal(false)}
          onConfirm={handleDelete}
          status={OrderStatusToDelete}

        />

        {/* Update Modal */}
        {showUpdateModal && (
          <UpdateModal
            Order={updateOrder}
            onClose={() => setShowUpdateModal(false)}
            categoryList={categoryList}
            onUpdate={() => {
              fetchOrderList();
              toast.success("Order Updated Successfully.");
            }}
          />
        )}

        {/* Update Modal */}
        {showViewModal && (
          <ViewModal
            Order={viewOrder}
            onClose={() => setShowViewModal(false)}
          />
        )}

        <ToastContainer />
      </div>
    </div>
  );
}

export default Order;