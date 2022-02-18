import React, { useState, useEffect } from 'react'
import { useForm, FormProvider } from "react-hook-form"
import axios from 'axios'
import Header from '../components/Header/Header'
import { SmallSpinner } from "../components/Spinner/Spinner"
import UploadImage from '../components/UploadImage/UploadImage'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PageLoader from '../components/PageLoader/PageLoader'
import "./EventForm.css"
import RenderExistingLectures from './RenderExistingLectures'
import { useHistory } from 'react-router-dom'
import uuid from 'react-uuid'
import { connect } from "react-redux"


const Quill = ReactQuill.Quill;
var Font = Quill.import('formats/font');
Font.whitelist = ['Ubuntu', 'Raleway', 'Roboto'];
Quill.register(Font, true);

const Quill_Modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike', 'size'],        // toggled buttons
        ['blockquote', 'code-block', 'link'],
        ['image', 'video'],

        [{ 'header': 1 }, { 'header': 2 },
        { 'font': Font.whitelist },
        { "header": [] }],                                      // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        // [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']                                         // remove formatting button
    ]
};
const Quill_Formats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "video",
    "code-block",
    "color",
    "background",
    'script',
    'align',
    'indent',
    'direction',
]
function EventForm({ currentUser, preloadedValues, eventID }) {
    const token = currentUser.token
    const history = useHistory()
    const methods = useForm({
        defaultValues: preloadedValues
    })
    const { register, handleSubmit, formState: { errors } } = methods
    const [paymentTypeStatus, setPaymentTypeStatus] = useState(preloadedValues ? preloadedValues.paymentType : "noPaymentType")
    const [eventDescription, setEventDescription] = useState(preloadedValues ? preloadedValues.description : '');
    const [eventCoverImage, setEventCoverImage] = useState(preloadedValues ? preloadedValues.photoUrl : process.env.REACT_APP_DEFAULT_BANNER_IMG)
    console.log(preloadedValues)
    const [loading, setLoading] = useState(false)
    // Lecture form states
    const [lectureTitle, setLectureTitle] = useState('')
    const [lectureDescription, setLectureDescription] = useState('')
    const [startDate, setStartDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [duration, setDuration] = useState('')
    const [newLectureValidationError, setNewLectureValidationError] = useState(true)
    const [lectureObjects, setLectureObjects] = useState(preloadedValues ? preloadedValues.lectureList : [])

    useEffect(() => {
        if (preloadedValues && preloadedValues.mentorId !== currentUser.data.id) return

        //check payment type status and accordingly change fee input
        let payType = document.getElementById("paymentType")
        payType.addEventListener("change", () => {
            setPaymentTypeStatus(payType.value)
        })
    }, [])

    //new lecture validation
    useEffect(() => {
        if (lectureTitle === '' || startDate === '' || startTime === '' || duration === '') {
            setNewLectureValidationError(true)
        }
        else
            setNewLectureValidationError(false)
    }, [lectureTitle, startDate, startTime, duration])

    const updateLectureObjects = (id, value, key) => {
        console.log(id, value, key)
        let UpdatedLectureObjects = lectureObjects.map(lectureObject => {
            if (lectureObject.id === id)
                lectureObject[`${key}`] = value
            console.log(lectureObject)
            return lectureObject

        })
        setLectureObjects(UpdatedLectureObjects)
        console.log({ UpdatedLectureObjects })
    }

    // assign new lectures to the lecture list
    const handleNewLecture = () => {
        let newLecture = []
        newLecture.push({ id: uuid(), lectureTitle, lectureDescription, startDate, startTime, duration })
        let updatedExistingLectureList = [...lectureObjects, ...newLecture]
        setLectureObjects(updatedExistingLectureList)
        setLectureTitle('')
        setStartDate('')
        setStartTime('')
        setDuration('')
    }

    const deleteLecture = (id) => {
        const remainingLectures = lectureObjects.filter(lectureObject => lectureObject.id !== id)
        setLectureObjects(remainingLectures)
    }

    //submit to back end
    const onSubmit = async (eventData) => {
        console.log(eventData)


        eventData.lectureList = lectureObjects

        if (eventID) eventData.id = eventID

        eventData.photoUrl = eventCoverImage
        eventData.description = eventDescription

        // attach the mentor's ID
        eventData.mentorId = currentUser.data.id

        if (eventData.paymentType === "Free")
            eventData.fee = 0

        console.log({ eventData })


        setLoading(true)
        // if event creation successfull then show success component
        try {
            await axios.post(`${process.env.REACT_APP_CREATE_NEW_EVENT}`, eventData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
                .then(resp => {
                    if (resp.status === 200) {
                        history.push(`/event_success/${preloadedValues ? "edit" : "create"}_success`)
                        setLoading(false)
                    }
                })
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    if (preloadedValues && preloadedValues.mentorId !== currentUser.data.id) return <>
        <Header />
        <h2 className='px-3 pt-5 mt-5 text-center'>You don't have permission to edit this event.</h2>
    </>

    return (
        <>
            {loading ? <PageLoader /> :
                <>
                    <div className="w-80 p-5 border shadow bg-white custom-border-radius">
                        <h3 className="text-center text-capitalize">{preloadedValues ? "Edit" : "Create"} your event.</h3>
                        {/* Banner Image */}
                        <div className="my-3">
                            {

                                preloadedValues ?
                                    <UploadImage photoID="eventCoverPhoto"
                                        height="200px"
                                        uploadBtnID="eventPhotoBtnID"
                                        imageText='' value={eventCoverImage}
                                        setOnChange={setEventCoverImage} />
                                    :
                                    <UploadImage photoID="eventCoverPhoto"
                                        height="200px"
                                        uploadBtnID="eventPhotoBtnID"
                                        imageText={`Upload Your Banner Image`}
                                        value={eventCoverImage}
                                        setOnChange={setEventCoverImage} />
                            }
                        </div>
                        {/* form */}
                        <FormProvider {...methods}>
                            <form id="edit_event_form" onSubmit={handleSubmit(onSubmit)}>
                                {/* Event Title */}
                                <div className="mb-4">
                                    <label htmlFor="event_title" className="form-label">Event Title:</label>
                                    <input type="text" className="form-control border  form_field_style" name="eventTitle" id="event_title" placeholder="Your Event Title" {...register("eventTitle", { required: true })} />
                                    {errors.eventTitle && <p className="text-danger">required</p>}
                                </div>
                                {/* Description */}
                                <label htmlFor="quill_desc" className="form-label">About The Event</label>
                                <div className="bg-white text-black mb-4">
                                    <ReactQuill
                                        id="quill_desc"
                                        modules={Quill_Modules}
                                        formats={Quill_Formats}
                                        theme="snow"
                                        value={eventDescription}
                                        onChange={setEventDescription}
                                    />
                                </div>
                                {/* Registrations, start dates and durations */}
                                <div className="d-flex flex-wrap gap-3">
                                    {/* Registration start and end Date */}
                                    <div className="mb-4">
                                        <label htmlFor="event_registration_start_date " className="form-label">Registration Start Date</label>
                                        <input type="date" className="form-control  border form_field_style text-uppercase" id="event_registration_start_date" name="registrationOpenDate" {...register("registrationOpenDate", { required: true })}></input>
                                        {errors.registrationOpenDate && <p className="text-danger">required</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="event_registration_end_time" className="form-label">Registration End Date</label>
                                        <input type="date" className="form-control  border form_field_style text-uppercase" id="event_registration_end_time" name="registrationCloseDate"{...register("registrationCloseDate", { required: true })}></input>
                                        {errors.registrationCloseDate && <p className="text-danger">required</p>}

                                    </div>
                                    {/* Start Date & Start Time */}
                                    <div className="mb-4">
                                        <label htmlFor="event_start_date" className="form-label">Start Date:</label>
                                        <input type="date" className="form-control  border form_field_style text-uppercase" id="event_start_date" name="startDate" {...register("startDate", { required: true })}></input>
                                        {errors.startDate && <p className="text-danger">required</p>}

                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="event_start_time" className="form-label">Start Time</label>
                                        <input type="time" className="form-control   border form_field_style text-uppercase" id="event_start_time" name="startTime" {...register("startTime", { required: true })}></input>
                                        {errors.startTime && <p className="text-danger">required</p>}

                                    </div>
                                    {/* Event Duration */}
                                    <div className="mb-4">
                                        <label htmlFor="eventDuration" className="form-label">Event Duration</label>
                                        <select id="eventDuration" className="form-select  border form_field_style " name="duration" {...register("duration", { required: true })}>
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

                                {/* Payment Type and Fee */}
                                <div className="d-flex flex-wrap gap-3">
                                    <div className="mb-3">
                                        <label htmlFor="paymentType" className="form-label">Payment Type</label>
                                        <select id="paymentType" className="form-select  border form_field_style" name="paymentType" {...register("paymentType", { required: true })}>
                                            <option value="Free">Free</option>
                                            <option value="Paid">Paid</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        {
                                            paymentTypeStatus === "noPaymentType" ? null :
                                                paymentTypeStatus === "Free" ?
                                                    <div>
                                                        <label htmlFor="event_fee" className="form-label">Fee</label>
                                                        <input type="text" className="form-control readOnly" placeholder="Fee Amount" id="event_fee" value={0} name="fee" readOnly {...register("fee")}></input>
                                                    </div>
                                                    :
                                                    <div>
                                                        <label htmlFor="event_fee" className="form-label">Fee</label>
                                                        <input type="text" className="form-control  border form_field_style" placeholder="Fee Amount" id="event_fee" name="fee" {...register("fee", { required: true })}></input>
                                                    </div>
                                        }
                                    </div>
                                </div>

                                {/* SHOW EXISTING LECUTRES IF ANY */}
                                <div className="border-top pt-2">
                                    <h4 className="fw-bold mt-3">Your lectures:</h4>
                                    {lectureObjects.length > 0 ? lectureObjects.map(((lectureObject, index) => {
                                        index++
                                        return <RenderExistingLectures
                                            key={lectureObject.id}
                                            lectureObject={lectureObject}
                                            index={index}
                                            deleteLecture={deleteLecture}
                                            Quill_Modules={Quill_Modules}
                                            Quill_Formats={Quill_Formats}
                                            updateLectureObjects={updateLectureObjects}
                                        />

                                    })) : <p>You have not added any lectures yet</p>}
                                </div>
                                {/* END OF SHOW EXISTING LECTURES IF ANY */}

                                {/* New Lecture Modal + form */}
                                <div className="mt-3 border-top">
                                    <h4 className="pt-3">Add lecture?</h4>
                                    <div className="d-flex flex-row-reverse justify-content-end align-items-center flex-wrap">
                                        <h5 id="noOfLectures" className="ms-3">{`Lectures Added: ${lectureObjects.length}`}</h5>
                                        <button type="button" className="btn text-white fw-bold" data-bs-toggle="modal" data-bs-target="#lectureModal">
                                            Add new lecture
                                        </button>
                                    </div>
                                    <div className="modal fade" id="lectureModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div className="modal-dialog modal-xl">
                                            <div className="modal-content bg-white py-lg-4 px-lg-3">
                                                <div className="modal-header">
                                                    <h3 className="modal-title" id="exampleModalLabel">Enter Your Lecture Details:</h3>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    {/* lecture form */}
                                                    {/* 
                                                     */}
                                                    <div className="mb-3">
                                                        <label htmlFor="lectureTitle" className="form-label">Lecture Title</label>
                                                        <input className="form-control  border  form_field_style" id="lectureTitle" type="text" value={lectureTitle} onChange={e => setLectureTitle(e.target.value)} />
                                                    </div>
                                                    <div className="bg-white text-black my-3">
                                                        <ReactQuill
                                                            modules={Quill_Modules}
                                                            formats={Quill_Formats}
                                                            theme="snow"
                                                            value={lectureDescription}
                                                            onChange={(e) => setLectureDescription(e)}
                                                        />
                                                    </div>
                                                    <div className="d-flex flex-wrap gap-3">
                                                        <div className="mb-3">
                                                            <label htmlFor="lecture_start_date" className="form-label">Start Date:</label>
                                                            <input type="date" className="form-control  border  form_field_style text-uppercase" id="lecture_start_date" value={startDate} onChange={e => setStartDate(e.target.value)} ></input>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="lecture_start_time" className="form-label">Start Time</label>
                                                            <input type="time" className="form-control  border   form_field_style text-uppercase" id="lecture_start_time" value={startTime} onChange={e => setStartTime(e.target.value)} ></input>
                                                        </div>
                                                        {/* lecture Duration */}
                                                        <div className="mb-3">
                                                            <label htmlFor="lectureDuration" className="form-label">lecture Duration</label>
                                                            <select id="lectureDuration" className="form-select  border  form_field_style" value={duration} onChange={e => setDuration(e.target.value)} >
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
                                                    {
                                                        newLectureValidationError ?
                                                            <div className="btn bg-secondary text-white fw-bold " >Add lecture</div>
                                                            :
                                                            <div onClick={() => handleNewLecture()} className="btn bg-primary text-white fw-bold " data-bs-dismiss="modal">Add lecture</div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* End of lecture modal + form */}
                                <div className="d-flex justify-content-center p-3">
                                    {loading ?
                                        <div className="loading">
                                            <SmallSpinner />
                                        </div>
                                        :
                                        <button type="submit" className="btn  text-white fw-bold py-3 px-5">{preloadedValues ? "Update" : "Create"} Event</button>
                                    }
                                </div>
                            </form>
                        </FormProvider>
                        <p><span style={{ color: 'red' }}>*</span> Required</p>
                    </div>
                </>
            }
        </>
    )
}
const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(EventForm)
// const convertDate = (event) => {
    //     let newDate = new Date(event).toUTCString().split(" ")
    //     let final = [newDate[1], newDate[2], newDate[3]]
    //     let fullDay
    //     switch (newDate[0].slice(0, -1)) {
    //         case "Sun":
    //             fullDay = ["Sunday"]
    //             break
    //         case "Mon":
    //             fullDay = ["Monday"]
    //             break
    //         case "Tue":
    //             fullDay = ["Tuesday"]
    //             break
    //         case "Wed":
    //             fullDay = ["Wednesday"]
    //             break
    //         case "Thu":
    //             fullDay = ["Thursday"]
    //             break
    //         case "Fri":
    //             fullDay = ["Friday"]
    //             break
    //         default:
    //             fullDay = ["Saturday"]
    //     }
    //     let res = final.concat(fullDay).join(" ")

    //     return res
    // }

    // const convertTime = (time) => {
    //     // Check correct time format and split into components
    //     time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    //     if (time.length > 1) { // If time format correct
    //         time = time.slice(1);  // Remove full string match value
    //         time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    //         time[0] = +time[0] % 12 || 12; // Adjust hours
    //     }
    //     return time.join(''); // return adjusted time or original string
    // }