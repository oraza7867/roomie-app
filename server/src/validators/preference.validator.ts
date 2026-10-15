import { z } from 'zod';

// We use predefined strings to make matching algorithms predictable
export const preferenceSchema = z.object({
  sleepSchedule: z.enum(["EARLY_BIRD", "NIGHT_OWL", "FLEXIBLE"]),
  cleanliness: z.enum(["VERY_CLEAN", "AVERAGE", "MESSY"]),
  noiseTolerance: z.enum(["QUIET", "MODERATE", "LOUD"]),
  socialLevel: z.enum(["INTROVERT", "AMBIVERT", "EXTROVERT"]),
  guestPreference: z.enum(["NO_GUESTS", "WEEKENDS_ONLY", "ANYTIME"]),
  smokingPreference: z.enum(["NON_SMOKER", "OUTSIDE_ONLY", "SMOKER"]),
  foodPreference: z.enum(["VEG", "NON_VEG", "ANY"]),
  studyHabits: z.enum(["SILENCE", "BACKGROUND_MUSIC", "GROUP_STUDY"])
});
