
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plane } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 transition-transform hover:scale-105"
        >
          <Plane className="h-6 w-6 text-voyage-500" strokeWidth={2.5} />
          <span className="font-bold text-2xl text-gray-900">VoyageurAI</span>
        </Link>
        
        <div className="flex items-center space-x-1 md:space-x-4">
          <Link to="/">
            <Button 
              variant={location.pathname === '/' ? 'secondary' : 'ghost'} 
              className="border-2 border-voyage-400 font-medium"
            >
              Home
            </Button>
          </Link>
          <Link to="/about">
            <Button 
              variant={location.pathname === '/about' ? 'secondary' : 'ghost'} 
              className="font-medium border-2 border-voyage-400"
            >
              About
            </Button>
          </Link>
          <Link to="/plan-trip">
            <Button 
              variant="default" 
              className="bg-voyage-500 hover:bg-voyage-600 text-white font-medium shadow-md hover:shadow-lg transition-all"
            >
              Plan Your Trip
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
