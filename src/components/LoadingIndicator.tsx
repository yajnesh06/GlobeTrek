
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message = "Generating your perfect itinerary..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-voyage-200 opacity-25"></div>
        <div className="absolute inset-0 rounded-full border-4 border-voyage-500 border-t-transparent animate-spin"></div>
        <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-voyage-500 animate-pulse" />
      </div>
      
      <h3 className="text-xl font-medium text-gray-900 mb-3">{message}</h3>
      
      <div className="max-w-md text-center">
        <p className="text-gray-600 mb-6">
          Our AI is crafting a personalized travel plan just for you. This might take a minute or two.
        </p>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div className="bg-voyage-500 h-2.5 rounded-full animate-pulse-custom" style={{ width: '70%' }}></div>
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
