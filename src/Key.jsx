import { useState } from 'react';
import { IoIosArrowUp, IoIosArrowDown, IoMdSearch } from 'react-icons/io';

const Key = ({isCompact, selected, onFilterChange}) => {
	const [isOpen, setIsOpen] = useState(!isCompact);
	const [activeFilters, setActiveFilters] = useState([]);

	const filterOptions = [
    { label: 'Wi-Fi Available', value: 'has-wifi' },
    { label: 'Power Outlets Available', value: 'has-outlets' },
		{ label: 'Toilets Nearby', value: 'has-toilets' },
    // { label: 'Quiet Zone', value: 'is-quiet' },
    // { label: 'Open Late', value: 'open-late' }
  ];

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
    if (onFilterChange) onFilterChange(allValues);
  };

  const clearAll = () => {
    setActiveFilters([]);
    if (onFilterChange) onFilterChange([]);
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
								<input id="key-bar" className="search-bar" type="text" placeholder="Search location ..." />
								<button className="search-btn"><IoMdSearch className="search-icon" /></button>
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

							{/* <ul>
								<li>nearest (10) spots</li>
								<li>search by name/notes</li>
							</ul>
							<p>filter:</p>
							<ul>
								<li>by amenities</li>
								<li>by opening hours</li>
								<li>by type</li>
							</ul> */}
						</div>
					)}
				</div>
		</div>
		</>

  )

}

export default Key;