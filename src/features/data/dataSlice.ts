import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Define a universal Item type
export interface Item {
  id: string;
  type: 'movie' | 'music' | 'podcast';
  title: string;
  description: string;
  image: string;
  status: string;
}

export interface DataState {
  movies: Item[];
  music: Item[];
  podcasts: Item[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

const initialState: DataState = {
  movies: [],
  music: [],
  podcasts: [],
  status: 'idle',
  error: null,
};

// Async thunk is identical to the web version
export const fetchData = createAsyncThunk<
  { movies: Item[]; music: Item[]; podcasts: Item[] },
  void,
  { rejectValue: string }
>(
  'data/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const [moviesRes, musicRes, podcastsRes] = await Promise.all([
        fetch('https://dummyjson.com/products?limit=10&select=id,title,description,thumbnail,category'),
        fetch('https://dummyjson.com/products?limit=10&skip=10&select=id,title,description,thumbnail,category'),
        fetch('https://dummyjson.com/posts?limit=10&select=id,title,body,tags')
      ]);
      
      if (!moviesRes.ok || !musicRes.ok || !podcastsRes.ok) {
        return rejectWithValue('Failed to fetch all data sources');
      }

      const moviesData = await moviesRes.json();
      const musicData = await musicRes.json();
      const podcastsData = await podcastsRes.json();

      const movies: Item[] = moviesData.products.map((p: any) => ({
        id: `movie-${p.id}`,
        type: 'movie',
        title: p.title,
        description: p.description,
        image: p.thumbnail,
        status: p.category,
      }));

      const music: Item[] = musicData.products.map((p: any) => ({
        id: `music-${p.id}`,
        type: 'music',
        title: p.title,
        description: p.description,
        image: p.thumbnail,
        status: p.category,
      }));

      const podcasts: Item[] = podcastsData.posts.map((p: any) => ({
        id: `podcast-${p.id}`,
        type: 'podcast',
        title: p.title,
        description: p.body.substring(0, 100) + '...',
        image: `https://placehold.co/300x300/6366f1/white?text=${p.title.split(' ')[0]}`,
        status: p.tags[0] || 'Popular',
      }));
      
      return { movies, music, podcasts };

    } catch (error: any) {
      return rejectWithValue(error.message ?? 'Failed to fetch data');
    }
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.movies = action.payload.movies;
        state.music = action.payload.music;
        state.podcasts = action.payload.podcasts;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to fetch data';
      });
  },
});

export default dataSlice.reducer;