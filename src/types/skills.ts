import { z } from 'zod';

// Consider: Integrate including the skill_data directly?
// Also consider: Use the ID to look up the name directly?
export const UmaSkillSchema = z.object({
  name: z.string().min(1),
  id: z.number().gte(0),
});

export type UmaSkill = z.infer<typeof UmaSkillSchema>;