import React from 'react';
import { Transition } from '@headlessui/react';

const OTPModal = ({ isOpen, onClose, otp, setOtp, handleVerifyOtp }) => {
    return (
        <Transition
            show={isOpen}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
                <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
                    <div>
                        <h3 className="text-xl font-semibold mb-2"># OTP Verification :-</h3>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label htmlFor="otp" className="block mb-2 font-medium text-gray-700">
                                    Enter OTP
                                </label>
                                <input
                                    type="text"
                                    id="otp"
                                    name="otp"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter OTP"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors duration-300 ease-in-out"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleVerifyOtp}
                                className="px-4 py-2 text-white rounded-md shadow-md font-medium bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 transition duration-300"
                            >
                                Verify OTP
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    );
};

export default OTPModal;
