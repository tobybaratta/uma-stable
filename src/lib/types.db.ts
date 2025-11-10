// Datatypes for specific Veterans (Legacies) stored in local DB.

export type GradeLetter = 'G+' | 'F' | 'D' | 'C' | 'B' | 'A' | 'S';
export type Aptitudes = {
  Distance: Record<'Short' | 'Mile' | 'Medium' | 'Long', GradeLetter>;
  Track: Record<'Turf' | 'Dirt', GradeLetter>;
  Style: Record<'Front' | 'Pace' | 'Late' | 'End', GradeLetter>;
};

// ---- Sparks (evolution-ready) ----------------------------------------------
export type SparkId = number;
export type Spark = {
  skillId: number;
  level: 1 | 2 | 3;
  kind: 'blue' | 'pink' | 'green' | 'white';
  source: 'veteran' | 'legacy';
};

// later: Flip to Spark[] model.
export type VeteranSparks = SparkId[];


export type UmaVariantDb = {
  displayName: string; // "[Formula R] Maruzensky"
  id: string; // outfitId, e.g., "100401"
  baseId: string; // base Uma id, e.g., "1004"
  name: string; // base name, e.g., "Maruzensky"
  label: string; // outfit label, e.g., "[Formula R]"
};

// ---- Veteran Instance --------------------------------------------
export type Veteran = {
  id: string;
  uma: UmaVariantDb;

  aptitudes?: Aptitudes;

  score?: number;
  skills: number[]; // numeric skill IDs
  sparks: VeteranSparks; // numeric skill IDs
  notes?: string;
  favorite?: boolean;
  createdAt: string; // ISO
};
