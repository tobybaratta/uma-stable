import { z } from 'zod';
import { VeteranAptitudesSchema } from './types/aptitudes';

export const UmaStatsSchema = z.object({
  speed: z.number().int().nonnegative().max(1600).nullable(),
  stamina: z.number().int().nonnegative().max(1600).nullable(),
  power: z.number().int().nonnegative().max(1600).nullable(),
  guts: z.number().int().nonnegative().max(1600).nullable(),
  wisdom: z.number().int().nonnegative().max(1600).nullable(),
});

export type Stats = z.infer<typeof UmaStatsSchema>;

// TODO: Make this an actual object and not just a string
export const UmaSkillSchema = z.object({
  name: z.string().min(1),
});

// To Do: Update "Trainee" / "Uma" to be something that's tied closer
// to the actual Uma "Base" Trainee, separating "Trainee" from "Legacy Uma".

export const UmaSchema = z.object({
  id: z.uuid(),
  trainee: z.string().min(1),
  stats: UmaStatsSchema,
  affinities: VeteranAptitudesSchema,
  skills: z.array(UmaSkillSchema).max(60),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Uma = z.output<typeof UmaSchema>;
