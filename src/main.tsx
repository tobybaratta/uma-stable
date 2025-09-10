import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from './swRegister';
import HomePage from './pages/Home';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { CssBaseline } from '@mui/material';

// If trying to run in an actual proper webpage too.
if (import.meta.env.PROD) {
  registerSW();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HomePage />
      </ThemeProvider>
    </StyledEngineProvider>
    {/* </ThemeProvider> */}
  </React.StrictMode>,
);
