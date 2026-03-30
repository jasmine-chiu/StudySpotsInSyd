// import { useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./styles/global.css"
import Shuttle from "./Shuttle"
import Header from "./Header.jsx"

const Dash = () => {
    const navigate = useNavigate();

    return (
        <>
        <Header />
            <div className="page">
                <div className="page-top">
                    <div className="page-title">
                        <h1>
                            Welcome
                            {/* Welcome <!-- to UNSWTimes --> */}
                        </h1>
                    </div>
                    <div className="page-content">
                        <p>
                            insert text here insert text here insert text here insert text here 
                            insert text here insert text here insert text here insert text here 
                            insert text here insert text here insert text here insert text here 
                            insert text here insert text here insert text here insert text here 
                            insert text here insert text here insert text here insert text here 
                            insert text here insert text here insert text here insert text here 
                            {/* <!-- Find out the opening hours for UNSW's buildings and facilities here! --> */}
                        </p>
                        <p>
                            For more resources,
                            [INSERT LINKS]
                        </p>
                        <div className="scroll-to-see">
                            Scroll to explore!
                            &#8595;
                        </div>
                    </div>
                </div>
                <div class="page-bot">
                  <div className="funcs">
                      <div className="block-container">
                          <div className="block">
                              1
                              
                              {/* sydney map */}
                          </div>
                      </div>
                      <div className="block-container">
                          <div className="block">
                              2
                              
                              {/* UNSW MAIN MAP */}
                              
                              {/* have buttons be hover-over images w/ clear bg, w/ slight fade & shift animation --> */}
                          </div>
                      </div>
                      <div className="block-container">
                          <div className="block">
                              3
                              
                              {/* SHUTTLE BUS ------------- (mobile && desktop) */}
                          </div>
                      </div>
                  </div>
                </div>
            </div>
        </>
    )
}

export default Dash