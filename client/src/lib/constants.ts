// App constants

// Dog related constants
export const DOG_SIZES = ["Small", "Medium", "Large"];
export const DOG_GENDERS = ["Male", "Female"];
export const DOG_ACTIVITY_LEVELS = ["Low", "Medium", "High"];
export const DOG_TRAINING_LEVELS = ["None", "Basic", "Advanced"];
export const DOG_HEALTH_STATUSES = ["Healthy", "Special Needs", "Requires Medication"];
export const DOG_ADOPTION_STATUSES = ["available", "pending", "adopted"];

// User preferences related constants
export const HOME_TYPES = ["Apartment", "House", "Other"];
export const EXPERIENCE_LEVELS = ["First-time", "Some experience", "Experienced"];
export const PREFERRED_AGE_RANGES = ["Puppy", "Young", "Adult", "Senior"];
export const PREFERRED_SIZES = ["Small", "Medium", "Large", "Any"];

// Age helpers - convert months to human-readable format
export function formatDogAge(ageInMonths: number): string {
  const years = Math.floor(ageInMonths / 12);
  const months = ageInMonths % 12;
  
  if (years === 0) {
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  } else if (months === 0) {
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  } else {
    return `${years} ${years === 1 ? 'year' : 'years'}, ${months} ${months === 1 ? 'month' : 'months'}`;
  }
}

// Age category helper
export function getDogAgeCategory(ageInMonths: number): string {
  if (ageInMonths <= 12) {
    return "Puppy";
  } else if (ageInMonths <= 36) {
    return "Young";
  } else if (ageInMonths <= 84) {
    return "Adult";
  } else {
    return "Senior";
  }
}
