import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { EncryptedToken } from "../../../../utils/encryptedToken";

const MAIN = import.meta.env.VITE_API_URL;

// Async thunk to fetch dashboard overview
export const getChart = createAsyncThunk(
  "dashboard/chart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${MAIN}/admin/dashboard/chart`, {
        headers: {
          Authorization: `Bearer ${await EncryptedToken()}`,
        },
        withCredentials: true,
      });

      return { data: response.data, status: response.status };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Something went wrong",
        status: error.response?.status || 500,
      });
    }
  }
);

const chartSlice = createSlice({
  name: "chart",
  initialState: {
    chart: null,
    loading: false,
    error: null,
    status: null,
  },
  reducers: {
    clearChart: (state) => {
      state.chart = null;
      state.error = null;
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChart.pending, (state) => {
        state.loading = true;
        state.status = "pending";
        state.error = null;
      })
      .addCase(getChart.fulfilled, (state, action) => {
        state.loading = false;
        state.chart = action.payload.data;
        state.status = action.payload.status;
        state.error = null;
      })
      .addCase(getChart.rejected, (state, action) => {
        state.loading = false;
        state.chart = null;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });
  },
});

export const { clearChart } = chartSlice.actions;
export default chartSlice.reducer;
