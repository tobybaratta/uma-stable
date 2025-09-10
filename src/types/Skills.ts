import skillData from '../data/skill_data.json';
import skillsMeta from '../data/skills_meta.json';
import skillNames from '../data/skill_names.json';

interface SkillNames {
  [key: string]: string[];
}

export interface SkillMeta {
  baseCost: number;
  groupId: number;
  iconId: string;
  order: number;
}

// Something in here that notes what kind of things each skill is?
// Have to study that one file more.
export interface SkillData {
  [key: string]: unknown;
}

export interface Skill {
  id: string;
  name: string;
  data: SkillData;
  meta: SkillMeta;
}

export type SkillsMap = Record<string, Skill>;

// This can't index off of skill names, because skill names has data undefined in skill data
// for example, 100051.

// TODO! Set this actually up.
/**
 * Creates a skill object from the skill data.
 * @param id The ID of the skill.
 * @returns A Skill object that contains all of the relevant information for the skill, combined.
 * @remarks This checks to make sure the ID is in SkillData, rather than SkillName,
 * because some skills have their names but not their data defined
 */
function createSkill(id: keyof typeof skillData): Skill | undefined {
  const names = skillNames as SkillNames;
  const skillName = names[id] ? names[id][0] : '';
  if (!skillName) {
    console.warn(`Skill name not found for ID: ${id}`);
    return;
  }

  const meta = skillsMeta[id] ? (skillsMeta[id] as SkillMeta) : undefined;

  return {
    id,
    name: skillName,
    data: {},
    meta: {
      baseCost: 0,
      groupId: 0,
      iconId: '',
      order: 0,
    },
  };
}

//   const skillName = skillNames[id];

//   for (const id in skills) {
//     const skill = skills[id];
//     skillObjects[id] = {
//       id: skill.id,
//       name: skill.name,
//       data: skill.data,
//       meta: skill.meta,
//     };
//   }

//   return skillObjects;
//}

// export function combineSkills(): SkillsMap {
//   const result: SkillsMap = {};

//   for (const id of Object.keys(skillData)) {
//     const data = skillData[id] as SkillData;
//     const meta = skillsMeta[id] as SkillMeta;
//     const nameArr = skillNames[id] as string[];
//     const name = Array.isArray(nameArr) && nameArr.length > 0 ? nameArr[0] : '';

//     if (data && meta && name) {
//       result[id] = {
//         id,
//         name,
//         data,
//         meta,
//       };
//     }
//   }

//   return result;
// }
