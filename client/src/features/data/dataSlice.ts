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
      const tmdbKey = process.env.EXPO_PUBLIC_TMDB_API_KEY;
      const listenNotesKey = process.env.EXPO_PUBLIC_LISTEN_NOTES_API_KEY;
      
      if (!listenNotesKey) {
        return rejectWithValue('Missing Listen Notes API key.');
      }

      const [moviesRes, musicRes, podcastsRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${tmdbKey}`),
        fetch('https://itunes.apple.com/search?term=top+hits&media=music&limit=10'),
        fetch('https://listen-api.listennotes.com/api/v2/best_podcasts?region=us&safe_mode=1', {
          headers: {
            'X-ListenAPI-Key': listenNotesKey,
          },
        }),
      ]);
      
      if (!moviesRes.ok || !musicRes.ok || !podcastsRes.ok) {
        return rejectWithValue('Failed to fetch all data sources');
      }

      const moviesData = await moviesRes.json();
      const musicData = await musicRes.json();
      const podcastsData = await podcastsRes.json();

      const movies: Item[] = moviesData.results.map((p: any) => ({
        id: `movie-${p.id}`,
        type: 'movie',
        title: p.title,
        description: p.overview,
        image: `https://image.tmdb.org/t/p/w500${p.poster_path}`,
        status: `Rating: ${p.vote_average.toFixed(1)}`,
      }));

      const music: Item[] = musicData.results.map((p: any) => ({
        id: `music-${p.trackId}`,
        type: 'music',
        title: p.trackName,
        description: p.artistName,
        image: p.artworkUrl100.replace('100x100', '600x600'),
        status: p.primaryGenreName,
      }));

      const podcasts: Item[] = (podcastsData.podcasts || []).map((p: any) => ({
        id: `podcast-${p.id}`,
        type: 'podcast',
        title: p.title,
        description: p.description || p.publisher,
        image: p.image || p.thumbnail,
        status: p.publisher ?? 'Podcast',
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