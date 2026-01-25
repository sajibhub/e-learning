import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the base URL for your API
const MAIN = import.meta.env.VITE_API_URL

// --------------------- ASYNC THUNKS ---------------------

/**
 * Async thunk to fetch all videos, optionally filtered by courseId and/or moduleId.
 */
export const fetchAllVideos = createAsyncThunk(
  "videos/fetchAll",
  async ({ courseId, moduleId } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (courseId) params.courseId = courseId;
      if (moduleId) params.moduleId = moduleId;

      const response = await axios.get(`${MAIN}/videos`, {
        params,
        withCredentials: true, // Send cookies for authentication
      });

      // The backend returns { message, total, data: videos }
      return {
        data: response.data.data,
        total: response.data.total,
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch videos",
        status: error.response?.status || 500,
      });
    }
  }
);

/**
 * Async thunk to create a new video.
 */
export const createVideo = createAsyncThunk(
  "videos/create",
  async ({ courseId, moduleId, title, videoUrl }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${MAIN}/videos`,
        {
          courseId,
          moduleId,
          title,
          videoUrl,
        },
        {
          withCredentials: true, // Send cookies for authentication
        }
      );

      // The backend returns { message, data: newVideo }
      return response.data.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to create video",
        status: error.response?.status || 500,
      });
    }
  }
);

/**
 * Async thunk to update an existing video.
 */
export const updateVideo = createAsyncThunk(
  "videos/update",
  async ({ videoId, title, courseId, moduleId, videoUrl }, { rejectWithValue }) => {
    try {
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (courseId !== undefined) updateData.courseId = courseId;
      if (moduleId !== undefined) updateData.moduleId = moduleId;
      if (videoUrl !== undefined) updateData.videoUrl = videoUrl;

      const response = await axios.put(
        `${MAIN}/videos/${videoId}`,
        updateData,
        {
          withCredentials: true, // Send cookies for authentication
        }
      );

      // The backend returns { message, data: updatedVideo }
      return response.data.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to update video",
        status: error.response?.status || 500,
      });
    }
  }
);

/**
 * Async thunk to delete a video.
 */
export const deleteVideo = createAsyncThunk(
  "videos/delete",
  async (videoId, { rejectWithValue }) => {
    try {
      await axios.delete(`${MAIN}/videos/${videoId}`, {
        withCredentials: true, // Send cookies for authentication
      });

      // On successful deletion, we return the videoId to easily remove it from the state
      return videoId;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to delete video",
        status: error.response?.status || 500,
      });
    }
  }
);

// --------------------- SLICE ---------------------

const videoSlice = createSlice({
  name: "videos",
  initialState: {
    videos: [], // Array to hold the list of videos
    loading: false, // Loading state for fetching all videos
    createLoading: false, // Loading state for creating a video
    updateLoading: false, // Loading state for updating a video
    deleteLoading: false, // Loading state for deleting a video
    error: null, // Holds any error message
  },
  reducers: {
    // A synchronous reducer to clear errors
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --------------------- Fetch All Videos ---------------------
      .addCase(fetchAllVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload.data;
        state.error = null;
      })
      .addCase(fetchAllVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // --------------------- Create Video ---------------------
      .addCase(createVideo.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createVideo.fulfilled, (state, action) => {
        state.createLoading = false;
        // Add the newly created video to the beginning of the array
        state.videos.unshift(action.payload);
        state.error = null;
      })
      .addCase(createVideo.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload.message;
      })

      // --------------------- Update Video ---------------------
      .addCase(updateVideo.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.updateLoading = false;
        // Find the index of the updated video and replace it
        const index = state.videos.findIndex(
          (video) => video._id === action.payload._id
        );
        if (index !== -1) {
          state.videos[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateVideo.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload.message;
      })

      // --------------------- Delete Video ---------------------
      .addCase(deleteVideo.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.deleteLoading = false;
        // Filter out the deleted video from the array
        state.videos = state.videos.filter(
          (video) => video._id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload.message;
      });
  },
});

// Export the synchronous reducer action
export const { clearError } = videoSlice.actions;

// Export the reducer to be used in the store
export default videoSlice.reducer;