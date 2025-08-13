import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MatchQuiz from "@/components/quiz/MatchQuiz";

export default function MatchQuizPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 bg-gray-50">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Find Your Perfect Match</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Answer a few questions about your lifestyle and preferences, and our AI will find the perfect canine companion for you.
          </p>
        </div>
        
        <MatchQuiz />
      </main>
      <Footer />
    </div>
  );
}
