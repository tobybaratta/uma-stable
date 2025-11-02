import * as React from 'react';
import { Grid, TextField, MenuItem } from '@mui/material';

import {
  DistanceTypes,
  SurfaceTypes,
  RunnerTypes,
  GradeTypes,
  type Grade,
  type Distance,
  type Surface,
  type Runner,
  type TraineeAptitudes,
} from '../types';

type Props = {
  value: TraineeAptitudes;
  onChange: (v: TraineeAptitudes) => void;
};

function GradeSelect<T extends string>(props: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  size?: 'small' | 'medium';
}) {
  const { label, value, onChange, size = 'small' } = props;
  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      size={size}
      sx={{ minWidth: 90 }}
    >
      {GradeTypes.map((g) => (
        <MenuItem key={g} value={g}>
          {g}
        </MenuItem>
      ))}
    </TextField>
  );
}

// Controlled affinities editor — receives the current affinities and notifies
// the parent when a value changes. This simplifies state management and
// avoids duplication with the form's state.
export function AffinitiesSelector({ value, onChange }: Props) {
  const setDistance = (k: Distance, g: Grade) =>
    onChange({ ...value, Distance: { ...value.Distance, [k]: g } });

  const setTrack = (k: Surface, g: Grade) =>
    onChange({ ...value, Track: { ...value.Track, [k]: g } });

  const setStyle = (k: Runner, g: Grade) =>
    onChange({ ...value, Style: { ...value.Style, [k]: g } });

  return (
    <Grid container spacing={2}>
      {/* Distance Row */}
      <Grid container alignItems="center" spacing={2}>
        <Grid sx={{ minWidth: 80, fontWeight: 'bold' }}>Distance:</Grid>
        {DistanceTypes.map((k) => (
          <Grid key={`Distance-${k}`}>
            <GradeSelect label={k} value={value.Distance[k]} onChange={(v) => setDistance(k, v)} />
          </Grid>
        ))}
      </Grid>

      {/* Track Row */}
      <Grid container alignItems="center" spacing={2}>
        <Grid sx={{ minWidth: 80, fontWeight: 'bold' }}>Track:</Grid>
        {SurfaceTypes.map((k) => (
          <Grid key={`Track-${k}`}>
            <GradeSelect label={k} value={value.Track[k]} onChange={(v) => setTrack(k, v)} />
          </Grid>
        ))}
      </Grid>

      {/* Style Row */}
      <Grid container alignItems="center" spacing={2}>
        <Grid sx={{ minWidth: 80, fontWeight: 'bold' }}>Style:</Grid>
        {RunnerTypes.map((k) => (
          <Grid key={`Style-${k}`}>
            <GradeSelect label={k} value={value.Style[k]} onChange={(v) => setStyle(k, v)} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
