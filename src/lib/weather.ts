
import { useEffect, useState } from 'react';

export interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
}

export async function getWeatherData(location: string): Promise<WeatherData | null> {
  try {
    const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
    
    if (!API_KEY) {
      console.error('Missing OpenWeather API key in environment variables');
      return null;
    }
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Weather data not available');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

interface CostEstimate {
  totalCost: number;
  accommodationCost: number;
  foodCost: number;
  transportationCost: number;
  activitiesCost: number;
  miscCost: number;
}

export function generateTripCostEstimate(
  budgetLevel: string,
  travelers: number,
  duration: number,
  budgetAmount: number,
  currency: string = 'INR'
): CostEstimate {
  // Currency conversion rates relative to INR
  const conversionRates: Record<string, number> = {
    'USD': 0.012,
    'EUR': 0.011,
    'GBP': 0.0095,
    'JPY': 1.33,
    'AUD': 0.018,
    'CAD': 0.016,
    'SGD': 0.016,
    'AED': 0.044,
    'INR': 1
  };
  
  const rate = conversionRates[currency] || 1;
  
  // If a budget amount is provided, use it for calculations
  if (budgetAmount && budgetAmount > 0) {
    // Determine the distribution percentages based on the budget level
    let accommodationPercent = 0.35;
    let foodPercent = 0.25;
    let transportationPercent = 0.15;
    let activitiesPercent = 0.15;
    let miscPercent = 0.10;
    
    // Adjust percentages based on budget level
    if (budgetLevel === 'budget') {
      accommodationPercent = 0.30;
      foodPercent = 0.25;
      transportationPercent = 0.20;
      activitiesPercent = 0.15;
      miscPercent = 0.10;
    } else if (budgetLevel === 'luxury') {
      accommodationPercent = 0.40;
      foodPercent = 0.25;
      transportationPercent = 0.10;
      activitiesPercent = 0.15;
      miscPercent = 0.10;
    }
    
    // Calculate costs based on percentages of the budget amount
    const accommodationCost = Math.round(budgetAmount * accommodationPercent);
    const foodCost = Math.round(budgetAmount * foodPercent);
    const transportationCost = Math.round(budgetAmount * transportationPercent);
    const activitiesCost = Math.round(budgetAmount * activitiesPercent);
    const miscCost = Math.round(budgetAmount * miscPercent);
    
    // Ensure the total matches the budget amount exactly
    const calculatedTotal = accommodationCost + foodCost + transportationCost + activitiesCost + miscCost;
    const adjustment = budgetAmount - calculatedTotal;
    
    return {
      totalCost: budgetAmount,
      accommodationCost,
      foodCost,
      transportationCost,
      activitiesCost,
      miscCost: miscCost + adjustment,
    };
  }
  
  // Base costs per day per person in INR
  let accommodationCostPerDay = 0;
  let foodCostPerDay = 0;
  let transportationCostPerDay = 0;
  let activitiesCostPerDay = 0;
  let miscCostPerDay = 0;
  
  // Set costs based on budget level
  switch (budgetLevel.toLowerCase()) {
    case 'budget':
      accommodationCostPerDay = 1000;
      foodCostPerDay = 600;
      transportationCostPerDay = 300;
      activitiesCostPerDay = 500;
      miscCostPerDay = 200;
      break;
    case 'moderate':
      accommodationCostPerDay = 3000;
      foodCostPerDay = 1500;
      transportationCostPerDay = 800;
      activitiesCostPerDay = 1200;
      miscCostPerDay = 500;
      break;
    case 'premium':
      accommodationCostPerDay = 8000;
      foodCostPerDay = 3000;
      transportationCostPerDay = 2000;
      activitiesCostPerDay = 3000;
      miscCostPerDay = 1000;
      break;
    case 'luxury':
      accommodationCostPerDay = 15000;
      foodCostPerDay = 6000;
      transportationCostPerDay = 4000;
      activitiesCostPerDay = 6000;
      miscCostPerDay = 3000;
      break;
    default:
      accommodationCostPerDay = 3000;
      foodCostPerDay = 1500;
      transportationCostPerDay = 800;
      activitiesCostPerDay = 1200;
      miscCostPerDay = 500;
  }
  
  // Convert base costs to selected currency
  accommodationCostPerDay = Math.round(accommodationCostPerDay * rate);
  foodCostPerDay = Math.round(foodCostPerDay * rate);
  transportationCostPerDay = Math.round(transportationCostPerDay * rate);
  activitiesCostPerDay = Math.round(activitiesCostPerDay * rate);
  miscCostPerDay = Math.round(miscCostPerDay * rate);
  
  // Calculate total costs
  const accommodationCost = Math.round(accommodationCostPerDay * duration * travelers);
  const foodCost = Math.round(foodCostPerDay * duration * travelers);
  const transportationCost = Math.round(transportationCostPerDay * duration * travelers);
  const activitiesCost = Math.round(activitiesCostPerDay * duration * travelers);
  const miscCost = Math.round(miscCostPerDay * duration * travelers);
  
  const totalCost = accommodationCost + foodCost + transportationCost + activitiesCost + miscCost;
  
  return {
    totalCost,
    accommodationCost,
    foodCost,
    transportationCost,
    activitiesCost,
    miscCost
  };
}
