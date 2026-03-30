import Header from "./Header"
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';


const Map = () => {
	const mapRef = useRef()
  	const mapContainerRef = useRef()

	useEffect(() => {
		const MB_TOKEN = "pk.eyJ1IjoianFzbWluYyIsImEiOiJjbW44bGF3MmcwYndvMnJwejI1ejd4NndqIn0.ts5PTb2BHeScF9oA3SSkfQ"
		mapboxgl.accessToken = MB_TOKEN
		
		mapRef.current = new mapboxgl.Map({
			 container: mapContainerRef.current,
			 style: 'mapbox://styles/mapbox/light-v10', 
			 zoom: 11,
			 center: [151.2093, -33.8688]
		}); 
	  	
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
							<h1>Map of Spots in Sydney</h1>
						</div>
					</div>
					<div className="page-content">
						<div className="map-content">
							<div className="map-key">
								hello i need to fill this out with a relevant interactive key ;-;
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