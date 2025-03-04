
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TripForm from '@/components/TripForm';
import { TripFormData } from '@/types';
import { toast } from 'sonner';
import { generateItinerary } from '@/lib/gemini';
import Navbar from '@/components/Navbar';

const PlanTrip = () => {
  const handleSubmit = async (data: TripFormData) => {
    toast.info("Generating your personalized itinerary...");
    
    try {
      const itinerary = await generateItinerary(data);
      // Here you would typically save or display the itinerary
      toast.success("Your itinerary has been created!");
      console.log("Generated itinerary:", itinerary);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      toast.error("Failed to generate itinerary. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="bg-voyage-50 border-b border-voyage-100">
            <CardTitle className="text-2xl text-center text-voyage-900">Plan Your Dream Trip</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <TripForm onSubmit={handleSubmit} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanTrip;
