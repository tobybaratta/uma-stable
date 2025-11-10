import { HouseHeart, Plus, Search } from 'lucide-react';
import ThemeToggle from '@/components/common/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Header({
  onAdd,
  query,
  setQuery,
}: {
  onAdd: () => void;
  query: string;
  setQuery: (v: string) => void;
}) {
  return (
    <header className="relative border-b bg-white/70 dark:bg-white/10 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/30">
      <div className="mx-auto max-w-6xl px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-pink-400 to-amber-300 shadow-md grid place-items-center">
            <HouseHeart className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            <span className="bg-gradient-to-b from-pink-500 to-amber-400 bg-clip-text text-transparent drop-shadow-sm">
              Uma Stable
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-[52vw] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trainees, skills, sparks…"
              className="pl-9 rounded-xl"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={onAdd}
            className="gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-amber-400 text-white shadow"
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
          <ThemeToggle />
        </div>

        <img
          src="/uma-stable/seiun-sky-chibi.png"
          alt="Seiun Sky chibi"
          className="pointer-events-none select-none hidden sm:block absolute -right-4 -bottom-6 w-20 drop-shadow-[0_6px_0_rgba(255,255,255,0.9)]"
        />
      </div>
    </header>
  );
}
