import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
// import ComponentLoader from '../components/ComponentLoader/ComponentLoader'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import PageLoader from '../components/PageLoader/PageLoader'
import { useLocation } from "react-router-dom"
import { Rating } from '@mui/material'
import './ReviewPage.css'
import { Helmet } from 'react-helmet'
import useHandleError from '../components/Handlers/ErrorHandler/ErrorHandler'

function ReviewPage({ currentUser, details }) {
    const location = useLocation().pathname
    const [userRating, setUserRating] = useState(0)
    const [notRated, setNotRated] = useState(false)
    const [mentorDetails, setMentorDetails] = useState({})
    const [loading, setLoading] = useState(true)
    const [ratingSuccess, setRatingSuccess] = useState(false)
    const [ratingFailure, setRatingFailure] = useState(false)
    const [review, setReview] = useState('')
    let { mentorId } = useParams()
    const [reviewError, setReviewError] = useState('')
    const { handleError } = useHandleError(location)

    const submitUserRating = async () => {
        if (userRating === 0) {
            setNotRated(true)
            return
        }
        await axios.post(`${process.env.REACT_APP_SAVE_REVIEW}`,
            {
                mentorId: mentorId,
                menteeId: currentUser.data.id,
                rating: userRating,
                review: review,
                createDate: moment().format('YYYY-MM-DD')
            },
            {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                }
            })
            .then(resp => {
                console.log(resp.data)
                setRatingSuccess(true)
                setRatingFailure(false)
            })
            .catch(err => {
                setRatingSuccess(false)
                setRatingFailure(true)
                setReviewError(handleError(err.response.status))
            })
    }

    useEffect(() => {
        const fetchMentorData = async () => {
            console.log(mentorId)
            await axios.get(`${process.env.REACT_APP_GET_MENTOR_DETAILS}/${mentorId}`, {
                headers: {
                    Authorization: `Bearer ${currentUser?.token}`
                }
            })
                .then(resp => {
                    setMentorDetails(resp.data.model)
                    console.log(currentUser.id, resp.data.model.id)
                    if (currentUser.data.id === resp.data.model.id) {
                        // setReviewError(handleError(403))
                        window.location.assign("/")
                    }
                })
                .catch(err => {
                    setReviewError(handleError(err.response.status))
                })
            setLoading(false)
        }
        fetchMentorData()
    }, [])

    return (

        loading ? <PageLoader /> :
            <>
                <header>
                    <Header />
                    <Helmet>
                        <title>Rate {mentorDetails?.name} | Mentor Review | TradeBuddy  </title>
                        <meta name='description' content='Rate Your Mentors to Make Them Stand Out From the Rest.' charSet="utf-8" />
                    </Helmet>
                </header>
                <div className="d-flex flex-column justify-content-between" style={{ minHeight: "100vh" }}>
                    <main className=' mx-auto mt-5 pt-5' style={{ maxWidth: "900px" }}>
                        {reviewError ?
                            reviewError
                            :
                            <>

                                <div className='px-4 py-3 d-flex flex-column my-5 justify-content-center '>

                                    <div className='w-100'>
                                        {
                                            !ratingSuccess && !ratingFailure &&
                                            <div className='row custom_box_shadow px-4 py-3'>
                                                <div className='mentorReview gap-2 w-100'>
                                                    <img src={mentorDetails?.photoUrl} alt='' />
                                                    <div className='mentorReviewDetails'>
                                                        <h2>{mentorDetails?.name}</h2>
                                                        <h4>{mentorDetails?.designation}</h4>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className=" d-flex flex-column align-items-center">
                                                        <div>
                                                            <p className=' fw-600 fs-6'>Select number of stars</p>
                                                            <div className="d-flex flex-column gap-2 ">
                                                                <div style={{ width: "fit-content" }}>
                                                                    <Rating
                                                                        size="big"
                                                                        onChange={(event, newValue) => {
                                                                            setNotRated(false)
                                                                            setUserRating(newValue)
                                                                        }}
                                                                        defaultValue={0}
                                                                        precision={0.5}
                                                                    />
                                                                    {notRated && <p>Please provide your rating.</p>}
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className='reviewBox'>
                                                        <textarea value={review} placeholder='Add some comment' onChange={(e) => { setReview(e.target.value) }}></textarea>
                                                    </div>
                                                    <div className="border-top pt-3">
                                                        <button onClick={() => submitUserRating()} type="button" className="btn" >Add Review</button>
                                                    </div>
                                                </div>

                                            </div>
                                        }
                                        {
                                            ratingSuccess &&
                                            <>
                                                <div className="container  d-flex flex-column gap-2 justify-content-between align-items-center">
                                                    <div style={{ width: "120px" }}>
                                                        <svg>
                                                            <g>
                                                                <path className="st0" fill="#2EAFB4" d="M58.86,0c9.13,0,17.77,2.08,25.49,5.79c-3.16,2.5-6.09,4.9-8.82,7.21c-5.2-1.89-10.81-2.92-16.66-2.92 c-13.47,0-25.67,5.46-34.49,14.29c-8.83,8.83-14.29,21.02-14.29,34.49c0,13.47,5.46,25.66,14.29,34.49 c8.83,8.83,21.02,14.29,34.49,14.29s25.67-5.46,34.49-14.29c8.83-8.83,14.29-21.02,14.29-34.49c0-3.2-0.31-6.34-0.9-9.37 c2.53-3.3,5.12-6.59,7.77-9.85c2.08,6.02,3.21,12.49,3.21,19.22c0,16.25-6.59,30.97-17.24,41.62 c-10.65,10.65-25.37,17.24-41.62,17.24c-16.25,0-30.97-6.59-41.62-17.24C6.59,89.83,0,75.11,0,58.86 c0-16.25,6.59-30.97,17.24-41.62S42.61,0,58.86,0L58.86,0z M31.44,49.19L45.8,49l1.07,0.28c2.9,1.67,5.63,3.58,8.18,5.74 c1.84,1.56,3.6,3.26,5.27,5.1c5.15-8.29,10.64-15.9,16.44-22.9c6.35-7.67,13.09-14.63,20.17-20.98l1.4-0.54H114l-3.16,3.51 C101.13,30,92.32,41.15,84.36,52.65C76.4,64.16,69.28,76.04,62.95,88.27l-1.97,3.8l-1.81-3.87c-3.34-7.17-7.34-13.75-12.11-19.63 c-4.77-5.88-10.32-11.1-16.79-15.54L31.44,49.19L31.44,49.19z"></path>
                                                            </g>
                                                        </svg>

                                                    </div>
                                                    <p className="fs-6 text-success fw-bold">Your rating has been saved.</p>

                                                </div>
                                            </>
                                        }
                                        {/*  */}
                                        {
                                            ratingFailure &&
                                            <>
                                                <div className="container d-flex flex-column gap-2 justify-content-between align-items-center">
                                                    <div style={{ width: "125px" }}>
                                                        <svg style={{ width: "125px" }}>

                                                            <g>
                                                                <path fill="#FF4141" d="M61.44,0c16.96,0,32.328,6.882,43.453,17.986c11.104,11.125,17.986,26.494,17.986,43.453 c0,16.961-6.883,32.328-17.986,43.453C93.769,115.998,78.4,122.879,61.44,122.879c-16.96,0-32.329-6.881-43.454-17.986 C6.882,93.768,0,78.4,0,61.439C0,44.48,6.882,29.111,17.986,17.986C29.112,6.882,44.48,0,61.44,0L61.44,0z M73.452,39.152 c2.75-2.792,7.221-2.805,9.986-0.026c2.764,2.776,2.775,7.292,0.027,10.083L71.4,61.445l12.077,12.25 c2.728,2.77,2.689,7.256-0.081,10.021c-2.772,2.766-7.229,2.758-9.954-0.012L61.445,71.541L49.428,83.729 c-2.75,2.793-7.22,2.805-9.985,0.025c-2.763-2.775-2.776-7.291-0.026-10.082L51.48,61.435l-12.078-12.25 c-2.726-2.769-2.689-7.256,0.082-10.022c2.772-2.765,7.229-2.758,9.954,0.013L61.435,51.34L73.452,39.152L73.452,39.152z M96.899,25.98C87.826,16.907,75.29,11.296,61.44,11.296c-13.851,0-26.387,5.611-35.46,14.685 c-9.073,9.073-14.684,21.609-14.684,35.459s5.611,26.387,14.684,35.459c9.073,9.074,21.609,14.686,35.46,14.686 c13.85,0,26.386-5.611,35.459-14.686c9.073-9.072,14.684-21.609,14.684-35.459S105.973,35.054,96.899,25.98L96.899,25.98z"></path>
                                                            </g>

                                                        </svg>

                                                    </div>
                                                    <p className="fs-6 text-danger  fw-bold">Your rating could not be saved.</p>

                                                </div>
                                            </>
                                        }

                                    </div>

                                </div>
                            </>
                        }

                    </main>
                    <Footer />
                </div>
            </>

    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
    details: state.joinCall.details
})
export default connect(mapStateToProps)(ReviewPage)
