import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000').replace(/\/$/, '');
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
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  avatarUrl?: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

const persistUser = async (user: User) => {
  await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
};

const mapToUser = (data: any): User => ({
  id: data?.user?.id ?? '',
  email: data?.user?.email ?? '',
  username: data?.user?.username ?? '',
  firstName: data?.user?.firstName ?? '',
  lastName: data?.user?.lastName ?? '',
  avatarUrl: data?.user?.avatarUrl ?? undefined,
  token: data?.token ?? '',
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.status = 'succeeded';
    },
    logout: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
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
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;