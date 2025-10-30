'use client';

import { useEffect, useState } from 'react';
import {
  Sun, CloudRain, CloudSnow, Cloud, Thermometer,
} from 'lucide-react';

type Weather = {
  temp: number;
  description: string;
  icon: React.ReactNode;
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const localStorageKey = 'unigeventos_weather_cache';

  useEffect(() => {
    const cachedData = localStorage.getItem(localStorageKey);
    const iconMap: { [key: string]: React.ReactNode } = {
      'céu limpo': <Sun className="text-yellow-400" size={20} />,
      'chuva leve': <CloudRain className="text-blue-400" size={20} />,
      'chuva': <CloudRain className="text-blue-500" size={20} />,
      'nublado': <Cloud className="text-gray-400" size={20} />,
      'neve': <CloudSnow className="text-blue-300" size={20} />,
    };
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

    if (!apiKey) {
      console.error('API Key do OpenWeather não encontrada');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      if (cachedData) {
        const cached = JSON.parse(cachedData);
        const icon = iconMap[cached.description?.toLowerCase()] ?? <Thermometer size={20} />;
        setWeather({ temp: cached.temp, description: cached.description, icon });
        return;
      }

      const { latitude, longitude } = position.coords;

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=pt_br`
      );
      const data = await res.json();

      const temp = Math.round(data?.main?.temp);
      const description = data?.weather[0]?.description;
      const icon = iconMap[description?.toLowerCase()] ?? <Thermometer size={20} />;

      // Salva apenas temp e description no cache
      localStorage.setItem(localStorageKey, JSON.stringify({ temp, description }));
      setWeather({ temp, description, icon });
    });
  }, []);

  if (!weather) return null;

  return (
    <div className="flex items-center gap-2 text-orange-400">
      {weather.icon}
      <span>{weather.temp}°C • {weather.description}</span>
    </div>
  );
}