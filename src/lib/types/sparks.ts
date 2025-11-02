import { z } from 'zod';
import { UmaSkillSchema } from './skills';

/**
 * Each spark has its own tie to a skill, the level of the skill, and the parents.
 * These sparks can either be at level 1, 2, or 3.
 */
const SparkSkillSchema = UmaSkillSchema.extend({
  sparkLevel: z.number().gte(1).lte(3),
});

export type SkillSpark = z.infer<typeof SparkSkillSchema>;

const LegacySparkSchema = z.object({
  legacyUmaTrainee: z.string(),
  // This is an optional link to an existing Uma record
  // TBD. This is just to be able to easily copy over those stats and
  // potentially create a link in the future, but not now at all.
  legacyUmaId: z.uuid().optional(),
  pink: z.string().optional(),
  blue: z.string().optional(),
  green: z.string().optional(),
  skills: z.array(SparkSkillSchema),
});

/** Legacies Structure */
/** This is for being able to have the representative skills (which may include races),
 *  as well as the two legacies.
 */
export const LegaciesSchema = z.object({
  representativeSkills: z.array(SparkSkillSchema),
  legacy1: LegacySparkSchema,
  legacy2: LegacySparkSchema,
});

export type Legacies = z.infer<typeof LegaciesSchema>;
