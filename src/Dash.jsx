import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import "./styles/global.css"
import Header from "./Header.jsx"

import { loadData } from "./Helper.jsx"



const Dash = () => {
	const [spots, setSpots] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		loadData(setSpots); 
	}, []);

	const goToPage = () => {
		navigate("/map")
	}

	return (
		<>
		<div className="page">
			<div className="page-top">
				<Header 
					spots={spots}
				/>
			</div>
				<div className="page-title">
						<h1 className="page-heading">
								welcome to STUDY IN SYD.
						</h1>
				</div>		
				<div className="page-content">
						<div className="page-txt">
							<p>use this site to find your next spot to study at.</p>
							<p>with an expansive range of cafés and libraries across sydney, find out what's open near you!</p>
						</div>
						<div className="click-to-see">
							<button onClick={goToPage}>GO TO MAP</button>
						</div>
			</div>
		</div>
		</>
	)
}

export default Dash