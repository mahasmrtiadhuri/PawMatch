import * as tf from '@tensorflow/tfjs';
import { Dog, UserPreference } from '@shared/schema';

// Initialize TensorFlow.js
tf.ready().then(() => {
  console.log('TensorFlow.js initialized successfully');
}).catch(error => {
  console.error('Failed to initialize TensorFlow.js', error);
});

// Helper functions for data preprocessing
const oneHotEncode = (value: string, categories: string[]): number[] => {
  const result = new Array(categories.length).fill(0);
  const index = categories.indexOf(value);
  if (index !== -1) {
    result[index] = 1;
  }
  return result;
};

const normalizeAge = (ageInMonths: number): number => {
  // Normalize age to a value between 0 and 1 (assuming max age is 180 months / 15 years)
  return Math.min(ageInMonths / 180, 1);
};

const calculateCompatibilityScore = (
  dog: Dog, 
  userPreferences: UserPreference
): number => {
  // Initialize score
  let score = 0;
  const maxScore = 100;
  
  // Match activity level (high impact)
  if (dog.activityLevel === userPreferences.activityLevel) {
    score += 25;
  } else if (
    (dog.activityLevel === "Medium" && userPreferences.activityLevel === "High") ||
    (dog.activityLevel === "High" && userPreferences.activityLevel === "Medium") ||
    (dog.activityLevel === "Medium" && userPreferences.activityLevel === "Low") ||
    (dog.activityLevel === "Low" && userPreferences.activityLevel === "Medium")
  ) {
    score += 15; // Close match
  } else {
    score += 0; // Mismatch
  }
  
  // Match for kids (high impact if user has kids)
  if (userPreferences.hasKids) {
    if (dog.goodWithKids) {
      score += 20;
    } else {
      score -= 15; // Significant penalty if user has kids but dog isn't good with them
    }
  } else {
    score += 5; // Small bonus if matching (no kids & not good with kids), but not very important
  }
  
  // Match for other pets (medium impact)
  if (userPreferences.hasOtherPets) {
    if (dog.goodWithDogs || dog.goodWithCats) {
      score += 15;
    } else {
      score -= 10; // Penalty if user has other pets but dog isn't good with them
    }
  } else {
    score += 5; // Small bonus
  }
  
  // Match size preference (medium impact)
  if (userPreferences.preferredSize === "Any" || dog.size === userPreferences.preferredSize) {
    score += 15;
  } else {
    score += 0; // No points if size doesn't match
  }
  
  // Match age preference (medium impact)
  let agePreferenceMatch = false;
  const dogAgeYears = dog.age / 12;
  
  if (userPreferences.preferredAge === "Puppy" && dogAgeYears <= 1) {
    agePreferenceMatch = true;
  } else if (userPreferences.preferredAge === "Young" && dogAgeYears > 1 && dogAgeYears <= 3) {
    agePreferenceMatch = true;
  } else if (userPreferences.preferredAge === "Adult" && dogAgeYears > 3 && dogAgeYears <= 7) {
    agePreferenceMatch = true;
  } else if (userPreferences.preferredAge === "Senior" && dogAgeYears > 7) {
    agePreferenceMatch = true;
  }
  
  if (agePreferenceMatch) {
    score += 15;
  } else {
    score += 0;
  }
  
  // Match home type (yard available is important for large/active dogs)
  if (userPreferences.hasYard) {
    if (dog.size === "Large" || dog.activityLevel === "High") {
      score += 10;
    } else {
      score += 5;
    }
  } else {
    if (dog.size === "Small" || dog.activityLevel === "Low") {
      score += 5;
    } else if (dog.size === "Large" && dog.activityLevel === "High") {
      score -= 5; // Small penalty for large, high-energy dogs in homes without yards
    }
  }
  
  // Consider hours alone (medium impact)
  if (userPreferences.hoursAlone <= 4) {
    score += 5; // Any dog can handle this
  } else if (userPreferences.hoursAlone > 4 && userPreferences.hoursAlone <= 8) {
    if (dog.activityLevel === "High") {
      score -= 5; // Small penalty for high-energy dogs left alone longer
    }
  } else {
    if (dog.activityLevel === "High") {
      score -= 10; // Larger penalty for high-energy dogs left alone too long
    } else if (dog.activityLevel === "Medium") {
      score -= 5;
    }
  }
  
  // Normalize score to 0-100 range
  return Math.max(0, Math.min(100, score));
};

// Function to get more sophisticated matches using TensorFlow.js
export const getAIRecommendations = async (
  dogs: Dog[], 
  userPreferences: UserPreference
): Promise<{ dog: Dog; matchPercentage: number }[]> => {
  try {
    // For now, we'll use a simpler approach while we scaffold the application
    // In a real app, this would use a trained TensorFlow.js model
    
    // For each dog, calculate compatibility score
    const scoredDogs = dogs.map(dog => ({
      dog,
      matchPercentage: calculateCompatibilityScore(dog, userPreferences)
    }));
    
    // Sort by match percentage
    return scoredDogs.sort((a, b) => b.matchPercentage - a.matchPercentage);
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    
    // Fallback to simpler scoring if TensorFlow fails
    const scoredDogs = dogs.map(dog => ({
      dog,
      matchPercentage: calculateCompatibilityScore(dog, userPreferences)
    }));
    
    return scoredDogs.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }
};

export default {
  getAIRecommendations
};
