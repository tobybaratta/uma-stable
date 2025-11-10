// src/lib/adapters.db.ts
// Bridges UI values to the DB Veteran model.

import type { Veteran } from './types.db';
import type { SkillCatalog, UmaVariant } from './types.ui';
import { getUmaVariantById } from './catalog';
import { namesToIds } from './adapters.ui';

type BuildVeteranArgs = {
  id: string;

  // Provide either the full variant (from UI) or just its ID.
  uma: UmaVariant | { variantId: string };

  score?: number;
  notes?: string;
  favorite?: boolean;
  createdAt?: string;

  // Provide either names or ids for skills/sparks. Names take precedence.
  skillsByName?: string[];
  sparksByName?: string[];

  skills?: number[];
  sparks?: number[];

  SKILLS: SkillCatalog;
  UMA_VARIANTS: UmaVariant[]; // required if uma is { variantId }
};

/**
 * Normalizes incoming values into a persisted Veteran:
 * - Resolves { variantId } → embedded UmaVariantDb snapshot
 * - Converts skill/spark names → ids when provided
 */
export function buildVeteran(args: BuildVeteranArgs): Veteran {
  const {
    id,
    uma,
    score,
    notes,
    favorite,
    createdAt,

    skillsByName,
    sparksByName,
    skills,
    sparks,

    SKILLS,
    UMA_VARIANTS,
  } = args;

  // Resolve a concrete UmaVariant
  let variant: UmaVariant;
  if ('displayName' in (uma as any)) {
    variant = uma as UmaVariant;
  } else {
    const found = getUmaVariantById((uma as { variantId: string }).variantId, UMA_VARIANTS);
    if (!found) {
      throw new Error(`[buildVeteran] Unknown variantId "${(uma as any).variantId}"`);
    }
    variant = found;
  }

  const skillsIds =
    skillsByName && skillsByName.length > 0 ? namesToIds(skillsByName, SKILLS) : skills ?? [];

  const sparksIds =
    sparksByName && sparksByName.length > 0 ? namesToIds(sparksByName, SKILLS) : sparks ?? [];

  return {
    id,
    uma: {
      id: variant.id,
      baseId: variant.baseId,
      name: variant.name,
      label: variant.label,
      displayName: variant.displayName,
    },
    score,
    skills: skillsIds,
    sparks: sparksIds,
    notes,
    favorite,
    createdAt: createdAt ?? new Date().toISOString(),
  };
}
