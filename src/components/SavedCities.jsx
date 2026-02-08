function SavedCities({ cities, onCitySelect, onCityRemove }) {
  if (!cities || cities.length === 0) return null;

  return (
    <div className="saved-cities">
      <h3>⭐ SAVED CITIES</h3>
      <div className="cities-grid">
        {cities.map((city) => (
          <div key={city} style={{ position: 'relative' }}>
            <button 
              className="city-btn"
              onClick={() => onCitySelect(city)}
              title={`Load weather for ${city}`}
            >
              {city}
              <span 
                className="remove"
                onClick={(e) => {
                  e.stopPropagation();
                  onCityRemove(city);
                }}
                title={`Remove ${city}`}
              >
                ✕
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedCities;
