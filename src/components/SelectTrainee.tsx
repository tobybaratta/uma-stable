import React from 'react';
import { Avatar, Grid, Dialog, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getUmas } from '../utils/createTrainees';

interface Uma {
  name: string;
  id: number;
  outfits: { outfit: string; outfitId: number }[];
}

const UMA_ICON_PATH = '/uma-icons/';

function makeIconUrl(id: number): string {
  return `${UMA_ICON_PATH}chr_icon/${id}.png`;
}

interface IAvatarSelectorProps {
  value?: string;
  onChange: (name: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const umas = Array.from(getUmas().values());

export default function UmaSelector(props: IAvatarSelectorProps) {
  const { value, onChange, isOpen, onClose } = props;

  const selectedUma = umas.find((u) => u.name === value);

  const handleSelect = (name: string) => {
    onChange(name);
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        Select Uma Musume
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Grid container spacing={2} sx={{ p: 2 }}>
        {umas.map((uma) => (
          <>
            <IconButton onClick={() => handleSelect(uma.name)}>
              <Avatar src={makeIconUrl(uma.id)} alt={uma.name} sx={{ width: 56, height: 56 }} />
            </IconButton>
            <div style={{ textAlign: 'center', fontSize: 12 }}>{uma.name}</div>
          </>
        ))}
      </Grid>
    </Dialog>
  );
}
