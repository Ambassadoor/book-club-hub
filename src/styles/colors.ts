// Centralized color palette - single source of truth for both Tailwind and MUI
export const colors = {
  // Primary Colors
  primary: {
    main: "#606c38",
    dark: "#283618",
    light: "#7f8c52",
  },
  
  // Accent Colors
  accent: {
    main: "#dda15e",
    dark: "#bc6c25",
    light: "#e8b67d",
  },
  
  // Surface & Background
  surface: {
    main: "#fafae0",
    paper: "#fafae0",
  },
  
  // Text Colors
  text: {
    primary: "#283618",
    secondary: "#606c38",
    onPrimary: "#fafae0",
    onAccent: "#283618",
    onSurface: "#283618",
  },
  
  // Status Colors
  success: {
    main: "#606c38",
    border: "#283618",
    light: "#7f8c52",
  },
  
  info: {
    main: "#4a7c9e",
    border: "#2d5573",
    light: "#6b9dbd",
  },
  
  warning: {
    main: "#dda15e",
    border: "#bc6c25",
    light: "#e8b67d",
  },
  
  error: {
    main: "#a04b4b",
    border: "#7a2e2e",
    light: "#c26565",
  },
  
  danger: {
    main: "#a04b4b",
    border: "#7a2e2e",
  },
  
  // Neutral/Gray Scale
  neutral: {
    50: "#fafae0",
    100: "#f0f0d8",
    200: "#e0e0c0",
    300: "#c8c8a8",
    400: "#a0a088",
    500: "#606c38",
    600: "#4e5a2e",
    700: "#3c4823",
    800: "#283618",
    900: "#1a2410",
  },
  
  // UI Elements
  card: {
    main: "#606c38",
    border: "#283618",
  },
  
  button: {
    positive: "#dda15e",
    positiveBorder: "#bc6c25",
    positiveHover: "#bc6c25",
  },
  
  input: {
    main: "#fafae0",
    border: "#606c38",
  },
  
  // Disabled States
  disabled: {
    main: "#c8c8a8",
    text: "#a0a088",
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
