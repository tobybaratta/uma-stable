import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Stack,
  Button,
  IconButton,
  Box,
  Grid,
  Paper,
  Divider,
  Chip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useColorScheme } from '@mui/material/styles';

function ColorSchemeToggle() {
  const { mode, setMode } = useColorScheme();
  const isDark = mode === 'dark';
  return (
    <IconButton aria-label="toggle color scheme" onClick={() => setMode(isDark ? 'light' : 'dark')}>
      {isDark ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70, hideable: true },
  { field: 'name', headerName: 'Name', flex: 1, minWidth: 160 },
  { field: 'tag', headerName: 'Tags', flex: 1, minWidth: 140 },
  { field: 'grade', headerName: 'Grade', flex: 1, minWidth: 20 },
];

const rows = [
  { id: 1, name: 'Special Week', tag: '#parent #groundwork', grade: 'A' },
  { id: 2, name: 'Tokai Teio', tag: '#ace', grade: 'A+' },
  { id: 3, name: 'Oguri Cap', tag: '#waifu #glue', grade: 'B' },
  { id: 4, name: 'Gold Ship', tag: '#long #parent', grade: 'C+' },
];

export default function HomePage() {
  return (
    <>
      {/* <AppBar position="sticky" sx={{ borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
        <Toolbar>
          <Stack direction="row" spacing={1} alignItems="center">
            <ColorSchemeToggle />
          </Stack>
        </Toolbar>
      </AppBar> */}

      {/* Clean all of this up. */}
      <Container sx={{ py: 6 }}>
        <ColorSchemeToggle />
        {/* Hero */}
        <Typography variant="h2" sx={{ flexGrow: 1 }}>
          The Uma Stable
        </Typography>
        <Stack spacing={3} alignItems="center" textAlign="center" sx={{ py: 6 }}>
          <Typography variant="overline">Keep track of your Umas from outside the game.</Typography>
        </Stack>

        <Box sx={{ my: 6 }}>
          <Divider>
            <Typography variant="overline">Uma Table List</Typography>
          </Divider>
        </Box>

        {/* DataGrid demo */}
        <Paper sx={{ p: 2, border: (t) => `1px solid ${t.palette.divider}` }}>
          <Box sx={{ height: 360, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
            />
          </Box>
        </Paper>
      </Container>

      <Box
        component="footer"
        sx={{ py: 6, textAlign: 'center', borderTop: (t) => `1px solid ${t.palette.divider}` }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} The Uma Stable MIT License; Contribute on GitHub
        </Typography>
      </Box>
    </>
  );
}
