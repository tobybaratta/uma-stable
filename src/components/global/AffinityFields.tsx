import { Grid, Divider } from '@mui/material';
import GradeSelector from './GradeSelector';

type Affinities = {
  turf: string;
  dirt: string;
  distance: { short: string; mile: string; medium: string; long: string };
};

type Props = {
  affinities: Affinities;
  setAff: React.Dispatch<React.SetStateAction<Affinities>>;
};

export default function AffinitiesFields({ affinities, setAff }: Props) {
  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Divider textAlign="left">Affinities</Divider>
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <GradeSelector
          label="Turf"
          value={affinities.turf}
          onChange={(v) => setAff((a) => ({ ...a, turf: v }))}
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <GradeSelector
          label="Dirt"
          value={affinities.dirt}
          onChange={(v) => setAff((a) => ({ ...a, dirt: v }))}
        />
      </Grid>
      {(['short', 'mile', 'medium', 'long'] as const).map((k) => (
        <Grid key={k} size={{ xs: 6, sm: 3 }}>
          <GradeSelector
            label={k[0]!.toUpperCase() + k.slice(1)}
            value={affinities.distance[k]}
            onChange={(v) =>
              setAff((a) => ({
                ...a,
                distance: { ...a.distance, [k]: v },
              }))
            }
          />
        </Grid>
      ))}
    </>
  );
}
