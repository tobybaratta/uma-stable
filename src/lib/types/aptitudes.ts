/**
 * Race aptitudes (graded) for a legacy.
 */
export type Grade = 'G+' | 'F' | 'D' | 'C' | 'B' | 'A' | 'S';
export const GRADE_ORDER: Grade[] = ['G+', 'F', 'D', 'C', 'B', 'A', 'S'];
export const gradeRank: Record<Grade, number> = {
  'G+': 0,
  F: 1,
  D: 2,
  C: 3,
  B: 4,
  A: 5,
  S: 6,
};

export type Distance = 'Short' | 'Mile' | 'Medium' | 'Long';
export type Surface = 'Turf' | 'Dirt';
export type Runner = 'Front' | 'Pace' | 'Late' | 'End';

export type TraineeAptitudes = {
  Distance: Record<Distance, Grade>;
  Track: Record<Surface, Grade>;
  Style: Record<Runner, Grade>;
};

export const DefaultTraineeAptitudes: TraineeAptitudes = {
  Distance: { Short: 'A', Mile: 'A', Medium: 'A', Long: 'A' },
  Track: { Turf: 'A', Dirt: 'A' },
  Style: { Front: 'A', Pace: 'A', Late: 'A', End: 'A' },
};
