export interface ThemeColors {
  background: string;
  backgroundGradient: [string, string, ...string[]];
  primary: string;
  primaryGradient: [string, string, ...string[]];
  secondary: string;
  secondaryGradient: [string, string, ...string[]];
  text: {
    primary: string;
    secondary: string;
    accent: string;
    inverse: string;
  };
  glass: {
    background: string;
    border: string;
    tint: 'light' | 'dark' | 'default';
  };
  status: {
    success: string;
    error: string;
    warning: string;
  };
}

export const darkTheme: ThemeColors = {
  background: '#0f172a', // Deep dark blue/black
  backgroundGradient: ['#0f172a', '#1e1b4b'],
  primary: '#8b5cf6', // Violet
  primaryGradient: ['#8b5cf6', '#d946ef'], // Violet to Pink
  secondary: '#06b6d4', // Cyan
  secondaryGradient: ['#06b6d4', '#3b82f6'], // Cyan to Blue
  text: {
    primary: '#f8fafc', // White-ish
    secondary: '#94a3b8', // Grey-ish
    accent: '#c084fc', // Light purple
    inverse: '#0f172a',
  },
  glass: {
    background: 'rgba(30, 41, 59, 0.7)',
    border: 'rgba(255, 255, 255, 0.1)',
    tint: 'dark',
  },
  status: {
    success: '#22c55e',
    error: '#ef4444',
    warning: '#eab308',
  }
};

export const lightTheme: ThemeColors = {
  background: '#f8fafc', // Light gray/white
  backgroundGradient: ['#f8fafc', '#e2e8f0'],
  primary: '#7c3aed', // Slightly darker violet for contrast
  primaryGradient: ['#7c3aed', '#c026d3'],
  secondary: '#0891b2', // Darker cyan
  secondaryGradient: ['#0891b2', '#2563eb'],
  text: {
    primary: '#1e293b', // Dark slate
    secondary: '#64748b', // Slate gray
    accent: '#9333ea', // Purple
    inverse: '#f8fafc',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.6)',
    border: 'rgba(255, 255, 255, 0.5)',
    tint: 'light',
  },
  status: {
    success: '#16a34a',
    error: '#dc2626',
    warning: '#ca8a04',
  }
};

// Default export for backward compatibility during refactor (points to dark theme)
export const colors = darkTheme;
