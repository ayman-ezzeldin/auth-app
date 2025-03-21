import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyMail } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const VerifyMailPage = () => {
  const [otpMessage, setOtpMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isVerified, verificationError } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setOtpMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otpMessage.trim() === '') return;

    try {
      const result = await dispatch(verifyMail({ otp: otpMessage })).unwrap();
      console.log('OTP verified:', result);
      navigate('/login'); // Navigate only if successful
    } catch (error) {
      console.error('Verification error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Verify Your Email</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="otpMessage"
            value={otpMessage}
            onChange={handleChange}
            placeholder="Your OTP from email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Verify OTP
          </button>
        </form>
        {isVerified && <p className="text-green-500 mt-4">Email verified successfully!</p>}
        {verificationError && <p className="text-red-500 mt-4">{verificationError}</p>}
      </div>
    </div>
  );
};

export default VerifyMailPage;