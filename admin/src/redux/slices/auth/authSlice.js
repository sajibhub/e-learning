import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { EncryptedToken } from "../../../../utils/encryptedToken";

const MAIN = import.meta.env.VITE_API_URL;

// ------------------ Async Thunks ------------------

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${MAIN}/admin/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
         withCredentials:true,
        }
      );
      
      toast.success(data.message || "Login successful!");
      localStorage.setItem("isLogin", "true");
      
      return data;
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${MAIN}/admin/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${await EncryptedToken()}`,
          },
          withCredentials: true,
        }
      );
      
      toast.success(data.message || "Logged out successfully!");
      localStorage.setItem("isLogin", "false");
      
      return data;
    } catch (err) {
      const message = err.response?.data?.message || "Logout failed. Please try again.";
      toast.error(message);
      localStorage.setItem("isLogin", "false"); // Still clear local state even if API fails
      return rejectWithValue(message);
    }
  }
);

// ------------------ Slice ------------------
const authSlice = createSlice({
  name: "auth",
  initialState: {
    data: null,
    loginLoading: false,
    logoutLoading: false,
    error: null,
    isLogoutModalOpen: false,
  },
  reducers: {
    setLogoutModal: (state, action) => {
      state.isLogoutModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.data = action.payload || null;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.logoutLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.logoutLoading = false;
        state.data = null;
        state.isLogoutModalOpen = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutLoading = false;
        state.data = null; // Still clear data even if API fails
        state.isLogoutModalOpen = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { setLogoutModal } = authSlice.actions;

// Export reducer
export default authSlice.reducer;