import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  isShelterAdmin: boolean("is_shelter_admin").notNull().default(false),
  shelterId: integer("shelter_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Dog model
export const dogs = pgTable("dogs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  breed: text("breed").notNull(),
  age: integer("age").notNull(), // in months
  size: text("size").notNull(), // "Small", "Medium", "Large"
  gender: text("gender").notNull(), // "Male", "Female"
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  goodWithKids: boolean("good_with_kids").notNull().default(false),
  goodWithDogs: boolean("good_with_dogs").notNull().default(false),
  goodWithCats: boolean("good_with_cats").notNull().default(false),
  activityLevel: text("activity_level").notNull(), // "Low", "Medium", "High"
  trainingLevel: text("training_level").notNull(), // "None", "Basic", "Advanced"
  healthStatus: text("health_status").notNull(), // "Healthy", "Special Needs", "Requires Medication"
  shelterId: integer("shelter_id").notNull(),
  adoptionStatus: text("adoption_status").notNull().default("available"), // "available", "pending", "adopted"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDogSchema = createInsertSchema(dogs).omit({
  id: true,
  createdAt: true,
});

// Shelter model
export const shelters = pgTable("shelters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  website: text("website"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertShelterSchema = createInsertSchema(shelters).omit({
  id: true,
  createdAt: true,
});

// UserPreferences model for AI matching
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  activityLevel: text("activity_level").notNull(), // "Low", "Medium", "High"
  homeType: text("home_type").notNull(), // "Apartment", "House", "Other"
  hasYard: boolean("has_yard").notNull(),
  hasKids: boolean("has_kids").notNull(),
  hasOtherPets: boolean("has_other_pets").notNull(),
  experienceLevel: text("experience_level").notNull(), // "First-time", "Some experience", "Experienced"
  preferredAge: text("preferred_age").notNull(), // "Puppy", "Young", "Adult", "Senior"
  preferredSize: text("preferred_size").notNull(), // "Small", "Medium", "Large", "Any"
  hoursAlone: integer("hours_alone").notNull(), // Number of hours dog would be alone per day
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
});

// Favorites model
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  dogId: integer("dog_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Dog = typeof dogs.$inferSelect;
export type InsertDog = z.infer<typeof insertDogSchema>;

export type Shelter = typeof shelters.$inferSelect;
export type InsertShelter = z.infer<typeof insertShelterSchema>;

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = z.infer<typeof insertUserPreferencesSchema>;

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
