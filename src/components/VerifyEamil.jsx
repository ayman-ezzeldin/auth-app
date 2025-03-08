import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTokens, setEmail } from '../features/auth/authSlice';
import { sendOtp, verifyOtp } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const VerifyEamil = () => {
  const [email, setEmailInput] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email'); // 'email' أو 'otp'
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      if(email.trim() === '') {
        toast.error('يرجى تعبئة الحقل "بريد الكتروني"');
        return;
      }
      const response = await sendOtp(email);
      dispatch(setEmail(email));
      setSuccessMessage(response.message || 'تم إرسال OTP إلى بريدك!');
      setError('');
      setStep('otp');
    } catch (error) {
      setError(error.response?.data?.message || 'خطأ في إرسال OTP');
      setSuccessMessage('');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await verifyOtp(email, otp);
      dispatch(setTokens({
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
      }));
      setSuccessMessage('تم تسجيل الدخول بنجاح!');
      setError('');
      setTimeout(() => navigate('/protected'), 1500); // تأخير لعرض الرسالة
    } catch (error) {
      setError(error.response?.data?.message || 'خطأ في التحقق من OTP');
      setSuccessMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {step === 'email' ? 'تسجيل الدخول' : 'التحقق من OTP'}
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
        
        {step === 'email' ? (
          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="البريد الإلكتروني"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              required
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              إرسال OTP
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="أدخل رمز OTP"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              required
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              تحقق
            </button>
          </div>
        )}
        <p className="text-center text-gray-600 mt-4">
          ليس لديك حساب؟ <a href="/register" className="text-blue-500 hover:underline">سجل الآن</a>
        </p>
      </div>
    </div>
  );
};

export default VerifyEamil;