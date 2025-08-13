import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import AIRecommendation from "@/components/home/AIRecommendation";
import FeaturedDogs from "@/components/home/FeaturedDogs";
import ShelterMap from "@/components/home/ShelterMap";
import SuccessStories from "@/components/home/SuccessStories";
import Features from "@/components/home/Features";
import CTA from "@/components/home/CTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <AIRecommendation />
        <FeaturedDogs />
        <ShelterMap />
        <SuccessStories />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
