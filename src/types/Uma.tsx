import { Skill } from './Skills';

type Aptitude = ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

type Spark = {
  name: string;
  starCount: number;
};

// Consider: Refactoring this to have it be some sort of Uma empty shell that then is repeated for any individual Uma.
// In that case, you'd just have a simple 'Uma Lookup ID' that corresponds to any Trainee (not individual Legacy).
// That likely would make things cleaner? Might make filtering a bit more difficult though. Not sure.
export interface Umamusume {
  id: number;
  grade: number;
  // Date created in Uma Musume
  dateCreated: Date;
  // Date added to Stable?
  dateAdded: Date;
  name: string;
  outfits: { outfit: string; outfitId: number }[];
  stats: {
    speed: number;
    stamina: number;
    power: number;
    guts: number;
    wit: number;
  };

  // Might want to rethink this later, since really should be capitalized for distances and stuff maybe?
  // Or split it up into the three types of aptitudes, since those won't all show up in one row together.
  // a la Style, Surface,...whatever.
  aptitudes: {
    sprint: Aptitude;
    mile: Aptitude;
    medium: Aptitude;
    long: Aptitude;
    turf: Aptitude;
    dirt: Aptitude;
    // todo: some sort of lookup-ish table for these for actual useful property names?
    'Front Runner': Aptitude;
    'Pace Chaser': Aptitude;
    'Late Surger': Aptitude;
    'End Closer': Aptitude;
  };

  sparks: {
    pink: Spark;
    blue: Spark;
    // Can be null for 1-2 star Umas.
    green?: Spark;
    // You could be cursed and get no white Sparks. Allowing to be null, but might want to enforce it being an array, just empty. TBD.
    white?: Spark[];
  };

  skills: Skill[];
}
