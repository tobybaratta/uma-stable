// src/lib/adapters.ts
import {
  type SkillCatalog,
  type VeteranTrainee,
  type TraineeRef,
  type TraineeAptitudes,
  defaultStats,
} from './types';

const idByName = (catalog: SkillCatalog) => {
  const map = new Map<string, number>();
  for (const e of Object.values(catalog)) map.set(e.name.toLowerCase(), e.id);
  return map;
};

export function namesToIds(names: string[], catalog: SkillCatalog): number[] {
  const m = idByName(catalog);
  return Array.from(
    new Set(
      names
        .map((n) => m.get(n.trim().toLowerCase()))
        .filter((id): id is number => typeof id === 'number'),
    ),
  );
}

// For IDs, create a map from those IDs to their actual names
export function idsToNames(ids: number[], catalog: SkillCatalog): string[] {
  return ids.map((id) => catalog[id]?.name ?? String(id));
}

/** Build a VeteranTrainee default */
export function toRecord(params: {
  id: string;
  uma: TraineeRef;
  displayName?: string;
  aptitudes: TraineeAptitudes;
  skillNames: string[];
  sparkNames: string[]; // TEMP: treat as skills
  catalog: SkillCatalog;
  notes?: string;
  favorite?: boolean;
}): VeteranTrainee {
  const skills = namesToIds(params.skillNames, params.catalog);
  const sparks = namesToIds(params.sparkNames, params.catalog);
  return {
    id: params.id,
    uma: params.uma,
    displayName: params.displayName,
    aptitudes: params.aptitudes,
    skills,
    sparks,
    stats: defaultStats,
    notes: params.notes,
    favorite: params.favorite,
    createdAt: new Date().toISOString(),
  };
}

/** For rendering your list using names */
export function fromRecord(rec: VeteranTrainee, catalog: SkillCatalog) {
  return {
    skillNames: idsToNames(rec.skills, catalog),
    sparkNames: idsToNames(rec.sparks, catalog),
  };
}
