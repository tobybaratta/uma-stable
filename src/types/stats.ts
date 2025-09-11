import { z } from 'zod';

export const StatTypes = ['Speed', 'Stamina', 'Power', 'Guts', 'Wisdom'] as const;

const StatResultType = z.number().int().nonnegative().max(1600).nullable();

export const UmaStatsSchema = z.object({
  speed: StatResultType,
  stamina: StatResultType,
  power: StatResultType,
  guts: StatResultType,
  wisdom: StatResultType,
});