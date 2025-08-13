import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function AIRecommendation() {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            How Our AI Finds Your Perfect Match
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our advanced algorithm considers your lifestyle, living situation, and preferences 
            to recommend dogs that will thrive in your home.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-clipboard-list text-primary-500 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Complete Your Profile</h3>
            <p className="text-gray-600">
              Tell us about your lifestyle, living space, experience with dogs, and what you're looking for.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-brain text-secondary-500 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
            <p className="text-gray-600">
              Our AI analyzes thousands of successful adoptions to find patterns and predict great matches.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-heart text-accent-500 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Meet Your Matches</h3>
            <p className="text-gray-600">
              Review your personalized recommendations and schedule virtual or in-person meet-and-greets.
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/match-quiz" className="inline-block">
            <Button className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-lg inline-flex items-center space-x-2 transition">
              <span>Start Your Matching Journey</span>
              <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
