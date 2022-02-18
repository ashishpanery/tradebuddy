import React from 'react'
import ReactQuill from 'react-quill';
import "./RenderExistingLectures.css"

export default function RenderExistingLectures({ lectureObject, index, deleteLecture, Quill_Modules, Quill_Formats, updateLectureObjects, paymentTypeStatus }) {
    const lecID = `lecture${index}`
    const id1 = `lectureTitle${index}`
    const id2 = `lectureDescription${index}`
    const id3 = `startDate${index}`
    const id4 = `startTime${index}`
    const id5 = `duration${index}`
    return (

        <div className="accordion lecture-accordion my-2" id={`existingLectureAccordion${index}`} key={lecID}>
            <div className="accordion-item">
                <div className="accordion-header position-relative" id="headingOne">
                    <div>
                        <div className="cursor-pointer btn delete-btn py-2 position-absolute" data-bs-toggle="modal" data-bs-target={`#lecture${index}`}>
                            Delete
                        </div>
                        <div className="modal fade" id={`lecture${index}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Deleting {lectureObject.lectureTitle}</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        Are you sure you want to delete this lecture?
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" onClick={() => deleteLecture(lectureObject.id)} className="btn btn-secondary py-2 px-3" data-bs-dismiss="modal">Yes</button>
                                        <button type="button" className="btn btn-secondary py-2 px-3" data-bs-dismiss="modal">No</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-button accordion-button-lecture-accordion cursor-pointer" data-bs-toggle="collapse" data-bs-target={`#${lecID}`} aria-expanded="true" aria-controls="collapseOne">
                        <div className="d-flex container-fluid align-items-center justify-content-between">
                            <div className="lec_title">
                                {lectureObject.lectureTitle}
                            </div>
                        </div>
                    </div>
                </div>
                <div id={lecID} className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                        <div>
                            <div className="mb-3">
                                <label htmlFor={id1} className="form-label">Title</label>
                                <input className="form-control border form_field_style" id={id1} type="text" defaultValue={lectureObject.lectureTitle} onChange={e => updateLectureObjects(lectureObject.id, e.target.value, "lectureTitle")} />
                            </div>
                            <div className="bg-white text-black my-3">
                                <label htmlFor={id2} className="form-label">Description</label>
                                <ReactQuill
                                    id={id2}
                                    name={id2}
                                    modules={Quill_Modules}
                                    formats={Quill_Formats}
                                    theme="snow"
                                    defaultValue={lectureObject.lectureDescription}
                                    onChange={e => updateLectureObjects(lectureObject.id, e, "lectureDescription")}
                                />
                            </div>
                            <div className="d-flex flex-wrap">
                                <div className="mb-3 me-4">
                                    <label htmlFor={id3} className="form-label">Start Date:</label>
                                    <input type="date" className="form-control  border form_field_style text-uppercase" id={id3} defaultValue={lectureObject.startDate} onChange={e => updateLectureObjects(lectureObject.id, e.target.value, "startDate")} />
                                </div>
                                <div className="mb-3 mx-4">
                                    <label htmlFor={id4} className="form-label">Start Time</label>
                                    <input type="time" className="form-control  border  form_field_style text-uppercase" id={id4} defaultValue={lectureObject.startTime} onChange={e => updateLectureObjects(lectureObject.id, e.target.value, "startTime")} />
                                </div>

                                {/* lecture Duration */}
                                <div className="mb-3 mx-4">
                                    <label htmlFor={id5} className="form-label">Duration</label>
                                    <select id={id5} className="form-select  border form_field_style " onChange={e => updateLectureObjects(lectureObject.id, e.target.value, "duration")}>
                                        <option defaultValue value={lectureObject.duration}>{lectureObject.duration}</option>
                                        <option value="1 hour">1 hour</option>
                                        <option value="2 hours">2 hours</option>
                                        <option value="3 hours">3 hours</option>
                                        <option value="4 hours">4 hours</option>
                                        <option value="5 hours">5 hours</option>
                                        <option value="6 hours">6 hours</option>
                                        <option value="7 hours">7 hours</option>
                                        <option value="8 hours">8 hours</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

