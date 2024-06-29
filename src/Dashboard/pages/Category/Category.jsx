import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import ConfirmationModal from './ConfirmationModal';
import UpdateModal from './UpdateModal';
import ViewModal from './ViewModal';

export default function Category() {

  const perPage = 10;
  const API = `http://localhost:8080/masterservice/api/category`;
  const storedToken = localStorage.getItem('token');  // This is temporary solution 


  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategory] = useState([]);

  const [categoryList, setcategoryList] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // Updated state for current page

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [categoryIdToDelete, setcategoryIdToDelete] = useState(null);
  const [courseStatusToDelete, setCourseStatusToDelete] = useState(null);


  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateCourse, setUpdateCourse] = useState({});

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewCategory, setViewCategory] = useState({});

  // * ====================================== Adding A New Course ======================================

  const handleAddCourse = async () => {
    try {
      const response = await axios.post(`${API}/add`, { categoryName, description }, {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });
      setCategoryName('');
      setDescription('');
      fetchcategoryList();
      toast.success(response.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        console.error('Error adding course:', error);
      }
    }
  };

  // * ====================================== Course List Section Start ======================================

  const fetchcategoryList = async () => {
    try {
      const response = await axios.get(`${API}/get-list?offset=${currentPage}&limit=${perPage} `, {

        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });

      setcategoryList(response.data.data);
      setPageCount(response.data.totalPages); // Update pageCount with totalPages from response
    } catch (error) {
      console.error('Error fetching category list:', error);
    }
  };

  useEffect(() => {
    fetchcategoryList();
  }, [currentPage]); // Trigger fetchCategoryList when currentPage changes

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected); // Update currentPage state when page changes
  };

  // * ====================================== Delete Section Start ======================================
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${API}/delete/${categoryIdToDelete}`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });
      fetchcategoryList();
      setShowConfirmationModal(false);
      toast.success((courseStatusToDelete) ? "Category Deactivated." : "Category Activated.");
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleDeleteConfirmation = (categoryId, status) => {
    setcategoryIdToDelete(categoryId);
    setCourseStatusToDelete(status);
    setShowConfirmationModal(true);
  };

  // * ====================================== Update Section Start ======================================

  const handleEdit = async (categoryId) => {
    try {
      const response = await axios.get(`${API}/get/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });
      setUpdateCourse(response.data.data);
      console.log(response.data.data);
      setShowUpdateModal(true);
    } catch (error) {
      console.error('Error fetching category details:', error);
    }
  };


  // * ====================================== View Section Start ======================================

  const handleViewCategory = async (categoryId) => {
    try {
      const response = await axios.get(`${API}/get/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });
      setViewCategory(response.data.data);
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add New Category</h2>
          <form className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
            <div>
              <label htmlFor="categoryId" className="text-gray-700 font-medium mb-2 block">Category Name </label>
              <input
                type="text"
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter Category Name "
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-yellow-500  sm:text-sm"
                
              />
            </div>
            <div>
              <label htmlFor="categoryName" className="text-gray-700 font-medium mb-2 block">Description </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-yellow-500 sm:text-sm"
              />
            </div>
           
          </form>
          <button onClick={handleAddCourse} className="btn bg-gradient-to-r font-medium from-blue-500 to-indigo-500 text-white px-4 py-1.5 mt-5 rounded-md hover:shadow-lg transition">Add Course</button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Course List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 uppercase">
                <tr>
                  <th scope="col" className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider">Sl. No.</th>
                  <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Course Name</th>
                  {/* <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Duration</th> */}
                  <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Status</th>
                  <th className="px-6 py-2 text-left  text-sm font-medium text-gray-500  tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categoryList.map((course, index) => (
                  <tr key={course.id} className="transition duration-300  ease-in-out hover:bg-gray-50">
                    <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{index + 1 + currentPage * perPage}</td>
                    <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{course.categoryName}</td>
                    {/* <td className="px-6 py-2 text-gray-800 whitespace-nowrap">{course.duration}</td> */}
                    <td className="px-6 py-2 text-gray-800 whitespace-nowrap">
                      {course.status ? (
                        <span className="text-green-500 font-medium">Activate</span>
                      ) : (
                        <span className="text-red-500 font-medium">Deactivate</span>
                      )}
                    </td>
                    <td className="px-6 py-2 text-gray-800 whitespace-nowrap">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleViewCategory(course.id)}
                          className="text-green-500 hover:text-green-700 transition duration-300 ease-in-out"
                        >
                          <FaEye />
                        </button>
                        <button
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
        status={courseStatusToDelete}
      />

      {/* Update Modal */}
      {showUpdateModal && (
        <UpdateModal
          course={updateCourse}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={() => {
            fetchcategoryList();
            toast.success("Course Updated Successfully.");
          }}
        />
      )}


      {/* Update Modal */}
      {showViewModal && (
        <ViewModal
          course={viewCategory}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {/* Toast Container for displaying error messages */}
      <ToastContainer />
    </div>
  );
}
