
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getWeatherData, WeatherData } from '@/lib/weather';
import { Skeleton } from '@/components/ui/skeleton';
import { CloudSun, Droplets, Thermometer, Wind } from 'lucide-react';

interface WeatherCardProps {
  location: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ location }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const data = await getWeatherData(location);
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setLoading(false);
      }
    };

    if (location) {
      fetchWeather();
    }
  }, [location]);

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <div className="mt-3 space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-white border-blue-100">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{weather.location}</h3>
            <div className="flex items-center mt-1">
              <Thermometer className="h-4 w-4 mr-1 text-gray-600" />
              <span className="text-3xl font-bold text-gray-900">{weather.temperature}°C</span>
              <span className="text-sm ml-2 text-gray-600">Feels like: {weather.feelsLike}°C</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <img src={weather.icon} alt={weather.condition} className="h-16 w-16" />
            <span className="text-sm font-medium text-gray-700">{weather.condition}</span>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <Droplets className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm text-gray-700">Humidity: {weather.humidity}%</span>
          </div>
          <div className="flex items-center">
            <Wind className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm text-gray-700">Wind: {weather.windSpeed} m/s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
