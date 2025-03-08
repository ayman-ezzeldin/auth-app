import axios from 'axios';

const API_URL = 'https://lucky0wl.pythonanywhere.com/';

export const register = async (userData) => {
  console.log('Sending POST to:', `${API_URL}register`, 'with data:', userData);
  const response = await axios.post(`${API_URL}register/`, userData);
  
  return response.data;
};

export const sendOtp = async (email) => {
  const response = await axios.post(`${API_URL}send-otp`, { email });
  return response.data;
};

export const verifyOtp = async (email, otp) => {
  const response = await axios.post(`${API_URL}verify-otp`, { email, otp });
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await axios.post(`${API_URL}refresh-token`, { refresh_token: refreshToken });
  return response.data;
};

export const getProtectedData = async (accessToken) => {
  const response = await axios.get(`${API_URL}protected-endpoint`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};