import { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Stats, UmaSchema, type Uma } from '../schema';
import { db } from '../db';
import {
  Paper,
  Grid,
  TextField,
  Typography,
  Button,
  Divider,
  IconButton,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  VeteranAptitudes,
  DefaultVeteranAptitudes,
  DistanceTypes,
  GradeTypes,
  Grade,
} from '../types/aptitudes';
import { VeteranAptitudesEditor } from './AffinitiesSelector';
import { cap } from '../utils/string';

type Props = {
  editing?: Uma | null;
  onSaved?(u: Uma): void;
  onError?(msg: string): void;
};

const emptyStats: Stats = {
  speed: null,
  stamina: null,
  power: null,
  guts: null,
  wisdom: null,
};
const emptyAff: VeteranAptitudes = DefaultVeteranAptitudes;

export default function UmaForm({ editing, onSaved, onError }: Props) {
  const [trainee, setTrainee] = useState(editing?.trainee ?? '');
  const [stats, setStats] = useState<Stats>(editing?.stats ?? emptyStats);
  const [affinities, setAff] = useState<VeteranAptitudes>(editing?.affinities ?? emptyAff);
  const [skills, setSkills] = useState(
    editing?.skills ?? ([] as { name: string; rarity?: 'white' | 'gold' }[]),
  );
  const [notes, setNotes] = useState(editing?.notes ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTrainee(editing?.trainee ?? '');
    setStats(editing?.stats ?? emptyStats);
    setAff(editing?.affinities ?? emptyAff);
    setSkills(editing?.skills ?? []);
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

  const payload = useMemo(
    () => ({
      id: editing?.id ?? uuid(),
      trainee,
      stats,
      affinities,
      skills: skills.filter((s) => s.name.trim().length > 0),
      notes,
      createdAt: editing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    [editing, trainee, stats, affinities, skills, notes],
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
        Add a new Uma
      </Typography>

      <Grid container spacing={2}>
        <Grid columnSpacing={{ xs: 12, sm: 6 }}>
          <TextField
            label="Trainee *"
            required
            fullWidth
            value={trainee}
            onChange={(e) => setTrainee(e.target.value)}
            placeholder="e.g., Gold Ship"
          />
        </Grid>
        <Grid columnSpacing={{ xs: 12 }}>
          <Divider textAlign="left">Stats</Divider>
        </Grid>
        {(['speed', 'stamina', 'power', 'guts', 'wisdom'] as const).map((k) => (
          <Grid columnSpacing={{ xs: 12, sm: 6, md: 2.4 }} key={k}>
            <TextField
              type="number"
              fullWidth
              label={cap(k)}
              value={stats[k] ?? ''}
              onChange={(e) => updateStat(k, e.target.value)}
            />
          </Grid>
        ))}
        <Grid columnSpacing={{ xs: 12 }}>
          <Divider textAlign="left">Affinities</Divider>
        </Grid>
        <VeteranAptitudesEditor />
        <Grid columnSpacing={{ xs: 12 }}>
          <Divider textAlign="left">Skills</Divider>
        </Grid>
        <Grid columnSpacing={{ xs: 12, sm: 3 }}>
          <Button onClick={addSkill} variant="contained">
            Add skill
          </Button>
        </Grid>
        {skills.length === 0 && (
          <Grid columnSpacing={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary">
              No skills yet
            </Typography>
          </Grid>
        )}
        {skills.map((s, i) => (
          <Grid columnSpacing={{ xs: 12 }} key={i}>
            <Grid container spacing={2} alignItems="center">
              <Grid columnSpacing={{ xs: 12, sm: 8 }}>
                <TextField
                  label="Skill name"
                  fullWidth
                  value={s.name}
                  onChange={(e) => updateSkill(i, 'name', e.target.value)}
                  placeholder="Sunny Weather"
                />
              </Grid>
              <Grid columnSpacing={{ xs: 12, sm: 1 }}>
                <IconButton onClick={() => removeSkill(i)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        ))}
        <Grid columnSpacing={{ xs: 12 }}>
          <TextField
            label="Notes"
            fullWidth
            multiline
            minRows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Grid>
        <Grid columnSpacing={{ xs: 12 }}>
          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Save changes' : 'Save record'}
            </Button>
            {editing && (
              <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                Editing existing record...
              </Typography>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}
