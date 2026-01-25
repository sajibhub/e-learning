import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { EncryptedToken } from "../../../../utils/encryptedToken";

const MAIN = import.meta.env.VITE_API_URL;

// Async thunk to fetch dashboard overview
export const getOverView = createAsyncThunk(
  "dashboard/overview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${MAIN}/admin/dashboard/overview`, {
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


const OverViewSlice = createSlice({
  name: "overview",
  initialState: {
    overview: null,
    loading: false,
    error: null,
    status: null
  },
  reducers: {
    // You can add custom reducers here if needed
    clearOverview: (state) => {
      state.overview = null;
      state.error = null;
      state.status = "idle";
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOverView.pending, (state) => {
        state.loading = true;
        state.status = "pending";
        state.error = null;
      })
      .addCase(getOverView.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload.data;
        state.status = action.payload.status;
        state.error = null;
      })
      .addCase(getOverView.rejected, (state, action) => {
        state.loading = false;
        state.overview = null;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });
  }

});

export const { clearOverview } = OverViewSlice.actions;
export default OverViewSlice.reducer;
