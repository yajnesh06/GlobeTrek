
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowDown, Plane } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TextShimmer } from '@/components/ui/text-shimmer';

interface HeroProps {
  scrollToRef?: React.RefObject<HTMLElement>;
}

const Hero: React.FC<HeroProps> = ({ scrollToRef }) => {
  const { user, signInWithGoogle } = useAuth();
  
  const handleScrollDown = () => {
    if (scrollToRef && scrollToRef.current) {
      scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-sky-100 z-0"></div>
      
      {/* Abstract patterns */}
      <div className="absolute top-1/4 right-10 w-72 h-72 bg-[#2563eb] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-floating"></div>
      <div className="absolute bottom-1/3 left-10 w-80 h-80 bg-[#2563eb] rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-floating" style={{ animationDelay: '1.5s' }}></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className="mb-6 inline-block">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-[#2563eb] text-sm font-medium tracking-wide animate-fade-in">
              AI-POWERED TRAVEL PLANNING
            </span>
          </div>
          
          {user ? (
            <>
              <TextShimmer 
                as="h1"
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-down [--base-color:theme(colors.gray.900)] [--base-gradient-color:theme(colors.blue.500)]"
                duration={2}
              >
                {`Welcome back, ${user.full_name?.split(' ')[0] || 'Traveler'}!`}
              </TextShimmer>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mb-10 leading-relaxed animate-slide-up">
                Continue planning your next adventure or view your saved itineraries to explore past travel plans.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <Link to="/plan-trip">
                  <Button 
                    size="lg" 
                    className="bg-[#2563eb] hover:bg-[#1e40af] text-white font-medium text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    Plan New Trip
                  </Button>
                </Link>
                <Link to="/saved-trips">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-[#2563eb] border-2 text-gray-700 font-medium text-lg px-8 py-6 hover:bg-gray-100 transition-all duration-300"
                  >
                    View Saved Trips
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <TextShimmer 
                as="h1"
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-down [--base-color:theme(colors.gray.900)] [--base-gradient-color:theme(colors.blue.500)]"
                duration={3}
              >
                Your Personal AI Travel Assistant
              </TextShimmer>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mb-10 leading-relaxed animate-slide-up">
                Let our AI create your perfect travel itinerary based on your preferences, budget, 
                and interests. Experience travel planning made simple and personalized.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <Button 
                  size="lg" 
                  className="bg-[#2563eb] hover:bg-[#1e40af] text-white font-medium text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  onClick={signInWithGoogle}
                >
                  Sign in with Google
                </Button>
                <Link to="/plan-trip">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-[#2563eb] border-2 text-gray-700 font-medium text-lg px-8 py-6 hover:bg-gray-100 transition-all duration-300"
                  >
                    Try Without Signing In
                  </Button>
                </Link>
              </div>
            </>
          )}
          
          {scrollToRef && (
            <button 
              onClick={handleScrollDown}
              className="absolute bottom-1 mr-6 left-[47.2%] transform -translate-x-1/2 bg-white/80 rounded-full p-3 shadow-md hover:shadow-lg transition-all animate-bounce-light "
              aria-label="Scroll down"
            >
              <ArrowDown className="h-6 w-6 text-[#2563eb]" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
