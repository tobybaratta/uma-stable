export type UmaBase = {
  id: string; // e.g., "1004"
  name: string; // e.g., "Maruzensky"
  outfits: Record<string, string>; // outfitId -> "[Formula R]"
};

export type UmaVariant = {
  id: string; // outfitId, e.g., "100401"
  baseId: string; // UmaBase.id
  name: string; // base name only
  label: string; // outfit label only
  displayName: string; // "[Formula R] Maruzensky"
};

// ---- Skills catalog ---------------------------------------------------------

export type SkillCatalogEntry = {
  id: number;
  name: string;
  iconId?: number | string;
};

export type SkillCatalog = Record<number, SkillCatalogEntry>;
