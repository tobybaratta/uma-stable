// src/lib/catalog.ts
// Loads catalogs (skills + umas) from /public JSON files using fetch().
// Kept intentionally simple and readable.

import type { SkillCatalog, SkillCatalogEntry, UmaBase, UmaVariant } from './types.ui';

// --- JSON files from Umalator -------------------------------

const BASE = (import.meta as any).env?.BASE_URL ?? '/';

const URL_SKILL_NAMES = `${BASE}skill_names.json`;
const URL_SKILL_META = `${BASE}skills_meta.json`;
const URL_UMAS = `${BASE}umas.json`;

export function getSkillIconUrl(id: number, SKILLS: SkillCatalog): string {
  const entry = SKILLS[id];
  const iconKey = entry?.iconId ?? id;
  return `${BASE}icons/skills/${iconKey}.png`;
}

export function getUmaIcon(umaBaseId: string): string {
  return `${BASE}icons/umas/${umaBaseId}.png`;
}
// --- JSON shapes -------------------------------------------------------------
// skill_names.json: { "10001": ["Skill Name"], ... }
type SkillNamesJson = Record<string, [string] | string[]>;

// skills_meta.json: { "10001": { iconId?: number|string, groupId?: number, ... }, ... }
type SkillsMetaJson = Record<
  string,
  { iconId?: number | string; groupId?: number; order?: number }
>;

type RawUma = {
  name: [string, string]; // ["", "Base Name"], first is always ""
  outfits: Record<string, string>; // outfitId -> "[Outfit Label]"
};
type RawUmasJson = Record<string, RawUma>;

// --- module-level cache so we only fetch once per session -------------------
let _cached: Promise<{ SKILLS: SkillCatalog; UMAS: UmaBase[]; UMA_VARIANTS: UmaVariant[] }> | null =
  null;

// --- Small, readable helpers ------------------------------------------------

/** Turn the two skill JSONs into a single easy lookup: id -> {id, name, iconId} */
function buildSkillCatalog(names: SkillNamesJson, meta: SkillsMetaJson): SkillCatalog {
  const catalog: SkillCatalog = {};

  for (const idStr of Object.keys(names)) {
    const id = Number(idStr);
    if (Number.isNaN(id)) continue;

    // skill_names.json is ["Name"]; take the first entry
    const raw = names[idStr];
    const name = Array.isArray(raw) ? raw[0] ?? `Skill #${id}` : String(raw);

    const m = meta[idStr] ?? {};
    catalog[id] = {
      id,
      name,
      iconId: m.iconId ?? id, // fall back to the skill id as icon key
    } satisfies SkillCatalogEntry;
  }

  return catalog;
}

/** Converts raw umas.json (object keyed by base id) into functional array. */
function normalizeUmas(raw: RawUmasJson): UmaBase[] {
  const list: UmaBase[] = [];

  for (const baseId of Object.keys(raw)) {
    const item: RawUma = raw[baseId];
    const name: string = item?.name?.[1] ?? `Uma #${baseId}`;
    const outfits: Record<string, string> = item?.outfits ?? {};

    list.push({ id: baseId, name, outfits });
  }

  // Just ordering by their ID
  return list.sort((a, b) => Number(a.id) - Number(b.id));
}

/**
 * Each "Outfit" is a Variant of that Uma, almost the same Uma but with different top skills and growth rates.
 * This flattens all Uma bases + outfits into a single list of all Uma Variants at one-level for easier selection.
 */
function buildUmaVariants(bases: UmaBase[]): UmaVariant[] {
  const variants: UmaVariant[] = [];

  for (const base of bases) {
    const outfits = Object.entries(base.outfits ?? {});
    for (const [outfitId, label] of outfits) {
      variants.push({
        id: outfitId, // outfit id
        baseId: base.id, // the base uma id
        name: base.name, // "Maruzensky"
        label, // "[Formula R]"
        displayName: `${label} ${base.name}`.trim(), // "[Formula R] Maruzensky"
      });
    }
  }

  return variants.sort((a, b) => Number(a.id) - Number(b.id));
}

// --- Helper Utilities --------------------------------------------------------------

/**
 * Load and prepare all catalogs.
 * - Fetches JSON from /public
 * - Builds SKILLS (id -> { id, name, iconId })
 * - Normalizes UMAS array for selectors
 * - Flattens UMA_VARIANTS for “choose a specific outfit” UX
 */
export async function loadCatalogs(): Promise<{
  SKILLS: SkillCatalog;
  UMAS: UmaBase[];
  UMA_VARIANTS: UmaVariant[];
}> {
  if (_cached) return _cached;

  _cached = (async () => {
    // 1) Fetch all JSON in parallel
    const [namesResp, metaResp, umasResp] = await Promise.all([
      fetch(URL_SKILL_NAMES),
      fetch(URL_SKILL_META),
      fetch(URL_UMAS),
    ]);

    if (!namesResp.ok) throw new Error(`Failed to load ${URL_SKILL_NAMES}`);
    if (!metaResp.ok) throw new Error(`Failed to load ${URL_SKILL_META}`);
    if (!umasResp.ok) throw new Error(`Failed to load ${URL_UMAS}`);

    // 2) Parse JSON
    const [names, meta, rawUmas] = await Promise.all([
      namesResp.json() as Promise<SkillNamesJson>,
      metaResp.json() as Promise<SkillsMetaJson>,
      umasResp.json() as Promise<RawUmasJson>,
    ]);

    // 3) Build catalogs
    const SKILLS = buildSkillCatalog(names, meta);
    const UMAS = normalizeUmas(rawUmas);
    const UMA_VARIANTS = buildUmaVariants(UMAS);

    return { SKILLS, UMAS, UMA_VARIANTS };
  })();

  return _cached;
}

/** Friendly name for a skill id; falls back to "Skill #123". */
export function getSkillNameById(id: number, SKILLS: SkillCatalog): string {
  const entry = SKILLS[id];
  return entry?.name ?? `Skill #${id}`;
}

/** Find a specific Uma variant (by outfitId) from the prepared list. */
export function getUmaVariantById(
  variantId: string,
  UMA_VARIANTS: UmaVariant[],
): UmaVariant | undefined {
  return UMA_VARIANTS.find((v) => v.id === variantId);
}

// /** Optional fancy: turn UMA_VARIANTS into a quick lookup map for O(1) access. */
// export function indexUmaVariants(UMA_VARIANTS: UmaVariant[]): Record<string, UmaVariant> {
//   const map: Record<string, UmaVariant> = {};
//   for (const v of UMA_VARIANTS) map[v.id] = v;
//   return map;
//}
