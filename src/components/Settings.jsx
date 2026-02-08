import { useState } from 'react';

function Settings({ units, isDarkMode, onUnitChange, onThemeToggle, onSaveCity, cityName }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <button 
        className="settings-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        title="Settings menu"
      >
        ⚙️ MENU
      </button>
      
      <div className={`settings ${isMenuOpen ? 'open' : ''}`}>
        <button 
          onClick={() => onUnitChange('metric')}
          className={units === 'metric' ? 'active' : ''}
          title="Celsius"
        >
          °C CELSIUS
        </button>
        <button 
          onClick={() => onUnitChange('imperial')}
          className={units === 'imperial' ? 'active' : ''}
          title="Fahrenheit"
        >
          °F FAHRENHEIT
        </button>
        <button 
          onClick={onThemeToggle}
          className={isDarkMode ? 'active' : ''}
          title="Toggle theme"
        >
          {isDarkMode ? '🌙 DARK' : '☀️ LIGHT'}
        </button>
        <button 
          onClick={onSaveCity}
          title="Save current city"
          className="secondary"
        >
          💾 SAVE {cityName.toUpperCase()}
        </button>
      </div>
    </>
  );
}

export default Settings;
