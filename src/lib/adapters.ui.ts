// src/lib/adapters.ui.ts
// Name/ID conversion helpers for skills — UI-side.

import type { SkillCatalog } from './types.ui';
import { getSkillNameById } from './catalog';

function buildNameToId(SKILLS: SkillCatalog): Map<string, number> {
  const map = new Map<string, number>();
  for (const idStr of Object.keys(SKILLS)) {
    const id = Number(idStr);
    const name = SKILLS[id]?.name ?? `Skill #${id}`;
    map.set(name.trim().toLowerCase(), id);
  }
  return map;
}

export function namesToIds(names: string[], SKILLS: SkillCatalog): number[] {
  const lut = buildNameToId(SKILLS);
  const out: number[] = [];
  for (const raw of names) {
    const key = raw?.trim().toLowerCase();
    if (!key) continue;
    const id = lut.get(key);
    if (typeof id === 'number') {
      out.push(id);
    } else if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.warn(`[namesToIds] Unknown skill name: "${raw}"`);
    }
  }
  return out;
}

export function idsToNames(ids: number[], SKILLS: SkillCatalog): string[] {
  return ids.map((id) => getSkillNameById(id, SKILLS));
}
