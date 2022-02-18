import { useState } from "react"
import { Footer, Header } from '../components'
import { PaginationLoader } from "../components/Spinner/Spinner"
import './ContactUs.css'
import image from '../images/contactUsPhoto.png'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { connect } from 'react-redux'
import { Helmet } from "react-helmet"
// import useRedirect from "../components/Redirect/Redirect"

function ContactUs({ currentUser }) {
    // const redirectWithLogin = useRedirect(window.location.pathname)
    // !currentUser && redirectWithLogin()
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveFail, setSaveFail] = useState(false);
    const [loading, setIsLoading] = useState(false);

    const onSubmit = (data) => {
        data.status = "OPEN";
        // data.userId = currentUser.data.id
        saveSupport(data)
    }
    const saveSupport = async (data) => {
        setSaveSuccess(false);
        setSaveFail(false);
        setIsLoading(true);
        await axios.post(process.env.REACT_APP_SAVE_SUPPORT, {
            ...data
        }
            // ,
            //     {
            //         headers: {
            //             Authorization: `Bearer ${currentUser?.token}`
            //         }
            //     }
        )
            .then(resp => {
                console.log(resp);
                resp.data.code === 200 ? setSaveSuccess(true) : setSaveFail(true);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            })
    }

    return (
        <>
            <header>
                <Header />
                <Helmet>
                    <title>Support | Contact Form - TradeBuddy  </title>
                    <meta name='description' content='On This Page, You Can Contact Support, Register Complaint, Report Issues and Seek Assistance.' charSet="utf-8" />
                </Helmet>
            </header>
            <div className=' container d-flex justify-content-center align-items-center contact-us mt-5 pt-5 pt-md-0 '>
                <div className='row g-5'>
                    <div className='col-12 col-md-5 col-lg-5 me-auto contact-us-container-left'>
                        <img src={image} alt='' />
                        <div className='contact-us-container-left-details mt-2'>
                            <p>If you have questions or just want to get in touch use the form below. We look forward to hearing from you </p>
                        </div>
                    </div>

                    <div className='col-12 col-md-7 col-lg-6 ms-auto contact-us-container-right '>
                        {saveSuccess ?
                            <div className="d-flex flex-column gap-4 justify-content-center align-items-center h-100">
                                <div className="w-25">
                                    <svg version="1.1" id="Layer_1"
                                        x="0px" y="0px" viewBox="0 0 117.72 117.72"
                                        style={{ enableBackground: "new 0 0 117.72 117.72" }} >
                                        <style type="text/css">
                                        </style>
                                        <g>
                                            <path className="st0" fill="#2EAFB4"
                                                d="M58.86,0c9.13,0,17.77,2.08,25.49,5.79c-3.16,2.5-6.09,4.9-8.82,7.21c-5.2-1.89-10.81-2.92-16.66-2.92 c-13.47,0-25.67,5.46-34.49,14.29c-8.83,8.83-14.29,21.02-14.29,34.49c0,13.47,5.46,25.66,14.29,34.49 c8.83,8.83,21.02,14.29,34.49,14.29s25.67-5.46,34.49-14.29c8.83-8.83,14.29-21.02,14.29-34.49c0-3.2-0.31-6.34-0.9-9.37 c2.53-3.3,5.12-6.59,7.77-9.85c2.08,6.02,3.21,12.49,3.21,19.22c0,16.25-6.59,30.97-17.24,41.62 c-10.65,10.65-25.37,17.24-41.62,17.24c-16.25,0-30.97-6.59-41.62-17.24C6.59,89.83,0,75.11,0,58.86 c0-16.25,6.59-30.97,17.24-41.62S42.61,0,58.86,0L58.86,0z M31.44,49.19L45.8,49l1.07,0.28c2.9,1.67,5.63,3.58,8.18,5.74 c1.84,1.56,3.6,3.26,5.27,5.1c5.15-8.29,10.64-15.9,16.44-22.9c6.35-7.67,13.09-14.63,20.17-20.98l1.4-0.54H114l-3.16,3.51 C101.13,30,92.32,41.15,84.36,52.65C76.4,64.16,69.28,76.04,62.95,88.27l-1.97,3.8l-1.81-3.87c-3.34-7.17-7.34-13.75-12.11-19.63 c-4.77-5.88-10.32-11.1-16.79-15.54L31.44,49.19L31.44,49.19z" />
                                        </g>
                                    </svg>
                                </div>
                                <div>
                                    <h3>Your response has been recorded.</h3>
                                </div>
                            </div>

                            :
                            <form onSubmit={handleSubmit(onSubmit)} name="EmailForm" className="custom_box_shadow">
                                <h2>Contact Us</h2>
                                <div className="mb-2">
                                    <label >Your Name</label>
                                    <input className="form-control" type="text" defaultValue={currentUser?.data.name} name='name' {...register("name", { required: true, })} />
                                    {errors.name && <p className="text-danger">Name is required</p>}
                                </div>
                                <div className="mb-2">
                                    <label >Your Phone Number</label>
                                    <input className="form-control" type="text" name='mobile' defaultValue={currentUser?.data.phone} {...register("mobile", { required: true, maxLength: 10, minLength: 10 })} />
                                    {errors.mobile && <p className="text-danger">Phone is required and must be 10 digits long.</p>}
                                </div>
                                <div className="mb-2">
                                    <label>Email Address</label>
                                    <input className="form-control" type="email" name='email' defaultValue={currentUser?.data.email} {...register("email", { required: true, pattern: /^\S+@\S+\.\S+$/i })} />
                                    {errors.email && <p className="text-danger">Email is invalid</p>}
                                </div>
                                <div className="mb-2">
                                    <label>Message</label>
                                    <textarea className="form-control" name='message' rows="8" {...register("message", { required: true, })}></textarea>
                                    {errors.message && <p className="text-danger">Message is required</p>}
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p>
                                        {
                                            saveFail && <p className="text-danger ms-2">Response could not be recorded.<br /> Please Try again.</p>
                                        }

                                    </p>
                                    <button className="btn" type='submit' value='submit'>
                                        {
                                            loading ?
                                                <PaginationLoader />
                                                :
                                                'Submit'}
                                    </button>
                                </div>
                            </form>
                        }
                    </div>
                </div>
            </div >
            <Footer />
        </>
    )
    // return <></>
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(ContactUs)