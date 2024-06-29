import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faBook, faUserGraduate, faChalkboardTeacher, faCog, faCertificate } from '@fortawesome/free-solid-svg-icons';
import logo from "../assets/22.png";
import { useAuth } from '../../auth/AuthContext';

const Sidebar = ({ isOpen, closeSidebar }) => {
    const { role } = useAuth();
    const { name } = useAuth();

    const [isMasterOpen, setIsMasterOpen] = useState(false); // State to manage dropdown

    const toggleMaster = () => {
        setIsMasterOpen(!isMasterOpen);
    };
    return (
        <div
            className={`fixed h-full md:relative z-50 top-0 left-0 ${isOpen ? 'w-64' : 'w-0'} overflow-hidden transition-all duration-300 md:w-64`}
            style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1596597937550-d10c69e6411f?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MXx8fGVufDB8fHx8fA%3D%3D)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div className="absolute inset-0 bg-black opacity-70 z-0"></div>
            <div className={`p-4 relative z-10 ${isOpen ? 'block' : 'hidden'} md:block flex-grow`}>
                <div className="mb-4 text-center">
                    <img
                        src={logo}
                        alt="Company Logo"
                        className="w-25 mx-auto mb-4 rounded-full shadow-lg transform hover:scale-105 transition duration-300" />
                    <h2 className="text-xl text-white font-bold">Sparrow Softech</h2>
                </div>
                <hr className="border-t border-gray-500 mb-4" />
                <ul className='font-semibold text-sm px-4'>
                    <li className="py-2">
                        <NavLink
                            exact
                            to="/"
                            className={({ isActive }) =>
                                `text-white flex items-center rounded-lg px-4 py-2 transition-all duration-300 transform ${isActive ? 'bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] shadow-2xl scale-105' : 'hover:bg-gradient-to-r hover:from-[#ff416c] hover:to-[#ff4b2b] hover:shadow-lg '}`
                            }
                            onClick={closeSidebar}
                        >
                            <FontAwesomeIcon icon={faTachometerAlt} className="mr-3 text-lg" />
                            <span className="flex-1">Overview</span>
                        </NavLink>
                    </li>


                    {/* Additional sidebar links */}
                    {role === 'ROLE_ADMIN' && (
                        <>
                            {/* <li className="py-2">
                                <NavLink
                                    to="/courses"
                                    className={({ isActive }) =>
                                        `text-white flex items-center rounded-lg px-4 py-2 transition-all duration-300 transform ${isActive ? 'bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] shadow-2xl scale-110' : 'hover:bg-gradient-to-r hover:from-[#ff416c] hover:to-[#ff4b2b] hover:shadow-lg hover:scale-105'}`
                                    }
                                    onClick={closeSidebar}
                                >
                                    <FontAwesomeIcon icon={faBook} className="mr-3 text-lg" />
                                    <span className="flex-1">Courses</span>
                                </NavLink>
                            </li>
                            <li className="py-2">
                                <NavLink
                                    to="/students"
                                    className={({ isActive }) =>
                                        `text-white flex items-center rounded-lg px-4 py-2 transition-all duration-300 transform ${isActive ? 'bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] shadow-2xl scale-110' : 'hover:bg-gradient-to-r hover:from-[#ff416c] hover:to-[#ff4b2b] hover:shadow-lg hover:scale-105'}`
                                    }
                                    onClick={closeSidebar}
                                >
                                    <FontAwesomeIcon icon={faUserGraduate} className="mr-3 text-lg" />
                                    <span className="flex-1">Students</span>
                                </NavLink>
                            </li>
                            <li className="py-2">
                                <NavLink
                                    to="/instructors"
                                    className={({ isActive }) =>
                                        `text-white flex items-center rounded-lg px-4 py-2 transition-all duration-300 transform ${isActive ? 'bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] shadow-2xl scale-110' : 'hover:bg-gradient-to-r hover:from-[#ff416c] hover:to-[#ff4b2b] hover:shadow-lg hover:scale-105'}`
                                    }
                                    onClick={closeSidebar}
                                >
                                    <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-3 text-lg" />
                                    <span className="flex-1">Instructors</span>
                                </NavLink>
                            </li> */}
                            {/* Add more sidebar links for admin */}
                            {/* Master */}
                            <li className="py-2">
                                <div
                                    className={`text-white flex items-center rounded-lg px-4 py-2 cursor-pointer transition-all duration-300 transform ${isMasterOpen
                                        ? 'bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] shadow-2xl scale-105'
                                        : 'hover:bg-gradient-to-r hover:from-[#ff416c] hover:to-[#ff4b2b] hover:shadow-lg '
                                        }`}
                                    onClick={toggleMaster}
                                >
                                    <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-3 text-lg" />
                                    <span className="flex-1">Master</span>
                                    <svg
                                        className={`w-4 h-4 ml-auto transition-transform ${isMasterOpen ? 'transform rotate-90' : ''
                                            }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6.293 5.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>

                                {/* Dropdown items */}
                                {isMasterOpen && (
                                    <ul className="pl-4 mt-2">
                                        <li className="py-2">
                                            <NavLink
                                                to="/categories"
                                                className="text-white flex items-center rounded-lg px-4 py-2 hover:bg-gradient-to-r hover:from-[#ff416c] hover:to-[#ff4b2b] hover:shadow-lg hover:scale-105"
                                                onClick={closeSidebar}
                                            >
                                                    Category
                                            </NavLink>
                                        </li>
                                        <li className="py-2">
                                            <NavLink
                                                to="/products"
                                                className="text-white flex items-center rounded-lg px-4 py-2 hover:bg-gradient-to-r hover:from-[#ff416c] hover:to-[#ff4b2b] hover:shadow-lg hover:scale-105"
                                                onClick={closeSidebar}
                                            >
                                                Product
                                            </NavLink>
                                        </li>
                                        <li className="py-2">
                                            <NavLink
                                                to="/suppliers"
                                                className="text-white flex items-center rounded-lg px-4 py-2 hover:bg-gradient-to-r hover:from-[#ff416c] hover:to-[#ff4b2b] hover:shadow-lg hover:scale-105"
                                                onClick={closeSidebar}
                                            >
                                                Supplier
                                            </NavLink>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        </>
                    )}


                    {role === 'ROLE_USER' && (
                        <>


                        </>
                    )}

                    {/* <li className="py-2">
                        <NavLink
                            to="/certification"
                            className={({ isActive }) =>
                                `text-white flex items-center rounded-lg px-4 py-2 transition-all duration-300 transform ${isActive ? 'bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] shadow-2xl scale-110' : 'hover:bg-gradient-to-r hover:from-[#ff416c] hover:to-[#ff4b2b] hover:shadow-lg hover:scale-105'}`
                            }
                            onClick={closeSidebar}
                        >
                            <FontAwesomeIcon icon={faCertificate} className="mr-3 text-lg" />
                            <span className="flex-1">Certification</span>
                        </NavLink>
                    </li> */}

                    <li className="py-2">
                        <NavLink
                            to="/settings"
                            className={({ isActive }) =>
                                `text-white flex items-center rounded-lg px-4 py-2 transition-all duration-300 transform ${isActive ? 'bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] shadow-2xl scale-105' : 'hover:bg-gradient-to-r hover:from-[#ff416c] hover:to-[#ff4b2b] hover:shadow-lg '}`
                            }
                            onClick={closeSidebar}
                        >
                            <FontAwesomeIcon icon={faCog} className="mr-3 text-lg" />
                            <span className="flex-1">Settings</span>
                        </NavLink>
                    </li>

                </ul>
            </div>
            <div className="p-8 text-center text-white mt-auto">
                <div className="bg-gradient-to-r from-blue-800 to-green-600 rounded-lg p-4 shadow-lg transform hover:scale-105 transition duration-300">
                    <img src="https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png" alt="User" className="w-16 h-16 mx-auto mb-2 rounded-full shadow-md" />
                    {/* {role === 'ROLE_ADMIN' ? (
                        <p className="text-sm font-bold">Welcome, {name}</p>
                    ) : (
                        <p className="text-sm font-bold">Welcome, {name}</p>
                    )} */}
                    <p className="text-sm font-bold">Welcome, {name}</p>
                    <p className="text-xs mt-2">Logged in as {role}</p>
                </div>
            </div>

        </div>
    );
};

export default Sidebar;
