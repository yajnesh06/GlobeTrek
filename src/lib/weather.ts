
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
const API_KEY = "2d8eff8523fafb0bbec05d416c100ea8"; // Free tier API key for demo
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function getWeatherData(location: string): Promise<WeatherData | null> {
  try {
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
