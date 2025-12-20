import { createTheme } from "@mui/material/styles";
import { colors, radius } from "./src/styles/colors";

// Module augmentation for custom palette colors
declare module '@mui/material/styles' {
    interface Palette {
        input: Palette['primary']
    }

    interface PaletteOptions {
        input?: PaletteOptions['primary']
    }
}

declare module '@mui/material/TextField' {
    interface TextFieldPropsColorOverrides {
        input?: true
    }
}

// Create base theme for augmentColor utility
const baseTheme = createTheme();

// Main theme with color schemes for light/dark mode
export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: colors.primary.main,
          dark: colors.primary.dark,
          light: colors.primary.light,
          contrastText: colors.text.onPrimary,
        },
        secondary: {
          main: colors.accent.main,
          dark: colors.accent.dark,
          light: colors.accent.light,
          contrastText: colors.text.onAccent,
        },
        background: {
          default: colors.surface.main,
          paper: colors.surface.paper,
        },
        text: {
          primary: colors.text.primary,
          secondary: colors.text.secondary,
        },
        error: {
          main: colors.error.main,
          light: colors.error.light,
          contrastText: colors.text.onPrimary,
        },
        success: {
          main: colors.success.main,
          light: colors.success.light,
          contrastText: colors.text.onPrimary,
        },
        info: {
          main: colors.info.main,
          light: colors.info.light,
          contrastText: colors.text.onPrimary,
        },
        warning: {
          main: colors.warning.main,
          light: colors.warning.light,
          contrastText: colors.text.onAccent,
        },
        input: baseTheme.palette.augmentColor({
          color: {
            main: colors.input.main,
          },
          name: "input"
        })
      },
    },
    dark: {
      palette: {
        primary: {
          main: colors.primary.light,
          dark: colors.primary.dark,
          light: colors.primary.main,
          contrastText: colors.neutral[900],
        },
        secondary: {
          main: colors.accent.light,
          dark: colors.accent.dark,
          light: colors.accent.main,
          contrastText: colors.neutral[900],
        },
        background: {
          default: colors.neutral[900],
          paper: colors.neutral[800],
        },
        text: {
          primary: colors.text.onPrimary,
          secondary: colors.neutral[300],
        },
        error: {
          main: colors.error.light,
          light: colors.error.main,
          contrastText: colors.neutral[900],
        },
        success: {
          main: colors.success.light,
          light: colors.success.main,
          contrastText: colors.neutral[900],
        },
        info: {
          main: colors.info.light,
          light: colors.info.main,
          contrastText: colors.neutral[900],
        },
        warning: {
          main: colors.warning.light,
          light: colors.warning.main,
          contrastText: colors.neutral[900],
        },
        input: baseTheme.palette.augmentColor({
          color: {
            main: colors.neutral[800],
          },
          name: "input"
        })
      },
    },
  },
  shape: {
    borderRadius: parseFloat(radius.md) * 16, // Convert rem to px (assuming 1rem = 16px)
  },
  spacing: 8,
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    h1: {
      fontFamily: "'Merriweather', Georgia, serif",
      fontWeight: 900,
    },
    h2: {
      fontFamily: "'Merriweather', Georgia, serif",
      fontWeight: 700,
    },
    h3: {
      fontFamily: "'Merriweather', Georgia, serif",
      fontWeight: 700,
    },
    h4: {
      fontFamily: "'Merriweather', Georgia, serif",
      fontWeight: 700,
    },
    h5: {
      fontFamily: "'Merriweather', Georgia, serif",
      fontWeight: 700,
    },
    h6: {
      fontFamily: "'Merriweather', Georgia, serif",
      fontWeight: 700,
    },
    body1: {
      fontFamily: "'Inter', sans-serif",
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: "'Inter', sans-serif",
      lineHeight: 1.6,
    },
    button: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Disable uppercase transform
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          // Ensure TextField respects Tailwind classes
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "&:-webkit-autofill": {
            WebkitBoxShadow: "none !important",
            WebkitTextFillColor: "none !important",
            fontFamily: "inherit !important",
            transition: "background-color 5000s ease-in-out 0s !important",
          },
        },
      },
    },
  }
});
