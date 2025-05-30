import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Info } from "lucide-react";
import { GeneratedItinerary } from '@/types';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

// API Configuration for Gemini
const API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;
// Consider using a more conversational model
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"; // Keeping flash for speed

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
      text: `👋 Hello! I'm your ${itinerary.destination} trip assistant. Ask me anything about your itinerary, local customs, or travel tips!`,
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

  const generateGeminiResponse = async (userQuestion: string) => {
    try {
      // Check if API key is available
      if (!API_KEY) {
        console.error("Missing Gemini API key in environment variables");
        return `I'm sorry, I can't provide information right now due to a configuration issue. Please ensure the API key is set up correctly.`;
      }

      // Include previous messages for context (limited to last 6 messages)
      const conversationHistory = messages
        .slice(-6) // Keep using the last 6 messages for context
        .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
        .join('\n');

      // --- PROMPT REFINEMENT ---
      const prompt = `
        You are a helpful, friendly, and knowledgeable AI travel assistant specifically for a trip to ${itinerary.destination}.
        Your goal is to provide direct, specific, and actionable answers based on the user's itinerary and your general travel knowledge.

        **IMPORTANT LIMITATION:** You do NOT have access to real-time information (e.g., live weather updates, current flight statuses, exact current prices, real-time availability). If asked for real-time data, kindly state that you cannot provide it and offer general, historical information instead, if relevant.

        Trip details:
        - Destination: ${itinerary.destination}
        - Dates: ${new Date(itinerary.startDate).toLocaleDateString()} to ${new Date(itinerary.endDate).toLocaleDateString()}
        - Travelers: ${itinerary.travelers || 2}
        - Interests: ${itinerary.interests?.join(', ') || 'various activities'}
        - Budget: Approximately ${itinerary.budgetAmount?.toLocaleString()} ${itinerary.currency || 'INR'} (${itinerary.budget || 'medium'} level)
        - Key attractions mentioned in this itinerary: ${itinerary.highlights.mustVisitPlaces.map(place => place.name).join(', ')}

        Previous conversation:
        ${conversationHistory}

        User question: "${userQuestion}"

        Instructions:
        - Answer the user's question directly and specifically.
        - **Prioritize information from the provided "Trip details" section first.**
        - If the question asks for recommendations (like resorts, restaurants, activities, or must-visit places), provide specific examples that are well-known or generally fit the destination's context and the specified budget.
        - For "must-visit places," refer to "Key attractions mentioned in this itinerary" first, then supplement with other well-known places if appropriate.
        - If recommending, list specific names and offer a brief reason/description for each.
        - Keep your response concise and helpful (aim for 2-5 sentences unless more detail is necessary for a specific recommendation or list).
        - Do NOT provide generic travel advice unless explicitly asked.
        - If you genuinely lack specific information that isn't general knowledge or available in the provided trip details, acknowledge that briefly and offer alternative help.
        - Format lists or multiple recommendations clearly using markdown (e.g., bullet points).
      `;
      // --- END PROMPT REFINEMENT ---

      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.5,     // Slightly increased for more varied recommendations
            topK: 40,             // Adjusted slightly
            topP: 0.9,            // Adjusted slightly
            maxOutputTokens: 300, // SIGNIFICANTLY INCREASED for more comprehensive recommendations
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from Gemini API:', errorData);
        throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      // Handle cases where content might be empty (e.g., due to safety filters or no valid response)
      if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
        console.warn('Gemini API returned an empty or invalid response:', data);
        return "I apologize, but I couldn't generate a response for that. Please try rephrasing your question.";
      }
      return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
      console.error('Error generating chat response:', error);
      return `I'm sorry, I encountered an error processing your question. Please try again.`;
    }
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
      // Get AI-generated response using Gemini API
      const responseText = await generateGeminiResponse(inputValue);
      
      // Add a small delay for natural feeling
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: responseText,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to generate response. Please try again.');
      
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
      <CardHeader className="bg-[#2563eb]/10 border-b border-[#2563eb]/20 px-4 py-3">
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
                  max-w-[85%] md:max-w-[80%] px-4 py-2 rounded-lg 
                  ${message.sender === 'user' 
                    ? 'bg-[#2563eb] text-white rounded-tr-none' 
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
                {message.sender === 'assistant' ? (
                  <div className="text-sm md:text-base markdown-content">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm md:text-base">{message.text}</p>
                )}
                <div className="text-xs mt-1 opacity-70 text-right">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] md:max-w-[80%] px-4 py-3 rounded-lg bg-gray-100 text-gray-800 rounded-tl-none">
                <div className="flex items-center gap-2 mb-1">
                  <Info className="h-4 w-4" />
                  <span className="text-xs font-medium">Trip Assistant</span>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-2 w-2 rounded-full bg-gray-300 animate-pulse" />
                  <Skeleton className="h-2 w-2 rounded-full bg-gray-300 animate-pulse delay-150" />
                  <Skeleton className="h-2 w-2 rounded-full bg-gray-300 animate-pulse delay-300" />
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
            className="bg-[#2563eb] hover:bg-[#1e40af]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TripChat;