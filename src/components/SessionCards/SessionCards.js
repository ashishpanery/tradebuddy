export default function SessionCards({ item, setDetails, details, joinCall }) {
    return (
        <div className="card custom-border-radius custom-height cards_container">
            <div className="d-flex align-items-center justify-content-lg-center p-3 p-xl-3 p-lg-1 bg-stat custom-border-radius">
                <img id="custom-card-img" src={item.mentee.photoUrl} alt="..." />
                <div className="mx-3 ">
                    <p className="text-live my-1 fw-bold fs-6">LIVE</p>
                    <a target="_blank" rel="noreferrer" href={`/profile/${item.mentee.id}`} className="my-2 text-black fs-7 cursor-pointer" style={{ textDecoration: "none" }}>{item.mentee.name}</a>
                </div>
            </div>
            <div className="card-body p-4 boxShadow">
                <div className="d-flex  my-1">
                    <h1 className="card-text text-capitalize fs-8">Rate</h1>
                    <h1 className="card-text d-none d-lg-flex fs-8">:</h1>
                    <p className="ss card-text  fw-600 margin-auto fs-8">{`Rs. ${item.mentor.callRatePerMin}/min`}</p>
                </div>
                <div className="d-flex mb-2">
                    <h1 className="card-text text-capitalize fs-8" >Session ID</h1>
                    <h1 className=" card-text d-none d-lg-inline fs-8 ">:</h1>
                    <p className=" ms-auto w-50 ss card-text fs-8">{`${item.id}`}</p>
                </div>
                <div className="d-flex">
                    <h1 className="card-text text-capitalize fs-8 ">Order Amount</h1>
                    <h1 className="card-text d-none d-lg-flex fs-8">:</h1>
                    <p className="ss card-text display-6  margin-auto fs-8">{`${item.currency} ${item.sessionAmout}`}</p>
                </div>
                <div className="d-flex">
                    <h1 className="card-text text-capitalize fs-8">Order Status</h1>
                    <h1 className="card-text d-none d-lg-flex fs-8">:</h1>
                    <p className="ss card-text display-6 fw-600 margin-auto fs-8">{`${item.status}`}</p>
                </div>
                {item.status === 'STARTED' ? <div className="mt-3 d-flex justify-content-center"><button onClick={() => joinCall(item.id)} className="bg-ss text-white fw-bold px-5 py-2 card-btn">Join</button></div> : null}
                {item.status === 'ACCEPTED' ?
                    <div className="mt-3 d-flex flex-wrap justify-content-center">
                        <button onClick={() => {
                            setDetails(item)

                        }} className="bg-ss text-white my-1 w-75 fw-bold px-3 py-2" data-bs-toggle="modal" data-bs-target="#reScheduleSessionModal">Reschedule</button>
                        <button className="bg-ss text-white w-75 fw-bold px-3 py-2" data-bs-toggle="modal" data-bs-target="#cancelSessionModal">Cancel</button>
                    </div>
                    : null}
            </div>
        </div>
    )
}
