import { LifestylePreference } from '@prisma/client';

// The weights must add up to 100
const WEIGHTS = {
  sleepSchedule: 20,
  cleanliness: 15,
  noiseTolerance: 15,
  socialLevel: 15,
  guestPreference: 10,
  smokingPreference: 10,
  foodPreference: 5,
  studyHabits: 10,
};

export const calculateCompatibility = (me: LifestylePreference, them: LifestylePreference) => {
  let score = 0;
  const whyYouMatch: string[] = [];
  const differences: string[] = [];

  // 1. Sleep Schedule (20%)
  if (me.sleepSchedule === them.sleepSchedule) {
    score += WEIGHTS.sleepSchedule;
    whyYouMatch.push("Similar sleep schedule");
  } else {
    differences.push("Different sleep schedules");
  }

  // 2. Cleanliness (15%)
  if (me.cleanliness === them.cleanliness) {
    score += WEIGHTS.cleanliness;
    whyYouMatch.push("Similar cleanliness habits");
  } else {
    differences.push("Different cleanliness habits");
  }

  // 3. Noise Tolerance (15%)
  if (me.noiseTolerance === them.noiseTolerance) {
    score += WEIGHTS.noiseTolerance;
    whyYouMatch.push("Matching noise tolerance");
  } else {
    differences.push("Different noise preferences");
  }

  // 4. Social Level (15%)
  if (me.socialLevel === them.socialLevel) {
    score += WEIGHTS.socialLevel;
    whyYouMatch.push("Compatible social energy");
  } else {
    differences.push("Different social levels");
  }

  // 5. Guest Preference (10%)
  if (me.guestPreference === them.guestPreference) {
    score += WEIGHTS.guestPreference;
    whyYouMatch.push("Agree on guest policy");
  } else {
    differences.push("Different guest preferences");
  }

  // 6. Smoking Preference (10%)
  if (me.smokingPreference === them.smokingPreference) {
    score += WEIGHTS.smokingPreference;
    whyYouMatch.push("Compatible smoking preferences");
  } else {
    differences.push("Different smoking preferences");
  }

  // 7. Food Preference (5%)
  if (me.foodPreference === them.foodPreference) {
    score += WEIGHTS.foodPreference;
    whyYouMatch.push("Similar food preferences");
  } else {
    differences.push("Different food preferences");
  }

  // 8. Study Habits (10%)
  if (me.studyHabits === them.studyHabits) {
    score += WEIGHTS.studyHabits;
    whyYouMatch.push("Similar study routines");
  } else {
    differences.push("Different study habits");
  }

  return {
    compatibility: score,
    whyYouMatch,
    differences
  };
};
