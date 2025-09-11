import { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import UmaForm from '../components/UmaForm';
import UmaList from '../components/UmaList';
import type { Uma } from '../schema';

const theme = createTheme({
  palette: { mode: 'dark' },
});

export default function Home() {
  const [tab, setTab] = useState(0);
  const [editing, setEditing] = useState<Uma | null>(null);
  const [toast, setToast] = useState<{ open: boolean; msg: string; sev: 'success' | 'error' }>({
    open: false,
    msg: '',
    sev: 'success',
  });

  const onSaved = (ok: boolean, msg: string) =>
    setToast({ open: true, msg, sev: ok ? 'success' : 'error' });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            The Uma Stable
          </Typography>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="Add / Edit" />
            <Tab label="List / Export" />
          </Tabs>
        </Toolbar>
      </AppBar>

      {/* Show the "New Uma" view or the "Uma List" depending on selected tab." */}
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box hidden={tab !== 0}>
          <UmaForm
            editing={editing}
            onSaved={(u) => {
              setEditing(null);
              setTab(1);
              onSaved(true, 'Saved');
            }}
            onError={(m) => onSaved(false, m)}
          />
        </Box>
        <Box hidden={tab !== 1}>
          <UmaList
            onEdit={(u) => {
              setEditing(u);
              setTab(0);
            }}
          />
        </Box>
      </Container>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      >
        <Alert severity={toast.sev} onClose={() => setToast((t) => ({ ...t, open: false }))}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
