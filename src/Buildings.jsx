import Header from "./Header"

const Buildings = () => {
    return (
      <> 
        <Header />
        <div className="page">
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
              <option>???</option>
            </select>
          </div>
        </div>

      </>
  )
}

export default Buildings;