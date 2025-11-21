import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../state/store';
import { API_BASE_URL, buildApiUrl, withAuthHeaders } from '../../utils/api';
const AUTH_STORAGE_KEY = 'streambox_user';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  token: string;
}

export interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
  profileStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  profileError: string | null;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
  profileStatus: 'idle',
  profileError: null,
};

const persistUser = async (user: User) => {
  await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
};

const mapToUser = (data: any, fallbackToken?: string): User => ({
  id: data?.user?.id ?? '',
  email: data?.user?.email ?? '',
  username: data?.user?.username ?? '',
  firstName: data?.user?.firstName ?? '',
  lastName: data?.user?.lastName ?? '',
  avatarUrl: data?.user?.avatarUrl ?? undefined,
  token: data?.token ?? fallbackToken ?? '',
});

const handleAuthRequest = async (path: string, body: Record<string, any>, rejectWithValue: (message: string) => any) => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message = data?.message ?? 'Request failed';
      return rejectWithValue(message);
    }

    const user = mapToUser(data);
    await persistUser(user);
    return user;
  } catch (error: any) {
    const message = error?.message ?? 'Unable to reach server';
    return rejectWithValue(message);
  }
};

export const registerUser = createAsyncThunk<User, RegisterPayload, { rejectValue: string }>(
  'auth/registerUser',
  async (payload, { rejectWithValue }) => handleAuthRequest('/api/auth/register', payload, rejectWithValue)
);

export const loginUser = createAsyncThunk<User, LoginPayload, { rejectValue: string }>(
  'auth/loginUser',
  async (payload, { rejectWithValue }) => handleAuthRequest('/api/auth/login', payload, rejectWithValue)
);

type ProfileThunkConfig = {
  rejectValue: string;
  state: RootState;
};

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  avatarBase64?: string;
}

export const updateProfile = createAsyncThunk<User, UpdateProfilePayload, ProfileThunkConfig>(
  'auth/updateProfile',
  async (payload, { getState, rejectWithValue }) => {
    const token = getState().auth.user?.token;
    if (!token) {
      return rejectWithValue('Please sign in to continue.');
    }

    try {
      const response = await fetch(buildApiUrl('/api/profile'), {
        method: 'PUT',
        headers: withAuthHeaders(token),
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return rejectWithValue(data?.message ?? 'Unable to update profile.');
      }

      const user = mapToUser(data, token);
      await persistUser(user);
      return user;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? 'Unable to update profile.');
    }
  }
);

export const deleteProfile = createAsyncThunk<void, void, ProfileThunkConfig>(
  'auth/deleteProfile',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.user?.token;
    if (!token) {
      return rejectWithValue('Please sign in to continue.');
    }

    try {
      const response = await fetch(buildApiUrl('/api/profile'), {
        method: 'DELETE',
        headers: withAuthHeaders(token),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        return rejectWithValue(data?.message ?? 'Unable to delete profile.');
      }

      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? 'Unable to delete profile.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.status = 'succeeded';
      state.profileStatus = 'idle';
      state.profileError = null;
    },
    logout: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
      state.profileStatus = 'idle';
      state.profileError = null;
      AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.profileStatus = 'loading';
        state.profileError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileStatus = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileStatus = 'failed';
        state.profileError = action.payload ?? 'Unable to update profile.';
      })
      .addCase(deleteProfile.pending, (state) => {
        state.profileStatus = 'loading';
        state.profileError = null;
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.profileStatus = 'succeeded';
        state.user = null;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.profileStatus = 'failed';
        state.profileError = action.payload ?? 'Unable to delete profile.';
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;