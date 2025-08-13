import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Dog } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import DogCard from '@/components/dogs/DogCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeaturedDogs() {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Fetch available dogs
  const { data: dogs, isLoading, error } = useQuery({
    queryKey: ['/api/dogs/available'],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error('Failed to fetch dogs');
      return await res.json();
    }
  });

  // Toggle favorite status (client-side only in this demo)
  const toggleFavorite = (dogId: number) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(dogId)) {
        return prevFavorites.filter(id => id !== dogId);
      } else {
        return [...prevFavorites, dogId];
      }
    });
  };

  if (error) {
    return (
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-500">
              Error loading dogs. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-display font-bold">Featured Dogs</h2>
          <Link href="/find-dogs" className="text-primary-500 hover:text-primary-600 font-medium flex items-center">
            View All
            <i className="fas fa-chevron-right ml-2"></i>
          </Link>
        </div>
        
        {/* Dog Cards */}
        {isLoading ? (
          // Loading skeleton
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dogs?.slice(0, 4).map((dog: Dog) => (
              <DogCard 
                key={dog.id}
                dog={dog}
                onToggleFavorite={toggleFavorite}
                isFavorite={favorites.includes(dog.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
