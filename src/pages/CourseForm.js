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
import { useHistory } from 'react-router-dom'
import uuid from 'react-uuid'
import { connect } from "react-redux"
import RenderExistingCourseLectures from './RenderExistingCourseLectures'
import CreatableSelect from 'react-select/creatable';

const Quill_Modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike', 'size'],        // toggled buttons
        ['blockquote', 'code-block', 'link'],
        ['image', 'video'],

        [{ 'header': 1 }, { 'header': 2 }],
        [{ "header": [] }],                                      // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']                                         // remove formatting button
    ]
};
const Quill_Formats = [
    "header",
    "font",
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
function CourseForm({ currentUser, preloadedValues, courseID }) {
    const history = useHistory()
    const methods = useForm({
        defaultValues: preloadedValues
    })
    const editMode = preloadedValues ? true : false
    const { register, handleSubmit, formState: { errors } } = methods
    const [paymentTypeStatus, setPaymentTypeStatus] = useState(editMode ? preloadedValues.fee !== "0" ? "Paid" : "Free" : "Free")
    const [CourseDescription, setCourseDescription] = useState(editMode ? preloadedValues.description : '');
    const [courseCoverImage, setCourseCoverImage] = useState(editMode ? preloadedValues.bannerImage : process.env.REACT_APP_DEFAULT_BANNER_IMG)
    const [loading, setLoading] = useState(false)
    // Lecture form states
    const [lectureTitle, setLectureTitle] = useState('')
    const [lectureDescription, setLectureDescription] = useState('')
    const [videoLink, setVideoLink] = useState('')
    const [freeLecture, setFreeLecture] = useState(false)
    const [newLectureValidationError, setNewLectureValidationError] = useState(true)
    const [lectureObjects, setLectureObjects] = useState(editMode ? preloadedValues.lectureList : [])
    const [tagList, setTagList] = useState([])

    // console.log({ tagList })

    //prefill tags
    let existingTagList = []
    if (editMode && preloadedValues.tags.length > 0) {
        existingTagList = preloadedValues.tags.map(item => {
            return { value: item, label: item }
        })
    }

    useEffect(() => {
        if (preloadedValues && preloadedValues.mentorId !== currentUser.data.id) return
        //check payment type status and accordingly change fee input
        let payType = document.getElementById("paymentType")
        payType.addEventListener("change", () => {
            setPaymentTypeStatus(payType.value)
        })
    }, [])

    useEffect(() => {
        if (editMode && preloadedValues.tags.length > 0) {
            let existingTagsList = preloadedValues.tags.map(item => {
                return { value: item, label: item }
            })
            setTagList(existingTagsList)
        }
    }, [])
    // console.log({ preloadedValues })

    //new lecture validation
    useEffect(() => {
        if (lectureTitle === '' || lectureDescription === '' || videoLink === '') {
            setNewLectureValidationError(true)
        }
        else
            setNewLectureValidationError(false)
    }, [lectureTitle, lectureDescription, videoLink])

    const updateLectureObjects = (id, value, key) => {
        console.log("updating lecture:");
        console.log(id, value, key)
        let UpdatedLectureObjects = lectureObjects.map(lectureObject => {
            if (lectureObject.id === id) {
                lectureObject[`${key}`] = value
                console.log("line 104:", { lectureObject })
            }
            return lectureObject

        })
        setLectureObjects(UpdatedLectureObjects)
        console.log({ UpdatedLectureObjects })
    }

    // assign new lectures to the lecture list
    const handleNewLecture = () => {
        let newLecture = []
        newLecture.push({ id: uuid(), title: lectureTitle, description: lectureDescription, videoLink, locked: freeLecture })
        console.log({ newLecture })
        let updatedExistingLectureList = [...lectureObjects, ...newLecture]
        setLectureObjects(updatedExistingLectureList)
        setLectureTitle('')
        setLectureDescription('')
        setVideoLink('')

    }

    const deleteLecture = (id) => {
        const remainingLectures = lectureObjects.filter(lectureObject => lectureObject.id !== id)
        setLectureObjects(remainingLectures)
    }

    //submit to back end
    const onSubmit = async (courseData) => {
        // console.log(courseData)
        if (courseData.paymentType !== "Paid") {
            courseData.free = true
            courseData.fee = 0
        }
        else {
            courseData.free = false
        }

        courseData.lectureList = lectureObjects
        courseData.bannerImage = courseCoverImage
        courseData.description = CourseDescription

        if (editMode) {
            courseData.status = "PENDING"
            courseData.id = courseID
        }

        //convert objects with values and labels in select into arrays with values only
        let tag_list = []
        if (tagList.length > 0)
            tag_list = tagList.map(item => {
                return item.value
            })
        // check if mentor name exists if not add it
        // if mentor deletes their name from tags add it again
        if (editMode && tag_list.length > 0) {
            let exists = false
            tag_list.forEach(tag => {
                if (tag === courseData.mentorName) {
                    exists = true
                    return
                }
            })
            !exists && tag_list.push(courseData.mentorName)
        }
        else
            tag_list.push(currentUser.data.name)
        courseData.tags = tag_list

        // attach the mentor's ID
        courseData.mentorId = currentUser.data.id

        if (courseData.paymentType === "Free")
            courseData.fee = 0

        console.log({ courseData })


        setLoading(true)
        try {
            await axios.post(`${process.env.REACT_APP_SAVE_COURSE}`, courseData,
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                }
            )
                .then(resp => {
                    if (resp.status === 200) {
                        history.push(`/course_success/${preloadedValues ? "edit" : "create"}_success`)
                        setLoading(false)
                    }
                })
        } catch (error) {
            console.log(error)
            setLoading(false)
        }

    }
    if (editMode && preloadedValues.mentorId !== currentUser.data.id) return <>
        <Header />
        <h2 className='px-3 pt-5 mt-5 text-center' >You don't have permission to edit this course.</h2>
    </>
    return (
        <>
            {loading ? <PageLoader /> :
                <>
                    <div className="w-80 p-5 border shadow bg-white custom-border-radius">
                        <h3 className="text-center text-capitalize">{editMode ? "Edit" : "Create"} your Course.</h3>

                        {/* Banner Image */}
                        <div className="my-3">
                            {

                                preloadedValues ?
                                    <UploadImage photoID="CourseCoverPhoto"
                                        height="200px"
                                        uploadBtnID="CoursePhotoBtnID"
                                        imageText='' value={courseCoverImage}
                                        setOnChange={setCourseCoverImage} />
                                    :
                                    <UploadImage photoID="CourseCoverPhoto"
                                        height="200px"
                                        uploadBtnID="CoursePhotoBtnID"
                                        imageText={`Upload Your Banner Image`}
                                        value={courseCoverImage}
                                        setOnChange={setCourseCoverImage} />
                            }
                        </div>
                        {/* form */}
                        <FormProvider {...methods}>
                            <form id="edit_Course_form" onSubmit={handleSubmit(onSubmit)}>
                                {/* Course Title */}
                                <div className="mb-3">
                                    <label htmlFor="Course_title" className="form-label">Course Title:</label>
                                    <input type="text" className="form-control border  form_field_style" name="title" id="Course_title" placeholder="Your Course Title" {...register("title", { required: true })} />
                                    {errors.CourseTitle && <p className="text-danger">required</p>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Course_subtitle" className="form-label">Subtitle:</label>
                                    <textarea rows="10" className="form-control border  form_field_style" name="subTitle" id="Course_subtitle" placeholder="Short description" {...register("subTitle", { required: true })} />
                                    {errors.CourseTitle && <p className="text-danger">required</p>}
                                </div>
                                {/* Description */}
                                <div className="bg-white text-black my-3">
                                    <ReactQuill
                                        modules={Quill_Modules}
                                        formats={Quill_Formats}
                                        theme="snow"
                                        value={CourseDescription}
                                        onChange={setCourseDescription}
                                    />
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
                                                        <label htmlFor="Course_fee" className="form-label">Fee</label>
                                                        <input type="text" className="form-control readOnly" placeholder="Fee Amount" id="Course_fee" value={0} name="fee" readOnly {...register("fee")}></input>
                                                    </div>
                                                    :
                                                    <div>
                                                        <label htmlFor="Course_fee" className="form-label">Fee</label>
                                                        <input type="text" className="form-control  border form_field_style" placeholder="Fee Amount" id="Course_fee" name="fee" {...register("fee", { required: true })}></input>
                                                    </div>
                                        }
                                    </div>
                                </div>

                                {/* SHOW EXISTING LECUTRES IF ANY */}
                                <div className="border-top pt-2">
                                    <h4 className="fw-bold mt-3">Your lectures:</h4>

                                    {lectureObjects.length > 0 ? lectureObjects.map(((lectureObject, index) => {
                                        index++
                                        return <RenderExistingCourseLectures
                                            key={lectureObject.id}
                                            lectureObject={lectureObject}
                                            index={index}
                                            deleteLecture={deleteLecture}
                                            Quill_Modules={Quill_Modules}
                                            Quill_Formats={Quill_Formats}
                                            updateLectureObjects={updateLectureObjects}
                                            paymentTypeStatus={paymentTypeStatus}

                                        />

                                    })) : <p>You have not added any lectures yet</p>}
                                </div>
                                {/* END OF SHOW EXISTING LECTURES IF ANY */}

                                {/* New Lecture Modal + form */}
                                <div className="mt-3 border-top">
                                    <h4 className="pt-3">Add lecture?</h4>
                                    <div className="d-flex flex-row-reverse justify-content-end align-items-center flex-wrap">
                                        <h5 id="noOfLectures" className="ms-3">{`Lectures Added: ${lectureObjects.length}`}</h5>
                                        <button type="button" className="btn text-white fw-bold" data-bs-toggle="modal" data-bs-target="#courseLectureModal">
                                            Add new lecture
                                        </button>
                                    </div>
                                    <div className="modal fade" id="courseLectureModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                                    {/* Lecture Video Link */}
                                                    {/* <div className="mb-3">
                                                        <label htmlFor="videoLink" className="form-label">Video Link</label>
                                                        <input className="form-control  border  form_field_style" id="videoLink" type="file" defaultValue={videoLink} onChange={e => console.log(e.target.files[0])} />
                                                    </div> */}
                                                    <div className="mb-3">
                                                        <label htmlFor="videoLink" className="form-label">Video Link</label>
                                                        <input className="form-control  border  form_field_style" id="videoLink" type="text" value={videoLink} onChange={e => setVideoLink(e.target.value)} />
                                                    </div>
                                                    {
                                                        paymentTypeStatus === "Paid" &&
                                                        <div className="d-flex gap-2 form-switch  mt-4">
                                                            <input className="form-check-input mb-3" type="checkbox" role="switch" id="flexSwitchCheckChecked" onChange={() => setFreeLecture(!freeLecture)} />
                                                            <label className="form-check-label mt-1" for="flexSwitchCheckChecked">Premium Content</label>
                                                        </div>
                                                    }
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

                                {/* Tags */}
                                <div className="mb-3 pt-3 mt-3">
                                    <label className="form-label" htmlFor="">
                                        {editMode ? 'Tags (Please do not remove your name from tags as it makes your course easier to find)' : 'Tags'}
                                    </label>
                                    <CreatableSelect
                                        isMulti
                                        placeholder="Adding tags makes your course easier to find"
                                        onChange={setTagList}
                                        defaultValue={existingTagList}
                                    // options={}

                                    />
                                </div>
                                <div className="d-flex justify-content-center p-3">
                                    {loading ?
                                        <div className="loading">
                                            <SmallSpinner />
                                        </div>
                                        :
                                        <button type="submit" className="btn  text-white fw-bold py-3 px-5">{preloadedValues ? "Update" : "Create"} Course</button>
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

export default connect(mapStateToProps)(CourseForm) 