import { Shelter } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface ShelterInfoCardProps {
  shelter: Shelter;
  onClose: () => void;
}

export default function ShelterInfoCard({ shelter, onClose }: ShelterInfoCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm">
      <div className="flex justify-between items-start">
        <h3 className="font-bold">{shelter.name}</h3>
        <button 
          className="text-gray-400 hover:text-gray-500"
          onClick={onClose}
          aria-label="Close"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-2">{shelter.address}, {shelter.city}, {shelter.state}</p>
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <i className="fas fa-phone-alt mr-1"></i>
        <span>{shelter.phone}</span>
      </div>
      <div className="flex space-x-2">
        <Link href={`/shelters/${shelter.id}/dogs`} className="inline-block">
          <Button size="sm" variant="default" className="bg-primary-500 hover:bg-primary-600 text-white text-sm py-1 px-3 rounded">
            View Dogs
          </Button>
        </Link>
        <Button 
          size="sm" 
          variant="outline" 
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-1 px-3 rounded"
          onClick={() => window.open(`https://maps.google.com/?q=${shelter.latitude},${shelter.longitude}`, '_blank')}
        >
          Get Directions
        </Button>
      </div>
    </div>
  );
}
