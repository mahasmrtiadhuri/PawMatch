import { useParams } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DogProfile from "@/components/dogs/DogProfile";

export default function DogProfilePage() {
  // Get dog ID from URL parameters
  const params = useParams();
  const dogId = params.id ? parseInt(params.id) : 0;

  if (!dogId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-red-500">Invalid Dog ID</h1>
            <p className="mt-2">Please select a valid dog to view.</p>
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
        <DogProfile dogId={dogId} />
      </main>
      <Footer />
    </div>
  );
}
