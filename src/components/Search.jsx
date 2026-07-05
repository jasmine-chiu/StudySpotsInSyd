import { useState } from 'react';
import { IoMdSearch } from 'react-icons/io';
import 'mapbox-gl/dist/mapbox-gl.css';

const Search = ({ spots, onSpotSelect, onSearchExecuted }) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = query.length > 1
    ? spots.filter(f =>
        f.properties.name?.toLowerCase().includes(query.toLowerCase()) ||
        f.properties.suburb?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  const handleSelect = (spot) => {
    setQuery(spot.properties.name);
    setShowSuggestions(false);
    onSpotSelect(spot); 
    
    if (onSearchExecuted) {
      onSearchExecuted();
    }
  };

  return (
    <div id="key-search" className="search">
      <div className="key-search-container">
        <input
          id="key-bar"
          className="search-bar"
          type="text"
          placeholder="search location ..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        />
        <button className="search-btn">
          <IoMdSearch className="search-icon" />
        </button>
      </div>

      {showSuggestions && query.length > 1 && (
        <ul className="search-suggestions">
            {suggestions.length > 0 ? (
            suggestions.map((spot, i) => (
							<li
                className="suggestion"
                key={i}
                onMouseDown={() => handleSelect(spot)
              }>
							<b>{spot.properties.name}</b>
							<span> — {spot.properties.suburb}</span>
							</li>
            ))
            ) : (
            <li>
                <i className="no-suggestions">no locations found :(</i>
            </li>
            )}
        </ul>
        )}
    </div>
  );
};

export default Search;