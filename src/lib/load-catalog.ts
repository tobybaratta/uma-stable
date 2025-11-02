import skillNames from '@/data/skill_names.json';
import skillsMeta from '@/data/skills_meta.json';
import { buildSkillCatalog } from './skills-catalog';

/**
 * Single created catalog of skills to use.
 */
export const catalog = buildSkillCatalog(skillNames as any, skillsMeta as any);
