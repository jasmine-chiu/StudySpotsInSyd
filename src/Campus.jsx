import Header from "./Header"

const Campus = () => {
	return (
		<>
			<Header />
			<div className="page">
				<div className="page-content">
					<div className="page-title">
						<h1>UNSW Buildings Map</h1>
					</div>
					<div className="campus-toggle">
						<button className="campus-toggle-btn">Kensington Campus</button>
						<button className="campus-toggle-btn">Paddington Campus</button>
					</div>
					<div className="map-key">
						{/* <button>show open</button> */}
					</div>
					<div className="map-model">
						insert map
					</div>
				</div>
			</div>
		</>
	)
}

export default Campus