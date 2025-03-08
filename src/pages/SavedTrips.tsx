
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Trash, Eye } from 'lucide-react';
import { SavedTrip } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import { GeneratedItinerary } from '@/types';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ItineraryView from '@/components/ItineraryView';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const SavedTrips = () => {
  const { user, loading } = useAuth();
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedTrips = async () => {
      if (!user) return;
      
      try {
        console.log("Fetching saved trips for user:", user.id);
        const { data, error } = await supabase
          .from('saved_trips')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching trips:", error);
          throw error;
        }
        
        console.log("Fetched trips:", data);
        setTrips(data || []);
      } catch (error) {
        console.error('Error fetching saved trips:', error);
        toast.error('Failed to load your trips');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchSavedTrips();
    } else if (!loading) {
      setIsLoading(false);
    }
  }, [user, loading]);

  const handleDeleteTrip = async (tripId: string) => {
    try {
      console.log("Deleting trip:", tripId);
      const { error } = await supabase
        .from('saved_trips')
        .delete()
        .eq('id', tripId);
        
      if (error) {
        console.error("Error deleting trip:", error);
        throw error;
      }
      
      setTrips(trips.filter(trip => trip.id !== tripId));
      toast.success('Trip deleted successfully');
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast.error('Failed to delete trip');
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-voyage-600 mx-auto"></div>
          <p className="mt-4 text-voyage-600">Loading your saved trips...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 md:pt-40 pb-12 sm:pb-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Sign In Required</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-6">Please sign in to view your saved trips.</p>
              <Link to="/">
                <Button className="bg-voyage-500 hover:bg-voyage-600">
                  Return to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 md:pt-40 pb-12 sm:pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Your Saved Trips</h1>
            <Link to="/plan-trip">
              <Button className="bg-voyage-500 hover:bg-voyage-600">
                Plan New Trip
              </Button>
            </Link>
          </div>
          
          {trips.length === 0 ? (
            <Card className="text-center p-8">
              <CardHeader>
                <CardTitle>No Saved Trips Yet</CardTitle>
                <CardDescription>
                  You haven't saved any trip itineraries yet. Start planning your next adventure!
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Link to="/plan-trip">
                  <Button className="bg-voyage-500 hover:bg-voyage-600">
                    Plan Your First Trip
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => {
                const itinerary = trip.trip_data as GeneratedItinerary;
                return (
                  <Card key={trip.id} className="overflow-hidden">
                    <div className="bg-voyage-50 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{itinerary.destination}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{itinerary.startDate} - {itinerary.endDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {itinerary.summary}
                      </p>
                      <div className="flex items-center mt-3 text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{itinerary.days.length} days · {itinerary.travelers} {itinerary.travelers === 1 ? 'traveler' : 'travelers'}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {itinerary.destination} ({itinerary.startDate} - {itinerary.endDate})
                            </DialogTitle>
                          </DialogHeader>
                          <ItineraryView itinerary={itinerary} />
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="flex-1">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete your saved trip to {itinerary.destination}.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteTrip(trip.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedTrips;
