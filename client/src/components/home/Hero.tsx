import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-500 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Find Your Perfect Furry Companion
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Our AI-powered matching system helps you discover your ideal canine friend 
            based on your lifestyle and preferences.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/match-quiz" className="inline-block">
              <Button size="lg" variant="default" className="bg-white text-primary-600 hover:bg-gray-100 py-3 px-6">
                Take the Match Quiz
              </Button>
            </Link>
            <Link href="/find-dogs" className="inline-block">
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-white hover:bg-white/10 text-white py-3 px-6">
                Browse All Dogs
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white clip-bottom"></div>
    </section>
  );
}
