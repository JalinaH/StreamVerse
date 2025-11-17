import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Item } from '../data/dataSlice'; // Reuse the Item type

export interface FavouritesState {
  items: Item[];
}

const initialState: FavouritesState = {
  items: [],
};

// Helper function to save state to AsyncStorage
const saveFavouritesToStorage = async (items: Item[]) => {
  try {
    await AsyncStorage.setItem('streambox_favourites', JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save favourites to storage", error);
  }
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    // Action to set favourites when loaded from storage
    setFavourites: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
    },
    addFavourite: (state, action: PayloadAction<Item>) => {
      const newItem = action.payload;
      if (!state.items.find(item => item.id === newItem.id)) {
        state.items.push(newItem);
        saveFavouritesToStorage(state.items); // Persist
      }
    },
    removeFavourite: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      state.items = state.items.filter(item => !(item.id === id));
      saveFavouritesToStorage(state.items); // Persist
    },
  },
});

export const { setFavourites, addFavourite, removeFavourite } = favouritesSlice.actions;
export default favouritesSlice.reducer;