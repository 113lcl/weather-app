import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Settings from './components/Settings';
import SavedCities from './components/SavedCities';
import { weatherAPI } from './utils/weatherAPI';
import './index.css';

function App() {
  const [city, setCity] = useState('New York');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [units, setUnits] = useState('metric'); // metric or imperial
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [savedCities, setSavedCities] = useState([]);

  // Load saved settings and cities from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('weatherAppSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setUnits(settings.units || 'metric');
      setIsDarkMode(settings.isDarkMode !== false);
    }

    const saved_cities = localStorage.getItem('weatherAppCities');
    if (saved_cities) {
      setSavedCities(JSON.parse(saved_cities));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('weatherAppSettings', JSON.stringify({
      units,
      isDarkMode
    }));
  }, [units, isDarkMode]);

  // Update theme
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  // Fetch weather
  const fetchWeather = async (cityName, unitsToUse = units) => {
    setLoading(true);
    setError('');
    try {
      const weatherData = await weatherAPI.getCurrentWeather(cityName, unitsToUse);
      const forecastData = await weatherAPI.getForecast(cityName, unitsToUse);
      
      setWeather(weatherData);
      setForecast(forecastData);
      setCity(weatherData.name);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather on component mount
  useEffect(() => {
    fetchWeather(city);
  }, []);

  // Handle search
  const handleSearch = (searchCity) => {
    if (searchCity.trim()) {
      fetchWeather(searchCity.trim());
    }
  };

  // Handle unit change
  const handleUnitChange = (newUnits) => {
    setUnits(newUnits);
    if (weather) {
      fetchWeather(city, newUnits);
    }
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Handle geolocation
  const handleGeolocation = () => {
    setLoading(true);
    setError('');
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weatherData = await weatherAPI.getWeatherByCoords(latitude, longitude, units);
          const forecastData = await weatherAPI.getForecastByCoords(latitude, longitude, units);
          
          setWeather(weatherData);
          setForecast(forecastData);
          setCity(weatherData.name);
        } catch (err) {
          console.error('Geolocation error:', err);
          setError(err.message || 'Failed to fetch weather for your location');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation permission error:', error);
        setError('Unable to access your geolocation. Please allow location access.');
        setLoading(false);
      }
    );
  };

  // Add city to saved list
  const handleSaveCity = () => {
    if (city && !savedCities.includes(city)) {
      const newCities = [...savedCities, city];
      setSavedCities(newCities);
      localStorage.setItem('weatherAppCities', JSON.stringify(newCities));
    }
  };

  // Remove city from saved list
  const handleRemoveCity = (cityName) => {
    const newCities = savedCities.filter(c => c !== cityName);
    setSavedCities(newCities);
    localStorage.setItem('weatherAppCities', JSON.stringify(newCities));
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Weather</h1>
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Check weather in any city worldwide</p>
      </div>

      <div className="container">
        <SearchBar 
          onSearch={handleSearch}
          onGeolocation={handleGeolocation}
        />

        <Settings
          units={units}
          isDarkMode={isDarkMode}
          onUnitChange={handleUnitChange}
          onThemeToggle={handleThemeToggle}
          onSaveCity={handleSaveCity}
          cityName={city}
        />

        {error && <div className="error">❌ {error}</div>}

        {loading && <div className="card loading">Loading weather...</div>}

        {weather && !loading && (
          <>
            <CurrentWeather weather={weather} units={units} />
            {forecast && <Forecast forecast={forecast} units={units} />}
          </>
        )}

        {savedCities.length > 0 && (
          <SavedCities 
            cities={savedCities}
            onCitySelect={handleSearch}
            onCityRemove={handleRemoveCity}
          />
        )}
      </div>
    </div>
  );
}

export default App;
