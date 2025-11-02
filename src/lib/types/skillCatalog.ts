// Normalized skill catalog entry (ID is canonical; name/meta is derived)
export interface SkillCatalogEntry {
  id: number;
  name: string;
  iconId?: number | string;
  groupId?: number;
}

export type SkillCatalog = Record<number, SkillCatalogEntry>;
