import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://lucky0wl.pythonanywhere.com/';

// Helper function to decode JWT token
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return {};
  }
};

const initialState = {
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  user: null,
  isVerified: false,
  verificationError: null,
};

export const registerUser = createAsyncThunk("auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}register/`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk("auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}login/`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyMail = createAsyncThunk("auth/verify-email",
  async (userData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.accessToken || localStorage.getItem('accessToken');

      if (!token) {
        throw new Error('No access token available');
      }

      const response = await axios.post(`${API_URL}verify-email/`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("OTP verified:", response.data);
      return response.data;
    } catch (error) {
      console.error("Verification error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.user = null;
      state.isVerified = false;
      state.verificationError = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isVerified = false;
        state.verificationError = null;
        state.user = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.isAuthenticated = true;
        const decodedToken = decodeToken(action.payload.access);
        state.user = {
          user_id: decodedToken.user_id,
          username: decodedToken.username,
          email: decodedToken.email,
          full_name: decodedToken.full_name,
          bio: decodedToken.bio,
          image: decodedToken.image,
        };
        state.isVerified = decodedToken.verified || false;
        localStorage.setItem('accessToken', action.payload.access);
        localStorage.setItem('refreshToken', action.payload.refresh);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isVerified = false;
        state.verificationError = action.payload?.message || 'Registration failed';
        state.user = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(loginUser.pending, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.verificationError = null;
        state.user = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.isAuthenticated = true;
        const decodedToken = decodeToken(action.payload.access);
        state.user = {
          user_id: decodedToken.user_id,
          username: decodedToken.username,
          email: decodedToken.email,
          full_name: decodedToken.full_name,
          bio: decodedToken.bio,
          image: decodedToken.image,
        };
        state.isVerified = decodedToken.verified || false;
        localStorage.setItem('accessToken', action.payload.access);
        localStorage.setItem('refreshToken', action.payload.refresh);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.verificationError = action.payload?.message || 'Login failed';
        state.user = null;
      })
      .addCase(verifyMail.pending, (state) => {
        state.verificationError = null;
      })
      .addCase(verifyMail.fulfilled, (state) => {
        state.isVerified = true;
        state.user = { ...state.user, isVerified: true }; // Update existing user
      })
      .addCase(verifyMail.rejected, (state, action) => {
        state.verificationError = action.payload?.detail || action.payload?.message || 'Verification failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;