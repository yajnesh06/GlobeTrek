
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
      // Add some debug logs to help troubleshoot production issues
      console.log("Starting itinerary generation with data:", {
        destination: data.destination,
        budget: data.budget,
        budgetAmount: data.budgetAmount,
        currency: data.currency,
        travelers: data.travelers
      });
      
      // Pass the selected currency to the itinerary generator
      const generatedItinerary = await generateItinerary({
        ...data,
        currency: data.currency // Make sure currency is included
      });
      
      if (generatedItinerary) {
        // Ensure the exact budget amount from the form is used in the itinerary
        const preservedItinerary = {
          ...generatedItinerary,
          currency: data.currency, // Force the currency to be the one from the form
          budgetAmount: data.budgetAmount // Force the exact budget amount from the form
        };
        
        setItinerary(preservedItinerary);
        toast.success("Your itinerary has been created!");
        console.log("Generated itinerary successfully with preserved budget:", preservedItinerary.budgetAmount);
      } else {
        toast.error("Unable to generate itinerary. Please check console for details.");
        console.error("Itinerary generation returned null");
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
    console.log("Attempting to save trip for user:", user.id);
    
    try {
      // Convert GeneratedItinerary to JSON compatible format
      const tripDataJson = JSON.parse(JSON.stringify(itinerary));
      
      console.log("Saving trip to Supabase...");
      const { data, error } = await supabase
        .from('saved_trips')
        .insert({
          user_id: user.id,
          trip_data: tripDataJson
        })
        .select();
        
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Trip saved successfully:", data);
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
        text: `Check out my travel itinerary for ${itinerary?.destination} created with GlobeTrekAI!`,
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
          <Card className="max-w-3xl mx-auto shadow-lg overflow-hidden border-0 rounded-xl">
            <CardHeader className="bg-gradient-to-r from-voyage-50 to-voyage-100 border-b border-voyage-200 p-6 sm:p-8">
              <CardTitle className="text-2xl md:text-3xl font-bold text-center text-voyage-900">Plan Your Dream Trip</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="py-16 md:py-24 flex flex-col items-center justify-center bg-white">
                  <LoadingIndicator />
                  <p className="mt-6 text-lg text-gray-700">We're crafting your perfect vacation...</p>
                  <p className="text-sm text-gray-500 mt-2">This typically takes less than a minute</p>
                </div>
              ) : (
                <div className="p-6 sm:p-8 bg-white">
                  <TripForm onSubmit={handleSubmit} />
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-voyage-900 bg-clip-text text-transparent bg-gradient-to-r from-voyage-700 to-voyage-500">
                Your Trip to {itinerary.destination}
              </h1>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline"
                  className="flex items-center gap-2 border-2 border-voyage-300 text-voyage-700 hover:bg-voyage-50"
                  onClick={handleShareTrip}
                >
                  <Share className="h-4 w-4" />
                  Share
                </Button>
                <Button 
                  className="bg-gradient-to-r from-voyage-500 to-voyage-600 hover:from-voyage-600 hover:to-voyage-700 flex items-center gap-2 shadow-md"
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
