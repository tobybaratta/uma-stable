import type { TraineeAptitudes } from './aptitudes';
import type { Spark } from './sparks';

export interface UmaStats {
  speed: number;
  stamina: number;
  power: number;
  guts: number;
  wisdom: number;
}

// Reference to a trainee Uma (not specific to one Veteran)
export interface TraineeRef {
  umaId: number;
  variant: string; // which costume variant it is
}

export interface TraineeRecord {
  id: string;
  uma: TraineeRef;
  aptitudes: TraineeAptitudes;
  stats: UmaStats;

  // store skill IDs; render via skill catalog
  skills: number[];
  sparks: Spark[];

  notes?: string;
  favorite?: boolean;

  createdAt: string; // ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
  updatedAt?: string;
}
