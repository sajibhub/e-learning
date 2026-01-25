import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the base URL for your API
const MAIN = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// --------------------- ASYNC THUNKS ---------------------

/**
 * Async thunk to fetch all modules, optionally filtered by courseId.
 * Uses cookies / credentials automatically.
 */
export const fetchAllModules = createAsyncThunk(
  "modules/fetchAll",
  async ({ courseId } = {}, { rejectWithValue }) => {
    try {
      const params = courseId ? { courseId } : {};
      const response = await axios.get(`${MAIN}/modules`, { 
        params,
        withCredentials: true, // <--- send cookies
      });

      return {
        data: response.data.data,
        total: response.data.total,
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch modules",
        status: error.response?.status || 500,
      });
    }
  }
);

/**
 * Async thunk to fetch courses list
 */
export const fetchCourseList = createAsyncThunk(
  "modules/fetchCourseList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${MAIN}/courses/list`, {
        withCredentials: true, // <--- send cookies
      });
      return { courses: response.data.courses };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch course list",
        status: error.response?.status || 500,
      });
    }
  }
);

/**
 * Async thunk to create a module
 */
export const createModule = createAsyncThunk(
  "modules/create",
  async ({ courseId, title }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${MAIN}/modules`,
        { courseId, title },
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to create module",
        status: error.response?.status || 500,
      });
    }
  }
);

/**
 * Async thunk to update a module
 */
export const updateModule = createAsyncThunk(
  "modules/update",
  async ({ moduleId, title, courseId }, { rejectWithValue }) => {
    try {
      const updateData = {};
      if (title) updateData.title = title;
      if (courseId) updateData.courseId = courseId;

      const response = await axios.put(
        `${MAIN}/modules/${moduleId}`,
        updateData,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to update module",
        status: error.response?.status || 500,
      });
    }
  }
);

/**
 * Async thunk to delete a module
 */
export const deleteModule = createAsyncThunk(
  "modules/delete",
  async (moduleId, { rejectWithValue }) => {
    try {
      await axios.delete(`${MAIN}/modules/${moduleId}`, { withCredentials: true });
      return moduleId;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to delete module",
        status: error.response?.status || 500,
      });
    }
  }
);

// --------------------- SLICE ---------------------
const moduleSlice = createSlice({
  name: "modules",
  initialState: {
    modules: [],
    courses: [],
    loading: false,
    courseListLoading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    error: null,
    courseError: null, // Separate error state for course operations
  },
  reducers: {
    clearError: (state) => { 
      state.error = null;
      state.courseError = null;
    },
    clearCourseError: (state) => { 
      state.courseError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch modules
      .addCase(fetchAllModules.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchAllModules.fulfilled, (state, action) => { 
        state.loading = false; 
        state.modules = action.payload.data; 
        state.error = null;
      })
      .addCase(fetchAllModules.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload.message; 
      })

      // Fetch courses
      .addCase(fetchCourseList.pending, (state) => { 
        state.courseListLoading = true; 
        state.courseError = null; 
      })
      .addCase(fetchCourseList.fulfilled, (state, action) => { 
        state.courseListLoading = false; 
        state.courses = action.payload.courses; 
        state.courseError = null;
      })
      .addCase(fetchCourseList.rejected, (state, action) => { 
        state.courseListLoading = false; 
        state.courseError = action.payload.message; 
      })

      // Create module
      .addCase(createModule.pending, (state) => { 
        state.createLoading = true; 
        state.error = null; 
      })
      .addCase(createModule.fulfilled, (state, action) => { 
        state.createLoading = false; 
        state.modules.unshift(action.payload); 
        state.error = null;
      })
      .addCase(createModule.rejected, (state, action) => { 
        state.createLoading = false; 
        state.error = action.payload.message; 
      })

      // Update module
      .addCase(updateModule.pending, (state) => { 
        state.updateLoading = true; 
        state.error = null; 
      })
      .addCase(updateModule.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.modules.findIndex(m => m._id === action.payload._id);
        if (index !== -1) state.modules[index] = action.payload;
        state.error = null;
      })
      .addCase(updateModule.rejected, (state, action) => { 
        state.updateLoading = false; 
        state.error = action.payload.message; 
      })

      // Delete module
      .addCase(deleteModule.pending, (state) => { 
        state.deleteLoading = true; 
        state.error = null; 
      })
      .addCase(deleteModule.fulfilled, (state, action) => { 
        state.deleteLoading = false; 
        state.modules = state.modules.filter(m => m._id !== action.payload); 
        state.error = null;
      })
      .addCase(deleteModule.rejected, (state, action) => { 
        state.deleteLoading = false; 
        state.error = action.payload.message; 
      });
  },
});

export const { clearError, clearCourseError } = moduleSlice.actions;
export default moduleSlice.reducer;