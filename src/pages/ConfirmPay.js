import React, { useEffect, useState } from "react";
import "./ConfirmPay.css";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import { Header, Footer, PageLoader } from "../components";
import successImg from '../images/registration success.png'
import failureImg from '../images/registration failure.png'
import { useForm } from "react-hook-form"
import { useLocation } from "react-router-dom"
import useRedirect from '../components/Redirect/Redirect'
import { PaginationLoader } from "../components/Spinner/Spinner";
import { Helmet } from "react-helmet";
import useHandleError from "../components/Handlers/ErrorHandler/ErrorHandler";

function ConfirmPay({ currentUser }) {
  const location = useLocation().pathname
  const redirectWithLogin = useRedirect(location)
  if (!currentUser) redirectWithLogin()
  const token = currentUser && currentUser.token
  const [mentorInfo, setMentorInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [purpose, setPurpose] = useState('')
  const [documentLinkList, setDocumentLinkList] = useState([])
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [failure, setFailure] = useState(false)
  const [showForm, setShowForm] = useState(true)
  const { handleSubmit, register, formState: { errors } } = useForm()
  let { id, date, time } = useParams();
  const history = useHistory()
  var sessionId;
  const { handleError } = useHandleError(location)
  const [error, setError] = useState('')

  // console.log(id);
  useEffect(() => {
    const fetchMentorInfo = async () => {
      setLoading(true);
      await axios
        .get(
          `${process.env.REACT_APP_GET_MENTOR_DETAILS}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data.model);
          if (response.data.code === 200)
            setMentorInfo(response.data.model);
          else if (response.data.code === 404)
            setError(handleError(404))
          else if (response.data.code === 401)
            handleError(401)
        })
        .catch((err) => {
          // alert(err.message);
          setError(handleError(err.response.status))

        });
      if (currentUser.data.name) {
        setName(currentUser.data.name)
      }
      if (currentUser.data.phone) {
        setMobileNumber(currentUser.data.phone)
      }
      setLoading(false);
    };
    // currentUser && fetchMentorInfo();
    fetchMentorInfo();
  }, [id, token]);

  const saveSession = async () => {
    if (mentorInfo.callRatePerMin * 30 === 0) {
      await axios.post(`${process.env.REACT_APP_SAVE_SESSION}`, {
        menteeId: currentUser.data.id,
        mentorId: id,
        startDate: date,
        startTime: time,
        timeZone: mentorInfo.timeZone,
        duration: "30 Min",
        sessionAmout: mentorInfo.callRatePerMin * 30,
        sessionType: "Video Consultancy",
        currency: mentorInfo.currency,
        mentee: currentUser.data,
        purpose: purpose,
        supportingDoc: documentLinkList,
        paymentStatus: "PAYMENT_SUCCESS",
        orderId: "NA"
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        if (response.data.code === 200) {
          // alert('You have successfully registered')
          setSuccess(true)
          setShowForm(false)
          setFailure(false)

        }
      }).catch((err) => {
        console.log(err)
        if (err.response) {
          if (err.response.status === 401) {
            history.push(`/login/mentee-timeslot/${id}`)
          }
        }
      })
    } else {
      await axios.post(`${process.env.REACT_APP_SAVE_SESSION}`, {
        menteeId: currentUser.data.id,
        mentorId: id,
        startDate: date,
        startTime: time,
        timeZone: mentorInfo.timeZone,
        duration: "30 Min",
        sessionAmout: mentorInfo.callRatePerMin * 30,
        sessionType: "Video Consultancy",
        currency: mentorInfo.currency,
        mentee: currentUser.data,
        paymentStatus: "PAYMENT_PENDING",
        purpose: purpose,
        supportingDoc: documentLinkList,

        orderId: "NA"
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(async (response) => {
        // console.log("MONEY RESPONSE", response.data)
        sessionId = response.data.model.id
        await axios.post(`${process.env.REACT_APP_PAYMENT_TRANSACTION}`, {
          userId: currentUser.data.id,
          amount: response.data.model.sessionAmout * 100,
          paymentMode: 'CR'
        }, {
          headers: {
            client_Id: process.env.RAZORPAY_CLIENT_ID,
            client_key: process.env.RAZORPAY_CLIENT_KEY,
          }
        }).then((paymentResponse) => {
          var amount = response.data.model.sessionAmout
          var options = {
            "key": process.env.RAZORPAY_APIKEY,
            "amount": amount,
            "currency": response.data.model.currency,
            "name": "TradeBuddy",
            "order_id": paymentResponse.data.model.transactionId,
            "handler": async function (response) {
              await axios.post(`${process.env.REACT_APP_PAYMENT_SAVE_DETAILS}`, {
                id: paymentResponse.data.model.id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                status: "success",
                mode: "CR"
              }, {
                headers: {
                  client_Id: process.env.RAZORPAY_CLIENT_ID,
                  client_key: process.env.RAZORPAY_CLIENT_KEY,
                }
              }).then(async (saveResponse) => {
                // console.log("Checking save response", saveResponse)
                // console.log("Respo se", response)
                if (saveResponse.data.code === 200) {
                  await axios.post(`${process.env.REACT_APP_SAVE_SESSION}`, {
                    id: sessionId,
                    menteeId: currentUser.data.id,
                    mentorId: id,
                    startDate: date,
                    startTime: time,
                    timeZone: mentorInfo.timeZone,
                    duration: "30 Min",
                    sessionAmout: amount,
                    sessionType: "Video Consultancy",
                    currency: mentorInfo.currency,
                    mentee: currentUser.data,
                    paymentStatus: "PAYMENT_SUCCESS",
                    orderId: response.razorpay_order_id
                  }, {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }).then((response) => {
                    if (response.data.code === 200) {
                      setSuccess(true)
                      setShowForm(false)
                      setFailure(false)
                    }
                  }).catch((err) => {
                    if (err.response) {
                      if (err.response.status === 401) {
                        history.push(`/login/mentee-timeslot/${id}`)
                      }
                    }
                  })
                }
              })
            }
          };
          var rzp1 = new window.Razorpay(options);
          rzp1.open();
          rzp1.on('payment.failed', async function (response) {
            // console.log(response)
            await axios.post(`${process.env.REACT_APP_PAYMENT_SAVE_DETAILS}`, {
              id: paymentResponse.data.model.id,
              razorpay_payment_id: response.error.metadata.payment_id,
              razorpay_order_id: response.error.metadata.order_id,
              status: "failure",
              mode: "CR"
            }, {
              headers: {
                client_Id: process.env.RAZORPAY_CLIENT_ID,
                client_key: process.env.RAZORPAY_CLIENT_KEY,
              }
            }).then(async (saveResponse) => {
              // console.log(saveResponse)
              // alert('OOPS There is failure from our side')
              return await axios.post(`${process.env.REACT_APP_SAVE_SESSION}`, {
                id: sessionId,
                menteeId: currentUser.data.id,
                mentorId: id,
                startDate: date,
                startTime: time,
                timeZone: mentorInfo.timeZone,
                duration: "30 Min",
                sessionAmout: amount,
                sessionType: "Video Consultancy",
                currency: mentorInfo.currency,
                mentee: currentUser.data,
                paymentStatus: "PAYMENT_FAILED",
                orderId: response.error.metadata.order_id
              }, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              })
            }).then((savedDetails) => {
              setSuccess(false)
              setShowForm(false)
              setFailure(true)
            }).catch((err) => {
              console.log(err.response)
            })

          })

        })

      }).catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            history.push(`/login/mentee-timeslot/${id}`)
          }
        }
      })
    }
    setUploading(false)

  };
  const onSubmit = async (data) => {
    setUploading(true)
    // console.log(data)
    setName(data.name)
    setMobileNumber(data.mobileNumber)
    setPurpose(data.purpose)

    // create form data to store all files
    let formData = new FormData()
    // list for storing all document links
    let linkList = []

    // for every document send api request and get link
    for await (const doc of data.document) {
      formData.set("file", doc)
      // console.log(formData.get("file"))
      let documentLink = await axios.post(`${process.env.REACT_APP_UPLOAD_IMAGE}`, formData,
        {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': "multipart/form-data;"
          }
        }
      )
        .then(resp => { return resp.data.model.link }).catch(err => {
          setLoading(false)
          console.log(err)
        })
      //add links to the link list
      linkList.push(documentLink)
    }
    // console.log({linkList})
    setDocumentLinkList(linkList)
    saveSession()
  }

  const resetToDefault = () => {
    setShowForm(true)
    setFailure(false)
    setSuccess(false)
  }

  if (loading) {
    return <PageLoader />
  } else {
    return (
      <>

        <header>
          <Header />
          <Helmet>
            <title>Create Session | TradeBuddy  </title>
            {/* <meta name='description' content='Online platform to connect and get crafted advice from experts. Features: Audio and Video Sessions, Event Particiaption, Courses and Boot Camps' charSet="utf-8" /> */}
          </Helmet>
        </header>
        {
          error ? <div className="py-5 my-5" style={{ minHeight: "100vh" }}>
            {error}
          </div> :
            !mentorInfo || error ? <div className="py-5 my-5" style={{ minHeight: "100vh" }}>
              {error}
            </div> :
              <div className="container pt-default mt-5">
                {/* <div className="confirmPayHeader">
        </div> */}
                <div className="confirmPayMentorPart">
                  <div className="confirmPayMentorProfile">
                    <img src={mentorInfo.photoUrl} alt="" />
                  </div>
                  <div className="confirmPayMentorDetails">
                    <div className="confirmPayMentorDetailsLeft">
                      <div className="confirmPayMentorDetailsLeftDetails">
                        <p className="confirmPayMentorName">{mentorInfo.name}</p>
                        <p className="confirmPayMentorDesignation">
                          {mentorInfo.designation}
                        </p>
                        <p className="confirmPayMentorCurrentCompany">
                          {mentorInfo.currentCompany}
                        </p>
                        <p className="confirmPayMentorExperience">
                          Experience {mentorInfo.totalExperienceYears} yrs
                        </p>
                        <p className="confirmPayMentorAddress">
                          {mentorInfo.state},{mentorInfo.country}
                        </p>
                        {
                          (mentorInfo.linkedinProfile) &&
                          <a
                            href={mentorInfo.linkedinProfile}
                            className="confirmPayMentorLinkedIn"
                          >
                            LinkedinProfile
                          </a>
                        }
                      </div>
                    </div>
                    <div className="confirmPayMentorDetailsRight">
                      <div className="confirmPayMentorDetailsRightDetails">
                        <p>Type of meeting</p>
                        <p>Video Consultancy</p>
                      </div>
                      <div className="confirmPayMentorDetailsRightDetails">
                        <p>Date & Time</p>
                        <p>
                          {moment(date).format("Do MMMM")} {time}
                        </p>
                      </div>
                      <div className="confirmPayMentorDetailsRightDetails">
                        <p>Consultation Fees</p>
                        <p>{mentorInfo.currency} {mentorInfo.callRatePerMin * 30}</p>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </div>

                {
                  showForm &&
                  <>
                    <div className="confirmPayProvideInfoHeading">
                      <h1>Please provide the following information</h1>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-4">
                      <div className="d-flex gap-2">
                        <div className="">
                          <label className="form-label">Full Name</label>
                          <input
                            type="text"
                            placeholder="Full Name"
                            defaultValue={name}
                            name="name"
                            {...register("name", { required: true })}
                            className="form-control"
                          />
                          {errors.name && <p className="text-danger">Full name is required</p>}
                        </div>
                        <div className="">
                          <label className="form-label" >Mobile Number</label>
                          <input
                            type="text"
                            placeholder="Mobile Number"
                            defaultValue={mobileNumber}
                            name="mobileNumber"
                            {...register("mobileNumber", { required: true, minLength: 10, maxLength: 10 })}
                            className="form-control"
                          />
                          {errors.mobileNumber && <p className="text-danger">Mobile number is required</p>}

                        </div>
                      </div>
                      <div className="d-flex flex-column justify-content-center align-items-start">
                        <label className="form-label" >Purpose</label>
                        <textarea
                          className="form-control"
                          defaultValue={purpose}
                          // onChange={e => setPurpose(e.target.value)}
                          cols="30"
                          rows="15"
                          placeholder="What will be the purpose of this session?"
                          name="purpose"
                          {...register("purpose", { required: true })}
                        />
                        {errors.purpose && <p className="text-danger">Purpose is required</p>}
                      </div>
                      <div className="d-flex flex-column justify-content-center align-items-start">
                        <label htmlFor="document_file" className="fw-600 mb-2" >Reference Document</label>
                        <input className="form-control w-25"
                          type="file"
                          name="document"
                          multiple
                          id="document_file" accept=".xlsx, .xls, .doc,.docx, .ppt, .pptx, .txt, .pdf"
                          {...register("document", { required: false })}
                        />
                        {errors.purpose && <p className="text-danger">Purpose is required</p>}
                      </div>
                      <div className="py-3 text-end">
                        <button type="submit" className="btn"> {uploading ? <PaginationLoader /> : 'Confirm & Pay'}</button>
                        {/* &#38; */}
                      </div>
                    </form>
                  </>
                }
                {
                  success &&
                  <div className=''>
                    <img className="success_img" src={successImg} alt='' />
                  </div>
                }
                {
                  failure &&
                  <div className='registrationFailure'>
                    <img src={failureImg} alt='' />
                    <button onClick={resetToDefault}>Please Try Again</button>
                  </div>
                }
                <div className='pseudo'></div>
              </div>
        }
        <Footer />
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(ConfirmPay);
