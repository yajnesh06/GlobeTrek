// src/pages/itinerary/[id].tsx

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
import { useAttractionImages } from '@/hooks/useAttractionImages'; // Make sure this import is correct
import ImageWithFallback from '@/components/ui/ImageWithFallback'; // Make sure this import is correct

// Define props for the main ItineraryView component
interface ItineraryViewProps {
  itinerary: GeneratedItinerary;
}

const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary }) => {
  // ... (keep all your existing logic for currency, cost estimate, etc.) ...
  console.log("Itinerary full data:", itinerary);
  console.log("Itinerary currency:", itinerary.currency);

  const costEstimate = generateTripCostEstimate(
    itinerary.budget,
    itinerary.travelers || 2,
    itinerary.duration,
    itinerary.budgetAmount,
    itinerary.currency
  );

  const perPersonBudget = Math.round(itinerary.budgetAmount / itinerary.travelers);

  const validatedCurrency = itinerary.currency || 'INR';
  console.log("Using currency:", validatedCurrency);

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
      default: return currencyCode;
    }
  };

  const CurrencyIcon = () => {
    switch(validatedCurrency) {
      case 'USD': return <DollarSign className="h-4 w-4" />;
      case 'EUR': return <Euro className="h-4 w-4" />;
      case 'GBP': return <PoundSterling className="h-4 w-4" />;
      case 'JPY': return <JapaneseYen className="h-4 w-4" />;
      case 'INR': return <IndianRupee className="h-4 w-4" />;
      default: return <span>{validatedCurrency}</span>;
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
                      <span className="text-xl font-bold text-[#2563eb]">{currencySymbol}{itinerary.budgetAmount.toLocaleString()}</span>
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

        {/* HighlightSection for Attractions - now correctly passes overallDestination */}
        <TabsContent value="attractions">
          <HighlightSection
            title="Attractions"
            items={itinerary.highlights.mustVisitPlaces}
            overallDestination={itinerary.destination} // <--- PASS NEW PROP HERE
          />
        </TabsContent>

        {/* Dining content (remains unchanged as it doesn't use images) */}
        <TabsContent value="dining">
          <h3 className="text-xl font-medium mb-4">Dining Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {itinerary.highlights.restaurants.length > 0 ? (
              itinerary.highlights.restaurants.map((item, index) => (
                <Card key={index} className="overflow-hidden h-full">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-lg mb-1">{item.name}</h4>
                    {item.location && (
                      <p className="text-sm text-gray-600 flex items-center mb-2">
                        <span className="mr-1 text-red-500">📍</span>
                        {item.location}
                      </p>
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
              ))
            ) : (
              <p className="col-span-full text-gray-500">No dining options available in this itinerary.</p>
            )}
          </div>
        </TabsContent>

        {/* HighlightSection for Hidden Gems - now correctly passes overallDestination */}
        <TabsContent value="hidden">
          <HighlightSection
            title="Hidden Gems"
            items={itinerary.highlights.hiddenGems}
            overallDestination={itinerary.destination} // <--- PASS NEW PROP HERE
          />
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <TripChat itinerary={itinerary} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Define props for the HighlightSection component - UPDATED
interface HighlightSectionProps {
  title: string;
  items: HighlightItem[];
  overallDestination?: string; // <--- NEW PROP ADDED HERE
}

// HighlightSection component - UPDATED
const HighlightSection: React.FC<HighlightSectionProps> = ({ title, items, overallDestination }) => { // <--- ACCEPT NEW PROP HERE
  // Pass overallDestination to useAttractionImages
  const { highlightItems, isLoading } = useAttractionImages(items, overallDestination); // <--- PASS NEW PROP HERE

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {highlightItems.map((item, index) => (
          <Card key={index} className="overflow-hidden h-full">
            <div className="w-full h-48">
              {item.imageUrl ? (
                <ImageWithFallback
                  src={item.imageUrl}
                  alt={item.imageAlt || `Photo of ${item.name}`}
                  credit={item.imageCredit}
                  className="w-full h-full object-cover"
                />
              ) : isLoading ? (
                <div className="bg-gray-200 animate-pulse w-full h-full"></div>
              ) : (
                <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-400">
                  <span>No image available</span>
                </div>
              )}
            </div>
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