import { useState } from 'react';
import { Link } from 'react-router-dom';
import placeholder from "./assets/placeholder.png"
import { IoIosCloseCircle, IoMdSearch } from "react-icons/io";

const Header = ({ isCompact = false }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (isCompact) {
    return (
      <div className="header-compact">
        <button className="header-toggle" onClick={() => setIsOpen(!isOpen)}>
         {isOpen ? (
            <IoIosCloseCircle className="icon-img" title="Close Nav Bar" />
          ) : (
            <img src={placeholder} alt="Open Nav Bar" className="icon-img" />
          )}
        </button>
        
        {isOpen && (
          <nav className="compact-nav">
            <Link className="nav-btn" to="/">Home</Link>
            <Link className="nav-btn" to="/map">Map</Link>
            <Link className="nav-btn" to="/buildings">UNSW</Link>
          </nav>
        )}
      </div>
    );
  }
    // const navigate = useNavigate();
	return (
		<>
			<header className="nav">
				<div className="nav-bar">
					<div className="nav-left">
						<a href="/"><img id="logo" src={placeholder}/></a>
						<Link className="nav-btn" to="/map">Map</Link>
						<Link className="nav-btn" to="/buildings">UNSW Buildings</Link>
					</div>
					<div className="search">
						<input id="nav-bar" className="search-bar" type="text" placeholder="Search for a spot" />
						<button className="search-btn"><IoMdSearch className="search-icon" /></button>
					</div>
				</div>
			</header>
		</>
	)
}

export default Header