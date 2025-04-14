
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message = "Generating your perfect itinerary..." }) => {
  const [tipIndex, setTipIndex] = useState(0);
  const tips = [
    "Finding the best attractions for you...",
    "Exploring hidden gems in your destination...",
    "Creating your personalized daily schedule...",
    "Discovering local cuisine options...",
    "Planning the perfect trip for you...",
    "Almost there! Finalizing your itinerary..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-20 h-20 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-blue-200 opacity-25"></div>
        <div className="absolute inset-0 rounded-full border-4 border-[#2563eb] border-t-transparent animate-spin"></div>
        <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-[#2563eb] animate-pulse" />
      </div>
      
      <h3 className="text-xl font-medium text-gray-900 mb-3">{message}</h3>
      
      <div className="max-w-md text-center">
        <p className="text-gray-600 mb-6 min-h-[48px] transition-opacity duration-300">
          {tips[tipIndex]}
        </p>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div className="bg-[#2563eb] h-2.5 rounded-full animate-pulse-width"></div>
        </div>
        
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
