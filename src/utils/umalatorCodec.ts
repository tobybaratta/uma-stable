// import type { Uma } from '../schema';
// import { buildUmalatorUrl } from './umalatorCodec';

// /** Map your app's "strategy" text to Umalator's accepted labels. */
// const normalizeStrategy = (s?: string): 'Nige' | 'Senkou' | 'Sashi' | 'Oikomi' | undefined => {
//   if (!s) return undefined;
//   const t = s.toLowerCase();
//   if (/(逃げ|nige)/.test(t)) return 'Nige';
//   if (/(先行|senkou|senko)/.test(t)) return 'Senkou';
//   if (/(差し|sashi)/.test(t)) return 'Sashi';
//   if (/(追込|oikomi|oik)/.test(t)) return 'Oikomi';
//   // if users typed already-correct English:
//   if (/^nige|^senkou|^sashi|^oikomi/.test(t)) return s as any;
//   return undefined;
// };

// /** Pick safe default aptitudes if yours are per-distance/per-surface. */
// function pickAptitudes(u: Uma) {
//   // If you have a selected "intended distance/surface" in your UI,
//   // plug it in here. Otherwise default to 'A' to keep it neutral.
//   return {
//     distanceAptitude: 'A' as const,
//     surfaceAptitude: 'A' as const,
//     strategyAptitude: 'A' as const,
//   };
// }

// /** Convert one Uma to Umalator's runner object. */
// function toUmalatorRunner(u: Uma) {
//   const ap = pickAptitudes(u);
//   return {
//     outfitId: String(u.id ?? u.trainee), // if you have outfit ids, use them; else any stable string
//     speed: u.stats.speed ?? 0,
//     stamina: u.stats.stamina ?? 0,
//     power: u.stats.power ?? 0,
//     guts: u.stats.guts ?? 0,
//     wisdom: u.stats.wisdom ?? 0,
//     strategy: normalizeStrategy((u as any).strategy) ?? 'Senkou',
//     distanceAptitude: ap.distanceAptitude,
//     surfaceAptitude: ap.surfaceAptitude,
//     strategyAptitude: ap.strategyAptitude,
//     // Umalator wants skill **IDs**; if you only have names, omit the array for now.
//     // Later we can map via your vendored skill catalogs.
//     // skills: ['100321', '900041', ...]
//   };
// }

// /**
//  * Build a URL that contains only the runners (no courseId / racedef).
//  * Umalator will open with your runners pre-filled and let users choose the race.
//  */
// export function openInUmalatorNoCourse(
//   umas: Uma[],
//   opts?: { nsamples?: number; usePosKeep?: boolean },
// ) {
//   const payload: Record<string, unknown> = {};

//   // optional global knobs; omit entirely if you want *zero* suggestions
//   if (opts?.nsamples != null) payload.nsamples = opts.nsamples;
//   if (opts?.usePosKeep != null) payload.usePosKeep = opts.usePosKeep;
//   // NOTE: purposely **no** courseId/racedef keys here.

//   // Attach runners as uma1, uma2, ...
//   umas.slice(0, 18).forEach((u, i) => {
//     // Umalator UI shows up to ~18 participants
//     payload[`uma${i + 1}`] = toUmalatorRunner(u);
//   });

//   return buildUmalatorUrl(payload);
// }
