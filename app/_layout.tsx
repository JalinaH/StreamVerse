import React, { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { Stack } from 'expo-router';
import { store } from '../src/app/store';
import { setUser } from '../src/features/auth/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// This component loads the user from storage
function RootNavigation() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This is the correct native way to load persistent data
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('streambox_user');
        if (storedUser) {
          dispatch(setUser(JSON.parse(storedUser)));
        }
      } catch (error) {
        console.error("Failed to load user from storage", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [dispatch]);

  // Show a loading spinner while we check for a saved user
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // This is your main app navigation
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ presentation: 'modal', headerShown: false }} />
      {/* Add your details screen here, e.g.: */}
      {/* <Stack.Screen name="details/[id]" options={{ title: "Details" }} /> */}
    </Stack>
  );
}

// This is your main App component
export default function AppLayout() {
  return (
    <Provider store={store}>
      <RootNavigation />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});