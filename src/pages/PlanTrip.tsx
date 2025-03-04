
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TripForm from '@/components/TripForm';
import { TripFormData, GeneratedItinerary } from '@/types';
import { toast } from 'sonner';
import { generateItinerary } from '@/lib/gemini';
import Navbar from '@/components/Navbar';
import ItineraryView from '@/components/ItineraryView';
import LoadingIndicator from '@/components/LoadingIndicator';

const PlanTrip = () => {
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: TripFormData) => {
    setIsLoading(true);
    toast.info("Generating your personalized itinerary...");
    
    try {
      const generatedItinerary = await generateItinerary(data);
      setItinerary(generatedItinerary);
      
      if (generatedItinerary) {
        toast.success("Your itinerary has been created!");
        console.log("Generated itinerary:", generatedItinerary);
      } else {
        toast.error("Unable to generate itinerary. Please try again.");
      }
    } catch (error) {
      console.error("Error generating itinerary:", error);
      toast.error("Failed to generate itinerary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        {!itinerary ? (
          <Card className="max-w-3xl mx-auto shadow-lg">
            <CardHeader className="bg-voyage-50 border-b border-voyage-100">
              <CardTitle className="text-2xl text-center text-voyage-900">Plan Your Dream Trip</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                  <LoadingIndicator />
                  <p className="mt-4 text-gray-600">Crafting your personalized itinerary...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take up to a minute</p>
                </div>
              ) : (
                <TripForm onSubmit={handleSubmit} />
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-voyage-900">Your Personalized Itinerary</h1>
              <button 
                onClick={() => setItinerary(null)} 
                className="px-4 py-2 text-voyage-600 hover:text-voyage-800 hover:bg-voyage-50 rounded-md transition-colors"
              >
                Plan Another Trip
              </button>
            </div>
            <ItineraryView itinerary={itinerary} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanTrip;
