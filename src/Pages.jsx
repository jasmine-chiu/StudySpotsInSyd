import {
  Routes,
  Route, 
} from "react-router-dom"

import Dash from "./Dash"
import Map from "./Map"
// import About from "./About"
// import Header from "./Header"

export const url = "http://localhost:5173";

const Pages = () => {
    return (
        <>
            <Routes>
                <Route path="/map" element={<Map />} />
                <Route path="/" element={<Dash />} />
                {/* <Route path="/about" element={<About />} /> */}
            </Routes> 
        </>
    );
}

export default Pages;
