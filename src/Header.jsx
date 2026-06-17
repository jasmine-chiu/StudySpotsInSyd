import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdSearch  } from 'react-icons/io';
import placeholder from "./assets/placeholder.png"
import logo from "./assets/logo.png"
import chat from "./assets/chat.png"
import chatting from "./assets/chatting.png"

const Header = ({ isCompact, onChatToggle, isChatOpen }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  if (isCompact) {
    return (
      <div className="header-compact">
        <button 
          className={`header-toggle ${isNavOpen ? 'open' : ''}`} 
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <img src={logo} className="icon-img" title={isNavOpen ? "close nav bar" : "open nav bar"} />
        </button>

        <button 
          className={`chat-toggle ${isChatOpen ? 'open' : ''}`} 
          onClick={onChatToggle}
        >
          {isChatOpen ? (
            <img src={chatting} className="icon-img" title="close chat" />
          ) : (
            <img src={chat} alt="open chat" className="icon-img" />
          )}
        </button>

        {isNavOpen && (
          <nav className="compact-nav">
            <Link className="nav-btn" to="/about">About</Link>
            <Link className="nav-btn" to="/map">Map</Link>
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
						<a href="/"><img id="logo" src={logo}/></a>
						<Link className="nav-btn" to="/map">Map</Link>
						<Link className="nav-btn" to="/about">About</Link>
					</div>
					<div className="search">
						<input id="nav-bar" className="search-bar" type="text" placeholder="search for a spot ..." />
						<button className="search-btn"><IoMdSearch className="search-icon" /></button>
					</div>
				</div>
			</header>
		</>
	)
}

export default Header