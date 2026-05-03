import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Gotit } from 'mui-gotit';
import App from './App';

const theme = createTheme({ palette: { mode: 'light', primary: { main: '#3b82f6' } } });

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Gotit>
        <App />
      </Gotit>
    </ThemeProvider>
  </React.StrictMode>,
);
