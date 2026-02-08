// Open-Meteo API utility
// Free weather API with no API key required
// Documentation: https://open-meteo.com/

const BASE_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1';

// Geocode city name to coordinates
async function geocodeCity(city) {
  try {
    const response = await fetch(
      `${GEOCODING_URL}/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error('City not found');
    }
    
    const result = data.results[0];
    return {
      lat: result.latitude,
      lon: result.longitude,
      name: result.name,
      country: result.country,
      timezone: result.timezone
    };
  } catch (error) {
    throw error;
  }
}

export const weatherAPI = {
  // Get current weather by city name
  async getCurrentWeather(city, units = 'metric') {
    try {
      const location = await geocodeCity(city);
      
      const tempUnit = units === 'metric' ? 'celsius' : 'fahrenheit';
      const response = await fetch(
        `${BASE_URL}/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,visibility,surface_pressure&timezone=${location.timezone}&temperature_unit=${tempUnit}`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      
      const data = await response.json();
      
      // Transform to OpenWeatherMap-like format for compatibility
      return {
        name: location.name,
        sys: { country: location.country },
        main: {
          temp: data.current.temperature_2m,
          feels_like: data.current.temperature_2m, // Approximation
          humidity: data.current.relative_humidity_2m,
          pressure: data.current.surface_pressure
        },
        weather: [
          {
            main: getWeatherMain(data.current.weather_code),
            description: getWeatherDescription(data.current.weather_code),
            icon: getWeatherIcon(data.current.weather_code)
          }
        ],
        wind: {
          speed: data.current.wind_speed_10m
        },
        visibility: data.current.visibility || 10000,
        timezone: location.timezone
      };
    } catch (error) {
      throw error;
    }
  },

  // Get 5-day forecast
  async getForecast(city, units = 'metric') {
    try {
      const location = await geocodeCity(city);
      
      const tempUnit = units === 'metric' ? 'celsius' : 'fahrenheit';
      const response = await fetch(
        `${BASE_URL}/forecast?latitude=${location.lat}&longitude=${location.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=${location.timezone}&temperature_unit=${tempUnit}&forecast_days=5`
      );
      
      if (!response.ok) {
        throw new Error('Forecast not available');
      }
      
      const data = await response.json();
      
      // Transform to match OpenWeatherMap format
      const list = data.daily.time.map((date, index) => {
        const timestamp = new Date(date).getTime() / 1000;
        return {
          dt: timestamp,
          main: {
            temp: (data.daily.temperature_2m_max[index] + data.daily.temperature_2m_min[index]) / 2,
            temp_max: data.daily.temperature_2m_max[index],
            temp_min: data.daily.temperature_2m_min[index]
          },
          weather: [
            {
              main: getWeatherMain(data.daily.weather_code[index]),
              description: getWeatherDescription(data.daily.weather_code[index]),
              icon: getWeatherIcon(data.daily.weather_code[index])
            }
          ]
        };
      });
      
      return {
        list,
        city: {
          name: location.name,
          country: location.country
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // Get weather by coordinates (for geolocation)
  async getWeatherByCoords(lat, lon, units = 'metric') {
    try {
      const tempUnit = units === 'metric' ? 'celsius' : 'fahrenheit';
      const response = await fetch(
        `${BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,visibility,surface_pressure&temperature_unit=${tempUnit}`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Weather API error: ${errorText}`);
      }
      
      const data = await response.json();
      
      // Get city name from coordinates using Nominatim reverse geocoding
      let cityName = 'Your Location';
      try {
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`,
          { headers: { 'User-Agent': 'PixelWeatherApp/1.0' } }
        );
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          // Try to get city, town, village, or county
          cityName = geoData.address?.city || 
                     geoData.address?.town || 
                     geoData.address?.village || 
                     geoData.address?.county || 
                     geoData.name || 
                     'Your Location';
        }
      } catch (geoErr) {
        console.warn('Reverse geocoding failed', geoErr);
      }
      
      return {
        name: cityName,
        coord: { lat, lon },
        main: {
          temp: data.current.temperature_2m,
          feels_like: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          pressure: data.current.surface_pressure
        },
        weather: [
          {
            main: getWeatherMain(data.current.weather_code),
            description: getWeatherDescription(data.current.weather_code),
            icon: getWeatherIcon(data.current.weather_code)
          }
        ],
        wind: {
          speed: data.current.wind_speed_10m
        },
        visibility: data.current.visibility || 10000
      };
    } catch (error) {
      console.error('getWeatherByCoords error:', error);
      throw new Error(error.message || 'Failed to get weather data');
    }
  },

  // Get 5-day forecast by coordinates
  async getForecastByCoords(lat, lon, units = 'metric') {
    try {
      const tempUnit = units === 'metric' ? 'celsius' : 'fahrenheit';
      const response = await fetch(
        `${BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=${tempUnit}&forecast_days=5`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Forecast API error: ${errorText}`);
      }
      
      const data = await response.json();
      
      // Get city name from Nominatim reverse geocoding
      let cityName = 'Your Location';
      try {
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`,
          { headers: { 'User-Agent': 'PixelWeatherApp/1.0' } }
        );
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          // Try to get city, town, village, or county
          cityName = geoData.address?.city || 
                     geoData.address?.town || 
                     geoData.address?.village || 
                     geoData.address?.county || 
                     geoData.name || 
                     'Your Location';
        }
      } catch (geoErr) {
        console.warn('Reverse geocoding failed', geoErr);
      }
      
      const list = data.daily.time.map((date, index) => {
        const timestamp = new Date(date).getTime() / 1000;
        return {
          dt: timestamp,
          main: {
            temp: (data.daily.temperature_2m_max[index] + data.daily.temperature_2m_min[index]) / 2,
            temp_max: data.daily.temperature_2m_max[index],
            temp_min: data.daily.temperature_2m_min[index]
          },
          weather: [
            {
              main: getWeatherMain(data.daily.weather_code[index]),
              description: getWeatherDescription(data.daily.weather_code[index]),
              icon: getWeatherIcon(data.daily.weather_code[index])
            }
          ]
        };
      });
      
      return {
        list,
        city: {
          name: cityName
        }
      };
    } catch (error) {
      console.error('getForecastByCoords error:', error);
      throw new Error(error.message || 'Failed to get forecast data');
    }
  }
};

// WMO Weather interpretation codes
// https://www.noaa.gov/media/11302/current-conditions
function getWeatherMain(code) {
  if (code === 0) return 'Clear';
  if (code === 1 || code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Foggy';
  if (code === 51 || code === 53 || code === 55) return 'Drizzle';
  if (code === 61 || code === 63 || code === 65) return 'Rain';
  if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) return 'Snow';
  if (code === 80 || code === 81 || code === 82) return 'Rain showers';
  if (code === 95 || code === 96 || code === 99) return 'Thunderstorm';
  return 'Unknown';
}

function getWeatherDescription(code) {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45) return 'Foggy';
  if (code === 48) return 'Depositing rime fog';
  if (code === 51) return 'Light drizzle';
  if (code === 53) return 'Moderate drizzle';
  if (code === 55) return 'Dense drizzle';
  if (code === 61) return 'Slight rain';
  if (code === 63) return 'Moderate rain';
  if (code === 65) return 'Heavy rain';
  if (code === 71) return 'Slight snow';
  if (code === 73) return 'Moderate snow';
  if (code === 75) return 'Heavy snow';
  if (code === 77) return 'Snow grains';
  if (code === 80) return 'Slight rain showers';
  if (code === 81) return 'Moderate rain showers';
  if (code === 82) return 'Violent rain showers';
  if (code === 85) return 'Slight snow showers';
  if (code === 86) return 'Heavy snow showers';
  if (code === 95) return 'Thunderstorm';
  if (code === 96) return 'Thunderstorm with slight hail';
  if (code === 99) return 'Thunderstorm with heavy hail';
  return 'Unknown conditions';
}

function getWeatherIcon(code) {
  if (code === 0) return '01d';
  if (code === 1 || code === 2) return '02d';
  if (code === 3) return '04d';
  if (code === 45 || code === 48) return '50d';
  if (code === 51 || code === 53 || code === 55) return '09d';
  if (code === 61 || code === 63 || code === 65) return '10d';
  if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) return '13d';
  if (code === 80 || code === 81 || code === 82) return '10d';
  if (code === 95 || code === 96 || code === 99) return '11d';
  return '04d';
}

// Weather icon mapping (emoji/custom)
export const getWeatherEmoji = (iconCode) => {
  const iconMap = {
    '01d': '☀️', // clear sky day
    '01n': '🌙', // clear sky night
    '02d': '🌤️', // few clouds day
    '02n': '🌤️', // few clouds night
    '03d': '☁️', // scattered clouds
    '03n': '☁️',
    '04d': '☁️', // broken clouds
    '04n': '☁️',
    '09d': '🌧️', // shower rain
    '09n': '🌧️',
    '10d': '🌧️', // rain
    '10n': '🌧️',
    '11d': '⛈️', // thunderstorm
    '11n': '⛈️',
    '13d': '❄️', // snow
    '13n': '❄️',
    '50d': '🌫️', // mist
    '50n': '🌫️'
  };
  return iconMap[iconCode] || '🌡️';
};

// Format timestamp to day
export const formatDay = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

// Format time
export const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// Celsius to Fahrenheit
export const celsiusToFahrenheit = (celsius) => {
  return Math.round((celsius * 9/5) + 32);
};
