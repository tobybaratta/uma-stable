import { z } from 'zod';

/** Single source of truth for types */
export const SurfaceTypes = ['Turf', 'Dirt'] as const;
export const DistanceTypes = ['Short', 'Mile', 'Medium', 'Long'] as const;
export const RunnerTypes = ['Front', 'Pace', 'Late', 'End'] as const;
export const GradeTypes = ['G+', 'F', 'D', 'C', 'B', 'A', 'S'] as const;

export type Surface = (typeof SurfaceTypes)[number];
export type Distance = (typeof DistanceTypes)[number];
export type Runner = (typeof RunnerTypes)[number];
export type Grade = (typeof GradeTypes)[number];

export type VeteranAptitudes = {
  Distance: Record<Distance, Grade>;
  Track: Record<Surface, Grade>;
  Style: Record<Runner, Grade>;
};

// Default values for Aptitudes when creating a new Uma. Lazily done but whatever.
export const DefaultVeteranAptitudes: VeteranAptitudes = {
  Distance: { Short: 'G+', Mile: 'G+', Medium: 'G+', Long: 'G+' },
  Track: { Turf: 'G+', Dirt: 'G+' },
  Style: { Front: 'G+', Pace: 'G+', Late: 'G+', End: 'G+' },
};

// Grade values
export const GradeEnum = z.enum(GradeTypes);

// Schema for Zod and type validations
export const VeteranAptitudesSchema = z
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
