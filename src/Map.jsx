import Header from "./Header"
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';




const Map = () => {
	// const [filter, setFilter] = useState('All');

	// const filteredSpots = studySpots.filter(spot => 
  //   filter === 'All' || data.tags.includes(filter)
	// );


	const mapRef = useRef()
  	const mapContainerRef = useRef()

	useEffect(() => {
		const MB_TOKEN = 'pk.eyJ1IjoianFzbWluYyIsImEiOiJjbW44bGF3MmcwYndvMnJwejI1ejd4NndqIn0.ts5PTb2BHeScF9oA3SSkfQ'
		mapboxgl.accessToken = MB_TOKEN

		const bounds = [
      		[151.44807325836814, -34.08521058458822], 
        	[150.70621083451968, -33.65097998638358]
    	];
		
		mapRef.current = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: 'mapbox://styles/mapbox/light-v10', 
			zoom: 12,
			center: [151.2093, -33.8688],
			maxBounds: bounds
		}); 

		const map = mapRef.current

		map.on('load', () => {
			map.addSource('data-src', {
				'type': 'geojson',
				'data': './data/studySpotsCafe.geojson'
			});

			map.addLayer({
				id: 'spots-layer',
				type: 'circle',
				source: 'data-src',
				paint: {
					'circle-radius': 6,
					'circle-color': '#FF6464',
					'circle-stroke-width': 2,
					'circle-stroke-color': '#ffffff'
				}
			});
		})
			
		return () => {
      		mapRef.current.remove()
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
						<div className="map-content">
							<div className="map-key">
								hello i need to fill this out with a relevant interactive key ;-;
								1. has amenities
								2. nearest spots
								3. keywords?
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