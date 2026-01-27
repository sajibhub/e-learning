import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { EncryptedToken } from "../../../../utils/encryptedToken";

const MAIN = import.meta.env.VITE_API_URL;

// Async thunks
export const createCourse = createAsyncThunk(
  "course/create",
  async ({ title, details, price, category, courseImage }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("details", details);
      formData.append("price", price);
      formData.append("category", category);
      if (courseImage) {
        formData.append("courseImage", courseImage);
      }

      const response = await axios.post(
        `${MAIN}/course/create`,
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
      return response.data.course;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course");
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  }
);

export const getAllCourses = createAsyncThunk(
  "course/getAll",
  async ({ page = 1, limit = 10, category = "" }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (category) params.append("category", category);

      const response = await axios.get(`${MAIN}/course/courses?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${await EncryptedToken()}`,
        },
        withCredentials: true,
      });

      return {
        courses: response.data.courses,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch courses");
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  }
);

export const getCourseById = createAsyncThunk(
  "course/getById",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${MAIN}/course/${id}`, {
        headers: {
          Authorization: `Bearer ${await EncryptedToken()}`,
        },
        withCredentials: true,
      });

      return response.data.course;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch course");
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "course/delete",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${MAIN}/course/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${await EncryptedToken()}`,
        },
        withCredentials: true,
      });

      toast.success(response.data.message);
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete course");
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  }
);

export const updateCourse = createAsyncThunk(
  "course/update",
  async ({ id, title, details, price, category, courseImage }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("details", details);
      formData.append("price", price);
      formData.append("category", category);
      if (courseImage) {
        formData.append("courseImage", courseImage);
      }

      const response = await axios.put(
        `${MAIN}/course/update/${id}`,
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
      return response.data.course;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update course");
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  }
);

// Slice
const courseSlice = createSlice({
  name: "course",
  initialState: {
    courses: [],
    currentCourse: null,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    error: null,
    isModalOpen: false,
    isUpdateModalOpen: false,
    selectedCourse: null,
  },
  reducers: {
    isModal: (state, action) => {
      state.isModalOpen = action.payload;
    },
    isUpdateModal: (state, action) => {
      state.isUpdateModalOpen = action.payload;
    },
    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetCurrentCourse: (state) => {
      state.currentCourse = null;
    },
    // Added missing actions
    setCreateCourseModal: (state, action) => {
      state.isModalOpen = action.payload;
    },
    setUpdateCourseModal: (state, action) => {
      state.isUpdateModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all courses
      .addCase(getAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch courses";
      })
      
      // Get course by ID
      .addCase(getCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(getCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch course";
      })
      
      // Create course
      .addCase(createCourse.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.createLoading = false;
        state.isModalOpen = false;
        state.courses.unshift(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload?.message || "Failed to create course";
      })
      
      // Update course
      .addCase(updateCourse.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.isUpdateModalOpen = false;
        const index = state.courses.findIndex(
          (course) => course._id === action.payload._id
        );
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        // Also update currentCourse if it's the same course
        if (state.currentCourse && state.currentCourse._id === action.payload._id) {
          state.currentCourse = action.payload;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload?.message || "Failed to update course";
      })
      
      // Delete course
      .addCase(deleteCourse.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.courses = state.courses.filter(
          (course) => course._id !== action.payload
        );
        // Also clear currentCourse if it's the deleted course
        if (state.currentCourse && state.currentCourse._id === action.payload) {
          state.currentCourse = null;
        }
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload?.message || "Failed to delete course";
      });
  },
});

export const { 
  isModal, 
  isUpdateModal, 
  setSelectedCourse, 
  clearError, 
  resetCurrentCourse,
  setCreateCourseModal,
  setUpdateCourseModal
} = courseSlice.actions;
export default courseSlice.reducer;