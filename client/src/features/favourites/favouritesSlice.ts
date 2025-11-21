import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Item } from '../data/dataSlice';
import { buildApiUrl, withAuthHeaders } from '../../utils/api';
import type { RootState } from '../../state/store';

interface FavouriteResponseItem extends Item {
  addedAt?: string;
}

interface FavouriteResponse {
  items?: FavouriteResponseItem[];
  message?: string;
}

export interface FavouritesState {
  items: Item[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FavouritesState = {
  items: [],
  status: 'idle',
  error: null,
};

type ThunkConfig = {
  state: RootState;
  rejectValue: string;
};

const normalizeResponse = (payload?: FavouriteResponse): Item[] => {
  if (!payload?.items) {
    return [];
  }
  return payload.items.map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    description: item.description,
    image: item.image,
    status: item.status,
  }));
};

const getAuthToken = (state: RootState) => state.auth.user?.token;

export const fetchFavourites = createAsyncThunk<Item[], void, ThunkConfig>(
  'favourites/fetchFavourites',
  async (_, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState());
    if (!token) {
      return rejectWithValue('Please sign in to manage favourites.');
    }

    try {
      const response = await fetch(buildApiUrl('/api/favourites'), {
        method: 'GET',
        headers: withAuthHeaders(token),
      });

      const data: FavouriteResponse = await response.json().catch(() => ({ message: 'Invalid response' }));

      if (!response.ok) {
        return rejectWithValue(data?.message ?? 'Unable to load favourites.');
      }

      return normalizeResponse(data);
    } catch (error: any) {
      return rejectWithValue(error?.message ?? 'Unable to load favourites.');
    }
  }
);

export const addFavourite = createAsyncThunk<Item[], Item, ThunkConfig>(
  'favourites/addFavourite',
  async (item, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState());
    if (!token) {
      return rejectWithValue('Please sign in to manage favourites.');
    }

    try {
      const response = await fetch(buildApiUrl('/api/favourites'), {
        method: 'POST',
        headers: withAuthHeaders(token),
        body: JSON.stringify({
          id: item.id,
          type: item.type,
          title: item.title,
          description: item.description,
          image: item.image,
          status: item.status,
        }),
      });

      const data: FavouriteResponse = await response.json().catch(() => ({ message: 'Invalid response' }));

      if (!response.ok) {
        return rejectWithValue(data?.message ?? 'Unable to save favourite.');
      }

      return normalizeResponse(data);
    } catch (error: any) {
      return rejectWithValue(error?.message ?? 'Unable to save favourite.');
    }
  }
);

export const removeFavourite = createAsyncThunk<Item[], { id: string }, ThunkConfig>(
  'favourites/removeFavourite',
  async ({ id }, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState());
    if (!token) {
      return rejectWithValue('Please sign in to manage favourites.');
    }

    try {
      const response = await fetch(buildApiUrl(`/api/favourites/${encodeURIComponent(id)}`), {
        method: 'DELETE',
        headers: withAuthHeaders(token),
      });

      const data: FavouriteResponse = await response.json().catch(() => ({ message: 'Invalid response' }));

      if (!response.ok) {
        return rejectWithValue(data?.message ?? 'Unable to remove favourite.');
      }

      return normalizeResponse(data);
    } catch (error: any) {
      return rejectWithValue(error?.message ?? 'Unable to remove favourite.');
    }
  }
);

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    resetFavourites: () => ({ ...initialState }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavourites.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load favourites.';
      })
      .addCase(addFavourite.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(addFavourite.rejected, (state, action) => {
        state.error = action.payload ?? 'Unable to save favourite.';
      })
      .addCase(removeFavourite.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(removeFavourite.rejected, (state, action) => {
        state.error = action.payload ?? 'Unable to remove favourite.';
      });
  },
});

export const { resetFavourites } = favouritesSlice.actions;
export default favouritesSlice.reducer;