import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dog, Shelter } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface DogProfileProps {
  dogId: number;
}

export default function DogProfile({ dogId }: DogProfileProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  // Fetch dog data
  const { data: dog, isLoading: isDogLoading, error: dogError } = useQuery({
    queryKey: [`/api/dogs/${dogId}`],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error('Failed to fetch dog');
      return await res.json();
    }
  });

  // Fetch shelter data if we have a dog
  const { data: shelter, isLoading: isShelterLoading } = useQuery({
    queryKey: [`/api/shelters/${dog?.shelterId}`],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error('Failed to fetch shelter');
      return await res.json();
    },
    enabled: !!dog?.shelterId
  });

  // Toggle favorite status (client side only for demo)
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite 
        ? `${dog?.name} has been removed from your favorites.` 
        : `${dog?.name} has been added to your favorites!`,
    });
  };

  // Schedule a meet & greet (just a demo toast)
  const scheduleMeetGreet = () => {
    toast({
      title: "Meet & Greet Requested",
      description: `Your request to meet ${dog?.name} has been sent to ${shelter?.name}.`,
    });
  };

  if (dogError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-red-500">Error loading dog profile</h2>
          <p className="mt-2">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {isDogLoading ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            <Skeleton className="md:w-1/2 h-72 md:h-auto" />
            <div className="p-6 md:w-1/2">
              <Skeleton className="h-10 w-1/2 mb-4" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-2/3 mb-6" />
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
              <div className="flex space-x-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      ) : dog && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Dog Image */}
            <div className="md:w-1/2 relative">
              <img 
                src={dog.imageUrl} 
                alt={`${dog.name} - ${dog.breed}`} 
                className="w-full h-72 md:h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <button 
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition shadow-md"
                  onClick={toggleFavorite}
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <i className={`${isFavorite ? 'fas' : 'far'} fa-heart text-accent-500 text-xl`}></i>
                </button>
              </div>
            </div>
            
            {/* Dog Info */}
            <div className="p-6 md:w-1/2">
              <div className="flex justify-between items-center mb-3">
                <h1 className="text-3xl font-bold">{dog.name}</h1>
                <span className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm font-medium">
                  {dog.breed}
                </span>
              </div>
              
              <p className="text-gray-600 mb-6">{dog.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Age</div>
                  <div className="font-semibold">
                    {Math.floor(dog.age / 12)} {Math.floor(dog.age / 12) === 1 ? 'year' : 'years'}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Size</div>
                  <div className="font-semibold">{dog.size}</div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Gender</div>
                  <div className="font-semibold flex items-center">
                    <i className={`fas fa-${dog.gender === 'Male' ? 'mars' : 'venus'} mr-2 ${dog.gender === 'Male' ? 'text-blue-500' : 'text-pink-500'}`}></i>
                    {dog.gender}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Activity Level</div>
                  <div className="font-semibold">{dog.activityLevel}</div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Compatibility</h3>
                <div className="flex flex-wrap gap-2">
                  {dog.goodWithKids && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Good with kids
                    </span>
                  )}
                  {dog.goodWithDogs && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Good with dogs
                    </span>
                  )}
                  {dog.goodWithCats && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Good with cats
                    </span>
                  )}
                  {dog.trainingLevel !== "None" && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {dog.trainingLevel} training
                    </span>
                  )}
                </div>
              </div>
              
              {/* Shelter Info */}
              {!isShelterLoading && shelter && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Shelter Information</h3>
                  <p className="text-sm text-gray-600">
                    {shelter.name} <br />
                    {shelter.address}, {shelter.city}, {shelter.state} {shelter.zipCode}
                  </p>
                </div>
              )}
              
              <div className="flex space-x-3">
                <Button 
                  onClick={scheduleMeetGreet}
                  className="bg-primary-500 hover:bg-primary-600"
                >
                  Schedule Meet & Greet
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open(`mailto:${shelter?.email}?subject=Inquiry about ${dog.name}&body=Hello, I'm interested in learning more about ${dog.name}.`, '_blank')}
                >
                  Contact Shelter
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
