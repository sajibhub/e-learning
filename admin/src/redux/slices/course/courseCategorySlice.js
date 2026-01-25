import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { EncryptedToken } from "../../../../utils/encryptedToken";

const MAIN = import.meta.env.VITE_API_URL;

// Async thunks
export const createCourseCategory = createAsyncThunk(
  "courseCategory/create",
  async ({ name }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${MAIN}/course-category/added`,
        { name },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await EncryptedToken()}`
          },
          withCredentials: true,
        }
      );

      toast.success(response.data.message);
      return response.data.category;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  }
);

export const getAllCourseCategories = createAsyncThunk(
  "courseCategory/getAll",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      const response = await axios.get(`${MAIN}/course-category?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${await EncryptedToken()}`,
        },
        withCredentials: true,
      });

      return {
        categories: response.data.categories,
        currentPage: page,
        totalPages: Math.ceil(response.data.totalCount / limit) || 1,
      };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch categories");
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  }
);

export const deleteCourseCategory = createAsyncThunk(
  "courseCategory/delete",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${MAIN}/course-category/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${await EncryptedToken()}`,
        },
        withCredentials: true,
      });

      toast.success(response.data.message);
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category");
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  }
);

export const updateCourseCategory = createAsyncThunk(
  "courseCategory/update",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${MAIN}/course-category/update/${id}`,
        { name },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await EncryptedToken()}`
          },
          withCredentials: true,
        }
      );

      toast.success(response.data.message);
      return response.data.category;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update category");
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  }
);

// Slice
const courseCategorySlice = createSlice({
  name: "courseCategory",
  initialState: {
    categories: [],
    currentPage: 1,
    totalPages: 1,
    loading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    error: null,
    isModalOpen: false,
    isUpdateModalOpen: false,
    selectedCategory: null,
  },
  reducers: {
    isModal: (state, action) => {
      state.isModalOpen = action.payload;
    },
    isUpdateModal: (state, action) => {
      state.isUpdateModalOpen = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Added missing actions
    setCreateCategoryModal: (state, action) => {
      state.isModalOpen = action.payload;
    },
    setUpdateCategoryModal: (state, action) => {
      state.isUpdateModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all categories
      .addCase(getAllCourseCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCourseCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAllCourseCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch categories";
      })
      
      // Create category
      .addCase(createCourseCategory.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createCourseCategory.fulfilled, (state, action) => {
        state.createLoading = false;
        state.isModalOpen = false;
        state.categories.unshift(action.payload);
      })
      .addCase(createCourseCategory.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload?.message || "Failed to create category";
      })
      
      // Update category
      .addCase(updateCourseCategory.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateCourseCategory.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.isUpdateModalOpen = false;
        const index = state.categories.findIndex(
          (category) => category._id === action.payload._id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCourseCategory.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload?.message || "Failed to update category";
      })
      
      // Delete category
      .addCase(deleteCourseCategory.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteCourseCategory.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload
        );
      })
      .addCase(deleteCourseCategory.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload?.message || "Failed to delete category";
      });
  },
});

export const { 
  isModal, 
  isUpdateModal, 
  setSelectedCategory, 
  clearError,
  setCreateCategoryModal,
  setUpdateCategoryModal
} = courseCategorySlice.actions;
export default courseCategorySlice.reducer;