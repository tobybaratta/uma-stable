import { useEffect, useState } from 'react';
import { db } from '../../db';
import type { Uma } from '../../schema';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Toolbar,
  TextField,
  Button,
  Stack,
  IconButton,
  Box,
} from '@mui/material';
import { downloadJSON, copyToClipboard } from '../../utils/download';
import UmaSelector from '../UmaSelector';

type Props = { onEdit?(u: Uma): void };

export default function UmaList({ onEdit }: Props) {
  const [items, setItems] = useState<Uma[]>([]);
  const [query, setQuery] = useState('');
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);

  useEffect(() => {
    let active = true;
    db.open()
      .then(() => db.umas.toArray())
      .then((arr) => {
        if (active)
          setItems(arr.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')));
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = items.filter((i) => i.trainee.toLowerCase().includes(query.toLowerCase()));

  async function exportAll() {
    const all = await db.umas.toArray();
    downloadJSON('uma_all.json', all);
  }
  async function clearAll() {
    if (!confirm('Delete all stored Uma records?')) return;
    await db.umas.clear();
    setItems([]);
  }

  // Handler for avatar selection
  const handleAvatarSelect = (name: string) => {
    setQuery(name);
    setAvatarDialogOpen(false);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Toolbar disableGutters sx={{ gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            placeholder="Search by trainee..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <IconButton onClick={() => setAvatarDialogOpen(true)}>
            <span role="img" aria-label="select avatar">
              🐴
            </span>
          </IconButton>
        </Box>
        <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
          <Button variant="outlined" onClick={exportAll}>
            Export all
          </Button>
          <Button variant="outlined" color="error" onClick={clearAll}>
            Delete all
          </Button>
        </Stack>
      </Toolbar>

      {/* Avatar selector dialog */}
      <UmaSelector
        value={query}
        onChange={handleAvatarSelect}
        isOpen={avatarDialogOpen}
        onClose={() => setAvatarDialogOpen(false)}
      />

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Trainee</TableCell>
            <TableCell>Scenario</TableCell>
            <TableCell>Updated</TableCell>
            <TableCell>Skills</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((u) => (
            <TableRow key={u.id} hover>
              <TableCell>{u.trainee}</TableCell>
              <TableCell>{u.scenario ?? '-'}</TableCell>
              <TableCell>{new Date(u.updatedAt).toLocaleString()}</TableCell>
              <TableCell>{u.skills.length}</TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button variant="text" onClick={() => onEdit?.(u)}>
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() =>
                      downloadJSON(`uma_${u.trainee.replace(/\s+/g, '_')}_${u.id}.json`, u)
                    }
                  >
                    Export
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => copyToClipboard(JSON.stringify(u, null, 2))}
                  >
                    Copy
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} sx={{ color: 'text.secondary' }}>
                No records yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
