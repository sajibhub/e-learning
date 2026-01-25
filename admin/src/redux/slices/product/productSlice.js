import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { EncryptedToken } from "../../../../utils/encryptedToken";

const MAIN = import.meta.env.VITE_API_URL;

// Async thunks
export const createProduct = createAsyncThunk(
  "product/create",
  async ({ title, categoryId, price, details, productImage, productZipFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("categoryId", categoryId);
      formData.append("price", price);
      formData.append("details", details);
      if (productImage) formData.append("productImage", productImage);
      if (productZipFile) formData.append("productZipFile", productZipFile);

      const response = await axios.post(
        `${MAIN}/product/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${await EncryptedToken()}`
          },
          withCredentials: true,
        }
      );

      toast.success(response.data.message);
      return response.data.product;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create product");
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  }
);

export const getAllProducts = createAsyncThunk(
  "product/getAll",
  async ({ page = 1, limit = 10, categoryId = "", search = "" }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (categoryId) params.append("categoryId", categoryId);
      if (search) params.append("search", search);

      const response = await axios.get(`${MAIN}/product/?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${await EncryptedToken()}`,
        },
        withCredentials: true,
      });

      return {
        products: response.data.products,
        page: response.data.page,
        pages: response.data.pages,
      };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  }
);

export const getProductDetails = createAsyncThunk(
  "product/getDetails",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${MAIN}/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${await EncryptedToken()}`,
        },
        withCredentials: true,
      });

      return response.data.product;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch product details");
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/update",
  async ({ productId, title, categoryId, price, details, productImage, productZipFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (title) formData.append("title", title);
      if (categoryId) formData.append("categoryId", categoryId);
      if (price) formData.append("price", price);
      if (details) formData.append("details", details);
      if (productImage) formData.append("productImage", productImage);
      if (productZipFile) formData.append("productZipFile", productZipFile);

      const response = await axios.put(
        `${MAIN}/product/update/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${await EncryptedToken()}`
          },
          withCredentials: true,
        }
      );

      toast.success(response.data.message);
      return response.data.product;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/delete",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${MAIN}/product/delete/${productId}`, {
        headers: {
          Authorization: `Bearer ${await EncryptedToken()}`,
        },
        withCredentials: true,
      });

      toast.success(response.data.message);
      return productId;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  }
);

// Slice
const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    currentProduct: null,
    page: 1,
    pages: 1,
    loading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    error: null,
    isModalOpen: false,
    isUpdateModalOpen: false,
    selectedProduct: null,
  },
  reducers: {
    isModal: (state, action) => {
      state.isModalOpen = action.payload;
    },
    isUpdateModal: (state, action) => {
      state.isUpdateModalOpen = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    setCreateProductModal: (state, action) => {
      state.isModalOpen = action.payload;
    },
    setUpdateProductModal: (state, action) => {
      state.isUpdateModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all products
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch products";
      })
      
      // Get product details
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch product details";
      })
      
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.createLoading = false;
        state.isModalOpen = false;
        state.products.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload?.message || "Failed to create product";
      })
      
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.isUpdateModalOpen = false;
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        // Also update currentProduct if it's the same product
        if (state.currentProduct && state.currentProduct._id === action.payload._id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload?.message || "Failed to update product";
      })
      
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
        // Also clear currentProduct if it's the deleted product
        if (state.currentProduct && state.currentProduct._id === action.payload) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload?.message || "Failed to delete product";
      });
  },
});

export const { 
  isModal, 
  isUpdateModal, 
  setSelectedProduct, 
  clearError, 
  resetCurrentProduct,
  setCreateProductModal,
  setUpdateProductModal
} = productSlice.actions;

export default productSlice.reducer;