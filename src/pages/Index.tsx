
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plane, 
  Map, 
  CalendarDays, 
  Clock, 
  Star, 
  Gem,
  Utensils,
  ChevronRight,
  CloudSun,
  DollarSign,
  UserCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';

const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    // Force video to play again on component mount
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(error => {
        console.error("Video playback failed:", error);
      });
    }
  }, []);

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <Hero scrollToRef={featuresRef} />
      
      {/* Features section with video */}
        
      
      {/* Benefits section */}
   

      {/* Right Side: Video (1/3 width) */}
      
      
      <section ref={featuresRef} className="py-8 md:py-12 px-0 relative bg-gray-50">
  <div className="container mx-auto max-w-full px-4">
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
      
      {/* Left Side: Flowchart Content (1/3 width on desktop, full width on mobile) */}
      <div className="md:w-1/3 w-full flex flex-col items-center text-center">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight">
            How GlobeTrekAI Works
          </h2>
          <p className="text-base md:text-lg text-gray-500 mt-2 md:mt-3 font-medium">
  Our AI assistant simplifies
  trip planning. <br />  Share your preferences,
  and get a  <br /> personalized itinerary in minutes.
</p>
        </div>

        {/* Flowchart Boxes */}
        <div className="flex flex-col items-center gap-6 md:gap-8 relative">
          {/* Flowchart Box 1 */}
          <div className="relative bg-white border border-gray-200 rounded-xl p-4 md:p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full max-w-[280px] md:max-w-xs">
            <div className="flex items-center mb-2 md:mb-3">
              <div className="bg-voyage-100 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-2 md:mr-3 border border-voyage-200">
                <Map className="h-4 w-4 md:h-5 md:w-5 text-voyage-600" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-900">Share Your Preferences</h3>
            </div>
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
              Tell us where you want to go, your travel dates, budget, and what you enjoy doing.
            </p>
            {/* Arrow pointing to the next box */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-voyage-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>

          {/* Flowchart Box 2 */}
          <div className="relative bg-white border border-gray-200 rounded-xl p-4 md:p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full max-w-[280px] md:max-w-xs">
            <div className="flex items-center mb-2 md:mb-3">
              <div className="bg-voyage-100 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-2 md:mr-3 border border-voyage-200">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-voyage-600" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-900">AI Creates Your Plan</h3>
            </div>
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
              Our AI analyzes your preferences and crafts a personalized itinerary in minutes.
            </p>
            {/* Arrow pointing to the next box */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-voyage-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>

          {/* Flowchart Box 3 */}
          <div className="relative bg-white border border-gray-200 rounded-xl p-4 md:p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full max-w-[280px] md:max-w-xs">
            <div className="flex items-center mb-2 md:mb-3">
              <div className="bg-voyage-100 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-2 md:mr-3 border border-voyage-200">
                <Plane className="h-4 w-4 md:h-5 md:w-5 text-voyage-600" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-900">Enjoy Your Trip</h3>
            </div>
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
              Get a day-by-day itinerary with attractions, restaurants, and local gems to explore.
            </p>
          </div>
        </div>

        {/* Button - Centered Below Flowchart */}
        <div className="mt-8 md:mt-12">
          <Link to="/plan-trip">
            <Button 
              size="lg" 
              className="bg-voyage-500 hover:bg-voyage-600 text-white font-medium px-8 md:px-10 py-5 md:py-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg md:text-xl"
            >
              Start Planning Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Right Side: Video (2/3 width on desktop, full width on mobile) */}
      <div className="md:w-2/3 w-full">
        <video 
          className="w-full h-full min-h-[300px] md:min-h-[450px] object-cover rounded-2xl shadow-xl"
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="/vid1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  </div>
</section>

    {/* CTA Button */}
    


      
      {/* CTA section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-voyage-500 to-voyage-700 opacity-90"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-voyage-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -mb-40 -mr-40"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-voyage-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -mt-40 -ml-40"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Plan Your Dream Trip?
          </h2>
          <p className="text-xl text-voyage-100 mb-10 max-w-2xl mx-auto">
            Let our AI create a customized itinerary tailored to your interests and preferences. It only takes a few minutes!
          </p>
          
          <Link to="/plan-trip">
            <Button 
              size="lg" 
              className="bg-white text-voyage-600 hover:bg-voyage-50 font-medium px-8 shadow-lg"
            >
              Create My Travel Plan
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link to="/" className="flex items-center">
                <Plane className="h-6 w-6 text-voyage-400 mr-2" />
                <span className="text-2xl font-bold">GlobeTrekAI</span>
              </Link>
              <p className="mt-2 text-gray-400 max-w-md">
                AI-powered travel planning that creates personalized itineraries based on your preferences.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h3 className="font-medium mb-3 text-gray-300">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                  <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                  <li><Link to="/plan-trip" className="text-gray-400 hover:text-white transition-colors">Plan Trip</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-3 text-gray-300">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <Separator className="my-8 bg-gray-800" />
          
          <div className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} GlobeTrekAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
