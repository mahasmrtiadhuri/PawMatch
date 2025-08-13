import { useState } from 'react';
import { Link } from 'wouter';
import { Dog } from '@shared/schema';

interface DogCardProps {
  dog: Dog;
  onToggleFavorite: (dogId: number) => void;
  isFavorite: boolean;
}

export default function DogCard({ dog, onToggleFavorite, isFavorite }: DogCardProps) {
  // Show the dog's profile when clicked
  const viewProfile = () => {
    // Navigate to the dog's profile page
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={dog.imageUrl} 
          alt={`${dog.name} - ${dog.breed}`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 p-2">
          <button 
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(dog.id);
            }}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <i className={`${isFavorite ? 'fas' : 'far'} fa-heart text-accent-500`}></i>
          </button>
        </div>
        {dog.goodWithKids && (
          <div className="absolute bottom-0 left-0 bg-primary-500 text-white px-3 py-1 rounded-tr-lg">
            <span className="text-sm font-medium">Good with kids</span>
          </div>
        )}
        {dog.activityLevel === "High" && !dog.goodWithKids && (
          <div className="absolute bottom-0 left-0 bg-secondary-500 text-white px-3 py-1 rounded-tr-lg">
            <span className="text-sm font-medium">Active</span>
          </div>
        )}
        {dog.age > 84 && !dog.goodWithKids && dog.activityLevel !== "High" && (
          <div className="absolute bottom-0 left-0 bg-accent-500 text-white px-3 py-1 rounded-tr-lg">
            <span className="text-sm font-medium">Senior</span>
          </div>
        )}
        {dog.trainingLevel === "Advanced" && !dog.goodWithKids && dog.activityLevel !== "High" && dog.age <= 84 && (
          <div className="absolute bottom-0 left-0 bg-green-500 text-white px-3 py-1 rounded-tr-lg">
            <span className="text-sm font-medium">Training complete</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">{dog.name}</h3>
          <span className="bg-secondary-100 text-secondary-700 text-xs px-2 py-1 rounded-full">
            {dog.breed}
          </span>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <div className="flex items-center">
              <i className="fas fa-birthday-cake mr-1"></i>
              <span>{Math.floor(dog.age / 12)} {Math.floor(dog.age / 12) === 1 ? 'year' : 'years'}</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-ruler-vertical mr-1"></i>
              <span>{dog.size}</span>
            </div>
            <div className="flex items-center">
              <i className={`fas fa-${dog.gender.toLowerCase() === 'male' ? 'mars' : 'venus'} mr-1 ${dog.gender.toLowerCase() === 'male' ? 'text-blue-500' : 'text-pink-500'}`}></i>
              <span>{dog.gender}</span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{dog.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">5 miles away • Shelter name</span>
          <Link href={`/dog/${dog.id}`} className="text-primary-500 hover:text-primary-600 text-sm font-medium">
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
