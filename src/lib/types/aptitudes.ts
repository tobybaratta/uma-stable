/** Single source of truth for types */
import { z } from 'zod';

export const SurfaceTypes = ['Turf', 'Dirt'] as const;
export const DistanceTypes = ['Short', 'Mile', 'Medium', 'Long'] as const;
export const RunnerTypes = ['Front', 'Pace', 'Late', 'End'] as const;
export const GradeTypes = ['S', 'A', 'B', 'C', 'D', 'F', 'G+'] as const;

export type Surface = (typeof SurfaceTypes)[number];
export type Distance = (typeof DistanceTypes)[number];
export type Runner = (typeof RunnerTypes)[number];
export type Grade = (typeof GradeTypes)[number];

/**
 * Distance, Track, and Style models
 **/
export type TraineeAptitudes = {
  Distance: { [K in Distance]: Grade };
  Track: { [K in Surface]: Grade };
  Style: { [K in Runner]: Grade };
};

export const GradeEnum = z.enum(GradeTypes);

// Zod schema for validation
export const TraineeAptitudesSchema = z
  .object({
    Distance: z
      .object({
        Short: GradeEnum,
        Mile: GradeEnum,
        Medium: GradeEnum,
        Long: GradeEnum,
      })
      .strict(),
    Track: z
      .object({
        Turf: GradeEnum,
        Dirt: GradeEnum,
      })
      .strict(),
    Style: z
      .object({
        Front: GradeEnum,
        Pace: GradeEnum,
        Late: GradeEnum,
        End: GradeEnum,
      })
      .strict(),
  })
  .strict();

export const DefaultTraineeAptitudes: TraineeAptitudes = {
  Distance: { Short: 'A', Mile: 'A', Medium: 'A', Long: 'A' },
  Track: { Turf: 'A', Dirt: 'A' },
  Style: { Front: 'A', Pace: 'A', Late: 'A', End: 'A' },
};
