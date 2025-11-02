/**
 * Each spark has its own tie to a skill, the level of the skill, and the parents.
 * These sparks can either be at level 1, 2, or 3.
 */
export type Spark = {
  sparkLevel: number;
  skillId?: number;
  sparkName?: string;
  type: 'pink' | 'blue' | 'green' | 'white';
  isInherited: boolean;
};
