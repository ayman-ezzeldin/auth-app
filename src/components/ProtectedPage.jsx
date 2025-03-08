import  { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTokens, logout } from '../features/auth/authSlice';
import { getProtectedData, refreshToken } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

const ProtectedPage = () => {
  const { accessToken, refreshToken, user } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtectedData = async () => {
      // إذا لم يكن هناك accessToken، انتقل إلى صفحة تسجيل الدخول
      if (!accessToken || !refreshToken) {
        setError('يرجى تسجيل الدخول أولاً');
        setTimeout(() => navigate('/login'), 1500);
        return;
      }

      try {
        const response = await getProtectedData(accessToken);
        setData(response);
        setLoading(false);
        setError('');
      } catch (error) {
        if (error.response?.status === 401) {
          // محاولة تجديد الـ accessToken باستخدام refreshToken
          try {
            const newTokens = await refreshToken(refreshToken);
            if (!newTokens.access_token || !newTokens.refresh_token) {
              throw new Error('فشل في تجديد التوكن');
            }
            dispatch(setTokens({
              accessToken: newTokens.access_token,
              refreshToken: newTokens.refresh_token,
            }));
            // إعادة المحاولة باستخدام الـ accessToken الجديد
            const retryData = await getProtectedData(newTokens.access_token);
            setData(retryData);
            setLoading(false);
            setError('');
          } catch (refreshError) {
            setError('انتهت صلاحية الجلسة. يرجى إعادة تسجيل الدخول.');
            dispatch(logout());
            setTimeout(() => navigate('/login'), 2000);
          }
        } else {
          setError(error.response?.data?.message || 'خطأ في جلب البيانات');
          setLoading(false);
        }
      }
    };

    fetchProtectedData();
  }, [accessToken, refreshToken, dispatch, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">جارٍ التحميل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">صفحة محمية</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {user && (
          <div className="mb-4 text-right">
            <p className="text-lg text-gray-700">مرحبًا، {user.firstName} {user.lastName}</p>
            <p className="text-gray-600">اسم المستخدم: {user.username}</p>
          </div>
        )}
        {data ? (
          <div className="bg-gray-50 p-4 rounded-lg text-right">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">البيانات المحمية</h2>
            <pre className="text-gray-600 text-sm whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
          </div>
        ) : (
          <p className="text-gray-600 text-center">لا توجد بيانات متاحة</p>
        )}
        <button
          onClick={() => {
            dispatch(logout());
            navigate('/login');
          }}
          className="mt-6 w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-300"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default ProtectedPage;