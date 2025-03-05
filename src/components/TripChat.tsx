
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Info } from "lucide-react";
import { GeneratedItinerary } from '@/types';
import { Skeleton } from "@/components/ui/skeleton";
import { generateTripCostEstimate } from '@/lib/weather';

interface TripChatProps {
  itinerary: GeneratedItinerary;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const TripChat: React.FC<TripChatProps> = ({ itinerary }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: `👋 Hello! I'm your ${itinerary.destination} trip assistant. Ask me anything about your itinerary, local customs, or travel tips for your trip!`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Calculate cost estimate for budget questions
      const costEstimate = generateTripCostEstimate(
        itinerary.budget || 'moderate',
        itinerary.travelers || 2,
        itinerary.duration
      );
      
      // Generate more dynamic response based on question content
      let responseText = '';
      const question = inputValue.toLowerCase();
      
      if (question.includes('cost') || question.includes('price') || question.includes('budget') || question.includes('expense') || question.includes('money')) {
        responseText = `The trip to ${itinerary.destination} for ${itinerary.duration} days with a ${itinerary.budget || 'moderate'} budget will cost approximately ₹${costEstimate.totalCost.toLocaleString('en-IN')}. This includes ₹${costEstimate.accommodationCost.toLocaleString('en-IN')} for accommodation, ₹${costEstimate.foodCost.toLocaleString('en-IN')} for food, ₹${costEstimate.transportationCost.toLocaleString('en-IN')} for transportation, and ₹${costEstimate.activitiesCost.toLocaleString('en-IN')} for activities.`;
      } 
      else if (question.includes('weather') || question.includes('temperature') || question.includes('climate') || question.includes('rain') || question.includes('sunny')) {
        responseText = `The current weather in ${itinerary.destination} is displayed in the summary section. In general, ${itinerary.destination} has varying weather patterns depending on the region. The best time to visit is typically between April and September for warmer weather. During your travel dates (${itinerary.startDate} to ${itinerary.endDate}), you can expect temperatures to be moderate but do check the forecast closer to your travel date.`;
      }
      else if (question.includes('food') || question.includes('eat') || question.includes('restaurant') || question.includes('cuisine') || question.includes('meal') || question.includes('dinner')) {
        const randomRestaurants = itinerary.highlights.restaurants
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(r => r.name)
          .join(', ');
        
        const randomFoods = itinerary.highlights.localFood
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(f => f.name)
          .join(', ');
          
        responseText = `${itinerary.destination} offers amazing culinary experiences! Some must-try local dishes include ${randomFoods}. For restaurants, I recommend checking out ${randomRestaurants}. See the "Dining" tab for more restaurant suggestions and local food recommendations. Your itinerary includes reservations at some of the best places in each location!`;
      }
      else if (question.includes('travel') || question.includes('transport') || question.includes('get around') || question.includes('bus') || question.includes('train') || question.includes('car')) {
        const transportTypes = itinerary.transportationType?.join(', ') || 'public transportation';
        responseText = `${itinerary.destination} has an excellent transportation system. Based on your preferences, we've included ${transportTypes} in your itinerary. Public transportation is efficient and connects most major cities and attractions. For remote areas, having a rental car gives you more flexibility. Your daily itinerary includes specific transportation arrangements for each activity.`;
      }
      else if (question.includes('attraction') || question.includes('visit') || question.includes('see') || question.includes('place') || question.includes('museum') || question.includes('castle')) {
        const randomAttractions = itinerary.highlights.mustVisitPlaces
          .sort(() => Math.random() - 0.5)
          .slice(0, 4)
          .map(p => p.name)
          .join(', ');
          
        const randomGems = itinerary.highlights.hiddenGems
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(g => g.name)
          .join(', ');
          
        responseText = `Your itinerary includes many amazing attractions in ${itinerary.destination}! Some highlights include ${randomAttractions}. For unique experiences, don't miss ${randomGems}. Check the "Attractions" tab for must-visit places and the "Hidden Gems" tab for special experiences that most tourists miss. Your daily itinerary also includes specific visiting times.`;
      }
      else if (question.includes('time') || question.includes('when') || question.includes('schedule') || question.includes('itinerary') || question.includes('plan')) {
        const firstDay = itinerary.days[0];
        const lastDay = itinerary.days[itinerary.days.length - 1];
        responseText = `Your ${itinerary.duration}-day itinerary in ${itinerary.destination} starts on ${firstDay.date} and ends on ${lastDay.date}. Each day has a carefully planned schedule with specific activities and meal times. Check the "Daily Itinerary" tab for a detailed view of your schedule. The itinerary is designed to balance sightseeing, relaxation, and cultural experiences based on your interests in ${itinerary.interests?.join(', ') || 'various activities'}.`;
      }
      else if (question.includes('language') || question.includes('speak') || question.includes('communication')) {
        responseText = `In ${itinerary.destination}, the official language is German. However, many people in tourist areas speak English, especially in larger cities and at major attractions. Learning a few basic German phrases like "Hallo" (Hello), "Danke" (Thank you), and "Bitte" (Please) can enhance your experience and is appreciated by locals. Most restaurants in tourist areas have English menus or staff who speak English.`;
      }
      else if (question.includes('currency') || question.includes('money') || question.includes('payment') || question.includes('card') || question.includes('cash')) {
        responseText = `${itinerary.destination} uses the Euro (€) as its currency. Credit cards are widely accepted in most establishments, but it's good to carry some cash for small purchases at local markets or in rural areas. ATMs are readily available in cities and towns. The current exchange rate is approximately 1 EUR = 89-92 INR, but check the latest rates before your trip. Your estimated total trip cost is ₹${costEstimate.totalCost.toLocaleString('en-IN')}.`;
      }
      else if (question.includes('accommodation') || question.includes('hotel') || question.includes('stay') || question.includes('resort')) {
        const accommodationType = itinerary.accommodationType || 'luxury hotels';
        responseText = `Your itinerary includes ${accommodationType} accommodations throughout your trip to ${itinerary.destination}. All hotels have been selected based on your ${itinerary.budget || 'moderate'} budget preference and offer excellent amenities. Check your daily itinerary for specific hotel information and check-in times. All accommodations are conveniently located near major attractions or offer beautiful views.`;
      }
      else if (question.includes('tips') || question.includes('advice') || question.includes('recommendation') || question.includes('suggest')) {
        responseText = `For your trip to ${itinerary.destination}, I recommend: 1) Carry a refillable water bottle as tap water is safe to drink, 2) Public transport is efficient but validate tickets before boarding, 3) Always carry some cash for small establishments, 4) Try to learn basic German phrases, 5) Be punctual as Germans value timeliness, 6) Shops are typically closed on Sundays, and 7) When dining out, it's customary to leave a 5-10% tip if the service was good.`;
      }
      else {
        // General response with personalized elements
        responseText = `Thanks for your question about ${itinerary.destination}! I've analyzed your ${itinerary.duration}-day itinerary for ${itinerary.travelers} travelers and can see you're interested in ${itinerary.interests?.join(', ') || 'exploring the destination'}. Your trip is planned from ${itinerary.startDate} to ${itinerary.endDate} with a ${itinerary.budget || 'moderate'} budget. Is there anything specific about a particular day, activity, or aspect of your trip you'd like to know more about?`;
      }
      
      // Slight delay for natural feeling
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: responseText,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Fallback response in case of error
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `I'm sorry, I encountered an error while processing your question. Please try asking again.`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="bg-voyage-50 border-b border-voyage-100 px-4 py-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Info className="h-5 w-5" />
          Trip Assistant
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`
                  max-w-[80%] px-4 py-2 rounded-lg 
                  ${message.sender === 'user' 
                    ? 'bg-voyage-500 text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.sender === 'assistant' ? (
                    <Info className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="text-xs font-medium">
                    {message.sender === 'user' ? 'You' : 'Trip Assistant'}
                  </span>
                </div>
                <p>{message.text}</p>
                <div className="text-xs mt-1 opacity-70 text-right">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] px-4 py-3 rounded-lg bg-gray-100 text-gray-800 rounded-tl-none">
                <div className="flex items-center gap-2 mb-1">
                  <Info className="h-4 w-4" />
                  <span className="text-xs font-medium">Trip Assistant</span>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-2 w-2 rounded-full bg-gray-300" />
                  <Skeleton className="h-2 w-2 rounded-full bg-gray-300" />
                  <Skeleton className="h-2 w-2 rounded-full bg-gray-300" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question about your trip..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-grow"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isLoading}
            className="bg-voyage-500 hover:bg-voyage-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TripChat;
