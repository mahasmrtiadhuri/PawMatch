export default function Features() {
  // Feature data
  const features = [
    {
      icon: "video",
      color: "primary",
      title: "Virtual Meet & Greets",
      description: "Schedule video calls with shelters to meet dogs virtually before visiting in person."
    },
    {
      icon: "tasks",
      color: "secondary",
      title: "Adoption Journey Tracker",
      description: "Follow your adoption process from application to bringing your new friend home."
    },
    {
      icon: "bell",
      color: "accent",
      title: "Real-Time Updates",
      description: "Receive instant notifications about your application status and saved dogs."
    },
    {
      icon: "paw",
      color: "green",
      title: "Rich Dog Profiles",
      description: "Detailed information about each dog's personality, training, health, and compatibility."
    },
    {
      icon: "heart",
      color: "purple",
      title: "Favorite & Wishlist",
      description: "Save dogs you're interested in and get alerts when they're updated or become available."
    },
    {
      icon: "comments",
      color: "blue",
      title: "Shelter Communication",
      description: "Direct messaging with shelters to ask questions and coordinate visits."
    }
  ];

  // Helper function to get the right icon color class
  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      'primary': 'text-primary-500',
      'secondary': 'text-secondary-500',
      'accent': 'text-accent-500',
      'green': 'text-green-500',
      'purple': 'text-purple-500',
      'blue': 'text-blue-500'
    };
    return colorMap[color] || 'text-gray-500';
  };

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Features That Make Adoption Easy
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform is designed to simplify and enhance every step of your dog adoption journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className={`${getColorClass(feature.color)} mb-4`}>
                <i className={`fas fa-${feature.icon} text-3xl`}></i>
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
