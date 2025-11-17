import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dataReducer from '../features/data/dataSlice';
import favouritesReducer from '../features/favourites/favouritesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    favourites: favouritesReducer,
  },
  // Disables a warning about non-serializable data (like functions)
  // which is fine for this app
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// These types are for TypeScript. They help you use Redux with TS.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;