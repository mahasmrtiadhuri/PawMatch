import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DogCard from "@/components/dogs/DogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Dog } from "@shared/schema";
import { 
  DOG_SIZES, 
  DOG_ACTIVITY_LEVELS, 
  DOG_GENDERS 
} from "@/lib/constants";

export default function FindDogs() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    breed: "",
    size: "",
    gender: "",
    activityLevel: "",
    goodWithKids: false,
    goodWithDogs: false,
    goodWithCats: false,
  });

  // Fetch available dogs
  const { data: dogs, isLoading, error } = useQuery({
    queryKey: ['/api/dogs/available'],
    retry: 3,
    refetchOnWindowFocus: false,
    staleTime: 60000 // 1 minute
  });

  // Toggle favorite status
  const toggleFavorite = (dogId: number) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(dogId)) {
        return prevFavorites.filter(id => id !== dogId);
      } else {
        return [...prevFavorites, dogId];
      }
    });
  };

  // Update filters
  const handleFilterChange = (field: string, value: any) => {
    setFilters({
      ...filters,
      [field]: value
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      breed: "",
      size: "",
      gender: "",
      activityLevel: "",
      goodWithKids: false,
      goodWithDogs: false,
      goodWithCats: false,
    });
  };

  // Apply filters to dogs
  const filteredDogs = dogs?.filter((dog: Dog) => {
    if (filters.breed && !dog.breed.toLowerCase().includes(filters.breed.toLowerCase())) return false;
    if (filters.size && dog.size !== filters.size) return false;
    if (filters.gender && dog.gender !== filters.gender) return false;
    if (filters.activityLevel && dog.activityLevel !== filters.activityLevel) return false;
    if (filters.goodWithKids && !dog.goodWithKids) return false;
    if (filters.goodWithDogs && !dog.goodWithDogs) return false;
    if (filters.goodWithCats && !dog.goodWithCats) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-4">Find Your Perfect Dog</h1>
          <p className="text-gray-600">Browse available dogs or use filters to narrow your search.</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-8">
          <h2 className="text-lg font-semibold mb-4">Filter Dogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
              <Input 
                type="text" 
                placeholder="Search breeds..." 
                value={filters.breed}
                onChange={(e) => handleFilterChange("breed", e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
              <Select 
                value={filters.size}
                onValueChange={(value) => handleFilterChange("size", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any size</SelectItem>
                  {DOG_SIZES.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <Select 
                value={filters.gender}
                onValueChange={(value) => handleFilterChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any gender</SelectItem>
                  {DOG_GENDERS.map((gender) => (
                    <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
              <Select 
                value={filters.activityLevel}
                onValueChange={(value) => handleFilterChange("activityLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any activity level</SelectItem>
                  {DOG_ACTIVITY_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="goodWithKids" 
                checked={filters.goodWithKids}
                onCheckedChange={(checked) => handleFilterChange("goodWithKids", checked)}
              />
              <label htmlFor="goodWithKids" className="text-sm font-medium text-gray-700 cursor-pointer">
                Good with kids
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="goodWithDogs" 
                checked={filters.goodWithDogs}
                onCheckedChange={(checked) => handleFilterChange("goodWithDogs", checked)}
              />
              <label htmlFor="goodWithDogs" className="text-sm font-medium text-gray-700 cursor-pointer">
                Good with dogs
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="goodWithCats" 
                checked={filters.goodWithCats}
                onCheckedChange={(checked) => handleFilterChange("goodWithCats", checked)}
              />
              <label htmlFor="goodWithCats" className="text-sm font-medium text-gray-700 cursor-pointer">
                Good with cats
              </label>
            </div>
          </div>
          
          <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
        </div>

        {/* Dogs grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <div className="mb-3 flex space-x-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-500">Error loading dogs</h2>
            <p className="mt-2">Please try again later or contact support.</p>
          </div>
        ) : filteredDogs?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDogs.map((dog: Dog) => (
              <DogCard 
                key={dog.id}
                dog={dog}
                onToggleFavorite={toggleFavorite}
                isFavorite={favorites.includes(dog.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">No dogs match your filters</h2>
            <p className="mt-2 text-gray-500">Try adjusting your filters to see more dogs.</p>
            <Button 
              className="mt-4 bg-primary-500 hover:bg-primary-600" 
              onClick={resetFilters}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
