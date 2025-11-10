import { useEffect, useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ComboAdd from '@/components/uma/ComboAdd';

import type { SkillCatalog, UmaVariant } from '@/lib/types.ui';
import type { Veteran } from '@/lib/types.db';
import { cn } from '@/lib/utils';

type SavePayload = {
  id?: string;
  variantId: string; // outfit/variant id (ex: "100401")
  skillsByName: string[]; // names -> ids in parent via adapters
  sparksByName: string[]; // names -> ids in parent via adapters
  notes?: string;
  favorite?: boolean;
};

interface IEditSheetProps {
  open: boolean;
  setOpen: (v: boolean) => void;

  // Catalogs (UI-facing)
  UMA_VARIANTS: UmaVariant[];
  SKILLS: SkillCatalog;

  // Current record or null for "add"
  veteran: Veteran | null;

  // Parent save
  onSubmit: (data: SavePayload) => void;
}

export default function EditSheet({
  open,
  setOpen,
  UMA_VARIANTS,
  SKILLS,
  veteran,
  onSubmit,
}: IEditSheetProps) {
  // ------- helpers (name <-> id) -------
  const nameById = (id: number) => SKILLS[id]?.name ?? String(id);

  const idsToNames = (ids: number[]) => ids.map(nameById);

  // ------- local editable state (UI uses names; save uses names) -------
  const [variantId, setVariantId] = useState<string>(veteran?.uma.id ?? '');
  const [skillNames, setSkillNames] = useState<string[]>(veteran ? idsToNames(veteran.skills) : []);
  const [sparkNames, setSparkNames] = useState<string[]>(veteran ? idsToNames(veteran.sparks) : []);
  const [notes, setNotes] = useState<string>(veteran?.notes ?? '');
  const [favorite, setFavorite] = useState<boolean>(!!veteran?.favorite);

  // small input buffers for adders
  const [skillInput, setSkillInput] = useState('');
  const [sparkInput, setSparkInput] = useState('');

  // Re-seed when opening/switching record
  useEffect(() => {
    setVariantId(veteran?.uma.id ?? '');
    setSkillNames(veteran ? idsToNames(veteran.skills) : []);
    setSparkNames(veteran ? idsToNames(veteran.sparks) : []);
    setNotes(veteran?.notes ?? '');
    setFavorite(!!veteran?.favorite);
    setSkillInput('');
    setSparkInput('');
  }, [veteran, open]); // eslint-disable-line react-hooks/exhaustive-deps

  // ------- list helpers -------
  const clean = (s: string) => s.replace(/\s+/g, ' ').trim();
  const addUnique = (list: string[], value: string) => {
    const v = clean(value);
    if (!v) return list;
    const set = new Set(list.map((x) => x.toLowerCase()));
    if (set.has(v.toLowerCase())) return list;
    return [...list, v];
  };

  function addSkill(v?: string) {
    const value = v ?? skillInput;
    if (!value) return;
    setSkillNames((prev) => addUnique(prev, value));
    setSkillInput('');
  }
  function removeSkill(s: string) {
    setSkillNames((prev) => prev.filter((x) => x !== s));
  }

  function addSpark(v?: string) {
    const value = v ?? sparkInput;
    if (!value) return;
    setSparkNames((prev) => addUnique(prev, value));
    setSparkInput('');
  }
  function removeSpark(s: string) {
    setSparkNames((prev) => prev.filter((x) => x !== s));
  }

  // ------- save -------
  function handleSave() {
    const selectedVariantId = variantId || (UMA_VARIANTS.length ? UMA_VARIANTS[0].id : '');
    const payload: SavePayload = {
      id: veteran?.id, // parent can create if undefined
      variantId: selectedVariantId,
      skillsByName: skillNames, // names → ids in parent via adapters
      sparksByName: sparkNames, // names → ids in parent via adapters
      notes: clean(notes) || undefined,
      favorite,
    };
    onSubmit(payload);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{veteran ? 'Edit Veteran' : 'Add Veteran'}</SheetTitle>
          <SheetDescription>
            Pick a specific outfit/variant, add skills and sparks (by name), then save.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 grid gap-6">
          {/* Variant (outfit-based) */}
          <div className="grid gap-2">
            <Label>Uma (Variant)</Label>
            <Select value={variantId} onValueChange={setVariantId}>
              <SelectTrigger className="bg-background rounded-xl">
                <SelectValue placeholder="Select a variant" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>All Variants</SelectLabel>
                  {UMA_VARIANTS.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.displayName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Skills (entered as names, stored as IDs) */}
          <div className="grid gap-2">
            <Label>Skills</Label>
            <ComboAdd
              options={Object.values(SKILLS).map((s) => ({ id: s.id, label: s.name }))}
              onAdd={(val) => addSkill(val)}
              placeholder="Type a skill name, press Enter"
              addLabel="Add"
            />
            <div className="flex flex-wrap gap-2">
              {skillNames.map((s, i) => (
                <Badge
                  key={s + i}
                  variant="secondary"
                  className={cn(
                    'rounded-xl border-0 px-2 py-1 text-xs font-medium text-foreground',
                    'bg-gradient-to-r from-sky-300/70 to-indigo-400/70 dark:from-sky-700/60 dark:to-indigo-800/60',
                  )}
                >
                  {s}
                  <button
                    className="ml-1 rounded-full hover:bg-foreground/10 px-1"
                    onClick={() => removeSkill(s)}
                    aria-label={`Remove ${s}`}
                  >
                    ✖
                  </button>
                </Badge>
              ))}
              {!skillNames.length && <p className="text-sm text-muted-foreground">No skills yet</p>}
            </div>
          </div>

          {/* Sparks */}
          <div className="grid gap-2">
            <ComboAdd
              options={Object.values(SKILLS).map((s) => ({ id: s.id, label: s.name }))}
              onAdd={(val) => addSpark(val)}
              placeholder="Type a spark name, press Enter"
              addLabel="Add"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {sparkNames.map((s, i) => (
                <Badge
                  key={s + i}
                  variant="secondary"
                  className={cn(
                    'rounded-xl border-0 px-2 py-1 text-xs font-medium text-foreground',
                    'bg-gradient-to-r from-amber-200 to-pink-200 dark:from-amber-700/60 dark:to-pink-700/60',
                  )}
                >
                  {s}
                  <button
                    className="ml-1 rounded-full hover:bg-black/10 px-1"
                    onClick={() => removeSpark(s)}
                    aria-label={`Remove ${s}`}
                  >
                    ✖
                  </button>
                </Badge>
              ))}
              {!sparkNames.length && <p className="text-sm text-muted-foreground">No sparks yet</p>}
            </div>
          </div>

          {/* Notes & favorite */}
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
            <Button onClick={handleSave} className="gap-2">
              <Plus className="h-4 w-4" /> Save Veteran
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
