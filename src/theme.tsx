import { createTheme, responsiveFontSizes } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme()`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

// Uma Musume–inspired palette
const uma = {
  sky: '#3AB9F7', // blue spark
  pink: '#FC74AE', // pink spark
  green: '#96D534', // green spark
  purple: '#C673D9', // “G” purple
  brown: '#723A20', // Agnes’s hair
};

let baseTheme = createTheme({
  cssVariables: true,
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  colorSchemes: {
    light: {
      palette: {
        mode: 'light',
        primary: { main: uma.sky },
        secondary: { main: uma.pink },
        success: { main: uma.green },
        info: { main: uma.purple },
        warning: { main: uma.brown },
        background: {
          default: '#FAFAFB',
          paper: '#FFFFFF',
        },
      },
    },
    dark: {
      palette: {
        mode: 'dark',
        primary: { main: uma.sky },
        secondary: { main: uma.pink },
        success: { main: uma.green },
        info: { main: uma.purple },
        warning: { main: uma.brown },
        background: {
          default: '#0B0C10',
          paper: '#111319',
        },
      },
    },
  },
  components: {
    MuiButton: {
      defaultProps: { variant: 'contained' },
      styleOverrides: { root: { borderRadius: 12 } },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 16,
          border: `1px solid ${theme.palette.divider}`,
          backgroundImage: 'none',
        }),
      },
    },
    MuiAppBar: {
      defaultProps: { color: 'transparent', position: 'sticky' },
      styleOverrides: {
        root: ({ theme }) => ({
          backdropFilter: 'saturate(180%) blur(12px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 700 } },
    },
  },
});

const theme = responsiveFontSizes(baseTheme);
export default theme;
