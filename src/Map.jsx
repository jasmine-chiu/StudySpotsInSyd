import Header from "./Header"
import Use from "./Use";
import Key from "./Key";
import Overlay from "./Overlay";

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { IoIosRefreshCircle } from 'react-icons/io';


import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
	
	// const filteredSpots = studySpots.filter(spot => 
		//   filter === 'All' || data.tags.includes(filter)
		// );
		
	const [selected, setSelected] = useState(null);
	const [activeFilters, setActiveFilters] = useState([]);
	const mapRef = useRef()
  	const mapContainerRef = useRef()
	const selectedRef = useRef(null);

	const loadImage = (map, url) => {
		return new Promise((resolve, reject) => {
			map.loadImage(url, (error, image) => {
				if (error) reject(error);
				else resolve(image);
			});
		});
	};

	useEffect(() => {
		const MB_TOKEN = 'pk.eyJ1IjoianFzbWluYyIsImEiOiJjbW44bGF3MmcwYndvMnJwejI1ejd4NndqIn0.ts5PTb2BHeScF9oA3SSkfQ'
		mapboxgl.accessToken = MB_TOKEN

		// fix , probs increase
		const bounds = [
      		[151.44807325836814, -34.08521058458822], 
        	[150.70621083451968, -33.65097998638358]
    	];
		
		const map = (mapRef.current = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: 'mapbox://styles/mapbox/light-v11', 
			zoom: 10,
			center: [151.14882147065683, -33.8819969622573],
			// maxBounds: bounds
		})); 

		map.on('load', async () => {
			// see if i can remove small ugly buildings
			// map.setLayoutProperty('poi-level', 'visibility', 'none');

			const icons = [
            	{ name: 'cafe-icon', url: '/icons/cafe-icon.png' },
           		{ name: 'cafe-icon-hover', url: '/icons/cafe-icon-hover.png' },
        	];

			try {
				await Promise.all(
					icons.map(async (icon) => {
						const image = await loadImage(map, icon.url);
						map.addImage(icon.name, image);
					})
				);

				map.addSource('data-src', {
					type: 'geojson',
					data: './data/studySpotsCafe.geojson',
					// promoteId does not work — manually add id later?
					generateId: true
				});

				map.addLayer({
					id: 'cafe-layer',
					type: 'symbol',
					source: 'data-src',
					layout: {
						'icon-image': 'cafe-icon',
						'icon-size': 0.14,
						'icon-allow-overlap': true
					}
					
				});

				map.addLayer({
					id: 'cafe-hover-layer',
					type: 'symbol',
					source: 'data-src',
					filter: ['==', ['id'], ''], 
					layout: {
						'icon-image': 'cafe-icon-hover',
						'icon-size': 0.15, 
						'icon-allow-overlap': true
					}
				});

				// INTERACTIONS — must be in onLoad //
				// Clicking on the map will deselect the selected feature
				let justClickedFeature = false;

				map.on('click', 'cafe-layer', (e) => {
					justClickedFeature = true;

					const feature = e.features[0];
					const properties = e.features[0].properties;
					const featureId = feature.id;

					selectedRef.current = featureId;
					map.setFilter('cafe-hover-layer', ['==', ['id'], featureId]);

					if (selectedRef.current) {
						map.setFeatureState(
							{ source: 'data-src', id: selectedRef.current }, 
							{ selected: true }
						);
					}

					setSelected({
						name: properties.name,
						suburb: properties.suburb || 'Sydney, NSW',
						outlets: properties['has-outlets'] || 'Unknown',
						wifi: properties['has-wifi'] || 'Unknown',
						power: properties['has-power'] || 'Unknown',
						toilets: properties['has-toilets'] || 'Unknown'
					});

					map.flyTo({
						center: e.features[0].geometry.coordinates,
						zoom: 14
					});
				});
							
				map.on('mousemove', 'cafe-layer', (e) => {
					if (e.features && e.features.length > 0) {
						const hoveredId = e.features[0].id;

						if (hoveredId !== undefined && hoveredId !== null) {
							map.setFilter('cafe-hover-layer', [
								'any',
								['==', ['id'], hoveredId],
								['==', ['id'], selectedRef.current !== null ? selectedRef.current : '']
							]);
							map.getCanvas().style.cursor = 'pointer';
						}
					}
				});

				map.on('mouseleave', 'cafe-layer', () => {
					const filterId = selectedRef.current !== null ? selectedRef.current : '';
    				map.setFilter('cafe-hover-layer', ['==', ['id'], filterId]);
					map.getCanvas().style.cursor = '';
				});

				map.on('click', () => {
					if (justClickedFeature) {
    		    		justClickedFeature = false;
        				return;
				    }
					if (selectedRef.current !== null) {
						map.setFeatureState(
							{ source: 'data-src', id: selectedRef.current }, 
							{ selected: false }
						);
						selectedRef.current = null;
						setSelected(null);
					}

					map.easeTo({
						zoom: 12
					});
				});
			
			} catch (err) {
        console.error("Error loading icons:", err);
			};
		})

		return () => {
      		map.remove()
    	}
		
  	}, []);

	useEffect(() => {
		const map = mapRef.current;
		if (!map || !map.getLayer('cafe-layer')) return;

		if (activeFilters.length === 0) {
			map.setFilter('cafe-layer', null);
		} else {
			const filterShow = ['all', ...activeFilters.map(f => ['==', ['get', f], "TRUE"])];
			map.setFilter('cafe-layer', filterShow);
		}
	}, [activeFilters]);

		const resetMap = () => {
			if (mapRef.current) {
				mapRef.current.flyTo({
					center: [151.14882147065683, -33.8819969622573],
					zoom: 10,
					essential: true 
				});

				if (mapRef.current.getLayer('cafe-layer')) {
					mapRef.current.setFilter('cafe-layer', null);
				}

				mapRef.current.setFeatureState(
							{ source: 'data-src', id: selectedRef.current }, 
							{ selected: false }
						);
						selectedRef.current = null;
						setSelected(null);
			}
		};

	return (
    <>
			<div className="page">

				<div className="page-top">
					<Header isCompact={true} />
					<Use isCompact={true} />
				</div>
				<div className="page-title">
						<h1>Study Spots in Sydney</h1>
				</div>

				<div className="page-content">
					<div className="map-content">
						<div className="key-content">
							<Key isCompact={false} selected={selected} onFilterChange={setActiveFilters} />
							{/* <div className="map-overlay">		 */}
								{selected && (<Overlay selected={selected}/>)}
						</div>

						<div className='map-container' ref={mapContainerRef}/>
					</div>
					<div className="map-btn-container">
						<div classname="zoom-btn-container">
							<button className="zoom-btn plus-btn">+</button>
							<button className="zoom-btn minus-btn">-</button>
						</div>
						<button className="reset-btn" onClick={resetMap} >
							<IoIosRefreshCircle className="icon-img" title="Refresh Map" color="#9AA7FF" />
						</button>
					</div>

						
				</div>
			</div>
  	</>
	)
}

export default Map