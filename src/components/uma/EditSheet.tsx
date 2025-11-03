// src/components/uma/EditSheet.tsx
import { useEffect, useState } from 'react';
// import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { DEFAULT_SKILLS, DEFAULT_SPARKS, TRAINEES } from '@/data/trainees';
import type { Entry } from '@/lib/types';
import ComboAdd from './ComboAdd';

export default function EditSheet({
  open,
  setOpen,
  entry,
  onSubmit,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  entry: Entry | null;
  onSubmit: (data: Omit<Entry, 'id' | 'createdAt'> & { id?: string }) => void;
}) {
  const [trainee, setTrainee] = useState<string>(entry?.trainee ?? '');
  const [skills, setSkills] = useState<string[]>(entry?.skills ?? []);
  const [sparks, setSparks] = useState<string[]>(entry?.sparks ?? []);
  const [notes, setNotes] = useState<string>(entry?.notes ?? '');
  const [favorite, setFavorite] = useState<boolean>(!!entry?.favorite);

  useEffect(() => {
    setTrainee(entry?.trainee ?? '');
    setSkills(entry?.skills ?? []);
    setSparks(entry?.sparks ?? []);
    setNotes(entry?.notes ?? '');
    setFavorite(!!entry?.favorite);
  }, [entry, open]);

  const addSkill = (s: string) => s && setSkills((prev) => Array.from(new Set([...prev, s])));
  const removeSkill = (s: string) => setSkills((prev) => prev.filter((x) => x !== s));
  const addSpark = (s: string) => s && setSparks((prev) => Array.from(new Set([...prev, s])));
  const removeSpark = (s: string) => setSparks((prev) => prev.filter((x) => x !== s));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{entry ? 'Edit Trainee' : 'Add Trainee'}</SheetTitle>
          <SheetDescription>Pick a trainee, attach skills and sparks, and save.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 grid gap-6">
          <div className="grid gap-2">
            <Label>Trainee</Label>
            <Select value={trainee} onValueChange={setTrainee}>
              <SelectTrigger className="bg-background rounded-xl">
                <SelectValue placeholder="Select a trainee" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Popular</SelectLabel>
                  {TRAINEES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input
              placeholder="…or type a custom name"
              value={trainee}
              onChange={(e) => setTrainee(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Skills</Label>
            <ComboAdd placeholder="Add a skill" options={DEFAULT_SKILLS} onAdd={addSkill} />
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <Badge key={s} variant="secondary" className="rounded-xl group">
                  {s}
                  <button
                    className="ml-1 rounded-full hover:bg-foreground/10"
                    onClick={() => removeSkill(s)}
                    aria-label={`Remove ${s}`}
                  >
                    ✖
                  </button>
                </Badge>
              ))}
              {!skills.length && <p className="text-sm text-muted-foreground">No skills yet</p>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Sparks</Label>
            <ComboAdd placeholder="Add a spark" options={DEFAULT_SPARKS} onAdd={addSpark} />
            <div className="flex flex-wrap gap-2">
              {sparks.map((s) => (
                <Badge
                  key={s}
                  className="rounded-xl bg-gradient-to-r from-amber-200 to-pink-200 text-foreground border-0"
                >
                  {s}
                  <button
                    className="ml-1 rounded-full hover:bg-black/10"
                    onClick={() => removeSpark(s)}
                    aria-label={`Remove ${s}`}
                  >
                    ✖
                  </button>
                </Badge>
              ))}
              {!sparks.length && <p className="text-sm text-muted-foreground">No sparks yet</p>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Notes</Label>
            <Textarea
              rows={4}
              placeholder="Any notes…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Switch checked={favorite} onCheckedChange={(v) => setFavorite(!!v)} id="fav" />
              <Label htmlFor="fav" className="text-sm">
                Mark as favorite
              </Label>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                onSubmit({
                  id: entry?.id,
                  trainee: trainee || 'Unnamed',
                  skills,
                  sparks,
                  notes,
                  favorite,
                })
              }
              className="gap-2"
            >
              Save Record
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
