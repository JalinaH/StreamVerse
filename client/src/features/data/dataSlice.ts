import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../state/store';

// Define a universal Item type
export interface Item {
  id: string;
  type: 'movie' | 'music' | 'podcast';
  title: string;
  description: string;
  image: string;
  status: string;
  genres?: string[];
}

export interface DataState {
  movies: Item[];
  music: Item[];
  podcasts: Item[];
  catalogue: Item[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
  lastFetched: number | null;
}

const initialState: DataState = {
  movies: [],
  music: [],
  podcasts: [],
  catalogue: [],
  status: 'idle',
  error: null,
  lastFetched: null,
};

const TMDB_GENRES: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

const LISTEN_NOTES_GENRES: Record<number, string> = {
  67: 'True Crime',
  122: 'Documentary',
  68: 'Comedy',
  82: 'TV & Film',
  93: 'Society & Culture',
};

const mapTmdbGenres = (ids: number[] | undefined): string[] =>
  (ids ?? []).map((id) => TMDB_GENRES[id]).filter(Boolean);

const mapListenNotesGenres = (ids: number[] | undefined): string[] =>
  (ids ?? []).map((id) => LISTEN_NOTES_GENRES[id]).filter(Boolean);

type FetchDataArgs = {
  force?: boolean;
};

const CACHE_WINDOW_MS = 1000 * 60 * 5; // 5 minutes

// Async thunk is identical to the web version
export const fetchData = createAsyncThunk<
  { movies: Item[]; music: Item[]; podcasts: Item[]; catalogue: Item[] },
  FetchDataArgs | undefined,
  { rejectValue: string; state: RootState }
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
        genres: mapTmdbGenres(p.genre_ids),
      }));

      const music: Item[] = musicData.results.map((p: any) => ({
        id: `music-${p.trackId}`,
        type: 'music',
        title: p.trackName,
        description: p.artistName,
        image: p.artworkUrl100.replace('100x100', '600x600'),
        status: p.primaryGenreName,
        genres: p.primaryGenreName ? [p.primaryGenreName] : [],
      }));

      const podcasts: Item[] = (podcastsData.podcasts || []).map((p: any) => ({
        id: `podcast-${p.id}`,
        type: 'podcast',
        title: p.title,
        description: p.description || p.publisher,
        image: p.image || p.thumbnail,
        status: p.publisher ?? 'Podcast',
        genres: mapListenNotesGenres(p.genre_ids),
      }));
      
      const catalogue = [...movies, ...music, ...podcasts];
      return { movies, music, podcasts, catalogue };

    } catch (error: any) {
      return rejectWithValue(error.message ?? 'Failed to fetch data');
    }
  },
  {
    condition: (args = {}, { getState }) => {
      const { lastFetched, status } = (getState() as RootState).data;
      if (status === 'loading') {
        return false;
      }
      if (args.force) {
        return true;
      }
      if (!lastFetched) {
        return true;
      }
      return Date.now() - lastFetched >= CACHE_WINDOW_MS;
    },
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
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.movies = action.payload.movies;
        state.music = action.payload.music;
        state.podcasts = action.payload.podcasts;
        state.catalogue = action.payload.catalogue;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to fetch data';
      });
  },
});

export default dataSlice.reducer;