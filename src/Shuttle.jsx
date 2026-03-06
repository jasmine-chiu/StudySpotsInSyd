import Header from "./Header"

const Shuttle = () => {

    return (
        <>
            <Header />
            <div className="page">
                <div className="page-title">
                    <h1>
                        Shuttle Bus Times
                    </h1>
                </div>
                <div>
                    <div className="next-shuttle-container">
                        <h3>
                            Next Shuttle Bus:
                        </h3>
                        <p className="shuttle-direction">
                            {/* should it be main/a&d or paddington/kensington */}
                            To Arts & Design Campus (from Main Campus):
                        </p>
                        <p className="shuttle-time">{}</p>
                    </div>
                    <div className="next-shuttle-container">
                        <p classNam="shuttle-direction">
                            To Main Campus (from Arts & Design Campus):
                        </p>
                        <p className="shuttle-time">{}</p>
                    </div>
                    <div className="timetable-container">
                        <div className="subtitle">
                            <h3>Shuttle Timetable</h3>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Shuttle