/* eslint-disable @typescript-eslint/no-explicit-any */
import umas from '../data/umas.json';
import { Umamusume } from '../types/uma';

export interface UmaOutfit {
  outfit: string;
  outfitId: number;
}

type EmptyUma = Pick<Umamusume, 'id' | 'name' | 'outfits'>;

// Returns a Map of Uma name to Uma object
/** This function is helpful for the sake of actually processing the JSON data
 * into a more useful structure for frontend purposes, idk. Don't need the same
 * kind of separation of concerns as needed in the Umalator, as that's not the point for it here.
 */
export function getUmas(): Map<string, EmptyUma> {
  const umaMap = new Map<string, EmptyUma>();

  Object.entries(umas).forEach(([id, value]) => {
    const names = (value as any).name;
    // Always flatten to a single string
    const name = Array.isArray(names) && names.length > 1 ? names[1] : '';
    const outfitsObj = (value as any).outfits || {};
    const outfits: UmaOutfit[] = Object.entries(outfitsObj).map(([outfitId, outfit]) => ({
      outfit: outfit as string,
      outfitId: Number(outfitId),
    }));

    if (name) {
      umaMap.set(name, {
        id: Number(id),
        name,
        outfits,
      });
    }
  });

  return umaMap;
}

// Export an array for easy iteration; should load into local db or something maybe?
export const umaArray = Array.from(getUmas().values());
