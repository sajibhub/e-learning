import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { EncryptedToken } from "../../../../utils/encryptedToken";

const MAIN = import.meta.env.VITE_API_URL;

export const getUsers = createAsyncThunk(
  "users/get",
  async ({ page = 1, limit = 10, query = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (query.search) params.append("search", query.search);
      if (query.status) params.append("status", query.status);

      const response = await axios.get(`${MAIN}/admin/get/users?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${await EncryptedToken()}`,
        },
        withCredentials: true,
      });

      return {
        data: response.data.users,
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalUsers: response.data.totalUsers,
      };
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "users/status",
  async ({ _id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${MAIN}/admin/update/user/${_id}/status`, // Fixed: Added "/status" to match the backend endpoint
        { status },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await EncryptedToken()}`
          },
          withCredentials: true,
        }
      );

      toast.success(response.data.message);
      return response.data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user status");
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: null,
    page: null,
    totalPages: null,
    totalUsers: null,
    loading: false,
    statusUpdateLoading: false,
    error: null,
    status: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get users
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalUsers = action.payload.totalUsers;
        state.status = 200;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch users";
      })
      
      // Update user status
      .addCase(updateUserStatus.pending, (state) => {
        state.statusUpdateLoading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.statusUpdateLoading = false;
        const updatedUser = action.payload;
        const existingUser = state.users.find(user => user._id === updatedUser._id);
        
        if (existingUser) {
          existingUser.status = updatedUser.status;
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.statusUpdateLoading = false;
        state.error = action.payload?.message || "Failed to update user status";
      });
  },
});

export default usersSlice.reducer;