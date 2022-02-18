import './UpcomingEventCard.css'
import { useHistory } from 'react-router-dom'
// import background from '../../images/event card background.png'
import avatar from '../../images/avatar.png'


function UpcomingEventCard({ eventDetails, single_col = false, maxWidth = false }) {
    const history = useHistory()

    if (eventDetails)
        return (
            <div
                className={
                    `px-2 px-lg-3 my-3 cursor-pointer  h-100  
                    ${maxWidth && "eventContainer"}
            ${single_col === true ? 'col-lg-12' : 'col-lg-6'} 
            ${eventDetails.status === "EXPIRED" ? 'event_disabled' : null}  mb-3 `}
                onClick={() => history.push(`/events/${eventDetails.id}/${eventDetails.eventTitle.split(" ").join("-")}`)}
            >
                <div className='custom_box_shadow rounded_border h-100 d-flex flex-column ' >
                    <div className='upComingEventCardTop ' >
                        <img loading='lazy' src={eventDetails.photoUrl} alt='' />
                        {/* MENTOR PROFILE PIC */}
                        <div className='col-12 col-lg-6 position-relative '>
                            <img loading='lazy' className='upcomingEventProfilePic ' src={eventDetails.mentorListObject ? eventDetails.mentorListObject.photoUrl : avatar} alt='' />
                        </div>
                    </div>
                    <div className='upComingEventContainer  row container  mx-auto  flexible w-100 py-2' style={{ marginTop: "-1em", minHeight: "191px" }}>
                        <div className='col-12 col-md-4 mt-5 mt-md-auto pt-3 upComingEventContainerLeft d-flex flex-column  align-items-center '>
                            {/* MENTOR NAME, DESIGNATION, COMPANY */}
                            {
                                eventDetails.mentorListObject &&
                                <div className='upComingEventContainerLeftBottom gap-2'>
                                    <button>
                                        <a style={{ textDecoration: "none", color: 'white' }}
                                            href={`/profile/${eventDetails.mentorListObject.id}/${eventDetails.mentorListObject.name.split(" ").join("-")}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >{eventDetails.mentorListObject.name}</a>
                                    </button>
                                    <div className=''>
                                        <p>{eventDetails.mentorListObject.designation}</p>
                                    </div>
                                    <div className=''>
                                        <p className='text-dark fw-bold'>{eventDetails.mentorListObject.currentCompany}</p>
                                    </div>
                                </div>}
                        </div>
                        <div className='col-12 col-md-8  ps-md-5 d-flex flex-column  h-100 '>
                            {/* EVENT TITLE */}
                            <div className='upComingEventContainerRightEventName flexible'>
                                <h1 className="eventTitle my-0">{eventDetails.eventTitle}</h1>
                            </div>
                            {/* OTHER BODY CONTENT */}
                            <div className='upComingEvetContainerRightDetailsContainer '>
                                <div className='upComingEventContainerRightDetails'>
                                    <div className='upComingEventContainerRightDetailsList '>
                                        <div className='upComingEventContainerRightDetailsListLeft'>
                                            <p className="eventTimingHeaders">DATE</p>
                                        </div>
                                        <div className='upComingEventContainerRightDetailsListCenter'>
                                            <p>:</p>
                                        </div>
                                        <div className='upComingEventContainerRightDetailsListRight'>
                                            <p>{eventDetails.startDate}</p>
                                        </div>
                                    </div>
                                    <div className='upComingEventContainerRightDetailsList'>
                                        <div className='upComingEventContainerRightDetailsListLeft'>
                                            <p className="eventTimingHeaders">TIME</p>
                                        </div>
                                        <div className='upComingEventContainerRightDetailsListCenter'>
                                            <p>:</p>
                                        </div>
                                        <div className='upComingEventContainerRightDetailsListRight'>
                                            <p>{eventDetails.startTime}</p>
                                        </div>
                                    </div>
                                    <div className='upComingEventContainerRightDetailsList'>
                                        <div className='upComingEventContainerRightDetailsListLeft'>
                                            <p className="eventTimingHeaders">DURATION</p>
                                        </div>
                                        <div className='upComingEventContainerRightDetailsListCenter'>
                                            <p>:</p>
                                        </div>
                                        <div className='upComingEventContainerRightDetailsListRight'>
                                            <p>{eventDetails.duration}</p>
                                        </div>
                                    </div>
                                    <div className='upComingEventContainerRightDetailsList'>
                                        <div className='upComingEventContainerRightDetailsListLeft'>
                                            <p className="eventTimingHeaders">STATUS</p>
                                        </div>
                                        <div className='upComingEventContainerRightDetailsListCenter'>
                                            <p>:</p>
                                        </div>
                                        <div className='upComingEventContainerRightDetailsListRight'>
                                            {
                                                eventDetails.status === 'EXPIRED' ?
                                                    <p className="text-danger">Closed</p>
                                                    :
                                                    <p>Registration Open</p>

                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    return <p>Problem loading this event</p>
}

export default UpcomingEventCard
