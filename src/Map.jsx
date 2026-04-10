import Header from "./Header"
import Use from "./Use";
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
	
	// const filteredSpots = studySpots.filter(spot => 
		//   filter === 'All' || data.tags.includes(filter)
		// );
		
	const [selected, setSelected] = useState(null);
	// const [filter, setFilter] = useState('All');
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
						'icon-size': 0.1,
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
						'icon-size': 0.11, 
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
						wifi: properties['has-wifi'] || 'Unknown',
						power: properties['has-power'] || 'Unknown',
						toilets: properties['has-toilets'] || 'Unknown'
					});

					map.easeTo({
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
    		    		justClickedFeature = false;  // ← consume the flag, don't deselect
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
				});
			
			} catch (err) {
            	console.error("Error loading icons:", err);
			};
		})

		

		return () => {
      		map.remove()
    	}
		
  	}, []);

	return (
    <>
			<Header isCompact={true} />
				<div className="page">
					<div className="page-top">
						<div className="page-title">
							<h1>Study Spots in Sydney</h1>
						</div>
					</div>
					<div className="page-content">
						<Use isCompact={true} />
						<div className="map-content">
							<div className="key-content">
								<div className="map-key">
									hello i need to fill this out with a relevant interactive key ;-;
									1. has amenities
									2. nearest spots
									3. keywords?
								</div>
								<div className="map-overlay">		
									{selected && (<div className="map-overlay-container">
										<code>{selected.name}</code>
										<hr />
										{Object.entries(selected).map(([key, value]) => (
											<li key={key}>
												<b>{key}</b>: {value.toString()}
											</li>
										))}
									</div>
									)}
								</div>
							</div>
							<div className='map-container' ref={mapContainerRef}/>
						</div>
					</div>
				</div>
    	</>
  	)

	/* // return (
	// 	<>
	// 		<Header />
	// 		<div className="page">
	// 			<div className="page-content">
	// 				<div className="page-title">
	// 					<h1>Map of Spots in Sydney</h1>
	// 				</div>
	// 				<div className="map-key">
	// 					{/* <button>show open</button> */
	// 				</div>
	// 				<div className="map-container" ref={mapContainer}>
						
	// 				</div>
	// 			</div>
	// 		</div>
	// 	</>
	// ) */}
}

export default Map