import { useState, useEffect } from 'react';
import { Button, Menu } from '@headlessui/react'; // Import Menu component from @headlessui/react
import Sidebar from './Sidebar'; // Import Sidebar component
import { Bell } from 'react-feather';
import { Link } from 'react-router-dom';
import adminPhoto from "../../assets/logo.jpg";
import { useAuth } from '../../auth/AuthContext';
import ConfirmationModal from './auth/ConfirmationModal';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { ScaleLoader } from 'react-spinners';

const Header = () => {

    const [loading, setLoading] = useState(false); // State to handle loading

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
        };

        handleResize(); // Call the function once to set initial state
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    const handleLogoutConfirmation = () => {
        setShowConfirmationModal(true);
    };

    return (
        <div>
            {/* Sidebar component */}
            {isMobile && (
                <Sidebar isOpen={isOpen} closeSidebar={closeSidebar} />
            )}

            {/* Header component */}
            <div className="relative">
                {/* Overlay */}
                {isMobile && isOpen && (
                    <div
                        className="fixed inset-0 bg-black opacity-50 z-40"
                        onClick={closeSidebar}

                    />
                )}

                {/* Header */}
                <div className="relative bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white h-12 md:h-12 flex items-center justify-between px-4 md:px-8 shadow-md">
                    <div className="absolute inset-1 opacity-30 z-0"></div>
                    {isMobile && (
                        <button className="md:hidden text-white focus:outline-none z-50 flex items-center justify-center rounded-full w-10 h-10" onClick={toggleSidebar}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    )}


                    <h2 className="text-xl font-bold text-white z-10">Dashboard</h2>
                    <div className="flex items-center z-10 space-x-4">
                        {/* Search Bar (Desktop Only) */}
                        {!isMobile && (
                            <div className="relative">
                                <input type="text" className="border border-gray-300 text-black rounded-lg py-1 px-3 focus:outline-none focus:border-blue-500" placeholder="Search..." />
                                <button className="absolute right-0 top-0 mt-1 mr-2">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.5 17.5l6 6"></path>
                                    </svg>
                                </button>
                            </div>
                        )}
                        {/* Notification Icon */}
                        <button className="text-gray-800 focus:outline-none">

                            <Bell className="h-7 w-7 text-white" />

                        </button>
                        <Menu as="div" className="relative">
                            <Menu.Button className="focus:outline-none">
                                <img
                                    src="https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png"
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full cursor-pointer"
                                />
                            </Menu.Button>
                            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="p-1 text-black">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/profile"
                                                className={`block p-2 w-full text-left ${active ? 'bg-gray-100' : ''}`}
                                            >
                                                Profile
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/settings"
                                                className={`block p-2 w-full text-left ${active ? 'bg-gray-100' : ''}`}
                                            >
                                                Settings
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Button

                                                className={`block p-2 w-full text-left ${active ? 'bg-gray-100' : ''}`}
                                                onClick={() => {
                                                    // logout(); // Call the logout function
                                                    handleLogoutConfirmation();
                                                }}
                                            >
                                                Logout
                                            </Button>
                                        )}
                                    </Menu.Item>

                                </div>
                            </Menu.Items>
                        </Menu>
                    </div>
                </div>
            </div>


            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showConfirmationModal}
                onCancel={() => setShowConfirmationModal(false)}
                onConfirm={async () => {
                    setLoading(true); // Set loading to true

                    // Use an immediately invoked async function expression (IIFE)
                    (async () => {
                        await new Promise((resolve) => setTimeout(resolve, 2000));
                        logout();
                        setLoading(false);

                    })();
                }}
            />

            <ToastContainer />


            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <ScaleLoader color="#fff" speedMultiplier={2} size={30} />
                </div>
            )}

        </div>


    );
};

export default Header;
