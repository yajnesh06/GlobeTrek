
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Info } from "lucide-react";
import { GeneratedItinerary } from '@/types';
import { Skeleton } from "@/components/ui/skeleton";

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
      text: `👋 Hello! I'm your Switzerland trip assistant. Ask me anything about your itinerary, local customs, or travel tips for ${itinerary.destination}!`,
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate response based on question content
      let responseText = '';
      const question = inputValue.toLowerCase();
      
      if (question.includes('cost') || question.includes('price') || question.includes('budget') || question.includes('expense')) {
        responseText = `The trip to ${itinerary.destination} for ${itinerary.duration} days with a ${itinerary.budget || 'moderate'} budget will cost approximately ₹XXX,XXX. This includes accommodation, food, transportation, and activities. Check the cost breakdown in the summary section for more details.`;
      } 
      else if (question.includes('weather') || question.includes('temperature') || question.includes('climate')) {
        responseText = `The current weather in ${itinerary.destination} is displayed in the summary section. Generally, Switzerland has varying climates depending on altitude. The best time to visit is between April and October for warmer weather, while December to March is perfect for winter sports.`;
      }
      else if (question.includes('food') || question.includes('eat') || question.includes('restaurant') || question.includes('cuisine')) {
        responseText = `Switzerland is famous for its cheese fondue, raclette, rösti, and chocolate. Check the "Dining" tab for recommended restaurants and local food suggestions. Don't miss trying Swiss chocolate from local chocolatiers!`;
      }
      else if (question.includes('travel') || question.includes('transport') || question.includes('get around')) {
        responseText = `Switzerland has an excellent public transportation system including trains, buses, and boats. The Swiss Travel Pass might be worth considering for unlimited travel. For your itinerary, we've included a mix of ${itinerary.transportationType?.join(', ') || 'public transportation'} as per your preferences.`;
      }
      else if (question.includes('attraction') || question.includes('visit') || question.includes('see') || question.includes('place')) {
        responseText = `We've included many attractions in your itinerary! Check the "Attractions" tab for must-visit places and the "Hidden Gems" tab for unique experiences that most tourists miss. Your daily itinerary also includes specific times for visiting these places.`;
      }
      else {
        responseText = `Thanks for your question about ${itinerary.destination}! I've analyzed your ${itinerary.duration}-day itinerary and can confirm that your trip includes the best experiences based on your interests in ${itinerary.interests?.join(', ') || 'Switzerland'}. Is there anything specific about a particular day or activity you'd like to know more about?`;
      }
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: responseText,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
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
