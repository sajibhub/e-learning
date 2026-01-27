import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { EncryptedToken } from "../../../../utils/encryptedToken";

const MAIN = import.meta.env.VITE_API_URL;

// Async thunk to read profile
export const readProfile = createAsyncThunk(
    "profile/read",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${MAIN}/admin/profile`, {
                headers: {
                    Authorization: `Bearer ${await EncryptedToken()}`,
                },
                withCredentials: true,
            });

            return { data: response.data.profile, status: response.status };
        } catch (error) {
            if (error.response.status == 401) {
                localStorage.setItem("isLogin", "false");
            }
            return rejectWithValue({
                message: error.response?.data?.message || error.message,
                status: error.response?.status || 500,
            });
        }
    }
);

export const updateProfile = createAsyncThunk(
    'profile/update',
    async ({ name, email, password, oldPassword, profileImage, address }, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            // Only append fields that are provided
            if (name) formData.append('name', name);
            if (email) formData.append('email', email);
            if (password) formData.append('password', password);
            if (oldPassword) formData.append('oldPassword', oldPassword);
            if (profileImage) formData.append('profileImage', profileImage);
            if (address) formData.append('address', address);

            const response = await axios.put(`${MAIN}/admin/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${await EncryptedToken()}`,
                },
                withCredentials: true
            });

            toast.success(response.data.message);
            return { data: response.data.profile, status: response.status };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
            return rejectWithValue({
                message: error.response?.data?.message || error.message,
                status: error.response?.status || 500,
            });
        }
    }
);

const ProfileSlice = createSlice({
    name: "profile",
    initialState: {
        profile: null,
        loading: false,
        updateLoading: false,
        error: null,
        status: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Read profile
            .addCase(readProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = "pending";
            })
            .addCase(readProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload.data;
                state.status = action.payload.status;
                state.error = null;
            })
            .addCase(readProfile.rejected, (state, action) => {
                state.loading = false;
                state.profile = null;
                state.error = action.payload.message;
                state.status = action.payload.status;
            })
            // Update profile
            .addCase(updateProfile.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.profile = action.payload.data;
                state.status = action.payload.status;
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload.message;
                state.status = action.payload.status;
            });
    },
});

export const { clearError } = ProfileSlice.actions;
export default ProfileSlice.reducer;