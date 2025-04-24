import React from 'react';
import { GeneratedItinerary, HighlightItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import WeatherCard from '@/components/WeatherCard';
import TripChat from '@/components/TripChat';
import { generateTripCostEstimate } from '@/lib/weather';
import { IndianRupee, DollarSign, Euro, PoundSterling, JapaneseYen } from 'lucide-react';

interface ItineraryViewProps {
  itinerary: GeneratedItinerary;
}

const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary }) => {
  // Add more detailed debugging log
  console.log("Itinerary full data:", itinerary);
  console.log("Itinerary currency:", itinerary.currency);
  
  // Calculate cost estimate based on itinerary data
  const costEstimate = generateTripCostEstimate(
    itinerary.budget,
    itinerary.travelers || 2,
    itinerary.duration,
    itinerary.budgetAmount,
    itinerary.currency // Ensure currency is passed
  );

  // Calculate per-person budget
  const perPersonBudget = Math.round(itinerary.budgetAmount / itinerary.travelers);
  
  // Force the currency to use the one from the itinerary
  // Make sure to use the exact currency value from the itinerary
  const validatedCurrency = itinerary.currency || 'INR'; 
  console.log("Using currency:", validatedCurrency);
  
  // Rest of the component remains the same
  const getCurrencySymbol = (currencyCode: string) => {
    switch(currencyCode) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      case 'AUD': return 'A$';
      case 'CAD': return 'C$';
      case 'SGD': return 'S$';
      case 'AED': return 'د.إ';
      case 'INR': return '₹';
      default: return currencyCode; // Return the code itself if unknown
    }
  };
  
  const CurrencyIcon = () => {
    switch(validatedCurrency) {
      case 'USD': return <DollarSign className="h-4 w-4" />;
      case 'EUR': return <Euro className="h-4 w-4" />;
      case 'GBP': return <PoundSterling className="h-4 w-4" />;
      case 'JPY': return <JapaneseYen className="h-4 w-4" />;
      case 'INR': return <IndianRupee className="h-4 w-4" />;
      default: return <span>{validatedCurrency}</span>; // Fallback for unknown currencies
    }
  };
  
  const currencySymbol = getCurrencySymbol(validatedCurrency);

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader className="bg-[#2563eb]/10 border-b border-[#2563eb]/20">
          <div className="flex flex-col items-center">
            <CardTitle className="text-2xl text-[#2563eb]">{itinerary.destination} Itinerary</CardTitle>
            <p className="text-[#2563eb]/80 mt-1">
              {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()} 
              ({itinerary.duration} days)
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-xl font-medium text-[#2563eb] mb-2">Trip Summary</h3>
              <p className="text-gray-700 mb-4">{itinerary.summary}</p>
              
              <div className="bg-[#2563eb]/10 p-4 rounded-lg mt-4">
                <h4 className="text-lg font-medium text-[#2563eb] flex items-center mb-3">
                  <span className="bg-[#2563eb]/20 p-1 rounded-full mr-2"><CurrencyIcon /></span> 
                  Budget Breakdown
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Budget</span>
                      <span className="text-xl font-bold text-voyage-600">{currencySymbol}{itinerary.budgetAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Per Person</span>
                      <span className="font-medium">{currencySymbol}{perPersonBudget.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Accommodation</span>
                      <span className="font-medium">{currencySymbol}{costEstimate.accommodationCost.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 mt-2 rounded-full overflow-hidden">
                      <div className="bg-[#2563eb] h-full rounded-full" style={{ width: `${(costEstimate.accommodationCost / itinerary.budgetAmount) * 100}%` }}></div>
                    </div>
                    <div className="text-xs text-right mt-1 text-gray-500">{Math.round((costEstimate.accommodationCost / itinerary.budgetAmount) * 100)}% of budget</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Food & Dining</span>
                      <span className="font-medium">{currencySymbol}{costEstimate.foodCost.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 mt-2 rounded-full overflow-hidden">
                      <div className="bg-[#2563eb] h-full rounded-full" style={{ width: `${(costEstimate.foodCost / itinerary.budgetAmount) * 100}%` }}></div>
                    </div>
                    <div className="text-xs text-right mt-1 text-gray-500">{Math.round((costEstimate.foodCost / itinerary.budgetAmount) * 100)}% of budget</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Transportation</span>
                      <span className="font-medium">{currencySymbol}{costEstimate.transportationCost.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 mt-2 rounded-full overflow-hidden">
                      <div className="bg-[#2563eb] h-full rounded-full" style={{ width: `${(costEstimate.transportationCost / itinerary.budgetAmount) * 100}%` }}></div>
                    </div>
                    <div className="text-xs text-right mt-1 text-gray-500">{Math.round((costEstimate.transportationCost / itinerary.budgetAmount) * 100)}% of budget</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Activities</span>
                      <span className="font-medium">{currencySymbol}{costEstimate.activitiesCost.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 mt-2 rounded-full overflow-hidden">
                      <div className="bg-[#2563eb] h-full rounded-full" style={{ width: `${(costEstimate.activitiesCost / itinerary.budgetAmount) * 100}%` }}></div>
                    </div>
                    <div className="text-xs text-right mt-1 text-gray-500">{Math.round((costEstimate.activitiesCost / itinerary.budgetAmount) * 100)}% of budget</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Miscellaneous</span>
                      <span className="font-medium">{currencySymbol}{costEstimate.miscCost.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 mt-2 rounded-full overflow-hidden">
                      <div className="bg-[#2563eb] h-full rounded-full" style={{ width: `${(costEstimate.miscCost / itinerary.budgetAmount) * 100}%` }}></div>
                    </div>
                    <div className="text-xs text-right mt-1 text-gray-500">{Math.round((costEstimate.miscCost / itinerary.budgetAmount) * 100)}% of budget</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">*Based on your selected budget of {currencySymbol}{itinerary.budgetAmount.toLocaleString()} ({itinerary.budget} level)</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-medium text-[#2563eb] mb-2">Current Weather</h3>
              <WeatherCard location={itinerary.destination} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="flex overflow-x-auto pb-1 mb-4 w-full">
          <TabsTrigger value="daily" className="flex-1 min-w-[120px]">Daily Itinerary</TabsTrigger>
          <TabsTrigger value="attractions" className="flex-1 min-w-[120px]">Attractions</TabsTrigger>
          <TabsTrigger value="dining" className="flex-1 min-w-[120px]">Dining</TabsTrigger>
          <TabsTrigger value="hidden" className="flex-1 min-w-[120px]">Hidden Gems</TabsTrigger>
          <TabsTrigger value="chat" className="flex-1 min-w-[120px]">Chat</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-6">
          {itinerary.days.map((day) => (
            <Card key={day.day} className="overflow-hidden">
              <CardHeader className="bg-[#2563eb]/10 py-3 px-6">
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
                        <div className="bg-[#2563eb]/20 text-[#2563eb] px-2 py-1 rounded text-sm font-medium min-w-20 text-center">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        
        <TabsContent value="chat" className="space-y-6">
          <TripChat itinerary={itinerary} />
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <Card key={index} className="overflow-hidden h-full">
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
