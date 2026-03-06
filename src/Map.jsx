import Header from "./Header"

const Map = () => {
	return (
		<>
			<Header />
			<div className="page">
				<div className="page-title">
					<h1>UNSW Buildings Map</h1>
				</div>
				<div className="map-toggle">
					<button className="map-toggle-btn">Kensington Campus</button>
					<button className="map-toggle-btn">Paddington Campus</button>
				</div>
				<div className="map-model">
					insert map
				</div>
			</div>
		</>
	)
}

export default Map