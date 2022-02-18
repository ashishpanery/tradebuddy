import React from 'react'
import "../css/style.css"
import "./Lectures.css"

export default function Events({ eventDetails }) {
    const { lectureList } = eventDetails

    const convertDate = (date) => {
        const newFormat = new Date(date).toDateString().split(" ")
        return [newFormat[2], newFormat[1], newFormat[3]]

    }
    return (
        <>
            <div className="my-4">
                <div className="accordion" id="EventsAccordion">
                    {lectureList.length > 0
                        ?
                        lectureList.map((lecture, index) => {
                            const { lectureTitle, lectureDescription, startDate, startTime, duration } = lecture
                            index++
                            const date = convertDate(startDate)
                            const source = `accordion${index}`
                            const target = `#accordion${index}`
                            const descID = `lecture${index}`
                            return <div className="accordion-item" key={`lecID_${index}`}>
                                <div className="accordion-header">
                                    <div className="accordion-button accordion_lecture py-3" type="button" data-bs-toggle="collapse" data-bs-target={target} aria-expanded="true" aria-controls="collapseOne">
                                        <h3 className="text-white mx-3 mx-md-5 ">Session {index >= 10 ? index : `0${index}`}</h3>
                                        <h3 className=" text-white fw-light mx-3 mx-md-5">{lectureTitle}</h3>
                                    </div>
                                </div>
                                <div id={source} className="accordion-collapse collapse show px-0 px-md-4 px-lg-5" data-bs-parent="#EventsAccordion">
                                    <div className="accordion-body">
                                        <h4 className="text-capitalize fw-bold mt-2">about</h4>
                                        <div id={descID} className="mb-5" style={{ wordWrap: "break-word" }}
                                            dangerouslySetInnerHTML={{
                                                __html: lectureDescription
                                            }}></div>
                                        <div className="my-3 event_schedule">
                                            <div className="d-block d-md-flex flex-wrap ">
                                                <h1 className="text-uppercase custom-w fs-6">Date</h1>
                                                <h1 className="d-none d-lg-flex fs-6 custom-w">:</h1>
                                                <span className="display-6 fw-light fs-6">{date[0]} {date[1]}, {date[2]}</span>
                                            </div>
                                            <div className="d-block d-md-flex flex-wrap my-2">
                                                <h1 className="text-uppercase custom-w fs-6">Time</h1>
                                                <h1 className="d-none d-lg-flex fs-6 custom-w">:</h1>
                                                <span className="display-6 fw-light fs-6">{startTime}</span>
                                            </div>
                                            <div className="d-block d-md-flex flex-wrap">
                                                <h1 className="text-uppercase custom-w fs-6">Duration</h1>
                                                <h1 className="d-none d-lg-flex fs-6 custom-w">:</h1>
                                                <span className="display-6 fs-6">{duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })
                        :
                        <div className="container-fluid d-flex justify-content-start">
                            <h1 className="fs-4 my-4">No lectures available. </h1>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}