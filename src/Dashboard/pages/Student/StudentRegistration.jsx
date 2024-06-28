import React, { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import OTPModal from './OTPModal';
import { ScaleLoader } from 'react-spinners';
// import { showCustomToast, ToastContainer } from '../../components/CustomToast'; // Import the custom toast functions


function StudentRegistration() {
    const API = "http://localhost:8080";
    const storedToken = localStorage.getItem('token');
    const nav = useNavigate();

    const [myData, setMyData] = useState({ state: '', city: '' });
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [loading, setLoading] = useState(false); // State to handle loading


    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        regNo: '',
        firstName: '',
        middleName: '',
        lastName: '',
        dob: '',
        gender: '',
        streetAddress: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
        email: '',
        phone: '',
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await axios.get(`${API}/studentservice/api/city/get-list`);
                setStates(response.data);
            } catch (error) {
                console.error('Error fetching states:', error);
            }
        };

        fetchStates();
    }, []);

    const handleChange = async (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files.length > 0) {
            setFormData({
                ...formData,
                [name]: files[0],
            });
            setImagePreview(URL.createObjectURL(files[0]));
        } else if (name === 'state') {
            const selectedState = value;
            setFormData({
                ...formData,
                state: selectedState,
                city: '',
            });

            if (selectedState) {
                try {
                    const response = await axios.get(`${API}/studentservice/api/city/${selectedState}`);
                    setCities(response.data);
                } catch (error) {
                    console.error('Error fetching cities:', error);
                }
            } else {
                setCities([]);
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        try {
            await axios.post(`${API}/studentservice/api/student/initiate-registration`, data, {
                // headers: {
                //     'Authorization': `Bearer ${storedToken}`,
                // },
            });

            setIsOtpSent(true);
            toast.success('OTP sent to your email.');
            setIsOtpModalOpen(true);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errorMessages = Object.values(error.response.data.errors);
                errorMessages.forEach(errorMessage => {
                    toast.error(errorMessage);
                });
            } else if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                console.error('Error adding course:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true

        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                data.append(key, formData[key]);
            });

            data.append('otp', otp);
            const response = await axios.post(`${API}/studentservice/api/student/add`, data, {
                // headers: {
                //     'Authorization': `Bearer ${storedToken}`,
                // },
            });
            const registrationNo = response.data.data.regNo;
            toast.success(`Registration Successful! \nRegistration No: ${registrationNo}`);
            handleReset();
            setIsOtpSent(false);
            setIsOtpModalOpen(false);
        } catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error('Failed to verify OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            regNo: '',
            firstName: '',
            middleName: '',
            lastName: '',
            dob: '',
            gender: '',
            streetAddress: '',
            city: '',
            state: '',
            country: '',
            zipcode: '',
            email: '',
            phone: '',
            image: null,
        });
        setImagePreview(null);
    };

    return (
        <div>
            <div className='bg-gray-100'>
                <h1 className="bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white text-3xl p-10 font-bold mb-4 relative z-10">Welcome to Learnify
                    <span className="absolute bottom-0 left-0 w-full h-2 bg-yellow-300"></span>
                </h1>
                <h2 className="text-2xl sm:text-3xl pl-10 text-left text-gray-700 mb-6">Student Registration Form :-</h2>

                <div className="relative p-6 m-6 bg-white rounded-lg shadow-md">
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-2"># Student Information :-</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="firstName" className="block mb-2 font-medium text-gray-700">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter first name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="middleName" className="block mb-2 font-medium text-gray-700">
                                        Middle Name
                                    </label>
                                    <input
                                        type="text"
                                        id="middleName"
                                        name="middleName"
                                        value={formData.middleName}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter middle name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block mb-2 font-medium text-gray-700">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter last name"
                                    />
                                </div>
                                {/* <div>
                                    <label htmlFor="regNo" className="block mb-2 font-medium text-gray-700">
                                        Registration Number
                                    </label>
                                    <input
                                        type="text"
                                        id="regNo"
                                        name="regNo"
                                        required
                                        value={formData.regNo}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter registration number"
                                    />
                                </div> */}
                                <div>
                                    <label htmlFor="dob" className="block mb-2 font-medium text-gray-700">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        id="dob"
                                        name="dob"
                                        required
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="gender" className="block mb-2 font-medium text-gray-700">
                                        Gender
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        required
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-2 "># Address :-</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="streetAddress" className="block mb-2 font-medium text-gray-700">
                                        Street Address
                                    </label>
                                    <input
                                        type="text"
                                        id="streetAddress"
                                        name="streetAddress"
                                        required
                                        value={formData.streetAddress}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter street address"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="state" className="block mb-2 font-medium text-gray-700">
                                        State
                                    </label>
                                    <select
                                        id="state"
                                        name="state"
                                        required
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Select State</option>
                                        {states.map((state) => (
                                            <option key={state.id} value={state.id}>
                                                {state.state}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="city" className="block mb-2 font-medium text-gray-700">
                                        City
                                    </label>
                                    <select
                                        id="city"
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Select City</option>
                                        {cities.map((city) => (
                                            <option key={city.id} value={city.id}>
                                                {city.city}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="zipcode" className="block mb-2 font-medium text-gray-700">
                                        Zipcode
                                    </label>
                                    <input
                                        type="number"
                                        id="zipcode"
                                        name="zipcode"
                                        required
                                        value={formData.zipcode}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter zipcode"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-2"># Contact Information :-</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="phone" className="block mb-2 font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <input
                                        type="number"
                                        id="phone"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter phone number"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter email address"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-2"># Documents :-</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="sm:col-span-2">
                                    <label htmlFor="image" className="block mb-2 font-medium text-gray-700">
                                        Upload Image
                                    </label>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="mt-1 block w-full py-2 px-4 text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-4 py-2 mr-4 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors duration-300 ease-in-out"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-white rounded-md shadow-md font-medium bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 transition duration-300"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                    {/* OTP Modal */}
                    <OTPModal
                        isOpen={isOtpModalOpen}
                        onClose={() => setIsOtpModalOpen(false)}
                        otp={otp}
                        setOtp={setOtp}
                        handleVerifyOtp={handleVerifyOtp}
                    />
                    {imagePreview && (
                        <div className="absolute top-0 right-0 m-2 mr-6 w-20 h-20 md:w-20 md:h-20 rounded-sm overflow-hidden shadow-md border border-gray-300">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <ToastContainer />

                    {loading && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                            <ScaleLoader color="#fff" speedMultiplier={2} size={30} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudentRegistration;
