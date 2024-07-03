import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from './ConfirmationModal';
import UpdateModal from './UpdateModal';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import ViewModal from './ViewModal';

const Product = () => {
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [productId, setproductId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  // const [image, setImage] = useState(null);
  const [productList, setProductList] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState({});

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewProduct, setViewProduct] = useState({});
  const [productStatusToDelete, setProductStatusToDelete] = useState(null);


  const perPage = 100;
  const API = `http://192.168.1.90:8082/masterservice/api/products`;
  const storedToken = localStorage.getItem('token');

  useEffect(() => {
    fetchCategoryList();
    fetchProductList();
  }, []);

  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/masterservice/api/category/get-categories`);
      setCategoryList(response.data);

    } catch (error) {
      console.error('Error fetching category list:', error);
    }
  };

  const fetchProductList = async () => {
    try {
      const response = await axios.get(`${API}/get-list?offset=${currentPage}&limit=${perPage}`);
      setProductList(response.data.data);
      setPageCount(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching product list:', error);
    }
  };

  // * ====================================== Adding A New Product ======================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const response = await axios.post(`${API}/add`, { productName, productCode, price, categoryId }, {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });
      setProductName('');
      setProductCode('');
      setPrice('');
      setCategoryId('');
      // setImage(null);
      toast.success(response.data.message);
      fetchProductList();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        console.error('Error adding product:', error);
      }
    }
  };

  const handleDeleteConfirmation = (productId, status) => {
    setProductIdToDelete(productId);
    setProductStatusToDelete(status);
    setShowConfirmationModal(true);

  };

  // * ====================================== Delete Section Start ======================================
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${API}/delete/${productIdToDelete}`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });
      fetchProductList();
      setShowConfirmationModal(false);
      toast.success((productStatusToDelete) ? "Category Deactivated." : "Category Activated.");
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // * ====================================== Update Section Start ======================================

  const handleEdit = async (productId) => {
    try {
      const response = await axios.get(`${API}/get/${productId}`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });
      setUpdateProduct(response.data.data);
      console.log(response.data.data);
      setShowUpdateModal(true);
    } catch (error) {
      console.error('Error fetching category details:', error);
    }
  };

  // * ====================================== View Section Start ======================================

  const handleViewProduct = async (productId) => {
    try {
      const response = await axios.get(`${API}/get/${productId}`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });
      setViewProduct(response.data.data);
      console.log(response.data.data);
      setShowViewModal(true);
    } catch (error) {
      console.error('Error fetching category details:', error);
    }
  };


  return (
    <div className="p-6 m-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="container mx-auto py-8">
          <h2 className="text-2xl font-semibold mb-4">Add Product</h2>
          <form onSubmit={handleSubmit} className="mb-8">
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
              <div>
                <label htmlFor="productCode" className="block text-sm font-medium text-gray-700">Product Code</label>
                <input type="text" id="productCode" value={productCode} onChange={(e) => setProductCode(e.target.value)}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full sm:text-sm"
                  placeholder='Enter Product Code'
                  required />
              </div>
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full sm:text-sm"
                  placeholder='Enter Product Name'
                  required />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  id="price"
                  value={price} onChange={(e) => setPrice(e.target.value)} 
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full sm:text-sm" 
                  placeholder='Enter Product Price'
                  required />
              </div>
              {/* <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Product Image</label>
                <input type="file" id="image" onChange={(e) => setImage(e.target.files[0])} className="mt-1 p-2 border border-gray-300 rounded-md w-full" required />
              </div> */}
            </div>
            <button type="submit" className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4">Add Product</button>
          </form>

          <div>
            <h2 className="text-xl font-semibold mb-4">Product List</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 uppercase">
                  <tr>
                    <th scope="col" className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider">Sl. No.</th>
                    <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">product Code</th>
                    <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">product Name</th>
                    {/* <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Duration</th> */}
                    <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Status</th>
                    <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productList.map((product, index) => (
                    <tr key={product.id} className="transition duration-300  ease-in-out hover:bg-gray-50">
                      <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{index + 1 + currentPage * perPage}</td>
                      <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{product.productCode}</td>
                      <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{product.productName}</td>
                      {/* <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{product.duration}</td> */}
                      <td className="px-6 py-2 text-gray-800 whitespace-nowrap">
                        {product.status ? (
                          <span className="text-green-500 font-medium">Activate</span>
                        ) : (
                          <span className="text-red-500 font-medium">Deactivate</span>
                        )}
                      </td>
                      <td className="px-6 py-2 text-gray-800 whitespace-nowrap">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleViewProduct(product.id)}
                            className="text-green-500 hover:text-green-700 transition duration-300 ease-in-out"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleEdit(product.id)}
                            className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteConfirmation(product.id, product.status)}
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

        <ConfirmationModal
          isOpen={showConfirmationModal}
          onCancel={() => setShowConfirmationModal(false)}
          onConfirm={handleDelete}
          status={productStatusToDelete}

        />

        {/* Update Modal */}
        {showUpdateModal && (
          <UpdateModal
            product={updateProduct}
            onClose={() => setShowUpdateModal(false)}
            categoryList={categoryList}
            onUpdate={() => {
              fetchProductList();
              toast.success("Product Updated Successfully.");
            }}
          />
        )}

        {/* Update Modal */}
        {showViewModal && (
          <ViewModal
            product={viewProduct}
            onClose={() => setShowViewModal(false)}
          />
        )}

        <ToastContainer />
      </div>
    </div>
  );
}

export default Product;