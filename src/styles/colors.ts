// Centralized color palette - single source of truth for both Tailwind and MUI
// Modern, sophisticated palette perfect for a book club application
export const colors = {
  // Primary Colors - Rich teal evokes knowledge, trust, and reading
  primary: {
    main: "#2d6a6a",
    dark: "#1e4848",
    light: "#3d8a8a",
  },
  
  // Accent Colors - Warm coral for highlights and CTAs
  accent: {
    main: "#e07856",
    dark: "#c85a3a",
    light: "#ff9777",
  },
  
  // Surface & Background - Clean, neutral backgrounds
  surface: {
    main: "#f8f9fa",
    paper: "#ffffff",
  },
  
  // Text Colors - High contrast for readability
  text: {
    primary: "#1a2332",
    secondary: "#4a5568",
    onPrimary: "#ffffff",
    onAccent: "#ffffff",
    onSurface: "#1a2332",
  },
  
  // Status Colors
  success: {
    main: "#10b981",
    border: "#059669",
    light: "#34d399",
  },
  
  info: {
    main: "#3b82f6",
    border: "#2563eb",
    light: "#60a5fa",
  },
  
  warning: {
    main: "#f59e0b",
    border: "#d97706",
    light: "#fbbf24",
  },
  
  error: {
    main: "#ef4444",
    border: "#dc2626",
    light: "#f87171",
  },
  
  danger: {
    main: "#ef4444",
    border: "#dc2626",
  },
  
  // Neutral/Gray Scale - Modern, sophisticated grays
  neutral: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
  
  // UI Elements
  card: {
    main: "#2d6a6a",
    border: "#1e4848",
  },
  
  button: {
    positive: "#e07856",
    positiveBorder: "#c85a3a",
    positiveHover: "#c85a3a",
  },
  
  input: {
    main: "#ffffff",
    border: "#d1d5db",
  },
  
  // Disabled States
  disabled: {
    main: "#e5e7eb",
    text: "#9ca3af",
  },
};

// Spacing scale
export const spacing = {
  xs: "0.5rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
};

// Border radius
export const radius = {
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  full: "999px",
};

// Shadows
export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
};
