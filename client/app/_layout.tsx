import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { AuthState, setUser } from '../src/features/auth/authSlice';
import { RootState, store } from '../src/state/store';

// This component loads the user from storage
function RootNavigation() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => (state.auth as AuthState).user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This is the correct native way to load persistent data
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('streambox_user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed?.token && parsed?.id) {
            dispatch(setUser(parsed));
          } else {
            await AsyncStorage.removeItem('streambox_user');
          }
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

  const initialRoute = user ? '(tabs)' : 'login';

  // This is your main app navigation
  return (
    <ThemeProvider>
      <Stack
        initialRouteName={initialRoute}
        screenOptions={{
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="music/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="podcast/[id]" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

// This is your main App component
export default function RootLayout() {
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
    backgroundColor: '#0f172a', // Match theme background
  },
});