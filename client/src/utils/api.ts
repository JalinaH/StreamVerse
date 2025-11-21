import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const resolveApiBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const unifyHost = (uri?: string | null) => {
    if (!uri) return undefined;
    const withoutProtocol = uri.replace(/^(https?:\/\/|exp:\/\/|ws:\/\/)/, '');
    const host = withoutProtocol.split(':')[0];
    if (['localhost', '127.0.0.1'].includes(host)) {
      if (Platform.OS === 'android') {
        return '10.0.2.2';
      }
      return 'localhost';
    }
    return host;
  };

  const hostUri = Constants.expoConfig?.hostUri || Constants.experienceUrl;
  const host = unifyHost(hostUri);
  if (host) {
    return `http://${host}:4000`;
  }

  return 'http://localhost:4000';
};

export const API_BASE_URL = resolveApiBaseUrl().replace(/\/$/, '');

export const buildApiUrl = (path: string) => {
  if (!path.startsWith('/')) {
    return `${API_BASE_URL}/${path}`;
  }
  return `${API_BASE_URL}${path}`;
};

export const withAuthHeaders = (token?: string, headers?: Record<string, string>) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...(headers ?? {}),
});
