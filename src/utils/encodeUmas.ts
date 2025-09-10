import { gzipSync, gunzipSync } from 'zlib';
import { promises as fs } from 'fs';
import path from 'path';

/* ---------- Umalator Types ---------- */
export interface RaceDef {
  mood: number;
  ground: number;
  weather: number;
  season: number;
  time: number;
  grade: number;
}

export interface Uma {
  outfitId: string;
  speed: number;
  stamina: number;
  power: number;
  guts: number;
  wisdom: number;
  strategy: string;
  distanceAptitude: string;
  surfaceAptitude: string;
  strategyAptitude: string;
  skills: string[];
}

export interface UmalatorPayload {
  courseId: number;
  nsamples: number;
  seed: number;
  usePosKeep: boolean;
  racedef: RaceDef;
  uma1: Uma;
  // uma2?: Uma;
}

export type SkillNames = Record<string, string>; // id -> display name
export type SkillsMeta = Record<string, { aliases?: string[] }>;
export type SkillData = Record<string, unknown>;
export type Umas = Record<string, { name: string; outfitId: string }>;

/** ---------- File loading (from ../src/data relative to this file) ---------- **/
const DATA_DIR = path.resolve(__dirname, '../src/data');

export async function loadDataFiles() {
  const [skillNamesRaw, skillsMetaRaw, skillDataRaw, umasRaw] = await Promise.all([
    fs.readFile(path.join(DATA_DIR, 'skilllnames.json'), 'utf8'),
    fs.readFile(path.join(DATA_DIR, 'skills_meta.json'), 'utf8'),
    fs.readFile(path.join(DATA_DIR, 'skill_data.json'), 'utf8'),
    fs.readFile(path.join(DATA_DIR, 'umas.json'), 'utf8'),
  ]);
  return {
    skillNames: JSON.parse(skillNamesRaw) as SkillNames,
    skillsMeta: JSON.parse(skillsMetaRaw) as SkillsMeta,
    skillData: JSON.parse(skillDataRaw) as SkillData,
    umas: JSON.parse(umasRaw) as Umas,
  };
}

/** ---------- Mapping helpers ---------- **/
/** This is a hellscape because of mismatching data structures. */
export function buildSkillNameToId(
  skillNames: SkillNames,
  skillsMeta: SkillsMeta,
): Map<string, string> {
  const m = new Map<string, string>();
  const norm = (s: string) =>
    s
      .replace(/\s+/g, ' ')
      .replace(/[!.'’]/g, '')
      .toLowerCase()
      .trim();

  for (const [id, name] of Object.entries(skillNames)) {
    if (!name) continue;
    m.set(name.toLowerCase(), id);
    m.set(norm(name), id);
  }
  for (const [id, meta] of Object.entries(skillsMeta)) {
    for (const alias of meta?.aliases ?? []) {
      if (!alias) continue;
      m.set(alias.toLowerCase(), id);
      m.set(norm(alias), id);
    }
  }
  return m;
}

export function buildUmaNameToOutfit(umas: Umas): Map<string, string> {
  const m = new Map<string, string>();
  for (const rec of Object.values(umas)) {
    const key = rec.name.toLowerCase();
    if (!m.has(key)) m.set(key, rec.outfitId);
  }
  return m;
}

export function mapSkillsToIds(skillNames: string[], nameToId: Map<string, string>): string[] {
  const norm = (s: string) =>
    s
      .replace(/\s+/g, ' ')
      .replace(/[!.'’]/g, '')
      .toLowerCase()
      .trim();

  const ids: string[] = [];

  for (const nm of skillNames) {
    const id = nameToId.get(nm.toLowerCase()) || nameToId.get(norm(nm));
    if (id) ids.push(id);
  }

  return Array.from(new Set(ids));
}

/* ---------- Payload builders ---------- */
/** Defaults right now to just stuff from Taurus Cup, but will update this later
 * TODO: Add in more options for racedef and other params from the UI.
 */
export function basePayload(
  outfitId: string,
  stats: { spd: number; sta: number; pow: number; guts: number; wit: number },
  skills: string[],
  strategy: string,
  opts?: Partial<Pick<UmalatorPayload, 'courseId' | 'nsamples' | 'seed' | 'usePosKeep'>> & {
    racedef?: Partial<RaceDef>;
  },
): UmalatorPayload {
  return {
    courseId: opts?.courseId ?? 10606,
    nsamples: opts?.nsamples ?? 500,
    seed: opts?.seed ?? 2615953739,
    usePosKeep: opts?.usePosKeep ?? true,
    racedef: {
      mood: opts?.racedef?.mood ?? 2,
      ground: opts?.racedef?.ground ?? 1,
      weather: opts?.racedef?.weather ?? 1,
      season: opts?.racedef?.season ?? 1,
      time: opts?.racedef?.time ?? 2,
      grade: opts?.racedef?.grade ?? 100,
    },
    uma1: {
      outfitId,
      speed: stats.spd,
      stamina: stats.sta,
      power: stats.pow,
      guts: stats.guts,
      wisdom: stats.wit,
      strategy,
      distanceAptitude: 'S',
      surfaceAptitude: 'A',
      strategyAptitude: 'A',
      skills,
    },
  };
}

/* ---------- Encoder / Decoder (Node 20 built-ins) ---------- */
export function encodeUmalatorFragment(payload: UmalatorPayload): string {
  const json = JSON.stringify(payload);
  const gz = gzipSync(Buffer.from(json, 'utf8')); // GZIP (not raw deflate)
  const b64 = gz.toString('base64');
  return encodeURIComponent(b64);
}

export function buildUmalatorUrl(payload: UmalatorPayload): string {
  return 'https://alpha123.github.io/uma-tools/umalator-global/#' + encodeUmalatorFragment(payload);
}

export function decodeUmalatorFragment(fragment: string): UmalatorPayload {
  const b64 = decodeURIComponent(fragment);
  const gz = Buffer.from(b64, 'base64');
  const json = gunzipSync(gz).toString('utf8');
  return JSON.parse(json);
}

// Utility to strip out uma2 from payloads since not using that at all right now
// not even sure if it'll work, we'll see.
export function toSingleUma<T extends { uma2?: unknown }>(payload: T): T {
  const copy: any = JSON.parse(JSON.stringify(payload));
  delete copy.uma2;
  return copy;
}
