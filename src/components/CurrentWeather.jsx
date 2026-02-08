import { getWeatherEmoji, formatTime, celsiusToFahrenheit } from '../utils/weatherAPI';

function CurrentWeather({ weather, units }) {
  if (!weather) return null;

  const temp = units === 'metric' ? weather.main.temp : weather.main.temp;
  const feelsLike = units === 'metric' ? weather.main.feels_like : weather.main.feels_like;
  const tempUnit = units === 'metric' ? '°C' : '°F';

  return (
    <div className="card">
      <div className="weather">
        <div className="weather-icon">
          {getWeatherEmoji(weather.weather[0].icon)}
        </div>
        <div className="weather-info">
          <h2>{weather.name}</h2>
          <div className="weather-temp">
            {Math.round(temp)}{tempUnit}
          </div>
          <div className="weather-description">
            {weather.weather[0].main} - {weather.weather[0].description}
          </div>
          <div className="weather-details">
            <div className="detail-item">
              <span>Feels Like:</span>
              <span className="glow">{Math.round(feelsLike)}{tempUnit}</span>
            </div>
            <div className="detail-item">
              <span>Humidity:</span>
              <span>{weather.main.humidity}%</span>
            </div>
            <div className="detail-item">
              <span>Pressure:</span>
              <span>{weather.main.pressure} hPa</span>
            </div>
            <div className="detail-item">
              <span>Wind Speed:</span>
              <span>{weather.wind.speed} m/s</span>
            </div>
            <div className="detail-item">
              <span>Visibility:</span>
              <span>{(weather.visibility / 1000).toFixed(1)} km</span>
            </div>
            <div className="detail-item">
              <span>UV Index:</span>
              <span>{Math.round(weather.uv_index || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeather;
