import type { TraineeAptitudes } from './aptitudes';
// import type { Spark } from './sparks';

export interface UmaStats {
  speed: number;
  stamina: number;
  power: number;
  guts: number;
  wisdom: number;
}

export const defaultStats: UmaStats = {
  speed: 100,
  stamina: 100,
  power: 100,
  guts: 100,
  wisdom: 100,
};

// Reference to a trainee Uma (not specific to one Veteran)
export interface TraineeRef {
  umaId: number;
  variant: string; // which costume variant it is
  umaIconUrl?: string; // Path for the icon for the Trainee
}

// This is the data object that is for a specific Veteran Uma.
// This is created based around the Uma Trainee model that is selected,
// but is explicitly a Veteran and not a Trainee base object.
export interface VeteranTrainee {
  id: string;
  uma: TraineeRef;

  // todo: organize this better
  displayName?: string;
  aptitudes: TraineeAptitudes;

  stats: UmaStats;

  // store skill IDs; render via skill catalog
  skills: number[];

  // To start, storing sparks just as their IDs. In the future, will use Spark
  sparks: number[];

  notes?: string;
  favorite?: boolean;

  createdAt: string; // ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
  updatedAt?: string;
}

export const umaIconUrl = (umaId: number | string) => `/icons/umas/${umaId}.png`;
