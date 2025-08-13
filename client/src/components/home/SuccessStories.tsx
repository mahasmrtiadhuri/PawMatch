import { Link } from 'wouter';

interface SuccessStory {
  id: number;
  dogName: string;
  ownerName: string;
  text: string;
  matchPercentage: number;
  matchTime: string;
  rating: number;
  imageUrl: string;
}

export default function SuccessStories() {
  // Sample data for success stories
  const stories: SuccessStory[] = [
    {
      id: 1,
      dogName: "Max",
      ownerName: "The Johnson Family",
      text: "PawMatch's AI recommended Max to us based on our active lifestyle and spacious yard. It was love at first sight during our virtual meet-and-greet. Max has been the perfect addition to our family!",
      matchPercentage: 97,
      matchTime: "6 months ago",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b"
    },
    {
      id: 2,
      dogName: "Luna",
      ownerName: "Sarah",
      text: "As a first-time dog owner living in an apartment, I was nervous about making the right choice. PawMatch suggested Luna, who has been the perfect calm companion for my lifestyle. The AI really works!",
      matchPercentage: 92,
      matchTime: "3 months ago",
      rating: 4,
      imageUrl: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa"
    }
  ];

  // Render paw icons for ratings
  const renderPawRating = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <i 
            key={i} 
            className={`fas fa-paw ${i < rating ? 'text-secondary-500' : 'text-gray-300'}`}
          ></i>
        ))}
      </div>
    );
  };

  return (
    <section className="py-12 bg-secondary-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Success Stories</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how our AI matchmaking has helped these furry friends find their forever homes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map(story => (
            <div key={story.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-2/5">
                <div className="h-64 md:h-full">
                  <img 
                    src={story.imageUrl} 
                    alt={`${story.dogName} and ${story.ownerName}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="md:w-3/5 p-6">
                <div className="flex items-center mb-4">
                  <h3 className="text-xl font-bold">{story.dogName} & {story.ownerName}</h3>
                  <div className="ml-auto">
                    {renderPawRating(story.rating)}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">"{story.text}"</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Matched {story.matchTime}</span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    {story.matchPercentage}% Match
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link href="/success-stories" className="text-primary-500 hover:text-primary-600 font-medium inline-flex items-center">
            <span>Read more success stories</span>
            <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
