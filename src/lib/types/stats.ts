import { z } from 'zod';

const StatResultType = z.int().gte(400).lte(1200).nullable();

export const UmaStatsSchema = z.object({
  speed: StatResultType,
  stamina: StatResultType,
  power: StatResultType,
  guts: StatResultType,
  wisdom: StatResultType,
});

export type UmaStats = z.infer<typeof UmaStatsSchema>;
