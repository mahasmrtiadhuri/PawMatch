import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDogSchema, insertFavoriteSchema, insertShelterSchema, insertUserPreferencesSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import * as tf from '@tensorflow/tfjs';

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Helper function to handle validation errors
  const validateRequest = (schema: z.ZodTypeAny, data: any) => {
    try {
      return { success: true, data: schema.parse(data) };
    } catch (error) {
      if (error instanceof ZodError) {
        return { 
          success: false, 
          error: error.format()
        };
      }
      return { success: false, error: "Invalid request data" };
    }
  };

  // User authentication middleware
  const authenticate = async (req: any, res: any, next: any) => {
    // For demo purposes, we'll use a simple user ID in header
    // In a real app, this would use JWT or sessions
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const user = await storage.getUser(Number(userId));
    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }
    
    req.user = user;
    next();
  };

  // Shelter admin middleware
  const shelterAdminOnly = async (req: any, res: any, next: any) => {
    if (!req.user.isShelterAdmin && !req.user.isAdmin) {
      return res.status(403).json({ message: "Shelter admin access required" });
    }
    next();
  };

  /*
   * User routes
   */
  
  // Register a new user
  app.post('/api/users/register', async (req, res) => {
    const validation = validateRequest(insertUserSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ message: "Invalid user data", errors: validation.error });
    }
    
    const existingUser = await storage.getUserByUsername(validation.data.username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    const existingEmail = await storage.getUserByEmail(validation.data.email);
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }
    
    const user = await storage.createUser(validation.data);
    // Don't return the password in the response
    const { password, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  });

  // Login
  app.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
    
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    // Don't return the password in the response
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  });

  // Create user preferences for AI matching
  app.post('/api/users/preferences', authenticate, async (req, res) => {
    const validation = validateRequest(insertUserPreferencesSchema, {
      ...req.body,
      userId: req.user.id
    });
    
    if (!validation.success) {
      return res.status(400).json({ message: "Invalid preference data", errors: validation.error });
    }
    
    const existingPreferences = await storage.getUserPreferences(req.user.id);
    if (existingPreferences) {
      const updatedPreferences = await storage.updateUserPreferences(req.user.id, validation.data);
      return res.json(updatedPreferences);
    }
    
    const preferences = await storage.createUserPreferences(validation.data);
    res.status(201).json(preferences);
  });

  // Get user preferences
  app.get('/api/users/preferences', authenticate, async (req, res) => {
    const preferences = await storage.getUserPreferences(req.user.id);
    if (!preferences) {
      return res.status(404).json({ message: "Preferences not found" });
    }
    
    res.json(preferences);
  });

  /*
   * Dog routes
   */
  
  // Get all dogs
  app.get('/api/dogs', async (req, res) => {
    const dogs = await storage.getAllDogs();
    res.json(dogs);
  });

  // Get available dogs
  app.get('/api/dogs/available', async (req, res) => {
    const dogs = await storage.getAvailableDogs();
    res.json(dogs);
  });

  // Get a specific dog
  app.get('/api/dogs/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    const dog = await storage.getDog(id);
    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }
    
    res.json(dog);
  });

  // Create a new dog (shelter admin only)
  app.post('/api/dogs', authenticate, shelterAdminOnly, async (req, res) => {
    const validation = validateRequest(insertDogSchema, {
      ...req.body,
      shelterId: req.user.shelterId
    });
    
    if (!validation.success) {
      return res.status(400).json({ message: "Invalid dog data", errors: validation.error });
    }
    
    const dog = await storage.createDog(validation.data);
    res.status(201).json(dog);
  });

  // Update a dog (shelter admin only)
  app.put('/api/dogs/:id', authenticate, shelterAdminOnly, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    const dog = await storage.getDog(id);
    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }
    
    // Verify shelter admin owns this dog
    if (dog.shelterId !== req.user.shelterId && !req.user.isAdmin) {
      return res.status(403).json({ message: "You can only update dogs from your shelter" });
    }
    
    const updatedDog = await storage.updateDog(id, req.body);
    res.json(updatedDog);
  });

  // Delete a dog (shelter admin only)
  app.delete('/api/dogs/:id', authenticate, shelterAdminOnly, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    const dog = await storage.getDog(id);
    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }
    
    // Verify shelter admin owns this dog
    if (dog.shelterId !== req.user.shelterId && !req.user.isAdmin) {
      return res.status(403).json({ message: "You can only delete dogs from your shelter" });
    }
    
    await storage.deleteDog(id);
    res.status(204).end();
  });

  /*
   * Shelter routes
   */
  
  // Get all shelters
  app.get('/api/shelters', async (req, res) => {
    const shelters = await storage.getAllShelters();
    res.json(shelters);
  });

  // Get a specific shelter
  app.get('/api/shelters/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    const shelter = await storage.getShelter(id);
    if (!shelter) {
      return res.status(404).json({ message: "Shelter not found" });
    }
    
    res.json(shelter);
  });

  // Get dogs from a shelter
  app.get('/api/shelters/:id/dogs', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    const shelter = await storage.getShelter(id);
    if (!shelter) {
      return res.status(404).json({ message: "Shelter not found" });
    }
    
    const dogs = await storage.getDogsByShelterId(id);
    res.json(dogs);
  });

  // Create a new shelter (admin only)
  app.post('/api/shelters', authenticate, async (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    const validation = validateRequest(insertShelterSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ message: "Invalid shelter data", errors: validation.error });
    }
    
    const shelter = await storage.createShelter(validation.data);
    res.status(201).json(shelter);
  });

  // Update a shelter (admin or shelter admin)
  app.put('/api/shelters/:id', authenticate, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    // Check if user is admin or the shelter admin for this shelter
    if (!req.user.isAdmin && (!req.user.isShelterAdmin || req.user.shelterId !== id)) {
      return res.status(403).json({ message: "You can only update your own shelter" });
    }
    
    const shelter = await storage.getShelter(id);
    if (!shelter) {
      return res.status(404).json({ message: "Shelter not found" });
    }
    
    const updatedShelter = await storage.updateShelter(id, req.body);
    res.json(updatedShelter);
  });

  /*
   * Favorites routes
   */
  
  // Get user's favorite dogs
  app.get('/api/favorites', authenticate, async (req, res) => {
    const favorites = await storage.getUserFavorites(req.user.id);
    res.json(favorites);
  });

  // Add dog to favorites
  app.post('/api/favorites', authenticate, async (req, res) => {
    const validation = validateRequest(insertFavoriteSchema, {
      userId: req.user.id,
      dogId: req.body.dogId
    });
    
    if (!validation.success) {
      return res.status(400).json({ message: "Invalid favorite data", errors: validation.error });
    }
    
    const dogId = validation.data.dogId;
    const dog = await storage.getDog(dogId);
    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }
    
    const isFavorite = await storage.isFavorite(req.user.id, dogId);
    if (isFavorite) {
      return res.status(400).json({ message: "Dog already in favorites" });
    }
    
    const favorite = await storage.addFavorite({ userId: req.user.id, dogId });
    res.status(201).json(favorite);
  });

  // Remove dog from favorites
  app.delete('/api/favorites/:dogId', authenticate, async (req, res) => {
    const dogId = parseInt(req.params.dogId);
    if (isNaN(dogId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    const removed = await storage.removeFavorite(req.user.id, dogId);
    if (!removed) {
      return res.status(404).json({ message: "Dog not found in favorites" });
    }
    
    res.status(204).end();
  });

  // Check if a dog is in user's favorites
  app.get('/api/favorites/:dogId', authenticate, async (req, res) => {
    const dogId = parseInt(req.params.dogId);
    if (isNaN(dogId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    const isFavorite = await storage.isFavorite(req.user.id, dogId);
    res.json({ isFavorite });
  });

  /*
   * AI Recommendation routes
   */
  
  // Get dog recommendations based on user preferences
  app.get('/api/recommendations', authenticate, async (req, res) => {
    const preferences = await storage.getUserPreferences(req.user.id);
    if (!preferences) {
      return res.status(404).json({ 
        message: "User preferences not found", 
        details: "Please complete your profile to get personalized recommendations"
      });
    }
    
    const availableDogs = await storage.getAvailableDogs();
    if (availableDogs.length === 0) {
      return res.status(404).json({ message: "No available dogs found" });
    }
    
    // Simple scoring algorithm - in a real app, this would use TensorFlow.js
    const recommendations = availableDogs.map(dog => {
      let score = 0;
      
      // Match activity level
      if (dog.activityLevel === preferences.activityLevel) {
        score += 3;
      } else if (
        (dog.activityLevel === "Medium" && preferences.activityLevel === "High") ||
        (dog.activityLevel === "High" && preferences.activityLevel === "Medium") ||
        (dog.activityLevel === "Medium" && preferences.activityLevel === "Low") ||
        (dog.activityLevel === "Low" && preferences.activityLevel === "Medium")
      ) {
        score += 1;
      }
      
      // Match for kids
      if (preferences.hasKids && dog.goodWithKids) {
        score += 3;
      } else if (!preferences.hasKids) {
        score += 1; // No penalty if no kids
      }
      
      // Match for other pets
      if (preferences.hasOtherPets && (dog.goodWithDogs || dog.goodWithCats)) {
        score += 2;
      } else if (!preferences.hasOtherPets) {
        score += 1; // No penalty if no other pets
      }
      
      // Match size preference
      if (preferences.preferredSize === "Any" || dog.size === preferences.preferredSize) {
        score += 2;
      }
      
      // Match age preference (simple approach)
      let ageMatch = false;
      if (preferences.preferredAge === "Puppy" && dog.age <= 12) {
        ageMatch = true;
      } else if (preferences.preferredAge === "Young" && dog.age > 12 && dog.age <= 36) {
        ageMatch = true;
      } else if (preferences.preferredAge === "Adult" && dog.age > 36 && dog.age <= 84) {
        ageMatch = true;
      } else if (preferences.preferredAge === "Senior" && dog.age > 84) {
        ageMatch = true;
      }
      
      if (ageMatch) {
        score += 2;
      }
      
      // Calculate match percentage (max score is 12)
      const matchPercentage = Math.round((score / 12) * 100);
      
      return {
        ...dog,
        matchPercentage
      };
    });
    
    // Sort by match percentage
    recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    res.json(recommendations);
  });

  return httpServer;
}
