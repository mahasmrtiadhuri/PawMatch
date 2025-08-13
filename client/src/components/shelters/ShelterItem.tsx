import { Shelter } from '@shared/schema';

interface ShelterItemProps {
  shelter: Shelter;
  isSelected: boolean;
  onClick: () => void;
  dogCount: number;
}

export default function ShelterItem({ shelter, isSelected, onClick, dogCount }: ShelterItemProps) {
  return (
    <div 
      className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${isSelected ? 'bg-gray-50' : ''}`}
      onClick={onClick}
    >
      <h3 className="font-bold text-gray-800">{shelter.name}</h3>
      <p className="text-sm text-gray-600 mb-1">{shelter.address}, {shelter.city}, {shelter.state}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-primary-600">5 miles away</span>
        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
          {dogCount} {dogCount === 1 ? 'dog' : 'dogs'} available
        </span>
      </div>
    </div>
  );
}
