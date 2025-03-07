
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
    const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY || '72aa7ff7ec2f7b237e50d96eac7cd262';
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
  days: number,
  customBudget?: number
): CostEstimate {
  // If a custom budget is provided, use it for calculations
  if (customBudget && customBudget > 0) {
    // Determine the distribution percentages based on the budget level
    let accommodationPercent = 0.35;
    let foodPercent = 0.25;
    let transportationPercent = 0.15;
    let activitiesPercent = 0.15;
    let miscPercent = 0.10;
    
    // Adjust percentages slightly based on budget level
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
    
    // Calculate costs based on percentages of the custom budget
    const accommodationCost = Math.round(customBudget * accommodationPercent);
    const foodCost = Math.round(customBudget * foodPercent);
    const transportationCost = Math.round(customBudget * transportationPercent);
    const activitiesCost = Math.round(customBudget * activitiesPercent);
    const miscCost = Math.round(customBudget * miscPercent);
    
    // Ensure the total matches the custom budget exactly
    const calculatedTotal = accommodationCost + foodCost + transportationCost + activitiesCost + miscCost;
    const adjustment = customBudget - calculatedTotal;
    
    return {
      totalCost: customBudget,
      accommodationCost,
      foodCost,
      transportationCost,
      activitiesCost,
      miscCost: miscCost + adjustment, // Add any rounding difference to miscellaneous
    };
  }
  
  // Base costs per day per person in INR (Indian Rupees)
  let accommodationCostPerDay = 0;
  let foodCostPerDay = 0;
  let transportationCostPerDay = 0;
  let activitiesCostPerDay = 0;
  let miscCostPerDay = 0;
  
  // Set costs based on budget level
  switch (budgetLevel.toLowerCase()) {
    case 'budget':
      accommodationCostPerDay = 1000; // Hostel or budget hotel
      foodCostPerDay = 600; // Street food, local eateries
      transportationCostPerDay = 300; // Public transportation
      activitiesCostPerDay = 500; // Free or low-cost activities
      miscCostPerDay = 200; // Minimal extras
      break;
    case 'moderate':
      accommodationCostPerDay = 3000; // 3-star hotel
      foodCostPerDay = 1500; // Mid-range restaurants
      transportationCostPerDay = 800; // Mix of public and private
      activitiesCostPerDay = 1200; // Standard attractions
      miscCostPerDay = 500; // Some extras
      break;
    case 'premium':
      accommodationCostPerDay = 8000; // 4-star hotel
      foodCostPerDay = 3000; // Nice restaurants
      transportationCostPerDay = 2000; // Private transportation
      activitiesCostPerDay = 3000; // Premium attractions
      miscCostPerDay = 1000; // Shopping and extras
      break;
    case 'luxury':
      accommodationCostPerDay = 15000; // 5-star hotel
      foodCostPerDay = 6000; // Fine dining
      transportationCostPerDay = 4000; // Private vehicles, taxis
      activitiesCostPerDay = 6000; // VIP experiences
      miscCostPerDay = 3000; // Luxury extras
      break;
    default:
      // Default to moderate if not specified
      accommodationCostPerDay = 3000;
      foodCostPerDay = 1500;
      transportationCostPerDay = 800;
      activitiesCostPerDay = 1200;
      miscCostPerDay = 500;
  }
  
  // Calculate total costs
  const accommodationCost = Math.round(accommodationCostPerDay * days * travelers);
  const foodCost = Math.round(foodCostPerDay * days * travelers);
  const transportationCost = Math.round(transportationCostPerDay * days * travelers);
  const activitiesCost = Math.round(activitiesCostPerDay * days * travelers);
  const miscCost = Math.round(miscCostPerDay * days * travelers);
  
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
