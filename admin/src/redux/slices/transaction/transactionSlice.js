import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { EncryptedToken } from "../../../../utils/encryptedToken";

const MAIN = import.meta.env.VITE_API_URL;

// Thunk to fetch transactions
// ✅ Thunk
export const getTransactions = createAsyncThunk(
    "transaction/get",
    async ({ page, limit, filters = {} }, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams();

            if (filters.search) queryParams.append("search", filters.search);
            if (filters.status) queryParams.append("status", filters.status);
            if (filters.type) queryParams.append("type", filters.type);
            if (filters.date) queryParams.append("date", filters.date);

            const url = `${MAIN}/admin/dashboard/transactions/${page}/${limit}${queryParams.toString() ? `?${queryParams.toString()}` : ""
                }`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${await EncryptedToken()}`,
                }, withCredentials: true
            });

            return {
                status: response.status,
                page: response.data.totalPages,
                transactions: response.data.transactions,
            };
        } catch (error) {
            return rejectWithValue({
                status: error?.response?.status || 500,
                message:
                    error?.response?.data?.message || "Something went wrong",
            });
        }
    }
);

// Slice definition
const transactionSlice = createSlice({
    name: "transactions",
    initialState: {
        transactions: null,
        loading: false,
        status: null,
        error: null,
        page: 1,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload.transactions;
                state.page = action.payload.page;
                state.status = action.payload.status;
                state.error = null;
            })
            .addCase(getTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch transactions";
                state.status = action.payload?.status || 500;
            });
    },
});

export default transactionSlice.reducer;
