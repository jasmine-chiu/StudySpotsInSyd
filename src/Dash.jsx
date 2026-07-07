import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import "./styles/global.css"
import Header from "./layout/Header.jsx"
import logo from './assets/logo.png';

// import { loadData } from "./Helper.jsx"

const Dash = () => {
	const [spots, setSpots] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
    	setIsLoading(false);
  	}, []);

	const goToPage = () => {
		navigate("/map")
	}

	return (
		<>
			<div className="page">
				<div className={`loading-overlay ${!isLoading ? 'hidden' : ''}`}>
				<div className="loading-spinner" />
				<img
					className="loading-img"
					src={logo}
					alt="Loading"
				/>
				<p><i>loading study spots...</i></p>
				</div>
			<div className="page-top">
				<Header 
					spots={spots}
				/>
			</div>
				<div className="page-title">
						<h1 className="page-heading" id="dash-heading">
								welcome to STUDY IN SYD.
						</h1>
				</div>		
				<div className="page-content">
						<div className="dash-page-txt">
							<p><i>use this site to find your next spot to study at.</i></p>
							<p><i>with an expansive range of cafés and libraries across sydney, find out what's open near you!</i></p>
						</div>
						<div className="dash-click">
							<button className="dash-btn" onClick={goToPage}>FIND YOUR SPOT&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;➤</button>
						</div>
			</div>
		</div>
		</>
	)
}

export default Dash