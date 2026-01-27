// src/redux/slices/order/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { EncryptedToken } from '../../../../utils/encryptedToken.js';

const MAIN = import.meta.env.VITE_API_URL;

// Async thunk for fetching all orders
export const getAllOrders = createAsyncThunk(
  'orders/getAll',
  async ({ page = 1, limit = 10, type, search }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (type) params.append('type', type);
      if (search) params.append('search', search);

      const response = await axios.get(`${MAIN}/admin/transactions?${params}`, {
        headers: {
          Authorization: `Bearer ${await EncryptedToken()}`,
        },
        withCredentials: true,
      });

      return { data: response.data, status: response.status };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch orders",
        status: error.response?.status || 500,
      });
    }
  }
);

// Async thunk for updating order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ transactionId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${MAIN}/admin/order/${transactionId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${await EncryptedToken()}`,
          },
          withCredentials: true,
        }
      );

      return { data: response.data, status: response.status };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to update order status",
        status: error.response?.status || 500,
      });
    }
  }
);

// Initial state
const initialState = {
  orders: [],
  loading: false,
  updateLoading: false,
  error: null,
  successMessage: null,
  currentPage: 1,
  totalPages: 1,
  limit: 10,
  total: 0,
  filters: {
    type: '',
    search: ''
  }
};

// Slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        type: '',
        search: ''
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all orders
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data.data;
        state.currentPage = action.payload.data.page;
        state.totalPages = action.payload.data.pages;
        state.total = action.payload.data.total || 0;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.successMessage = action.payload.data.message;
        
        // Update the order in the list with the returned data
        const updatedOrder = action.payload.data.data;
        const index = state.orders.findIndex(
          (order) => order._id === updatedOrder._id
        );
        
        if (index !== -1) {
          // Update only the status field as returned by the backend
          state.orders[index] = {
            ...state.orders[index],
            status: updatedOrder.status
          };
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload.message;
      });
  },
});

export const { 
  clearError, 
  clearSuccessMessage, 
  setFilters, 
  resetFilters 
} = orderSlice.actions;

export default orderSlice.reducer;