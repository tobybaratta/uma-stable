// src/lib/catalog.ts
// Loads catalogs (skills + umas) from /public JSON files using fetch().
// Kept intentionally simple and readable.

import type { SkillCatalog, SkillCatalogEntry, UmaBase, UmaVariant } from './types.ui';

// --- Where the JSON files live (public/ root) -------------------------------
// If you move these files, just update the paths below.
const URL_SKILL_NAMES = '/skill_names.json';
const URL_SKILL_META = '/skills_meta.json';
const URL_UMAS = '/umas.json';

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

/** Convert your raw umas.json (object keyed by base id) into a friendly array. */
function normalizeUmas(raw: RawUmasJson): UmaBase[] {
  const list: UmaBase[] = [];

  for (const baseId of Object.keys(raw)) {
    const item = raw[baseId];
    // item.name[0] is always "", item.name[1] is the readable base name
    const name = item?.name?.[1] ?? `Uma #${baseId}`;
    const outfits = item?.outfits ?? {};
    list.push({ id: baseId, name, outfits });
  }

  // Keep a stable order (numeric by id)
  return list.sort((a, b) => Number(a.id) - Number(b.id));
}

/** Flatten each outfit into a separate "variant" row with a finished displayName. */
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

// --- Public API --------------------------------------------------------------

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
export function skillName(id: number, SKILLS: SkillCatalog): string {
  const entry = SKILLS[id];
  return entry?.name ?? `Skill #${id}`;
}

/** Public path to a skill’s icon. Uses iconId when available; falls back to id. */
export function skillIconUrl(id: number, SKILLS: SkillCatalog): string {
  const entry = SKILLS[id];
  const iconKey = entry?.iconId ?? id;
  return `/icons/skills/${iconKey}.png`;
}

/** Public path to a base Uma’s icon (not outfit-specific). */
export function umaIcon(baseUmaId: string): string {
  return `/icons/umas/${baseUmaId}.png`;
}

/** Find a specific Uma variant (by outfitId) from the prepared list. */
export function getUmaVariantById(
  variantId: string,
  UMA_VARIANTS: UmaVariant[],
): UmaVariant | undefined {
  return UMA_VARIANTS.find((v) => v.id === variantId);
}

/** Optional: turn UMA_VARIANTS into a quick lookup map for O(1) access. */
export function indexUmaVariants(UMA_VARIANTS: UmaVariant[]): Record<string, UmaVariant> {
  const map: Record<string, UmaVariant> = {};
  for (const v of UMA_VARIANTS) map[v.id] = v;
  return map;
}
