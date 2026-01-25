import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { EncryptedToken } from "../../../../utils/encryptedToken";

const MAIN = import.meta.env.VITE_API_URL;

export const getSingleTransactions = createAsyncThunk(
  "transaction/single",
  async (transactionId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${MAIN}/bkash/merchant/payment/single/transaction/${transactionId}`, {
        headers: { Authorization: `Bearer ${await EncryptedToken()}`, },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Something went wrong"
      });
    }
  }
);

const SingleTransactionSlice = createSlice({
  name: "transaction",
  initialState: {
    transaction: null,
    loading: false,
    error: null,
    isModalOpen: false
  },
  reducers: {
    setCallbackModal: (state, action) => {
      state.isModalOpen = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSingleTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transaction = action.payload.transaction;
      })
      .addCase(getSingleTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setCallbackModal } = SingleTransactionSlice.actions;
export default SingleTransactionSlice.reducer;
