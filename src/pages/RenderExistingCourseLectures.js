import React from 'react'
import ReactQuill from 'react-quill';
import "./RenderExistingLectures.css"
import $ from "jquery"
import delete_icon from "../images/bin.png"

export default function RenderExistingCourseLectures({ lectureObject, index, deleteLecture, Quill_Modules, Quill_Formats, updateLectureObjects, paymentTypeStatus }) {
    const removeBackdrop = () => {
        $('.modal-backdrop').remove();
    }

    const lecID = `lecture${index}`
    const id1 = `title${index}`
    const id2 = `description${index}`
    const id3 = `videoLink${index}`
    const id4 = `locked${index}`
    return (
        <div className="accordion lecture-accordion my-2" id={`existingLectureAccordion${index}`} key={lecID}>
            <div className="accordion-item">
                <div className="accordion-header position-relative" id="headingOne">
                    <div>
                        <div className="cursor-pointer locked_and_delete d-flex gap-3 align-items-center py-2" >
                            {lectureObject.locked && <div className='cursor-pointer py-2 lock-icon ' >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" stroke="black" className="bi bi-lock-fill" viewBox="0 0 16 16">
                                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                                </svg>
                            </div>}
                            <div data-bs-toggle="modal" data-bs-target={`#${lecID}`}>
                                <img src={delete_icon} alt="" style={{ height: "20px", width: "20px" }} />

                            </div>
                        </div>
                        <div className="modal fade" id={lecID} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Deleting {lectureObject.title}</h5>
                                        <button type="button" onClick={() => removeBackdrop()} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        Are you sure you want to delete this lecture?
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" onClick={() => {
                                            deleteLecture(lectureObject.id)
                                            removeBackdrop()
                                        }} className="btn btn-secondary py-2 px-3" data-bs-dismiss="modal">Yes</button>
                                        <button onClick={() => removeBackdrop()} type="button" className="btn btn-secondary py-2 px-3" data-bs-dismiss="modal">No</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-button accordion-button-lecture-accordion cursor-pointer" data-bs-toggle="collapse" data-bs-target={`#${lecID}`} aria-expanded="true" aria-controls="collapseOne">
                        <div className="d-flex container-fluid align-items-center justify-content-between">
                            <div className="lec_title">
                                {lectureObject.title}
                            </div>
                        </div>
                    </div>
                </div>
                <div id={lecID} className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                        <div>
                            <div className="mb-3">
                                <label htmlFor={id1} className="form-label">Title</label>
                                <input className="form-control border form_field_style" id={id1} type="text" defaultValue={lectureObject.title} onChange={e => updateLectureObjects(lectureObject.id, e.target.value, "title")} />
                            </div>
                            <div className="bg-white text-black my-3">
                                <label htmlFor={id2} className="form-label">Description</label>
                                <ReactQuill
                                    id={id2}
                                    name={id2}
                                    modules={Quill_Modules}
                                    formats={Quill_Formats}
                                    theme="snow"
                                    defaultValue={lectureObject.description}
                                    onChange={e => updateLectureObjects(lectureObject.id, e, "description")}
                                />
                            </div>
                            <div className="mb-3 me-4">
                                <label htmlFor={id3} className="form-label">Video Link:</label>
                                <input className="form-control border form_field_style" type="text" defaultValue={lectureObject.videoLink} onChange={e => updateLectureObjects(lectureObject.id, e.target.value, "videoLink")} />
                            </div>
                            {
                                paymentTypeStatus === "Paid" &&
                                <div className="d-flex gap-2 form-switch  mt-4">
                                    <input className="form-check-input mb-3" type="checkbox" role="switch" id={`flexSwitchCheckChecked${id4}`} checked={lectureObject.locked} onChange={e => updateLectureObjects(lectureObject.id, !lectureObject.locked, "locked")} />
                                    <label className="form-check-label mt-1" for={`flexSwitchCheckChecked${id4}`}>Premium Content</label>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}