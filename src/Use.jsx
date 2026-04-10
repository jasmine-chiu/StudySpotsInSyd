import { useState } from 'react';
import placeholder from "./assets/placeholder.png"
import { IoIosCloseCircle } from "react-icons/io";

const Use = ({ isCompact = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (isCompact) {
    return (
      <div className="use-compact">
        <button className="use-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <IoIosCloseCircle className="icon-img" title="Close" />
          ) : (
            <img src={placeholder} alt="Open" className="icon-img" />
          )}
        </button>
        
        {isOpen && (
          <div className="use-container">
            <p>Mobile: </p>
            <p>Mouse: </p>
            <p>Trackpad:</p>
          </div>
        )}
      </div>
    );
  }
  
  return (
      <>
          <div className="instruction-container">
          </div>
      </>
  )
}

export default Use;