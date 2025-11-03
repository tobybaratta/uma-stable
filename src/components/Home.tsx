// src/app/App.tsx
import { useEffect, useMemo, useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Header, ListPanel, EditSheet } from '@/components/uma';

import { loadCatalogs } from '@/lib/catalog';
import { buildVeteran } from '@/lib/adapters.db';

import type { Veteran } from '@/lib/types.db';
import type { SkillCatalog, UmaVariant, UmaBase } from '@/lib/types.ui';

const uid = () => Math.random().toString(36).slice(2, 10);

export default function App() {
  const [ready, setReady] = useState(false);

  // Catalogs
  const [SKILLS, setSKILLS] = useState<SkillCatalog>({});
  const [_UMAS, setUMAS] = useState<UmaBase[]>([]);
  const [UMA_VARIANTS, setUMA_VARIANTS] = useState<UmaVariant[]>([]);

  // Data
  // Try to load previously saved veterans from sessionStorage
  const [entries, setEntries] = useState<Veteran[]>(() => {
    try {
      const stored = sessionStorage.getItem('uma-stable-veterans');
      console.log(stored);
      return stored ? (JSON.parse(stored) as Veteran[]) : [];
    } catch {
      return [];
    }
  });

  // Search functions
  const [query, setQuery] = useState('');

  // Sheet state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Veteran | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { SKILLS, UMAS, UMA_VARIANTS } = await loadCatalogs();
      if (!mounted) return;

      setSKILLS(SKILLS);
      setUMAS(UMAS);
      setUMA_VARIANTS(UMA_VARIANTS);

      // Seed demo entries with the first available variant (if any)
      const seed: Veteran[] = [];
      if (UMA_VARIANTS.length) {
        const v0 = UMA_VARIANTS[0];
        seed.push({
          id: uid(),
          uma: {
            id: v0.id,
            baseId: v0.baseId,
            name: v0.name,
            label: v0.label,
            displayName: v0.displayName,
          },
          skills: [],
          sparks: [],
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6h ago
          favorite: true,
        });
      }

      setEntries((prev) => {
        if (prev.length > 0) return prev;
        return seed ? [seed as any] : [];
      });

      setReady(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Search filter: displayName/notes/skill names/spark names
  const filtered = useMemo(() => {
    if (!query) return entries;
    const q = query.toLowerCase();

    const idToName = (id: number) => SKILLS[id]?.name ?? `Skill #${id}`;

    return entries.filter((e) => {
      const haystack: string[] = [
        e.uma.displayName ?? '',
        e.notes ?? '',
        ...e.skills.map(idToName),
        ...e.sparks.map(idToName),
      ];
      return haystack.some((t) => t.toLowerCase().includes(q));
    });
  }, [entries, query, SKILLS]);

  // Create/Edit submission from EditSheet
  function onSaveFromForm(data: {
    id?: string;
    variantId: string;
    skillsByName: string[];
    sparksByName: string[];
    notes?: string;
    favorite?: boolean;
  }) {
    const record = buildVeteran({
      id: data.id ?? uid(),
      uma: { variantId: data.variantId },
      skillsByName: data.skillsByName,
      sparksByName: data.sparksByName,
      notes: data.notes,
      favorite: data.favorite,
      SKILLS,
      UMA_VARIANTS,
    });

    setEntries((prev) => {
      const i = prev.findIndex((x) => x.id === record.id);
      if (i >= 0) {
        const copy = prev.slice();
        copy[i] = record;
        return copy;
      }
      return [record, ...prev];
    });

    setOpen(false);
    setEditing(null);
  }

  const onDelete = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));
  const startEdit = (entry?: Veteran) => {
    setEditing(entry ?? null);
    setOpen(true);
  };

  // Persist veterans to sessionStorage on any change
  useEffect(() => {
    try {
      sessionStorage.setItem('uma-stable-veterans', JSON.stringify(entries));
    } catch {
      // Ignore quota / private mode errors
    }
  }, [entries]);

  // If the data isn't loaded in yet, just show loading. Really shouldn't ever happen.
  if (!ready) return <div className="p-6">Loading…</div>;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[radial-gradient(80%_60%_at_0%_0%,#ffe6f6_0,transparent_60%),radial-gradient(80%_60%_at_100%_100%,#fff4d6_0,transparent_60%),#fff] dark:bg-[radial-gradient(80%_60%_at_0%_0%,#0e1320_0,transparent_60%),radial-gradient(80%_60%_at_100%_100%,#1a1028_0,transparent_60%),#0b0b12]">
        <Header onAdd={() => startEdit()} query={query} setQuery={setQuery} />
        <main className="mx-auto max-w-6xl px-4 py-6 grid gap-6">
          <ListPanel
            entries={filtered}
            SKILLS={SKILLS}
            onEdit={startEdit}
            onDelete={onDelete}
            setEntries={setEntries}
          />
        </main>

        <EditSheet
          open={open}
          setOpen={setOpen}
          UMA_VARIANTS={UMA_VARIANTS}
          SKILLS={SKILLS}
          veteran={editing}
          onSubmit={onSaveFromForm}
        />
      </div>
    </TooltipProvider>
  );
}
