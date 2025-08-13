import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-primary text-3xl">
              <i className="fas fa-paw"></i>
            </span>
            <Link href="/" className="font-display font-bold text-xl cursor-pointer">PawMatch</Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className={`font-medium ${location === '/' ? 'text-primary' : 'text-gray-700 hover:text-primary'} transition`}>
                Home
            </Link>
            <Link href="/find-dogs" className={`font-medium ${location === '/find-dogs' ? 'text-primary' : 'text-gray-700 hover:text-primary'} transition`}>
                Find a Dog
            </Link>
            <Link href="/shelters" className={`font-medium ${location === '/shelters' ? 'text-primary' : 'text-gray-700 hover:text-primary'} transition`}>
                Shelters
            </Link>
            <Link href="/about" className={`font-medium ${location === '/about' ? 'text-primary' : 'text-gray-700 hover:text-primary'} transition`}>
                About Us
            </Link>
          </div>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/favorites" className="hidden md:flex text-gray-700 hover:text-primary items-center space-x-1">
                <i className="far fa-heart"></i>
                <span>Favorites</span>
            </Link>
            <Link href="/login" className="hidden md:block">
              <Button variant="default">
                Sign In
              </Button>
            </Link>
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <i className="fas fa-bars text-2xl"></i>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2 pb-3">
            <div className="space-y-1">
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                  Home
              </Link>
              <Link href="/find-dogs" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                  Find a Dog
              </Link>
              <Link href="/shelters" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                  Shelters
              </Link>
              <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                  About Us
              </Link>
              <Link href="/favorites" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                  Favorites
              </Link>
              <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-primary-600">
                  Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
