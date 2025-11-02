import { z } from 'zod';
import { UmaStatsSchema, TraineeAptitudesSchema, UmaSkillSchema, LegaciesSchema } from './types';

export const UmaSchema = z.object({
  id: z.uuid(),
  trainee: z.string().min(1),
  stats: UmaStatsSchema,
  affinities: TraineeAptitudesSchema,
  skills: z.array(UmaSkillSchema).max(60),
  legacies: LegaciesSchema,
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Uma = z.output<typeof UmaSchema>;
