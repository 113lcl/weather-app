import { useState } from 'react';

function SearchBar({ onSearch, onGeolocation }) {
  const [searchInput, setSearchInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      setSearchInput('');
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter city name..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        aria-label="Search city"
      />
      <button type="submit" title="Search for weather">
        🔍 SEARCH
      </button>
      <button 
        type="button"
        onClick={onGeolocation}
        title="Use your current location"
        className="secondary"
      >
        📍 LOCATE
      </button>
    </form>
  );
}

export default SearchBar;
