import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import apiClient, { withAuthHeader } from '../utils/apiClient'

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/auth/user/profile', {
        headers: withAuthHeader(),
      })
      return response.data.user
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Unable to load profile. Please try again.'
      return rejectWithValue(message)
    }
  },
)

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.put('/api/profile', payload, {
        headers: withAuthHeader(),
      })
      return response.data.data
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Unable to update profile. Please try again.'
      return rejectWithValue(message)
    }
  },
)

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    loading: false,
    error: null,
    lastUpdatedAt: null,
  },
  reducers: {
    clearProfileError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
        state.lastUpdatedAt = new Date().toISOString()
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearProfileError } = profileSlice.actions
export default profileSlice.reducer
