import { IoIosArrowRoundForward } from 'react-icons/io';

import outletsTrue from '../../public/icons/outlets-true.png';
import outletsFalse from '../../public/icons/outlets-false.png';
import wifiTrue from '../../public/icons/wifi-true.png';
import wifiFalse from '../../public/icons/wifi-false.png';
import toiletsTrue from '../../public/icons/toilets-true.png';
import toiletsFalse from '../../public/icons/toilets-false.png';
import lateTrue from '../../public/icons/late-true.png';
import lateFalse from '../../public/icons/late-false.png';

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const Overlay = ({ isCompact, selected }) => {
  if (!selected) return null;

  const iconMap = {
    outlets: { true: outletsTrue,  false: outletsFalse },
    wifi:    { true: wifiTrue,     false: wifiFalse    },
    toilets: { true: toiletsTrue,  false: toiletsFalse },
    late:    { true: lateTrue,     false: lateFalse    }
  };

  // open past 8pm
  const isLate = (hours) => {
    if (!hours) return false;
    return Object.values(hours).some(times => {
      const match = times.match(/(\d+):(\d+)\s*(AM|PM)/gi);
      if (!match) return false;
      const last = match[match.length - 1];
      const [time, period] = [last.slice(0, -2).trim(), last.slice(-2)];
      const [h] = time.split(':').map(Number);
      const hour24 = period === 'PM' && h !== 12 ? h + 12 : h;
      return hour24 >= 20;
    });
  };

  const renderIcon = (feature) => {
    let isAvailable;

    if (feature === 'late') {
      isAvailable = isLate(selected.hours);
    } else {
      isAvailable = String(selected[feature]).toLowerCase() === 'true';
    }

    const iconUrl = iconMap[feature]?.[String(isAvailable)];
    if (!iconUrl) return null;

    return (
      <img
        key={feature}
        src={iconUrl}
        alt={`${feature} icon`}
        className="feature-icon"
        title={`${feature}: ${isAvailable ? "Available" : "Unavailable"}`}
      />
    );
  };

  const hours = selected.hours || {};
  const today = DAY_NAMES[new Date().getDay()];
  const todayHours = hours[today] || "Closed";

  const findInMaps = () => {
    const address = selected.name;
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
}

  return (
    <div className="map-overlay-container">
      <h2 className="overlay-name">{selected.name}</h2>
      <p className="overlay-suburb"><i>{selected.suburb}</i></p>
      <hr />

      <div className="overlay-icon-container">
        <div className="overlay-icon-centre">
          {renderIcon('outlets')}
          {renderIcon('wifi')}
          {renderIcon('toilets')}
          {renderIcon('late')}
        </div>
      </div>

      {!isCompact && (
        <div>
          {Object.keys(hours).length > 0 && (
            <div className="overlay-hours">
              <h3 className="overlay-hours-opening">Opening Hours Today:</h3>
              <div className="overlay-hours-row">
                <p>
                  <b className="overlay-hours-left">{today}: </b>
                  <span className="overlay-hours-right">{todayHours}</span>
                </p>
              </div>

            </div>
          )}
        </div>
      )}
       <div className="redirect">
        <button className="redirect-btn" onClick={findInMaps}>Find on Google Maps <IoIosArrowRoundForward className="redirect-arrow"/></button>
      </div>
    </div>
  );
};

export default Overlay;