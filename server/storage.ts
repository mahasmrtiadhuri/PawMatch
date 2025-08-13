import { 
  users, type User, type InsertUser,
  dogs, type Dog, type InsertDog,
  shelters, type Shelter, type InsertShelter,
  userPreferences, type UserPreference, type InsertUserPreference,
  favorites, type Favorite, type InsertFavorite
} from "@shared/schema";

// Define the storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Dog operations
  getDog(id: number): Promise<Dog | undefined>;
  getAllDogs(): Promise<Dog[]>;
  getDogsByShelterId(shelterId: number): Promise<Dog[]>;
  getAvailableDogs(): Promise<Dog[]>;
  createDog(dog: InsertDog): Promise<Dog>;
  updateDog(id: number, dog: Partial<Dog>): Promise<Dog | undefined>;
  deleteDog(id: number): Promise<boolean>;
  
  // Shelter operations
  getShelter(id: number): Promise<Shelter | undefined>;
  getAllShelters(): Promise<Shelter[]>;
  createShelter(shelter: InsertShelter): Promise<Shelter>;
  updateShelter(id: number, shelter: Partial<Shelter>): Promise<Shelter | undefined>;
  
  // User Preferences operations
  getUserPreferences(userId: number): Promise<UserPreference | undefined>;
  createUserPreferences(preferences: InsertUserPreference): Promise<UserPreference>;
  updateUserPreferences(userId: number, preferences: Partial<UserPreference>): Promise<UserPreference | undefined>;
  
  // Favorites operations
  getUserFavorites(userId: number): Promise<Dog[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, dogId: number): Promise<boolean>;
  isFavorite(userId: number, dogId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private dogs: Map<number, Dog>;
  private shelters: Map<number, Shelter>;
  private userPreferences: Map<number, UserPreference>;
  private favorites: Map<number, Favorite>;
  
  private userIdCounter: number;
  private dogIdCounter: number;
  private shelterIdCounter: number;
  private userPreferenceIdCounter: number;
  private favoriteIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.dogs = new Map();
    this.shelters = new Map();
    this.userPreferences = new Map();
    this.favorites = new Map();
    
    this.userIdCounter = 1;
    this.dogIdCounter = 1;
    this.shelterIdCounter = 1;
    this.userPreferenceIdCounter = 1;
    this.favoriteIdCounter = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  
  // Dog operations
  async getDog(id: number): Promise<Dog | undefined> {
    return this.dogs.get(id);
  }
  
  async getAllDogs(): Promise<Dog[]> {
    return Array.from(this.dogs.values());
  }
  
  async getDogsByShelterId(shelterId: number): Promise<Dog[]> {
    return Array.from(this.dogs.values()).filter(
      (dog) => dog.shelterId === shelterId
    );
  }
  
  async getAvailableDogs(): Promise<Dog[]> {
    return Array.from(this.dogs.values()).filter(
      (dog) => dog.adoptionStatus === "available"
    );
  }
  
  async createDog(insertDog: InsertDog): Promise<Dog> {
    const id = this.dogIdCounter++;
    const now = new Date();
    const dog: Dog = { ...insertDog, id, createdAt: now };
    this.dogs.set(id, dog);
    return dog;
  }
  
  async updateDog(id: number, dogUpdate: Partial<Dog>): Promise<Dog | undefined> {
    const dog = this.dogs.get(id);
    if (!dog) return undefined;
    
    const updatedDog = { ...dog, ...dogUpdate };
    this.dogs.set(id, updatedDog);
    return updatedDog;
  }
  
  async deleteDog(id: number): Promise<boolean> {
    return this.dogs.delete(id);
  }
  
  // Shelter operations
  async getShelter(id: number): Promise<Shelter | undefined> {
    return this.shelters.get(id);
  }
  
  async getAllShelters(): Promise<Shelter[]> {
    return Array.from(this.shelters.values());
  }
  
  async createShelter(insertShelter: InsertShelter): Promise<Shelter> {
    const id = this.shelterIdCounter++;
    const now = new Date();
    const shelter: Shelter = { ...insertShelter, id, createdAt: now };
    this.shelters.set(id, shelter);
    return shelter;
  }
  
  async updateShelter(id: number, shelterUpdate: Partial<Shelter>): Promise<Shelter | undefined> {
    const shelter = this.shelters.get(id);
    if (!shelter) return undefined;
    
    const updatedShelter = { ...shelter, ...shelterUpdate };
    this.shelters.set(id, updatedShelter);
    return updatedShelter;
  }
  
  // User Preferences operations
  async getUserPreferences(userId: number): Promise<UserPreference | undefined> {
    return Array.from(this.userPreferences.values()).find(
      (pref) => pref.userId === userId
    );
  }
  
  async createUserPreferences(insertPreferences: InsertUserPreference): Promise<UserPreference> {
    const id = this.userPreferenceIdCounter++;
    const now = new Date();
    const preferences: UserPreference = { ...insertPreferences, id, createdAt: now };
    this.userPreferences.set(id, preferences);
    return preferences;
  }
  
  async updateUserPreferences(userId: number, preferencesUpdate: Partial<UserPreference>): Promise<UserPreference | undefined> {
    const preferences = Array.from(this.userPreferences.values()).find(
      (pref) => pref.userId === userId
    );
    
    if (!preferences) return undefined;
    
    const updatedPreferences = { ...preferences, ...preferencesUpdate };
    this.userPreferences.set(preferences.id, updatedPreferences);
    return updatedPreferences;
  }
  
  // Favorites operations
  async getUserFavorites(userId: number): Promise<Dog[]> {
    const favoriteDogIds = Array.from(this.favorites.values())
      .filter((fav) => fav.userId === userId)
      .map((fav) => fav.dogId);
    
    return Array.from(this.dogs.values()).filter(
      (dog) => favoriteDogIds.includes(dog.id)
    );
  }
  
  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = this.favoriteIdCounter++;
    const now = new Date();
    const favorite: Favorite = { ...insertFavorite, id, createdAt: now };
    this.favorites.set(id, favorite);
    return favorite;
  }
  
  async removeFavorite(userId: number, dogId: number): Promise<boolean> {
    const favorite = Array.from(this.favorites.values()).find(
      (fav) => fav.userId === userId && fav.dogId === dogId
    );
    
    if (!favorite) return false;
    
    return this.favorites.delete(favorite.id);
  }
  
  async isFavorite(userId: number, dogId: number): Promise<boolean> {
    return Array.from(this.favorites.values()).some(
      (fav) => fav.userId === userId && fav.dogId === dogId
    );
  }
  
  // Initialize sample data
  private initializeSampleData() {
    // Add sample shelters
    const shelter1 = this.createShelter({
      name: "Sunshine Animal Shelter",
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      phone: "(555) 123-4567",
      email: "info@sunshine.org",
      website: "https://www.sunshine.org",
      latitude: 34.052235,
      longitude: -118.243683,
      description: "A loving shelter dedicated to finding homes for all animals."
    });
    
    const shelter2 = this.createShelter({
      name: "Happy Tails Rescue",
      address: "456 Oak St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      phone: "(555) 987-6543",
      email: "info@happytails.org",
      website: "https://www.happytails.org",
      latitude: 34.053235,
      longitude: -118.253683,
      description: "Rescue organization focused on rehabilitating and rehoming dogs."
    });
    
    const shelter3 = this.createShelter({
      name: "Second Chance Shelter",
      address: "789 Pine St",
      city: "Othertown",
      state: "CA",
      zipCode: "67890",
      phone: "(555) 246-8101",
      email: "info@secondchance.org",
      website: "https://www.secondchance.org",
      latitude: 34.062235,
      longitude: -118.263683,
      description: "Giving animals a second chance at finding forever homes."
    });
    
    const shelter4 = this.createShelter({
      name: "Paws & Hearts",
      address: "101 Maple St",
      city: "Newcity",
      state: "CA",
      zipCode: "54321",
      phone: "(555) 135-7911",
      email: "info@pawsandhearts.org",
      website: "https://www.pawsandhearts.org",
      latitude: 34.051235,
      longitude: -118.233683,
      description: "Finding loving homes for all types of dogs."
    });
    
    // Add sample dogs for each shelter
    // Shelter 1 dogs
    this.createDog({
      name: "Buddy",
      breed: "Golden Retriever",
      age: 24, // 2 years
      size: "Large",
      gender: "Male",
      description: "Buddy is playful, affectionate, and great with children and other pets.",
      imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: true,
      activityLevel: "High",
      trainingLevel: "Basic",
      healthStatus: "Healthy",
      shelterId: 1,
      adoptionStatus: "available"
    });
    
    this.createDog({
      name: "Max",
      breed: "Beagle",
      age: 96, // 8 years
      size: "Small",
      gender: "Male",
      description: "Max is a calm, gentle companion who loves leisurely walks and cuddles.",
      imageUrl: "https://images.unsplash.com/photo-1575859431774-2e57ed632664",
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      activityLevel: "Low",
      trainingLevel: "Advanced",
      healthStatus: "Healthy",
      shelterId: 1,
      adoptionStatus: "available"
    });
    
    // Shelter 2 dogs
    this.createDog({
      name: "Luna",
      breed: "Husky Mix",
      age: 12, // 1 year
      size: "Medium",
      gender: "Female",
      description: "Luna is energetic and intelligent, perfect for an active household.",
      imageUrl: "https://images.unsplash.com/photo-1592754862816-1a21a4ea2281",
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      activityLevel: "High",
      trainingLevel: "Basic",
      healthStatus: "Healthy",
      shelterId: 2,
      adoptionStatus: "available"
    });
    
    this.createDog({
      name: "Charlie",
      breed: "Labrador Retriever",
      age: 36, // 3 years
      size: "Large",
      gender: "Male",
      description: "Charlie is well-trained and loves to play fetch in the park.",
      imageUrl: "https://images.unsplash.com/photo-1579213838058-81010bd14c71",
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: true,
      activityLevel: "High",
      trainingLevel: "Advanced",
      healthStatus: "Healthy",
      shelterId: 2,
      adoptionStatus: "available"
    });
    
    // Shelter 3 dogs
    this.createDog({
      name: "Daisy",
      breed: "Dachshund",
      age: 48, // 4 years
      size: "Small",
      gender: "Female",
      description: "Daisy is sweet and cuddly, perfect for apartment living.",
      imageUrl: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb",
      goodWithKids: true,
      goodWithDogs: false,
      goodWithCats: false,
      activityLevel: "Medium",
      trainingLevel: "Basic",
      healthStatus: "Healthy",
      shelterId: 3,
      adoptionStatus: "available"
    });
    
    this.createDog({
      name: "Rocky",
      breed: "Boxer",
      age: 60, // 5 years
      size: "Large",
      gender: "Male",
      description: "Rocky is energetic and loves outdoor activities and exercise.",
      imageUrl: "https://images.unsplash.com/photo-1536809188428-e8ecf663d0be",
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      activityLevel: "High",
      trainingLevel: "Basic",
      healthStatus: "Healthy",
      shelterId: 3,
      adoptionStatus: "available"
    });
    
    // Shelter 4 dogs
    this.createDog({
      name: "Bella",
      breed: "Mixed Breed",
      age: 36, // 3 years
      size: "Medium",
      gender: "Female",
      description: "Bella is well-trained, loyal, and adapts easily to new environments.",
      imageUrl: "https://images.unsplash.com/photo-1534361960057-19889db9621e",
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: true,
      activityLevel: "Medium",
      trainingLevel: "Advanced",
      healthStatus: "Healthy",
      shelterId: 4,
      adoptionStatus: "available"
    });
    
    this.createDog({
      name: "Cooper",
      breed: "Australian Shepherd",
      age: 24, // 2 years
      size: "Medium",
      gender: "Male",
      description: "Cooper is highly intelligent and excels at agility training.",
      imageUrl: "https://images.unsplash.com/photo-1589941013453-ec89f98c8d65",
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      activityLevel: "High",
      trainingLevel: "Advanced",
      healthStatus: "Healthy",
      shelterId: 4,
      adoptionStatus: "available"
    });
    
    // Add sample users
    this.createUser({
      username: "johndoe",
      password: "password123",
      email: "john@example.com",
      name: "John Doe",
      isAdmin: false,
      isShelterAdmin: false,
      shelterId: null
    });
    
    this.createUser({
      username: "shelter1admin",
      password: "admin123",
      email: "admin@sunshine.org",
      name: "Sunshine Admin",
      isAdmin: false,
      isShelterAdmin: true,
      shelterId: 1
    });
  }
}

export const storage = new MemStorage();
