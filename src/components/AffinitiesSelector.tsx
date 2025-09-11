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
  type VeteranAptitudes,
  DefaultVeteranAptitudes,
} from '../types/aptitudes';
import { cap } from '../utils/string';

export function VeteranAptitudesEditor() {
  const [aff, setAff] = React.useState<VeteranAptitudes>(DefaultVeteranAptitudes);

  const setDistance = (k: Distance, g: Grade) =>
    setAff((a) => ({ ...a, Distance: { ...a.Distance, [k]: g } }));

  const setTrack = (k: Surface, g: Grade) =>
    setAff((a) => ({ ...a, Track: { ...a.Track, [k]: g } }));

  const setStyle = (k: Runner, g: Grade) =>
    setAff((a) => ({ ...a, Style: { ...a.Style, [k]: g } }));

  return (
    <Grid container spacing={2}>
      {/* Distance Row */}
      <Grid container alignItems="center" spacing={2}>
        <Grid sx={{ minWidth: 80, fontWeight: 'bold' }}>Distance:</Grid>
        {DistanceTypes.map((k) => (
          <Grid key={`Distance-${k}`}>
            <TextField
              select
              label={cap(k)}
              value={aff.Distance[k]}
              onChange={(e) => setDistance(k, e.target.value as Grade)}
              size="small"
              sx={{ minWidth: 90 }}
            >
              {GradeTypes.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        ))}
      </Grid>

      {/* Track Row */}
      <Grid container alignItems="center" spacing={2}>
        <Grid sx={{ minWidth: 80, fontWeight: 'bold' }}>Track:</Grid>
        {SurfaceTypes.map((k) => (
          <Grid key={`Track-${k}`}>
            <TextField
              select
              label={k}
              value={aff.Track[k]}
              onChange={(e) => setTrack(k, e.target.value as Grade)}
              size="small"
              sx={{ minWidth: 90 }}
            >
              {GradeTypes.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        ))}
      </Grid>

      {/* Style Row */}
      <Grid container alignItems="center" spacing={2}>
        <Grid sx={{ minWidth: 80, fontWeight: 'bold' }}>Style:</Grid>
        {RunnerTypes.map((k) => (
          <Grid key={`Style-${k}`}>
            <TextField
              select
              label={k}
              value={aff.Style[k]}
              onChange={(e) => setStyle(k, e.target.value as Grade)}
              size="small"
              sx={{ minWidth: 90 }}
            >
              {GradeTypes.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
