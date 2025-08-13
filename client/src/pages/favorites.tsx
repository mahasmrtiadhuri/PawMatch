import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DogCard from "@/components/dogs/DogCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dog } from "@shared/schema";

export default function Favorites() {
  // In a real application, this would be fetched from the server
  // For this demo, we'll use local storage to simulate favorites
  const [favorites, setFavorites] = useState<number[]>([]);
  
  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('pawMatchFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);
  
  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pawMatchFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Fetch all dogs
  const { data: dogs, isLoading, error } = useQuery({
    queryKey: ['/api/dogs'],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error('Failed to fetch dogs');
      return await res.json();
    }
  });

  // Filter dogs to only show favorites
  const favoriteDogs = dogs?.filter((dog: Dog) => favorites.includes(dog.id)) || [];

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-4">Your Favorite Dogs</h1>
          <p className="text-gray-600">Keep track of the dogs you're interested in and get updates on their status.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
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
            <h2 className="text-2xl font-bold text-red-500">Error loading favorites</h2>
            <p className="mt-2">Please try again later or contact support.</p>
          </div>
        ) : favoriteDogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteDogs.map((dog: Dog) => (
              <DogCard 
                key={dog.id}
                dog={dog}
                onToggleFavorite={toggleFavorite}
                isFavorite={true} // Always true since we're on the favorites page
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md p-8">
            <div className="text-8xl text-gray-300 mb-4">
              <i className="far fa-heart"></i>
            </div>
            <h2 className="text-2xl font-semibold mb-2">You haven't added any favorites yet</h2>
            <p className="text-gray-500 mb-6">
              Browse available dogs and click the heart icon to add them to your favorites.
            </p>
            <Link href="/find-dogs">
              <Button className="bg-primary-500 hover:bg-primary-600">
                Find Dogs
              </Button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
