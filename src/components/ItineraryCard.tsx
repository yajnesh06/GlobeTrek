
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Navigation, 
  Star, 
  Gem, 
  Utensils, 
  ChevronDown, 
  ChevronUp, 
  Download,
  Share2
} from 'lucide-react';
import { 
  GeneratedItinerary, 
  ItineraryDay, 
  ItineraryActivity,
  HighlightItem
} from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ItineraryCardProps {
  itinerary: GeneratedItinerary;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ itinerary }) => {
  const [expandedDays, setExpandedDays] = useState<number[]>([1]); // First day is expanded by default
  
  const toggleDayExpansion = (dayNumber: number) => {
    if (expandedDays.includes(dayNumber)) {
      setExpandedDays(expandedDays.filter((day) => day !== dayNumber));
    } else {
      setExpandedDays([...expandedDays, dayNumber]);
    }
  };
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attraction':
        return <Navigation className="h-4 w-4 mr-1.5 text-voyage-500" />;
      case 'restaurant':
        return <Utensils className="h-4 w-4 mr-1.5 text-voyage-500" />;
      case 'transportation':
        return <MapPin className="h-4 w-4 mr-1.5 text-voyage-500" />;
      case 'accommodation':
        return <MapPin className="h-4 w-4 mr-1.5 text-voyage-500" />;
      default:
        return <Clock className="h-4 w-4 mr-1.5 text-voyage-500" />;
    }
  };
  
  const renderHighlightItem = (item: HighlightItem, icon: React.ReactNode) => (
    <div key={item.name} className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-start gap-3">
        <div className="bg-voyage-50 p-2 rounded-md">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{item.name}</h4>
          {item.location && (
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{item.location}</span>
            </div>
          )}
          <p className="text-sm text-gray-600 mt-2">{item.description}</p>
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border">
        <div className="px-6 py-10 md:px-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {itinerary.destination}
              </h1>
              <div className="flex items-center mt-2 text-gray-600">
                <Calendar className="h-4 w-4 mr-1.5" />
                <span>
                  {format(new Date(itinerary.startDate), "MMM d")} - {format(new Date(itinerary.endDate), "MMM d, yyyy")}
                </span>
                <span className="mx-2">•</span>
                <span>{itinerary.duration} days</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <Download className="h-4 w-4 mr-1.5" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Share2 className="h-4 w-4 mr-1.5" />
                Share
              </Button>
            </div>
          </div>
          
          <p className="mt-4 text-gray-600">
            {itinerary.summary}
          </p>
        </div>
        
        <Tabs defaultValue="itinerary" className="w-full">
          <div className="border-b px-6">
            <TabsList className="h-12">
              <TabsTrigger value="itinerary" className="data-[state=active]:bg-transparent data-[state=active]:font-medium data-[state=active]:text-voyage-700">
                Day-by-Day Itinerary
              </TabsTrigger>
              <TabsTrigger value="highlights" className="data-[state=active]:bg-transparent data-[state=active]:font-medium data-[state=active]:text-voyage-700">
                Trip Highlights
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="itinerary" className="p-0 m-0">
            <div className="p-6">
              <div className="space-y-6">
                {itinerary.days.map((day) => (
                  <div key={day.day} className="bg-white rounded-lg overflow-hidden border">
                    <div 
                      className={cn(
                        "flex items-center justify-between p-4 border-b cursor-pointer transition-colors",
                        expandedDays.includes(day.day) ? "bg-voyage-50" : "hover:bg-gray-50"
                      )}
                      onClick={() => toggleDayExpansion(day.day)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 bg-voyage-100 rounded-full flex items-center justify-center text-voyage-700 font-medium">
                          {day.day}
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium text-gray-900">
                            Day {day.day}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {format(new Date(day.date), "EEE, MMM d")}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        {expandedDays.includes(day.day) ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {expandedDays.includes(day.day) && (
                      <div className="p-4 space-y-4">
                        {day.activities.map((activity, idx) => (
                          <div key={idx} className="flex">
                            <div className="mr-4 text-right w-16 flex-shrink-0 pt-0.5">
                              <span className="text-sm font-medium text-gray-900">
                                {activity.time}
                              </span>
                            </div>
                            
                            <div className="relative pb-5 flex-1">
                              {idx < day.activities.length - 1 && (
                                <div className="absolute left-0 top-3 h-full w-px bg-gray-200 -ml-2.5"></div>
                              )}
                              
                              <div className="bg-white rounded-lg border p-3 ml-5 relative before:absolute before:w-5 before:h-px before:bg-gray-200 before:left-0 before:top-4 before:-translate-x-full">
                                <div className="absolute left-0 top-3 w-3 h-3 rounded-full bg-voyage-500 -ml-7 z-10 ring-2 ring-white"></div>
                                
                                <div className="flex items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center">
                                      {getActivityIcon(activity.type)}
                                      <span className="font-medium text-gray-900">
                                        {activity.description}
                                      </span>
                                    </div>
                                    
                                    {activity.location && (
                                      <div className="flex items-center mt-1 text-sm text-gray-500">
                                        <MapPin className="h-3.5 w-3.5 mr-1" />
                                        <span>{activity.location}</span>
                                      </div>
                                    )}
                                    
                                    {activity.notes && (
                                      <p className="mt-2 text-sm text-gray-600">
                                        {activity.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="highlights" className="p-0 m-0">
            <div className="p-6 space-y-8">
              <section>
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-voyage-500 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">Must-Visit Places</h3>
                </div>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {itinerary.highlights.mustVisitPlaces.map((place) => 
                    renderHighlightItem(place, <Star className="h-5 w-5 text-voyage-500" />)
                  )}
                </div>
              </section>
              
              <section>
                <div className="flex items-center mb-4">
                  <Gem className="h-5 w-5 text-voyage-500 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">Hidden Gems</h3>
                </div>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {itinerary.highlights.hiddenGems.map((place) => 
                    renderHighlightItem(place, <Gem className="h-5 w-5 text-voyage-500" />)
                  )}
                </div>
              </section>
              
              <section>
                <div className="flex items-center mb-4">
                  <Utensils className="h-5 w-5 text-voyage-500 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">Recommended Restaurants</h3>
                </div>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {itinerary.highlights.restaurants.map((place) => 
                    renderHighlightItem(place, <Utensils className="h-5 w-5 text-voyage-500" />)
                  )}
                </div>
              </section>
              
              <section>
                <div className="flex items-center mb-4">
                  <Utensils className="h-5 w-5 text-voyage-500 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">Local Food to Try</h3>
                </div>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {itinerary.highlights.localFood.map((food) => 
                    renderHighlightItem(food, <Utensils className="h-5 w-5 text-voyage-500" />)
                  )}
                </div>
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ItineraryCard;
