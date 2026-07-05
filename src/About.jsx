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
		</div>
		</>
	)
}

export default About;