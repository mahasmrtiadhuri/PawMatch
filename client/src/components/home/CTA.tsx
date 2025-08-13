import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function CTA() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-500 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-lg mb-8">
            Join thousands of happy pet owners who found their furry companions through PawMatch.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/login" className="inline-block">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg">
                Create Your Profile
              </Button>
            </Link>
            <Link href="/find-dogs" className="inline-block">
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold py-3 px-8 rounded-lg">
                Browse Available Dogs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
