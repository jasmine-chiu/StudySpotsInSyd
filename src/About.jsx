import { useState } from "react";

import Header from "./Header";
import Chat from "./Chat";

const About = () => {
	
	const [isChatOpen, setIsChatOpen] = useState(false);

	return (
		<>
		<Header 
			isCompact={false}    
			onChatToggle={() => setIsChatOpen(!isChatOpen)}
			isChatOpen={isChatOpen}
		/>
		<div className="page">
			<div className="page-heading" id="about-heading">
				<h1>
					ABOUT this website...
				</h1>
			</div>
			<div className="page-content">
				(to be added)
			</div>
		</div>
		</>
	)
}

export default About;