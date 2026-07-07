import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from "../Client";

const Header = ({ isCompact, onChatToggle, isChatOpen, spots }) => {

  const getAssetUrl = (fileName) => {
    const { data } = supabase.storage.from("spots-icons").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const assets = {
    logo: getAssetUrl("logo.png"),
    chat: getAssetUrl("chat.png"),
    chatting: getAssetUrl("chatting.png"),
  };

  const [isNavOpen, setIsNavOpen] = useState(false);
 
  if (isCompact) {
    return (
      <div className="header-compact">
        <button 
          className={`header-toggle ${isNavOpen ? 'open' : ''}`} 
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <img src={assets.logo} className="icon-img" title={isNavOpen ? "close nav bar" : "open nav bar"} />
        </button>

        <button 
          className={`chat-toggle ${isChatOpen ? 'open' : ''}`} 
          onClick={onChatToggle}
        >
          {isChatOpen ? (
            <img src={assets.chatting} className="icon-img" title="close chat" />
          ) : (
            <img src={assets.chat} alt="open chat" className="icon-img" />
          )}
        </button>

        {isNavOpen && (
          <nav className="compact-nav">
            <Link className="nav-btn" to="/map">Map</Link>
            {/* <Link className="nav-btn" to="/">About</Link> */}
          </nav>
        )}
      </div>
    );
  }

	return (
		<>
			<header className="nav">
				<div className="nav-bar">
					<div className="nav-left">
						<a href="/"><img id="logo" src={assets.logo}/></a>
						<Link className="nav-btn" to="/map">Map</Link>
						{/* <Link className="nav-btn" to="/about">About</Link> */}
					</div>
					{/* <div className="search">
						<Search 
                id="nav-bar"
                spots={spots} 
                onSpotSelect={onSpotSelect} 
                onSearchExecuted={() => setSelected(null)}
              />
					</div> */}
				</div>
			</header>
		</>
	)
}

export default Header