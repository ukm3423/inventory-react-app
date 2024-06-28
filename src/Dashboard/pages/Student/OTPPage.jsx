import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function OTPPage() {
  const navigate = useNavigate();
  const [otp, setOTP] = useState('');

  const handleOTPChange = (e) => {
    setOTP(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can validate the OTP entered by the user
    // If the OTP is valid, you can navigate to the login page
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Enter OTP</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          value={otp}
          onChange={handleOTPChange}
          placeholder="Enter OTP"
          className="w-full max-w-xs p-3 mb-4 border rounded shadow-sm"
        />
        <button type="submit" className="w-full max-w-xs bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Submit
        </button>
      </form>
    </div>
  );
}

export default OTPPage;
