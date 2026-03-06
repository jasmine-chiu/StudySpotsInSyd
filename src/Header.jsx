
import { useNavigate, Link } from "react-router-dom"
import placeholder from "./assets/placeholder.png"

const Header = () => {
    // const navigate = useNavigate();
    return (
        <>
            <header className="nav">
                <div className="nav-bar">
                    <div className="nav-left">
                        <a href="/"><img id="logo" src={placeholder}/></a>
                        <Link className="nav-btn" to="/map">Map</Link>
                        <Link className="nav-btn" to="/buildings">All Buildings</Link>
                        <Link className="nav-btn" to="/shuttle">Shuttle Times</Link>
                    </div>
                    <div className="nav-search">
                        <input className="search-bar" type="text" placeholder="Search for a building"></input>
                        <button className="search-btn"></button>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header