// src/lib/skills-catalog.ts
import type { SkillCatalog, SkillCatalogEntry } from '@/lib/types';

type NamesJson = Record<string, string[]>;
type MetaJson = Record<string, Partial<Pick<SkillCatalogEntry, 'iconId' | 'groupId'>>>;


export function buildSkillCatalog(
  skillNames: NamesJson,
  skillsMeta: MetaJson,
): SkillCatalog {
  const catalog: SkillCatalog = {};

  // First pass: names
  for (const [idStr, arr] of Object.entries(skillNames)) {
    const id = Number(idStr);
    if (!Number.isFinite(id)) continue;
    const name = Array.isArray(arr) && arr.length ? arr[0] : String(arr ?? idStr);
    catalog[id] = { id, name };
  }

  // Second pass: meta
  for (const [idStr, meta] of Object.entries(skillsMeta)) {
    const id = Number(idStr);
    if (!Number.isFinite(id)) continue;
    if (!catalog[id]) catalog[id] = { id, name: String(id) };
    Object.assign(catalog[id], meta);
  }

  return catalog;
}

// Helpers for URLs based on your folder structure
export const skillIconUrl = (id: number | string) => `/icons/skills/${id}.png`;
export const umaIconUrl = (umaId: number | string) => `/icons/umas/${umaId}.png`;
