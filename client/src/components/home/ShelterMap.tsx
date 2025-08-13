import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shelter, Dog } from '@shared/schema';
import ShelterItem from '@/components/shelters/ShelterItem';
import ShelterInfoCard from '@/components/shelters/ShelterInfoCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

// To be implemented with Leaflet
export default function ShelterMap() {
  const [selectedShelterId, setSelectedShelterId] = useState<number | null>(null);
  const [shelterDogCounts, setShelterDogCounts] = useState<Record<number, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Fetch shelters
  const { data: shelters, isLoading: isLoadingShelters } = useQuery({
    queryKey: ['/api/shelters'],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error('Failed to fetch shelters');
      return await res.json();
    }
  });

  // Fetch all dogs to count how many each shelter has
  const { data: dogs, isLoading: isLoadingDogs } = useQuery({
    queryKey: ['/api/dogs'],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error('Failed to fetch dogs');
      return await res.json();
    }
  });

  // Calculate dog counts per shelter
  useEffect(() => {
    if (dogs) {
      const counts: Record<number, number> = {};
      dogs.forEach((dog: Dog) => {
        counts[dog.shelterId] = (counts[dog.shelterId] || 0) + 1;
      });
      setShelterDogCounts(counts);
    }
  }, [dogs]);

  // Implement map integration with Leaflet here
  // This would be where we'd initialize the map and add markers

  // Filter shelters based on search term
  const filteredShelters = shelters?.filter((shelter: Shelter) => 
    shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shelter.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shelter.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Find Nearby Shelters</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover local animal shelters and rescues with available dogs in your area.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Shelter List */}
            <div className="p-4 border-r border-gray-200 max-h-[500px] overflow-y-auto">
              <div className="mb-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search by location..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400"></i>
                  </div>
                </div>
              </div>
              
              {isLoadingShelters || isLoadingDogs ? (
                // Loading skeletons for shelters
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="p-3 border-b border-gray-100">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-3" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                ))
              ) : filteredShelters?.length > 0 ? (
                filteredShelters.map((shelter: Shelter) => (
                  <ShelterItem
                    key={shelter.id}
                    shelter={shelter}
                    isSelected={selectedShelterId === shelter.id}
                    onClick={() => setSelectedShelterId(shelter.id)}
                    dogCount={shelterDogCounts[shelter.id] || 0}
                  />
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">
                  No shelters found matching your search.
                </div>
              )}
            </div>
            
            {/* Map View */}
            <div className="col-span-2 h-[500px] bg-gray-100 relative" ref={mapRef}>
              {/* Map Placeholder - would be replaced with actual Leaflet map */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <i className="fas fa-map-marker-alt text-4xl text-primary-500 mb-2"></i>
                  <p className="text-gray-500">Interactive map would be displayed here</p>
                  <p className="text-xs text-gray-400 mt-2">Powered by Leaflet.js & OpenStreetMap</p>
                </div>
              </div>
              
              {/* Selected Shelter Info */}
              {selectedShelterId && shelters && (
                <div className="absolute bottom-4 right-4">
                  <ShelterInfoCard
                    shelter={shelters.find((s: Shelter) => s.id === selectedShelterId)}
                    onClose={() => setSelectedShelterId(null)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
