// src/app/App.tsx
import { useMemo, useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Header, ListPanel, EditSheet } from '@/components/uma';
import type { Entry } from '@/lib/types';

// Importing this wasn't properly working, so just placing the function here as a temp fix.
const uid = () => Math.random().toString(36).slice(2, 10);

export default function App() {
  const [query, setQuery] = useState('');
  // Fix Me to not be a subset of Umas
  const [entries, setEntries] = useState<Entry[]>(() => [
    {
      id: uid(),
      trainee: 'Seiun Sky',
      skills: ['Angling & Scheming', 'Focus'],
      sparks: ['Sunny Weather'],
      createdAt: Date.now() - 86_400_000,
      favorite: true,
    },
    {
      id: uid(),
      trainee: 'Gold Ship',
      skills: ['Corner Recovery', 'Focus'],
      sparks: ['Firm Conditions'],
      createdAt: Date.now() - 7_200_000,
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Entry | null>(null);

  const filtered = useMemo(() => {
    if (!query) return entries;
    const q = query.toLowerCase();
    return entries.filter((e) =>
      [e.trainee, e.notes, ...e.skills, ...e.sparks].some((t) => t?.toLowerCase().includes(q)),
    );
  }, [entries, query]);

  const onCreateOrUpdate = (data: Omit<Entry, 'id' | 'createdAt'> & { id?: string }) => {
    if (data.id)
      setEntries((prev) => prev.map((e) => (e.id === data.id ? ({ ...e, ...data } as Entry) : e)));
    else setEntries((prev) => [{ id: uid(), createdAt: Date.now(), ...data } as Entry, ...prev]);
    setOpen(false);
    setEditing(null);
  };

  const onDelete = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));
  const startEdit = (entry?: Entry) => {
    setEditing(entry ?? null);
    setOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[radial-gradient(80%_60%_at_0%_0%,#ffe6f6_0,transparent_60%),radial-gradient(80%_60%_at_100%_100%,#fff4d6_0,transparent_60%),#fff] dark:bg-[radial-gradient(80%_60%_at_0%_0%,#0e1320_0,transparent_60%),radial-gradient(80%_60%_at_100%_100%,#1a1028_0,transparent_60%),#0b0b12]">
        <Header onAdd={() => startEdit()} query={query} setQuery={setQuery} />
        <main className="mx-auto max-w-6xl px-4 py-6 grid gap-6">
          <ListPanel
            entries={filtered}
            onEdit={startEdit}
            onDelete={onDelete}
            setEntries={setEntries}
          />
        </main>
        <EditSheet open={open} setOpen={setOpen} entry={editing} onSubmit={onCreateOrUpdate} />
      </div>
    </TooltipProvider>
  );
}
