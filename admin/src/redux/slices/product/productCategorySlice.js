import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { EncryptedToken } from "../../../../utils/encryptedToken";

const MAIN = import.meta.env.VITE_API_URL;

// Async thunks
export const createProductCategory = createAsyncThunk(
  "productCategory/create",
  async ({ name }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${MAIN}/product-category/create`,
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

export const getAllProductCategories = createAsyncThunk(
  "productCategory/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${MAIN}/product-category`, {
        headers: {
          Authorization: `Bearer ${await EncryptedToken()}`,
        },
        withCredentials: true,
      });

      return response.data.categories;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch categories");
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  }
);

export const updateProductCategory = createAsyncThunk(
  "productCategory/update",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${MAIN}/product-category/update/${id}`,
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

export const deleteProductCategory = createAsyncThunk(
  "productCategory/delete",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${MAIN}/product-category/delete/${id}`, {
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

// Slice
const productCategorySlice = createSlice({
  name: "productCategory",
  initialState: {
    categories: [],
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
      .addCase(getAllProductCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProductCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getAllProductCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch categories";
      })
      
      // Create category
      .addCase(createProductCategory.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createProductCategory.fulfilled, (state, action) => {
        state.createLoading = false;
        state.isModalOpen = false;
        state.categories.unshift(action.payload);
      })
      .addCase(createProductCategory.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload?.message || "Failed to create category";
      })
      
      // Update category
      .addCase(updateProductCategory.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateProductCategory.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.isUpdateModalOpen = false;
        const index = state.categories.findIndex(
          (category) => category._id === action.payload._id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateProductCategory.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload?.message || "Failed to update category";
      })
      
      // Delete category
      .addCase(deleteProductCategory.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteProductCategory.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload
        );
      })
      .addCase(deleteProductCategory.rejected, (state, action) => {
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
} = productCategorySlice.actions;

export default productCategorySlice.reducer;