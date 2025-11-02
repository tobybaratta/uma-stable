// src/components/uma/ListPanel.tsx
import { Sparkles, NotebookPen, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Entry } from '@/lib/types';
import { useState } from 'react';

export default function ListPanel({
  entries,
  onEdit,
  onDelete,
  setEntries,
}: {
  entries: Entry[];
  onEdit: (e: Entry) => void;
  onDelete: (id: string) => void;
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
}) {
  const [dense, setDense] = useState(false);
  const toggleFav = (id: string) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, favorite: !e.favorite } : e)));

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Your Trainees</CardTitle>
            <CardDescription>Quick list of saved trainees with skills & sparks.</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="dense" className="text-sm">
                Compact
              </Label>
              <Switch id="dense" checked={dense} onCheckedChange={(v) => setDense(!!v)} />
            </div>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="py-4">
        <div
          className={
            'grid gap-3 ' +
            (dense ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-2')
          }
        >
          {entries.map((e) => (
            <article
              key={e.id}
              className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition p-4"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg leading-tight truncate">{e.trainee}</h3>
                  <p className="text-xs text-muted-foreground">
                    Added {new Date(e.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={e.favorite ? 'default' : 'secondary'}
                        size="icon"
                        className="rounded-full"
                        onClick={() => toggleFav(e.id)}
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Toggle favorite</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => onEdit(e)}
                      >
                        <NotebookPen className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => onDelete(e.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {e.notes ? (
                <p className="mt-2 text-sm line-clamp-2 text-muted-foreground">{e.notes}</p>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-2">
                {e.skills.slice(0, 5).map((s, i) => (
                  <Badge key={i} variant="secondary" className="rounded-xl">
                    {s}
                  </Badge>
                ))}
                {e.skills.length > 5 && (
                  <Badge variant="outline" className="rounded-xl">
                    +{e.skills.length - 5} more
                  </Badge>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {e.sparks.length ? (
                  <span className="text-xs font-medium text-muted-foreground">Sparks:</span>
                ) : null}
                {e.sparks.map((s, i) => (
                  <Badge
                    key={i}
                    className="rounded-xl bg-gradient-to-r from-amber-200 to-pink-200 text-foreground border-0"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
