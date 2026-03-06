import Header from "./Header"

const BuildingInfo = () => {
  return (
    <>
      <div className="building-info">
        <div className="building-info-title">
          <h5>{buildingName}</h5>
        </div>
      </div>
    </>
  )
}

// const getBuildingInfo = () => {
//   const building = {
//     name: ,
//     ot: ,
//     ct :,
//   }
// }

const Buildings = () => {
    return (
      <> 
        <Header />
        <div className="page">
          <div className="page-content">
            <div className="page-title">
              <h1>
                All Buildings
              </h1>
            </div>
            <div className="filter">
              {/* can i store recently searched??? */}
              <label>Sort by:</label>
              <select>
                <option value="ascending">Building Name (A-Z)</option>
                <option value="descending">Building Name (Z-A)</option>
                <option value="open">Open Now</option>
              </select>

              <label>Look for:</label>
              <select>
                <option>Faculty</option>
                <option>Facilities</option>
                <option>Weekday/Weekend</option>
              </select>
            </div>
            <div className="building-blocks">

            </div>
          </div>
        </div>

      </>
  )
}

export default Buildings;