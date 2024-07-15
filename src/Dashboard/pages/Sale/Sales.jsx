import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from './ConfirmationModal';
import UpdateModal from './UpdateModal';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import ViewModal from './ViewModal';

const Sales = () => {
  const [OrderCode, setOrderCode] = useState('');
  const [OrderName, setOrderName] = useState('');
  const [price, setPrice] = useState('');
  const [OrderId, setOrderId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [contactNo, setContactNo] = useState('');

  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');



  const [quantity, setQuantity] = useState('');
  const [rate, setRate] = useState(0);


  const [saleDetailsList, setSaleDetailsList] = useState([]);

  const [categoryList, setCategoryList] = useState([]); // Initialize as null
  const [supplierList, setSupplierList] = useState([]);

  const [productList, setProductList] = useState([]);

  // const [image, setImage] = useState(null);
  const [OrderList, setOrderList] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [OrderIdToDelete, setCategoryIdToDelete] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateOrder, setUpdateOrder] = useState({});

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewOrder, setViewOrder] = useState({});
  const [OrderStatusToDelete, setProductIdToDelete] = useState(null);



  const perPage = 100;
  // const API = `http://localhost:8080/masterservice/api/Orders`;
  const API = `http://192.168.1.90:8082/masterservice/api/sale`;

  const storedToken = localStorage.getItem('token');

  const [date, setDate] = useState('');

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  useEffect(() => {

    const currentDate = new Date().toISOString().substr(0, 10); // Format: YYYY-MM-DD
    setDate(currentDate);

    fetchCategoryList();
    // fetchProductList();
    fetchSupplierList();
    fetchOrderList();
  }, []);

  // * ====================================== Add Product in List ====================================== 

  const handleAddProduct = () => {

    // Ensure categoryList and productList are not empty
    if (!categoryList || categoryList.length === 0 || !productList || productList.length === 0) {
      console.error('Category list or product list is empty');
      return;
    }

    // Find selected category and product objects
    const selectedCategory = categoryList.find(category => category.id == categoryId);
    const selectedProduct = productList.find(product => product.id == productId);

    if (!selectedCategory || !selectedProduct) {
      console.error('Selected category or product not found');
      return;
    }
    if (quantity <= 0) {
      toast.error('Please enter quantity !!!');
      return;
    }

    // Check if the product already exists in saleDetailsList
    const existingProduct = saleDetailsList.find(product => product.categoryId == categoryId && product.productId == productId);

    if (existingProduct) {
      toast.error('Product already exists in List !!');
      console.warn('Product already exists in the list');
      return;
    }

    // Create product object with categoryName and productName
    let product = {
      categoryId,
      categoryName: selectedCategory.categoryName,
      productId,
      productName: selectedProduct.productName,
      quantity,
      rate
    };

    console.log('Adding Product:', product);

    setSaleDetailsList([...saleDetailsList, product]);

    // Clear fields after adding product
    setCategoryId('');
    setProductId('');
    setQuantity('');
    setRate(0);
  };

  // =============================================
  const handleProductChange = (e) => {
    const selectedProductId = e.target.value;
    setProductId(selectedProductId);
    const price = productList.find(product => product.id == selectedProductId).price;
    setRate(price);
  };

  // ===========================================================================================================================
  const fetchCategoryList = async () => {
    try {
      const response = await axios.get('http://192.168.1.90:8082/masterservice/api/category/get-categories-list');
      setCategoryList(response.data.data);
      console.log(categoryList);
    } catch (error) {
      console.error('Error fetching category list:', error);
    }
  };

  const fetchProductList = async (categoryId) => {
    try {
      const response = await axios.get(`http://192.168.1.90:8082/masterservice/api/products/get-delivered-products/${categoryId}`);
      setProductList(response.data.data);

      console.log(productList);
    } catch (error) {
      console.error('Error fetching product list:', error);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setCategoryId(selectedCategoryId);
    setProductId(''); // Reset productId when category changes
    if (selectedCategoryId) {
      fetchProductList(selectedCategoryId);
    } else {
      setProductList(null); // Clear product list if no category selected
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

      // Check if saleDetailsList has at least one product
      if (saleDetailsList.length === 0) {
        toast.error('Please add at least one product to the sale.');
        return;
      }

      const response = await axios.post(`${API}/add`, { saleDetailsList, customerName, contactNo, date }, {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });
      setContactNo('');
      setCustomerName('');
      // setPrice('');
      // setImage(null);
      const billNo = response.data.data.billNumber;
      toast.success(`Sale Successful!\n\nBill No: ${billNo}`);
      setSaleDetailsList([]);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.errors.message);
      } else {
        console.error('Error adding Order:', error);
      }
    }
  };

  const handleDeleteConfirmation = (OrderId, status) => {

    setCategoryIdToDelete(OrderId);
    setProductIdToDelete(status);
    setShowConfirmationModal(true);

  };

  // * ====================================== Delete Section Start ======================================
  const handleDelete = async (e) => {
    try {
      e.preventDefault(); // Prevent default form submission behavior (if applicable)
      const existingProductIndex = saleDetailsList.findIndex(product => product.categoryId == OrderIdToDelete && product.productId == OrderStatusToDelete);
      if (existingProductIndex !== -1) {
        // Remove item from saleDetailsList
        saleDetailsList.splice(existingProductIndex, 1);
        // Update state to reflect the deletion (assuming saleDetailsList is a state variable)
        setSaleDetailsList([...saleDetailsList]);

        setShowConfirmationModal(false);
        toast.success(OrderStatusToDelete ? "Product Deleted." : "Something Went Wrong...");

        // Reset orderIdToDelete after successful deletion
        setCategoryIdToDelete(null);
        setProductIdToDelete(null);
      } else {
        console.log("Item not found in saleDetailsList.");
      }
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


  // ====================================================
  const calculateGrandTotal = () => {
    let total = 0;
    saleDetailsList.forEach(product => {
      total += product.quantity * product.rate;
    });
    return total;

  };

  // ===================== Check for Valid Contact No =================
  const handleContactNoChange = (e) => {
    const inputContactNo = e.target.value;

    // Check if the entered value is a number and is not more than 10 digits
    if (/^\d{0,10}$/.test(inputContactNo)) {
      setContactNo(inputContactNo);
    }
    // Optionally, you can show an error message or handle invalid input in another way
  };

  // ===================== Fetching Data on Mount ====================
  return (
    <div className="p-6 m-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold text-center text-gray-700">Sale Details :-</h1>
        </div>
        <div className="mb-4">
          <form onSubmit={handleSubmit} className="mb-8">
            {/* <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Details :-</h2> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">
                  Bill Number
                </label>
                <input
                  type="text"
                  id="orderId"
                  // value={orderId}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full sm:text-sm"
                  placeholder="Auto-generated Bill Number"
                  disabled
                />
              </div>
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
              <div>
                <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">Customer Name</label>
                <input
                  type="text"
                  id="orderId"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full sm:text-sm"
                  placeholder="Enter Customer Name "
                  required
                />
              </div>
              <div>
                <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="tel"  // Use type="tel" for better support of phone numbers
                  id="orderId"
                  value={contactNo}
                  onChange={handleContactNoChange}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full sm:text-sm"
                  placeholder="Enter Contact Number"
                  maxLength={10}  // Optional: enforce maximum length directly in the input field
                  required
                />
              </div>

            </div>

            <div className='mt-8'>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 ">Product Details :-</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {categoryList && categoryList.length > 0 && ( // Check if categoryList is not null and is an array
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      id="category"
                      value={categoryId}
                      onChange={handleCategoryChange}
                      className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full sm:text-sm"

                    >
                      <option value="">Select Category</option>
                      {categoryList.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {productList && (
                  <div>
                    <label htmlFor="product" className="block text-sm font-medium text-gray-700">
                      Product
                    </label>
                    <select
                      id="product"
                      value={productId}
                      onChange={handleProductChange}
                      className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full sm:text-sm"

                    >
                      <option value="">Select Product</option>
                      {productList.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.productName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label htmlFor="rate" className="block text-sm font-medium text-gray-700">Rate</label>
                  <input
                    type="number"
                    id="rate"
                    value={rate}
                    // onChange={(e) => setRate(e.target.value)}

                    className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full sm:text-sm"
                    disabled
                  />
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full sm:text-sm" placeholder="Enter Quantity" />
                </div>


              </div>
            </div>

            <button type="button" onClick={handleAddProduct} className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4">Add Product</button>


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
                      <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Actions</th>

                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {saleDetailsList.map((product, index) => (
                      <tr key={index} className="transition duration-300  ease-in-out hover:bg-gray-50">
                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{product.categoryName}</td>
                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{product.productName}</td>
                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{product.quantity}</td>
                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{product.rate}</td>
                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{product.quantity * product.rate}</td>
                        <td className="px-6 py-2 text-gray-800 whitespace-nowrap">
                          <div className="flex space-x-4">
                            {/* <button
                              onClick={() => handleEdit(product.id)}
                              className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out"
                            >
                              <FaEdit />
                            </button> */}
                            <button
                              type='button'
                              onClick={() => handleDeleteConfirmation(product.categoryId, product.productId)}
                              className="text-red-500 hover:text-red-700 transition duration-300 font-semibold ease-in-out"
                            >
                              {/* <FaTrash /> */} Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>


                </table>


              </div>
              <div className='mt-4'>
                <tfoot>
                  <tr className="bg-gray-100">
                    <td colSpan="4" className="px-6 py-2 text-right text-lg font-semibold">Grand Total:</td>
                    <td className="px-6 py-2 text-lg font-semibold">{calculateGrandTotal()}</td>
                    <td></td> {/* Empty cell for Actions column alignment */}
                  </tr>
                </tfoot>
              </div>
              <div>
                <button type="submit" className="px-3 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 mt-4 uppercase">Submit</button>

              </div>
            </div>


          </form>

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

export default Sales;