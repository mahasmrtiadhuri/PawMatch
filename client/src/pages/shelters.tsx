import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shelter, Dog } from "@shared/schema";

export default function Shelters() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch shelters
  const { data: shelters, isLoading: isSheltersLoading } = useQuery({
    queryKey: ['/api/shelters'],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error('Failed to fetch shelters');
      return await res.json();
    }
  });

  // Fetch all dogs to count how many each shelter has
  const { data: dogs, isLoading: isDogsLoading } = useQuery({
    queryKey: ['/api/dogs'],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error('Failed to fetch dogs');
      return await res.json();
    }
  });

  // Calculate dog counts per shelter
  const shelterDogCounts: Record<number, number> = {};
  if (dogs) {
    dogs.forEach((dog: Dog) => {
      shelterDogCounts[dog.shelterId] = (shelterDogCounts[dog.shelterId] || 0) + 1;
    });
  }

  // Filter shelters based on search term
  const filteredShelters = shelters?.filter((shelter: Shelter) => 
    shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shelter.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shelter.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shelter.zipCode.includes(searchTerm)
  );

  const isLoading = isSheltersLoading || isDogsLoading;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-4">Find Shelters</h1>
          <p className="text-gray-600">Connect with local animal shelters and discover available dogs for adoption.</p>
        </div>

        {/* Search bar */}
        <div className="mb-8 max-w-md">
          <Input
            type="text"
            placeholder="Search by shelter name, city, or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Shelters grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : filteredShelters?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShelters.map((shelter: Shelter) => (
              <div key={shelter.id} className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-2">{shelter.name}</h2>
                <p className="text-gray-600 mb-1">{shelter.address}</p>
                <p className="text-gray-600 mb-4">{shelter.city}, {shelter.state} {shelter.zipCode}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-phone-alt text-gray-500"></i>
                    <span>{shelter.phone}</span>
                  </div>
                  <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    {shelterDogCounts[shelter.id] || 0} {shelterDogCounts[shelter.id] === 1 ? 'dog' : 'dogs'} available
                  </span>
                </div>
                
                <Link href={`/shelters/${shelter.id}/dogs`}>
                  <Button className="w-full bg-primary-500 hover:bg-primary-600">
                    View Available Dogs
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">No shelters found</h2>
            <p className="mt-2 text-gray-500">
              {searchTerm 
                ? `No shelters match "${searchTerm}". Try a different search term.` 
                : 'No shelters are currently available in the system.'}
            </p>
            {searchTerm && (
              <Button 
                className="mt-4" 
                variant="outline"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
