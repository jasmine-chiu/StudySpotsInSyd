import { useState, useEffect } from 'react';
// import './icons';

const Overlay = ({selected}) => {

	const iconMap = {
    outlets: {
      true: '/icons/outlets-true.png',
      false: '/icons/outlets-false.png'
    },
    wifi: {
      true: '/icons/wifi-true.png',
      false: '/icons/wifi-false.png'
    },
    toilets: {
      true: '/icons/toilets-true.png',
      false: '/icons/toilets-false.png'
    },
    late: {
      true: '/icons/late-true.png',
      false: '/icons/late-false.png'
    }
  };

	const renderIcon = (feature) => {
		const isAvailable = String(selected[feature]).toLowerCase() === 'true';
		const iconUrl = iconMap[feature][isAvailable];

		return (
			<img 
				src={iconUrl} 
				alt={`${feature} icon`} 
				className="feature-icon" 
				title={`${feature}: ${isAvailable ? 'Available' : 'Unavailable'}`}
				/>
			);
	};


	return (
		<div className="map-overlay-container">
			<h2 className="overlay-name">{selected.name}</h2>
			<p className="overlay-suburb"><i>{selected.suburb}</i></p>
			<hr />
			{/* <ul className="overlay-features">
				<li>outlets: {selected.outlets}</li>
				<li>wifi: {selected.wifi}</li>
				<li>toilets: {selected.toilets}</li>
			</ul> */}
			<div className="overlay-icon-container">
				{renderIcon('outlets')}
				{renderIcon('wifi')}
				{renderIcon('toilets')}
				{renderIcon('late')}
			</div>

		</div>  
	)
}

export default Overlay