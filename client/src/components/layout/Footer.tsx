import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-primary-400 text-2xl">
                <i className="fas fa-paw"></i>
              </span>
              <span className="font-display font-bold text-xl">PawMatch</span>
            </div>
            <p className="text-gray-400 mb-4">
              PawMatch uses AI technology to connect adopters with their ideal canine companions, 
              making the adoption journey easier and more successful.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/find-dogs" className="text-gray-400 hover:text-white transition">
                  Find a Dog
                </Link>
              </li>
              <li>
                <Link href="/match-quiz" className="text-gray-400 hover:text-white transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-gray-400 hover:text-white transition">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* For Shelters */}
          <div>
            <h3 className="text-lg font-bold mb-4">For Shelters</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-gray-400 hover:text-white transition">
                  Shelter Login
                </Link>
              </li>
              <li>
                <Link href="/shelters/register" className="text-gray-400 hover:text-white transition">
                  Add Your Shelter
                </Link>
              </li>
              <li>
                <Link href="/shelter-dashboard" className="text-gray-400 hover:text-white transition">
                  Manage Dogs
                </Link>
              </li>
              <li>
                <Link href="/shelter-resources" className="text-gray-400 hover:text-white transition">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/shelter-metrics" className="text-gray-400 hover:text-white transition">
                  Success Metrics
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-2"></i>
                <span>123 Adoption Lane, Pawsville, CA 90210</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-2"></i>
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-2"></i>
                <span>woof@pawmatch.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link href="/contact" className="inline-block">
                <Button className="bg-primary hover:bg-primary-600 text-white py-2 px-4 rounded transition">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} PawMatch. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition text-sm">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white transition text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Quick Button component for the footer
const Button = ({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};
