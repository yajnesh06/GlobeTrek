
import { toast } from 'sonner';

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

// Using OpenWeatherMap API - free tier
const API_KEY = "c3f10d16f9194ed8d2c5dc8aaf87b4cc"; // Updated API key
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function getWeatherData(location: string): Promise<WeatherData | null> {
  try {
    console.log(`Fetching weather for ${location}`);
    const response = await fetch(`${API_URL}?q=${encodeURIComponent(location)}&units=metric&appid=${API_KEY}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching weather data:', errorData);
      return null;
    }
    
    const data = await response.json();
    
    return {
      location: data.name,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      feelsLike: Math.round(data.main.feels_like)
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

// Helper function to convert cost from USD to INR
export function convertToINR(usdAmount: number): number {
  const conversionRate = 83.5; // Approximate USD to INR conversion rate
  return Math.round(usdAmount * conversionRate);
}

// Generate trip cost estimate based on trip data
export function generateTripCostEstimate(budget: string, travelers: number, days: number): {
  totalCost: number;
  accommodationCost: number;
  foodCost: number;
  transportationCost: number;
  activitiesCost: number;
  miscCost: number;
} {
  // Base costs per person per day in USD
  let accommodationBase = 0;
  let foodBase = 0;
  let transportationBase = 0;
  let activitiesBase = 0;
  let miscBase = 0;
  
  // Set base costs based on budget level
  switch (budget) {
    case 'budget':
      accommodationBase = 70;
      foodBase = 30;
      transportationBase = 20;
      activitiesBase = 30;
      miscBase = 10;
      break;
    case 'moderate':
      accommodationBase = 150;
      foodBase = 60;
      transportationBase = 40;
      activitiesBase = 60;
      miscBase = 25;
      break;
    case 'luxury':
      accommodationBase = 350;
      foodBase = 150;
      transportationBase = 100;
      activitiesBase = 150;
      miscBase = 50;
      break;
    default:
      accommodationBase = 150;
      foodBase = 60;
      transportationBase = 40;
      activitiesBase = 60;
      miscBase = 25;
  }
  
  // Calculate costs in USD
  const accommodationCost = accommodationBase * travelers * days;
  const foodCost = foodBase * travelers * days;
  const transportationCost = transportationBase * travelers * days;
  const activitiesCost = activitiesBase * travelers * days;
  const miscCost = miscBase * travelers * days;
  
  // Total cost
  const totalCost = accommodationCost + foodCost + transportationCost + activitiesCost + miscCost;
  
  // Convert to INR
  return {
    totalCost: convertToINR(totalCost),
    accommodationCost: convertToINR(accommodationCost),
    foodCost: convertToINR(foodCost),
    transportationCost: convertToINR(transportationCost),
    activitiesCost: convertToINR(activitiesCost),
    miscCost: convertToINR(miscCost)
  };
}
