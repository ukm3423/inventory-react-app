import  { useState } from 'react';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AddStudent from './AddStudent';

export default function Students() {
  const [students, setStudents] = useState([
    { id: 1, regNo: '202101', name: 'John Doe', course: 'Computer Science' },
    { id: 2, regNo: '202102', name: 'Jane Smith', course: 'Business Administration' },
    { id: 3, regNo: '202103', name: 'Alice Johnson', course: 'Mathematics' },
    { id: 4, regNo: '202104', name: 'Bob Brown', course: 'Physics' },
    { id: 5, regNo: '202105', name: 'Charlie Davis', course: 'Chemistry' },
    { id: 6, regNo: '202106', name: 'Diana Evans', course: 'Biology' },
    { id: 7, regNo: '202107', name: 'Eve Foster', course: 'History' },
    { id: 8, regNo: '202108', name: 'Frank Green', course: 'Philosophy' },
    { id: 9, regNo: '202109', name: 'Grace Harris', course: 'English' },
    { id: 10, regNo: '202110', name: 'Hank Ivers', course: 'Political Science' },
    { id: 11, regNo: '202111', name: 'Ivy Jenkins', course: 'Sociology' },
    { id: 12, regNo: '202112', name: 'Jack King', course: 'Economics' },
    { id: 13, regNo: '202113', name: 'Karen Lee', course: 'Psychology' },
    { id: 14, regNo: '202114', name: 'Leo Martinez', course: 'Art' },
    { id: 15, regNo: '202115', name: 'Mia Nelson', course: 'Music' },
  ]);

  const nav = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const studentsPerPage = 10;


  const handleUpdateStudent = (id) => {
    alert(`Update student with id: ${id}`);
  };

  const handleDeleteStudent = (id) => {
    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);
  };

  const handleViewStudent = (id) => {
    alert(`View student with id: ${id}`);
  };

  const handleAddStudent = () => {
    nav("addstudent");
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * studentsPerPage;
  const currentStudents = students.slice(offset, offset + studentsPerPage);
  const pageCount = Math.ceil(students.length / studentsPerPage);


  return (
    <div className='p-6 '>

      <Routes>
        <Route path="/" element={

          <>
            <div className='p-6 bg-white rounded-lg shadow-md'>



              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">Students</h1>
                  <button
                    onClick={handleAddStudent}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                  >
                    <FaPlus className="mr-2" /> Add New Student
                  </button>
                </div>
                <div className="bg-white ">
                  <div className=" ">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg. Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentStudents.map((student) => (
                            <tr key={student.id} className="transition duration-300 ease-in-out hover:bg-gray-50">
                              <td className="px-6 py-3 whitespace-nowrap">{student.id}</td>
                              <td className="px-6 py-3 whitespace-nowrap">{student.regNo}</td>
                              <td className="px-6 py-3 whitespace-nowrap">{student.name}</td>
                              <td className="px-6 py-3 whitespace-nowrap">{student.course}</td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                <div className="flex space-x-4">
                                  <button
                                    onClick={() => handleViewStudent(student.id)}
                                    className="text-green-500 hover:text-green-700 transition duration-300 ease-in-out"
                                  >
                                    <FaEye />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStudent(student.id)}
                                    className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteStudent(student.id)}
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
                    <div className="mt-6 flex justify-center">
                      <ReactPaginate
                        previousLabel={'Previous'}
                        nextLabel={'Next'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'}
                        pageClassName="mx-1 px-3 py-1 border rounded-md hover:bg-blue-200 cursor-pointer"
                        activeClassName="bg-blue-500 text-white"
                        previousClassName="mx-1 px-3 py-1 border rounded-md hover:bg-blue-200 cursor-pointer"
                        nextClassName="mx-1 px-3 py-1 border rounded-md hover:bg-blue-200 cursor-pointer"
                        disabledClassName="opacity-50 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </>
        } />

        <Route path="addstudent" element={<AddStudent />} />


      </Routes>

    </div >

  );
}
