
import React from 'react';
import { GeneratedItinerary, HighlightItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

interface ItineraryViewProps {
  itinerary: GeneratedItinerary;
}

const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary }) => {
  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader className="bg-voyage-50 border-b border-voyage-100">
          <div className="flex flex-col items-center">
            <CardTitle className="text-2xl text-voyage-900">{itinerary.destination} Itinerary</CardTitle>
            <p className="text-voyage-600 mt-1">
              {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()} 
              ({itinerary.duration} days)
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose max-w-none">
            <h3 className="text-xl font-medium text-voyage-800">Trip Summary</h3>
            <p className="text-gray-700">{itinerary.summary}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="daily">Daily Itinerary</TabsTrigger>
          <TabsTrigger value="attractions">Attractions</TabsTrigger>
          <TabsTrigger value="dining">Dining</TabsTrigger>
          <TabsTrigger value="hidden">Hidden Gems</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-6">
          {itinerary.days.map((day) => (
            <Card key={day.day} className="overflow-hidden">
              <CardHeader className="bg-voyage-50 py-3 px-6">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Day {day.day}: {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</CardTitle>
                  <Badge variant="outline" className="bg-white">{day.date}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {day.activities.map((activity, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start">
                        <div className="bg-voyage-100 text-voyage-800 px-2 py-1 rounded text-sm font-medium min-w-20 text-center">
                          {activity.time}
                        </div>
                        <div className="ml-4 flex-1">
                          <p className="font-medium">{activity.description}</p>
                          {activity.location && (
                            <p className="text-sm text-gray-600 mt-1">📍 {activity.location}</p>
                          )}
                          {activity.notes && (
                            <p className="text-sm text-gray-600 mt-1 italic">{activity.notes}</p>
                          )}
                          <Badge className="mt-2" variant="secondary">
                            {activity.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="attractions" className="space-y-6">
          <HighlightSection 
            title="Must-Visit Places" 
            items={itinerary.highlights.mustVisitPlaces} 
          />
        </TabsContent>
        
        <TabsContent value="dining" className="space-y-6">
          <HighlightSection 
            title="Recommended Restaurants" 
            items={itinerary.highlights.restaurants} 
          />
          
          <div className="mt-8">
            <h3 className="text-xl font-medium mb-4">Local Foods to Try</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {itinerary.highlights.localFood.map((food, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-lg">{food.name}</h4>
                    <p className="text-gray-600 mt-1">{food.description}</p>
                    {food.tags && food.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {food.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="hidden" className="space-y-6">
          <HighlightSection 
            title="Hidden Gems" 
            items={itinerary.highlights.hiddenGems} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface HighlightSectionProps {
  title: string;
  items: HighlightItem[];
}

const HighlightSection: React.FC<HighlightSectionProps> = ({ title, items }) => {
  return (
    <div>
      <h3 className="text-xl font-medium mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <h4 className="font-bold text-lg">{item.name}</h4>
              {item.location && (
                <p className="text-sm text-gray-600">📍 {item.location}</p>
              )}
              <p className="text-gray-600 mt-2">{item.description}</p>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline">{tag}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ItineraryView;
