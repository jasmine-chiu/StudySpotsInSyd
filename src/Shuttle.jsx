import Header from "./Header"

const Shuttle = () => {

	return (
			<>
				<Header />
				<div className="page">
					<div className="page-title">
						<h1>
							Shuttle Bus Times
						</h1>
					</div>
					<div className="page-content">
						<div className="next-shuttle-container">
							<h3>
									Next Shuttle Bus
							</h3>
							<div className="shuttle-direction">
								<h5 className="shuttle-direction-title">
									To Paddington Campus (from Kensington):
								</h5>
									<p className="next-shuttle-time">{}</p>
									<ul className="succeeding-shuttles-list">
										<li></li>
										<li></li>
										<li></li>
									</ul>
							</div>
							<div className="next-shuttle-container">
								<h5 classNam="shuttle-direction-title">
										To Kensington Campus (from Paddington):
								</h5>
								<p className="next-shuttle-time">{}</p>
								<ul className="succeeding-shuttles-list">
									<li></li>
									<li></li>
									<li></li>
								</ul>
							</div>
					</div>
						{/* <div className="shuttleview-container">
								<button>Leave at</button>
								<button> Arrive by</button>
						</div> */}
					<div className="timetable-container">
						<div className="subtitle">
							<h3>Shuttle Timetable</h3>
						</div>
						<div className="campus-toggle">
							<button className="campus-toggle-btn">Kensington Campus</button>
							<button className="campus-toggle-btn">Paddington Campus</button>
						</div>
						<div className="timetable">

						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Shuttle