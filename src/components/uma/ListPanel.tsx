import { Sparkles, NotebookPen, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { useState } from 'react';
import { getSkillNameById } from '@/lib/catalog';

import type { SkillCatalog } from '@/lib/types.ui';
import type { Veteran } from '@/lib/types.db';

// Simple badge style helpers
const badgeBase = 'rounded-xl px-2 py-0.5 text-xs font-medium border-0 text-black dark:text-white';

const badgeSkill = `${badgeBase} bg-gradient-to-r from-sky-300/70 to-indigo-400/70 dark:from-sky-700/60 dark:to-indigo-800/60`;

const badgeSpark = `${badgeBase} bg-gradient-to-r from-amber-200 to-pink-200 dark:from-amber-700/60 dark:to-pink-700/60`;

export default function ListPanel({
  entries,
  onEdit,
  onDelete,
  setEntries,
  SKILLS,
}: {
  entries: Veteran[];
  onEdit: (e: Veteran) => void;
  onDelete: (id: string) => void;
  setEntries: React.Dispatch<React.SetStateAction<Veteran[]>>;
  SKILLS: SkillCatalog;
}) {
  const [dense, setDense] = useState(false);
  const toggleFav = (id: string) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, favorite: !e.favorite } : e)));

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Trainee Veterans</CardTitle>
            <CardDescription>
              You can add your veterans here to then lookup and find sparks later.
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="dense" className="text-sm">
                Compact View
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
                  {/* tiny hack */}
                  <h3 className="font-semibold text-lg leading-tight truncate">
                    {e?.uma?.displayName}
                  </h3>
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
                {e.skills?.slice(0, 5).map((id, i) => (
                  <Badge key={i} className={badgeSkill}>
                    {getSkillNameById(id, SKILLS)}
                  </Badge>
                ))}
                {e.skills?.length > 5 && (
                  <Badge variant="outline" className={badgeSkill}>
                    +{e.skills.length - 5} more
                  </Badge>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {e.sparks?.length ? (
                  <span className="text-xs font-medium text-muted-foreground">Sparks:</span>
                ) : null}

                {e.sparks?.map((id, i) => (
                  <Badge key={i} className={badgeSpark}>
                    {getSkillNameById(id, SKILLS)}
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
