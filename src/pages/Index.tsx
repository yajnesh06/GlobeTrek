
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
  ChevronDown,
  ChevronRight,
  Save,
  Share,
  CloudSun,
  DollarSign,
  UserCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';

const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <Hero scrollToRef={featuresRef} />
      
      {/* Features section */}
      <section ref={featuresRef} className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How WanderwiseAI Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI assistant makes trip planning effortless. Just tell us your preferences, and we'll create a personalized itinerary in minutes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-2 bg-voyage-500"></div>
              <CardContent className="pt-6">
                <div className="bg-voyage-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Map className="h-6 w-6 text-voyage-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Share Your Preferences</h3>
                <p className="text-gray-600">
                  Tell us where you want to go, your travel dates, budget, and what you enjoy doing.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-2 bg-voyage-500"></div>
              <CardContent className="pt-6">
                <div className="bg-voyage-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-voyage-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Creates Your Plan</h3>
                <p className="text-gray-600">
                  Our AI analyzes your preferences and crafts a personalized itinerary in minutes.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-2 bg-voyage-500"></div>
              <CardContent className="pt-6">
                <div className="bg-voyage-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Plane className="h-6 w-6 text-voyage-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Enjoy Your Trip</h3>
                <p className="text-gray-600">
                  Get a day-by-day itinerary with attractions, restaurants, and local gems to explore.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center mt-12">
            <Link to="/plan-trip">
              <Button 
                size="lg" 
                className="bg-voyage-500 hover:bg-voyage-600 text-white font-medium px-8"
              >
                Start Planning Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Key Features section - Updated to reflect current state */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              WanderwiseAI combines cutting-edge AI with practical travel tools to create the ultimate trip planning experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            <div className="flex items-start">
              <div className="bg-voyage-100 p-3 rounded-lg mr-5">
                <Star className="h-6 w-6 text-voyage-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Itineraries</h3>
                <p className="text-gray-600">
                  Our advanced AI creates personalized day-by-day travel plans based on your unique preferences, including budget level, interests, and travel style.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-voyage-100 p-3 rounded-lg mr-5">
                <Gem className="h-6 w-6 text-voyage-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Hidden Gems Discovery</h3>
                <p className="text-gray-600">
                  Go beyond tourist traps with recommendations for lesser-known local spots that provide authentic experiences most travelers miss.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-voyage-100 p-3 rounded-lg mr-5">
                <Utensils className="h-6 w-6 text-voyage-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Culinary Exploration</h3>
                <p className="text-gray-600">
                  Discover local restaurants and must-try dishes tailored to your dietary preferences and budget, enabling a delicious culinary journey.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-voyage-100 p-3 rounded-lg mr-5">
                <Save className="h-6 w-6 text-voyage-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Save & Manage Trips</h3>
                <p className="text-gray-600">
                  Create an account to save and manage all your trip itineraries in one place, making it easy to reference them anytime.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-voyage-100 p-3 rounded-lg mr-5">
                <Share className="h-6 w-6 text-voyage-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Easy Sharing</h3>
                <p className="text-gray-600">
                  Share your travel plans with friends and family with a single click, making group trip coordination simpler than ever.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-voyage-100 p-3 rounded-lg mr-5">
                <CloudSun className="h-6 w-6 text-voyage-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Weather Integration</h3>
                <p className="text-gray-600">
                  Access current weather information for your destination to help pack appropriately and plan weather-dependent activities.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-voyage-100 p-3 rounded-lg mr-5">
                <DollarSign className="h-6 w-6 text-voyage-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Cost Estimation</h3>
                <p className="text-gray-600">
                  Get estimated costs for your trip based on your chosen budget level, helping you plan your finances more effectively.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-voyage-100 p-3 rounded-lg mr-5">
                <UserCircle className="h-6 w-6 text-voyage-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">User Accounts</h3>
                <p className="text-gray-600">
                  Create a secure account with Google authentication to save your preferences and access your trips from any device.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Discover the Perfect Balance of Popular Spots and Hidden Gems
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                WanderwiseAI doesn't just recommend tourist traps. Our AI understands what makes a destination special and creates balanced itineraries that include:
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-voyage-100 p-2 rounded-full mr-4 mt-0.5">
                    <Star className="h-5 w-5 text-voyage-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Must-See Attractions</h3>
                    <p className="text-gray-600">The iconic places that define a destination.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-voyage-100 p-2 rounded-full mr-4 mt-0.5">
                    <Gem className="h-5 w-5 text-voyage-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Hidden Local Gems</h3>
                    <p className="text-gray-600">Off-the-beaten-path spots that most tourists miss.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-voyage-100 p-2 rounded-full mr-4 mt-0.5">
                    <Utensils className="h-5 w-5 text-voyage-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Culinary Experiences</h3>
                    <p className="text-gray-600">Recommended restaurants and must-try local dishes.</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-8">
                <Link to="/plan-trip">
                  <Button 
                    variant="outline" 
                    className="border-voyage-500 text-voyage-500 hover:bg-voyage-50"
                  >
                    Plan Your Adventure
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-voyage-100 rounded-lg opacity-50 z-0"></div>
              <div className="relative z-10 bg-white rounded-lg shadow-lg p-6 border">
                <div className="flex items-center mb-6">
                  <CalendarDays className="h-5 w-5 text-voyage-500 mr-2" />
                  <h3 className="font-semibold text-gray-900">Day 2 in Paris</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="pb-4 border-b border-gray-100">
                    <div className="flex">
                      <span className="text-sm font-medium text-gray-500 w-16">09:00</span>
                      <div>
                        <p className="font-medium text-gray-900">Louvre Museum</p>
                        <p className="text-sm text-gray-600 mt-1">World's largest art museum and historic monument</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pb-4 border-b border-gray-100">
                    <div className="flex">
                      <span className="text-sm font-medium text-gray-500 w-16">13:00</span>
                      <div>
                        <p className="font-medium text-gray-900">Lunch at Le Soufflé</p>
                        <p className="text-sm text-gray-600 mt-1">Classic French restaurant specializing in soufflés</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pb-4 border-b border-gray-100">
                    <div className="flex">
                      <span className="text-sm font-medium text-gray-500 w-16">15:00</span>
                      <div>
                        <p className="font-medium text-gray-900">Montmartre Walking Tour</p>
                        <p className="text-sm text-gray-600 mt-1">Bohemian neighborhood with stunning Sacré-Cœur Basilica</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex">
                      <span className="text-sm font-medium text-gray-500 w-16">19:30</span>
                      <div>
                        <p className="font-medium text-gray-900">Dinner at Le Petit Canard</p>
                        <p className="text-sm text-gray-600 mt-1">Cozy restaurant serving traditional duck dishes</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <span className="text-voyage-500 text-sm font-medium">View full itinerary</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
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
                <span className="text-2xl font-bold">WanderwiseAI</span>
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
            &copy; {new Date().getFullYear()} WanderwiseAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
