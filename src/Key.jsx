import { useEffect, useState } from 'react';
import { IoIosArrowUp, IoIosArrowDown, IoMdSearch } from 'react-icons/io';

const Key = ({boxOpen, setBoxOpen, onFilterChange, onCategoryChange, onClearSelection, spots, onSpotSelect, resetKey }) => {
	const [activeFilters, setActiveFilters] = useState([]);
	const [query, setQuery] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);

	const filterOptions = [
    { label: 'wi-fi available', value: 'has-wifi' },
    { label: 'power outlets', value: 'has-outlets' },
		{ label: 'toilets nearby', value: 'has-toilets' },
		// { label: "Open Now", value: {checkOpen}}
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
  	onSpotSelect(spot); 
		resetKey(k => k + 1);
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

		if (onCategoryChange) {
      onCategoryChange("all");
    }

		if (onClearSelection) {
      onClearSelection(null); 
    }

		const dropdown = document.querySelector('.filter-dropdown');
    if (dropdown) dropdown.value = "all";
  };

	useEffect(() => {
		if (resetKey === 0) {
			return;
		}
		setQuery("");
		setShowSuggestions(false);
		setActiveFilters([]);

		const dropdown = document.querySelector('.filter-dropdown');
    if (dropdown) dropdown.value = "all";
  }, [resetKey]);

	return (
		<>
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

		<div className="key-container">
				<div className={`key-wrapper ${boxOpen ? true : false}`}>
					<div className="key-compact">
						<div className="key-top">
							<button className="key-toggle" onClick={() => setBoxOpen(!boxOpen)}>
							{boxOpen ? (
								<IoIosArrowUp className="icon-img" title="Close Key" />
							) : (
								<IoIosArrowDown className="icon-img" title="Open Key" />
							)}
						</button>
						</div>
        		<h2 className="key-title">FILTER</h2>
					</div>

					{boxOpen && (
						<div>	
							<div className="key-scrollable">
								<div className="filter-container">
									<ul className="filter-list">
										<select 
											className="filter-dropdown" 
											id="type"
											defaultValue="all"
											onChange={(e) => onCategoryChange(e.target.value)}
										>
											<option value="all">ALL</option>
											<option value="café">CAFÉS</option>
											<option value="library">LIBRARIES</option>
											<option value="misc">OTHER</option>
										</select>
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
										<button className="select-btn" onClick={selectAll}>select all</button>
										<button className="select-btn" onClick={clearAll}>reset selection</button>
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