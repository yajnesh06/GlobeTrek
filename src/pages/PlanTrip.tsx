
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TripForm from '@/components/TripForm';
import { TripFormData, GeneratedItinerary } from '@/types';
import { toast } from 'sonner';
import { generateItinerary } from '@/lib/gemini';
import Navbar from '@/components/Navbar';
import ItineraryView from '@/components/ItineraryView';
import LoadingIndicator from '@/components/LoadingIndicator';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Save, Share } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

const PlanTrip = () => {
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const handleSaveTrip = async () => {
    if (!user) {
      toast.error("Please sign in to save your trip");
      return;
    }
    
    if (!itinerary) {
      toast.error("No itinerary to save");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Convert GeneratedItinerary to JSON compatible format
      const tripDataJson = JSON.parse(JSON.stringify(itinerary));
      
      const { error } = await supabase
        .from('saved_trips')
        .insert({
          user_id: user.id,
          trip_data: tripDataJson
        });
        
      if (error) throw error;
      
      toast.success("Trip saved successfully!");
      navigate('/saved-trips');
    } catch (error) {
      console.error("Error saving trip:", error);
      toast.error("Failed to save your trip. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareTrip = () => {
    if (navigator.share) {
      navigator.share({
        title: `Travel Itinerary for ${itinerary?.destination}`,
        text: `Check out my travel itinerary for ${itinerary?.destination} created with VoyageurAI!`,
        url: window.location.href,
      })
      .then(() => toast.success("Shared successfully!"))
      .catch((error) => {
        console.error("Error sharing:", error);
        toast.error("Failed to share");
      });
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success("Link copied to clipboard!"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16">
        {!itinerary ? (
          <Card className="max-w-3xl mx-auto shadow-lg">
            <CardHeader className="bg-voyage-50 border-b border-voyage-100 p-4 sm:p-6">
              <CardTitle className="text-xl md:text-2xl text-center text-voyage-900">Plan Your Dream Trip</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {isLoading ? (
                <div className="py-10 sm:py-16 md:py-20 flex flex-col items-center justify-center">
                  <LoadingIndicator />
                  <p className="mt-4 text-gray-600">We're working on your dream vacation...</p>
                  <p className="text-sm text-gray-500 mt-2">This typically takes less than a minute</p>
                </div>
              ) : (
                <TripForm onSubmit={handleSubmit} />
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-voyage-900">Your Personalized Itinerary</h1>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleShareTrip}
                >
                  <Share className="h-4 w-4" />
                  Share
                </Button>
                <Button 
                  className="bg-voyage-500 hover:bg-voyage-600 flex items-center gap-2"
                  onClick={handleSaveTrip}
                  disabled={isSaving || !user}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Trip
                    </>
                  )}
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setItinerary(null)} 
                  className="text-voyage-600 hover:text-voyage-800 hover:bg-voyage-50"
                >
                  Plan Another Trip
                </Button>
              </div>
            </div>
            <ItineraryView itinerary={itinerary} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanTrip;
