import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DogCard from "@/components/dogs/DogCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ArrowLeft } from "lucide-react";

export default function RecommendationsPage() {
  const [_, setLocation] = useLocation();
  
  // Fetch available dogs (in a real app, this would be filtered based on preferences)
  const { data: dogs, isLoading } = useQuery({
    queryKey: ['/api/dogs/available'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/match-quiz')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quiz
          </Button>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Heart className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-4">Your Perfect Matches!</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Based on your preferences, we've found these amazing dogs that could be perfect for your family. 
              Each match is carefully selected based on your lifestyle and preferences.
            </p>
          </div>
        </div>

        {dogs && Array.isArray(dogs) && dogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dogs.map((dog: any) => (
              <DogCard 
                key={dog.id} 
                dog={dog} 
                onToggleFavorite={() => {}} 
                isFavorite={false} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No recommendations found.</p>
            <Button onClick={() => setLocation('/find-dogs')}>
              Browse All Dogs
            </Button>
          </div>
        )}

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Didn't find the perfect match?</h2>
          <p className="text-gray-600 mb-6">
            Don't worry! You can browse all available dogs or retake the quiz with different preferences.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => setLocation('/find-dogs')}>
              Browse All Dogs
            </Button>
            <Button variant="outline" onClick={() => setLocation('/match-quiz')}>
              Retake Quiz
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}