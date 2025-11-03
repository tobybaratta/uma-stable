// src/components/uma/ComboAdd.tsx
import * as React from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

type Option = { id: string | number; label: string };

type ComboAddProps = {
  /** full list; we'll filter & limit inside */
  options: Option[];
  /** called when user commits an item (or free text via Enter/Add) */
  onAdd: (value: string) => void;
  placeholder?: string;
  addLabel?: string;
  className?: string;
  emptyText?: string;
  /** if true, allow free text (not only from options) */
  allowFreeText?: boolean;
};

export default function ComboAdd({
  options,
  onAdd,
  placeholder = 'Type to search…',
  addLabel = 'Add',
  className,
  emptyText = 'No matches',
  allowFreeText = true,
}: ComboAddProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [buttonLabel, setButtonLabel] = React.useState(''); // preview in trigger

  // dedupe by label (case-insensitive), keep first occurrence
  const base = React.useMemo(() => {
    const map = new Map<string, Option>();
    for (const o of options) {
      const k = o.label.trim().toLowerCase();
      if (!map.has(k)) map.set(k, { id: o.id, label: o.label.trim() });
    }
    return Array.from(map.values());
  }, [options]);

  // simple filter (Command also filters, but we pre-limit for perf)
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = q ? base.filter((o) => o.label.toLowerCase().includes(q)) : base;
    // hard cap to keep DOM small; still searchable
    return arr.slice(0, 200);
  }, [base, query]);

  function commit(value: string) {
    const v = value.trim();
    if (!v) return;
    onAdd(v);
    setButtonLabel('');
    setQuery('');
    setOpen(false);
  }

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between rounded-xl"
            onClick={() => setOpen((p) => !p)}
          >
            <span className="truncate text-left">
              {buttonLabel || 'Search & select (or type)…'}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl shadow-lg border"
        >
          <Command shouldFilter>
            <CommandInput
              autoFocus
              value={query}
              onValueChange={setQuery}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && allowFreeText) {
                  // when Enter on free text (no active item)
                  // Command handles selection when an item is focused
                  commit(query);
                }
              }}
            />
            <CommandList className="max-h-64 overflow-auto">
              <CommandEmpty className="py-6 text-sm text-muted-foreground">
                {emptyText}
              </CommandEmpty>
              <CommandGroup>
                {filtered.map((opt, i) => {
                  const isActive = query.trim().toLowerCase() === opt.label.toLowerCase();
                  return (
                    <CommandItem
                      key={`${opt.id}__${i}`}
                      value={opt.label}
                      onSelect={(val) => commit(val)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={'mr-2 h-4 w-4 ' + (isActive ? 'opacity-100' : 'opacity-0')}
                      />
                      {opt.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <div className="p-2">
              <Button
                className="w-full rounded-xl gap-2"
                onClick={() => commit(query)}
                disabled={!allowFreeText || !query.trim()}
                variant="secondary"
              >
                <Plus className="h-4 w-4" />
                {addLabel}
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
