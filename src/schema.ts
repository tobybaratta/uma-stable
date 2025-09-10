import { z } from 'zod';

// Aptitude and Spark types
export type Aptitude = 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface Spark {
  name: string;
  starCount: number;
}

// Zod schemas for stats, skills, aptitudes, sparks, etc.
export const UmaStatsSchema = z.object({
  speed: z.number().int().nonnegative().max(1600).nullable(),
  stamina: z.number().int().nonnegative().max(1600).nullable(),
  power: z.number().int().nonnegative().max(1600).nullable(),
  guts: z.number().int().nonnegative().max(1600).nullable(),
  wisdom: z.number().int().nonnegative().max(1600).nullable(),
});

export const UmaAptitudeSchema = z.object({
  sprint: z.enum(['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G']),
  mile: z.enum(['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G']),
  medium: z.enum(['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G']),
  long: z.enum(['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G']),
  turf: z.enum(['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G']),
  dirt: z.enum(['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G']),
  'Front Runner': z.enum(['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G']),
  'Pace Chaser': z.enum(['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G']),
  'Late Surger': z.enum(['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G']),
  'End Closer': z.enum(['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G']),
});

export const UmaSparkSchema = z.object({
  pink: z.object({ name: z.string(), starCount: z.number().int().min(1) }),
  blue: z.object({ name: z.string(), starCount: z.number().int().min(1) }),
  green: z.object({ name: z.string(), starCount: z.number().int().min(1) }).optional(),
  white: z.array(z.object({ name: z.string(), starCount: z.number().int().min(1) })).optional(),
});

export const UmaOutfitSchema = z.object({
  outfit: z.string(),
  outfitId: z.number().int(),
});

export const UmaSchema = z.object({
  id: z.string().uuid(),
  trainee: z.string().min(1),
  scenario: z.string().optional(),
  stats: UmaStatsSchema,
  aptitudes: UmaAptitudeSchema.optional(),
  sparks: UmaSparkSchema.optional(),
  outfits: z.array(UmaOutfitSchema),
  skills: z.array(z.any()), // Use Skill schema if available
  legacy: z.array(z.object({ type: z.string(), value: z.string() })).optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// TypeScript type derived from Zod schema
export type Uma = z.infer<typeof UmaSchema>;
