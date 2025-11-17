import React from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons'; // Correct icon import for Expo

// This is your custom component to get the right icon
const TabBarIcon = ({ name, color }: { name: React.ComponentProps<typeof Feather>['name']; color: string }) => {
  return <Feather size={28} style={{ marginBottom: -3 }} name={name} color={color} />;
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6366f1', // Indigo color
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // We will add a custom header in each screen
      }}
    >
      <Tabs.Screen
        name="index" // This is the file `(tabs)/index.tsx`
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search" // This is `(tabs)/search.tsx`
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="favourites" // This is `(tabs)/favourites.tsx`
        options={{
          title: 'Favourites',
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile" // This is `(tabs)/profile.tsx`
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}