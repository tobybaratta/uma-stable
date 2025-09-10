import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, Stack } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getUmas } from '../scripts/getUmas';
import UmaSelector from '../components/UmaSelector';

const umaMap = getUmas();

// Need to make this have both the ID of the uma based on the image as well as
// have a separate UUID for separating individual Umas from each other here.
const umaRows = Array.from(umaMap.values()).map((uma) => ({
  id: uma.id,
  name: uma.name,
}));

// TODO: Add the columns for actual top-level skills (sparks?)
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 180 },
];

export default function HomePage() {
  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [selectedUmaName, setSelectedUmaName] = useState<string | undefined>(undefined);

  // TODO: Create a new UUID for the new Uma, etc.
  const handleAddUma = () => {
    // TODO: Add logic to save new Uma
    setAddOpen(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <h2>Uma Musume List</h2>
        <Button variant="contained" onClick={() => setAddOpen(true)}>
          Add New Uma
        </Button>
      </Stack>
      <DataGrid rows={umaRows} columns={columns} />

      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add New Uma</DialogTitle>
        <Box sx={{ p: 2 }}>
          {/* UmaSelector for picking avatar/name */}
          <UmaSelector
            value={selectedUmaName}
            onChange={setSelectedUmaName}
            isOpen={true}
            onClose={() => {}}
          />
          {/* Add more form fields as needed */}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleAddUma} disabled={!selectedUmaName}>
              Save
            </Button>
            <Button variant="outlined" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
}
