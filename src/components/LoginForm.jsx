import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser} from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [successMessage, setSuccessMessage] = useState(''); // جديد: لعرض رسالة نجاح
  const dispatch = useDispatch();
  const navigate = useNavigate()
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await dispatch(loginUser ({
        email: formData.email,
        password: formData.password,
      }));
      navigate('/');
      
    } catch (error) {
      console.error(error ,':خطأ في التسجيل');
      console.log(error.response?.data?.message );
      
      setSuccessMessage('');
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">تسجيل حساب جديد</h2>
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">

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

export default LoginForm;