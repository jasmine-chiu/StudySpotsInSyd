import Header from "./Header"

const Shuttle = () => {

    return (
        <>
            <Header />
            <div className="page">
                <div>
                    Next available shuttle:
                </div>
                <div>
                    <div className="next-shuttle-container">
                        <p className="shuttle-direction">
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
                </div>
            </div>
        </>
    )
}

export default Shuttle