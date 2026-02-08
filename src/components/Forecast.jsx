import { getWeatherEmoji, formatDay } from '../utils/weatherAPI';

function Forecast({ forecast, units }) {
  if (!forecast || !forecast.list) return null;

  // Get unique days (one forecast per day at 12:00)
  const dailyForecasts = {};
  forecast.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dateStr = date.toLocaleDateString();
    
    if (!dailyForecasts[dateStr] || date.getHours() === 12) {
      dailyForecasts[dateStr] = item;
    }
  });

  const uniqueDays = Object.entries(dailyForecasts)
    .slice(0, 5)
    .map(([_, data]) => data);

  const tempUnit = units === 'metric' ? '°C' : '°F';

  return (
    <div className="forecast">
      <h3>📅 5-DAY FORECAST</h3>
      <div className="forecast-grid">
        {uniqueDays.map((day, index) => (
          <div key={index} className="forecast-card">
            <div className="forecast-day">
              {formatDay(day.dt)}
            </div>
            <div className="forecast-icon">
              {getWeatherEmoji(day.weather[0].icon)}
            </div>
            <div className="forecast-temp">
              {Math.round(day.main.temp)}{tempUnit}
            </div>
            <div className="forecast-temp-range">
              H: {Math.round(day.main.temp_max)}{tempUnit}
              <br />
              L: {Math.round(day.main.temp_min)}{tempUnit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;
