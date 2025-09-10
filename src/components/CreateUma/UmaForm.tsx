import { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { UmaSchema, type Uma } from '../../schema';
import { db } from '../../db';
import {
  Paper,
  Grid,
  TextField,
  Typography,
  Button,
  MenuItem,
  Divider,
  IconButton,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AffinitiesFields from '../global/AffinityFields';

type Props = {
  editing?: Uma | null;
  onSaved?(u: Uma): void;
  onError?(msg: string): void;
};

const emptyStats = { speed: null, stamina: null, power: null, guts: null, wisdom: null };
const emptyAff = {
  turf: 'A',
  dirt: 'G',
  distance: { short: 'G', mile: 'A', medium: 'A', long: 'A' },
};

export default function UmaForm({ editing, onSaved, onError }: Props) {
  const [trainee, setTrainee] = useState(editing?.trainee ?? '');
  const [scenario, setScenario] = useState(editing?.scenario ?? '');
  const [stats, setStats] = useState(editing?.stats ?? emptyStats);
  const [affinities, setAff] = useState(editing?.affinities ?? emptyAff);
  const [skills, setSkills] = useState(
    editing?.skills ?? ([] as { name: string; rarity?: 'white' | 'gold' }[]),
  );
  const [legacy, setLegacy] = useState(
    editing?.legacy ?? ([] as { type: 'stat' | 'skill'; value: string }[]),
  );
  const [notes, setNotes] = useState(editing?.notes ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTrainee(editing?.trainee ?? '');
    setScenario(editing?.scenario ?? '');
    setStats(editing?.stats ?? emptyStats);
    setAff(editing?.affinities ?? emptyAff);
    setSkills(editing?.skills ?? []);
    setLegacy(editing?.legacy ?? []);
    setNotes(editing?.notes ?? '');
  }, [editing]);

  function updateStat(k: keyof typeof stats, v: string) {
    const n = v === '' ? null : Math.max(0, Math.min(1600, Math.floor(Number(v)) || 0));
    setStats((s) => ({ ...s, [k]: n }));
  }

  function addSkill() {
    setSkills((s) => [...s, { name: '', rarity: 'white' }]);
  }
  function updateSkill(i: number, k: 'name' | 'rarity', v: string) {
    setSkills((s) =>
      s.map((sk, idx) => (idx === i ? { ...sk, [k]: k === 'rarity' ? (v as any) : v } : sk)),
    );
  }
  function removeSkill(i: number) {
    setSkills((s) => s.filter((_, idx) => idx !== i));
  }

  function addLegacy() {
    setLegacy((l) => [...l, { type: 'stat', value: '' }]);
  }
  function updateLegacy(i: number, k: 'type' | 'value', v: string) {
    setLegacy((l) =>
      l.map((e, idx) => (idx === i ? { ...e, [k]: k === 'type' ? (v as any) : v } : e)),
    );
  }
  function removeLegacy(i: number) {
    setLegacy((l) => l.filter((_, idx) => idx !== i));
  }

  const payload = useMemo(
    () => ({
      id: editing?.id ?? uuid(),
      trainee,
      scenario,
      stats,
      affinities,
      skills: skills.filter((s) => s.name.trim().length > 0),
      legacy: legacy.filter((e) => e.value.trim().length > 0),
      notes,
      createdAt: editing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    [editing, trainee, scenario, stats, affinities, skills, legacy, notes],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const parsed = UmaSchema.safeParse(payload);
    if (!parsed.success) {
      setSaving(false);
      onError?.(parsed.error.issues.map((i) => i.path.join('.') + ': ' + i.message).join('\n'));
      return;
    }
    await db.open();
    await db.umas.put(parsed.data);
    setSaving(false);
    onSaved?.(parsed.data);
  }

  return (
    <Paper component="form" onSubmit={onSubmit} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Record
      </Typography>

      <Grid container spacing={2}>
        {/* Header */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Trainee *"
            required
            fullWidth
            value={trainee}
            onChange={(e) => setTrainee(e.target.value)}
            placeholder="e.g., Gold Ship"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Scenario"
            fullWidth
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder="e.g., URA, Grand Masters"
          />
        </Grid>

        {/* Stats */}
        <Grid size={{ xs: 12 }}>
          <Divider textAlign="left">Stats</Divider>
        </Grid>
        {(['speed', 'stamina', 'power', 'guts', 'wisdom'] as const).map((k) => (
          <Grid key={k} size={{ xs: 6, sm: 4, md: 2 }}>
            {!!k[0] && (
              <TextField
                type="number"
                inputProps={{ min: 0, max: 1600 }}
                fullWidth
                label={k[0].toUpperCase() + k.slice(1)}
                value={stats[k] ?? ''}
                onChange={(e) => updateStat(k, e.target.value)}
              />
            )}
          </Grid>
        ))}

        {/* Affinities */}
        <AffinitiesFields affinities={affinities} setAff={setAff} />

        {/* Skills */}
        <Grid size={{ xs: 12 }}>
          <Divider textAlign="left">Skills</Divider>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button onClick={addSkill} variant="contained">
            Add skill
          </Button>
        </Grid>
        {skills.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary">
              No skills yet
            </Typography>
          </Grid>
        )}
        {skills.map((s, i) => (
          <Grid key={i} size={{ xs: 12 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  label="Skill name"
                  fullWidth
                  value={s.name}
                  onChange={(e) => updateSkill(i, 'name', e.target.value)}
                  placeholder="Sunny Weather"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  label="Rarity"
                  fullWidth
                  select
                  value={s.rarity ?? 'white'}
                  onChange={(e) => updateSkill(i, 'rarity', e.target.value)}
                >
                  <MenuItem value="white">white</MenuItem>
                  <MenuItem value="gold">gold</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 1 }}>
                <IconButton onClick={() => removeSkill(i)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        ))}

        {/* Legacy */}
        <Grid size={{ xs: 12 }}>
          <Divider textAlign="left">Legacy</Divider>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button onClick={addLegacy} variant="contained">
            Add legacy
          </Button>
        </Grid>
        {legacy.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary">
              No legacy entries yet
            </Typography>
          </Grid>
        )}
        {legacy.map((e, i) => (
          <Grid key={i} size={{ xs: 12 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  label="Type"
                  select
                  fullWidth
                  value={e.type}
                  onChange={(ev) => updateLegacy(i, 'type', ev.target.value)}
                >
                  <MenuItem value="stat">stat</MenuItem>
                  <MenuItem value="skill">skill</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  label="Value"
                  fullWidth
                  value={e.value}
                  onChange={(ev) => updateLegacy(i, 'value', ev.target.value)}
                  placeholder="+12 Power / Groundwork◎"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 1 }}>
                <IconButton onClick={() => removeLegacy(i)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        ))}

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Notes"
            fullWidth
            multiline
            minRows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Save changes' : 'Save record'}
            </Button>
            {editing && (
              <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                Editing existing record
              </Typography>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}
