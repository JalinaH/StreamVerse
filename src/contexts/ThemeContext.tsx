import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export type ThemeMode = 'light' | 'dark';

interface ThemePalette {
	background: string;
	card: string;
	text: string;
	border: string;
	muted: string;
}

interface ThemeContextValue {
	theme: ThemeMode;
	isDarkMode: boolean;
	colors: ThemePalette;
	isHydrated: boolean;
	setTheme: (mode: ThemeMode) => void;
	toggleTheme: () => void;
}

const STORAGE_KEY = 'streamverse_theme_preference';

const lightPalette: ThemePalette = {
	background: '#f3f4f6',
	card: '#ffffff',
	text: '#111827',
	border: '#e5e7eb',
	muted: '#6b7280',
};

const darkPalette: ThemePalette = {
	background: '#0f172a',
	card: '#1f2937',
	text: '#f9fafb',
	border: '#334155',
	muted: '#94a3b8',
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const resolveInitialTheme = (
	stored: ThemeMode | null,
	system: ColorSchemeName,
): ThemeMode => {
	if (stored === 'light' || stored === 'dark') {
		return stored;
	}
	return system === 'dark' ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const systemScheme = Appearance.getColorScheme();
	const [theme, setThemeState] = useState<ThemeMode>(() => resolveInitialTheme(null, systemScheme));
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		let isMounted = true;

		const hydrateTheme = async () => {
			try {
				const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
				if (!isMounted) {
					return;
				}
				setThemeState(resolveInitialTheme(storedValue as ThemeMode | null, systemScheme));
			} catch {
				// If AsyncStorage fails, fall back to the system preference.
				setThemeState(resolveInitialTheme(null, systemScheme));
			} finally {
				if (isMounted) {
					setIsHydrated(true);
				}
			}
		};

		hydrateTheme();

		return () => {
			isMounted = false;
		};
	}, [systemScheme]);

	const persistTheme = useCallback(async (mode: ThemeMode) => {
		try {
			await AsyncStorage.setItem(STORAGE_KEY, mode);
		} catch {
			// Ignore persistence errors to keep UX smooth.
		}
	}, []);

	const setTheme = useCallback(
		(mode: ThemeMode) => {
			setThemeState(mode);
			void persistTheme(mode);
		},
		[persistTheme],
	);

	const toggleTheme = useCallback(() => {
		setThemeState((prev) => {
			const next = prev === 'dark' ? 'light' : 'dark';
			void persistTheme(next);
			return next;
		});
	}, [persistTheme]);

	const value = useMemo<ThemeContextValue>(
		() => ({
			theme,
			isDarkMode: theme === 'dark',
			colors: theme === 'dark' ? darkPalette : lightPalette,
			isHydrated,
			setTheme,
			toggleTheme,
		}),
		[isHydrated, setTheme, theme, toggleTheme],
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useThemeContext must be used within a ThemeProvider');
	}
	return context;
};
