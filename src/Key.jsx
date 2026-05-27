import { useState } from 'react';
import { IoIosArrowUp, IoIosArrowDown, IoMdSearch } from 'react-icons/io';

const Key = ({isCompact, onFilterChange, spots, onSpotSelect }) => {
	const [isOpen, setIsOpen] = useState(!isCompact);
	const [activeFilters, setActiveFilters] = useState([]);
	const [query, setQuery] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);

	const filterOptions = [
    { label: 'Wi-Fi Available', value: 'has-wifi' },
    { label: 'Power Outlets', value: 'has-outlets' },
		{ label: 'Toilets Nearby', value: 'has-toilets' },
    // { label: 'Open Late', value: 'open-late' }
	];

	const suggestions = query.length > 1
  ? spots.filter(f =>
      f.properties.name?.toLowerCase().includes(query.toLowerCase()) ||
      f.properties.suburb?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8)
  : [];

  const handleSelect = (spot) => {
    setQuery(spot.properties.name);
    setShowSuggestions(false);
    onSpotSelect(spot.geometry.coordinates);
  };

	const toggleFilter = (val) => {
    const newFilters = activeFilters.includes(val)
    	? activeFilters.filter(f => f !== val)
    	: [...activeFilters, val];            

    	setActiveFilters(newFilters);
    
			if (onFilterChange) {
				onFilterChange(newFilters);
			}
  	};

	const selectAll = () => {
    const allValues = filterOptions.map(opt => opt.value);
  	setActiveFilters(allValues);
    if (onFilterChange) {
			onFilterChange(allValues);
		} 
  };

  const clearAll = () => {
    setActiveFilters([]);
    if (onFilterChange) {
			onFilterChange([]);
		} 
  };

	return (
		<>
		<div className="key-container">
				<div className={`key-wrapper ${isOpen ? true : false}`}>
					<div className="key-compact">
						<div className="key-top">
							<button className="key-toggle" onClick={() => setIsOpen(!isOpen)}>
							{isOpen ? (
								<IoIosArrowUp className="icon-img" title="Close Key" />
							) : (
								<IoIosArrowDown className="icon-img" title="Open Key" />
							)}
						</button>
						</div>
        		<h2 className="key-title">KEY</h2>
					</div>

					{isOpen && (
						<div>
							<div id="key-search" className="search">
								<div className="key-search-container">
									<input
										id="key-bar"
										className="search-bar"
										type="text"
										placeholder="Search location ..."
										value={query}
										onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
										onFocus={() => setShowSuggestions(true)}
										onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
									/>
									<button className="search-btn"><IoMdSearch className="search-icon" /></button>
								</div>
								{showSuggestions && suggestions.length > 0 && (
                	<ul className="search-suggestions">
										{suggestions.map((spot, i) => (
											<li className="suggestion" key={i} onMouseDown={() => handleSelect(spot)}>
												<b>{spot.properties.name}</b>
												<span> — {spot.properties.suburb}</span>
											</li>
										))}
                	</ul>
              	)}
							</div>

							<div className="key-scrollable">
								<div className="filter-container">
									<label className="filter-label"><b>Filter:</b></label>
									<ul className="filter-list">
										{filterOptions.map((opt) => (
											<li key={opt.value}>
												<label className="filter-list-opt">
													<input
														type="checkbox"
														checked={activeFilters.includes(opt.value)}
														onChange={() => toggleFilter(opt.value)}
													/>
													{opt.label}
												</label>
											</li>
										))}
									</ul>
									<div className="filter-btn-container">
										<button className="select-btn" onClick={selectAll}>Select all</button>
										<button className="select-btn" onClick={clearAll}>Clear selection</button>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
		</div>
		</>
  )
}

export default Key;