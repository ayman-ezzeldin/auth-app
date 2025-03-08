import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEmail, setUser } from '../features/auth/authSlice';
import { register, sendOtp } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // جديد: لعرض رسالة نجاح
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authData = useSelector((state) => state.auth);
  console.log(authData, 'authData');
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    
    if (formData.password !== formData.confirmPassword) {
      setError('كلمة السر غير متطابقة!');
      setSuccessMessage('');
      return;
    }
    try {
      const response = await register({
        username: formData.username,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
      });
      // استخدام الـ response
      // console.log(response ,':رد التسجيل'); // للتحقق من البيانات المرجعة
      // setSuccessMessage(response.message || 'تم التسجيل بنجاح! سيتم إرسال OTP إلى بريدك.');
      // setError('');

      // حفظ بيانات المستخدم في Redux إذا كانت موجودة في الـ response
      if (response.user) {
        dispatch(setUser({
          username: response.user.username || formData.username,
          firstName: response.user.first_name || formData.firstName,
          lastName: response.user.last_name || formData.lastName,
        }));
      } else {
        dispatch(setUser({
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }));
      }

      await sendOtp(formData.email);
      dispatch(setEmail(formData.email));
      setSuccessMessage('تم إرسال OTP إلى بريدك!');
      setTimeout(() => navigate('/verify-email'), 2000);

    } catch (error) {
      console.error(error ,':خطأ في التسجيل');
      // setError('خطأ في التسجيل');
      console.log(error.response?.data?.message );
      
      setSuccessMessage('');
    }
    // try {

      // إرسال OTP بعد التسجيل
    //   try {
    //     await sendOtp(formData.email);
    //     dispatch(setEmail(formData.email));
    //     setSuccessMessage('تم إرسال OTP إلى بريدك!');
    //     setTimeout(() => navigate('/verify-email'), 2000);
    //   } catch (otpError) {
    //     setError(otpError.response?.data?.message || 'فشل إرسال OTP. تحقق من البريد أو حاول لاحقًا.');
    //     setSuccessMessage('');
    //   }
    // } catch (error) {
    //   console.error(error ,':خطأ في التسجيل');
    //   setError(error.response?.data?.message || 'خطأ في التسجيل');
    //   setSuccessMessage('');
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">تسجيل حساب جديد</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="اسم المستخدم"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            required
          />
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="الاسم الأول"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            required
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="الاسم الأخير"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="البريد الإلكتروني"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="كلمة السر"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="تأكيد كلمة السر"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            تسجيل
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;