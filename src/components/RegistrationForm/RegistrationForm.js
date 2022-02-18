import React, { useState } from 'react'
import './RegistrationForm.css'
import { FaWindowClose } from "react-icons/fa";
import axios from 'axios';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ComponentLoader from '../ComponentLoader/ComponentLoader';
import success from '../../images/registration success.png'
import failure from '../../images/registration failure.png'

function RegistrationForm({ hidePopup, eventDetails, currentUser }) {
    const [name, setName] = useState(currentUser.data.name)
    // const [email, setEmail] = useState(currentUser.data.email)
    const email = currentUser.data.email
    const [mobileNumber, setMobileNumber] = useState(currentUser.data.phone)
    const history = useHistory()
    const [showForm, setShowForm] = useState(true)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showFailure, setShowFailure] = useState(false)
    const [componentLoading, setComponentLoading] = useState(false)

    const resetToDefault = () => {
        setShowForm(true)
        setShowSuccess(false)
        setShowFailure(false)
    }


    const registerHandler = async () => {
        setComponentLoading(true)
        console.log(eventDetails)
        console.log(currentUser)
        if (parseInt(eventDetails.fee) === 0) {
            console.log("FEES 0")
            await axios.post(`${process.env.REACT_APP_SAVE_EVENT_REGISTRATION}`, {
                eventId: eventDetails.id,
                menteeId: currentUser.data.id,
                paymentStatus: "PAYMENT_SUCCESS",
                paymentId: "0",
                orderId: "0",
                name: name,
                phoneNumber: mobileNumber,
                email: email,
                amount: eventDetails.fee,
            }, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                }
            }).then((response) => {
                console.log(response.status)
                if (response.status === 200) {
                    setShowForm(false)
                    setShowSuccess(true)
                    setShowFailure(false)
                }

            }).catch((err) => {
                if (err.response) {
                    console.log(err.response)
                    setShowForm(false)
                    setShowSuccess(true)
                    setShowFailure(false)
                }
            })
        } else {
            await axios.post(`${process.env.REACT_APP_SAVE_EVENT_REGISTRATION}`, {
                eventId: eventDetails.id,
                menteeId: currentUser.data.id,
                paymentStatus: "PAYMENT_PENDING",
                paymentId: "0",
                orderId: "0",
                name: name,
                phoneNumber: mobileNumber,
                email: email,
                amount: eventDetails.fee,
            }, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                }
            }).then((response) => {
                console.log(response)
                return axios.post(`${process.env.REACT_APP_PAYMENT_TRANSACTION}`, {
                    userId: currentUser.data.id,
                    amount: parseInt(eventDetails.fee) * 100,
                    paymentMode: 'CR'
                }, {
                    headers: {
                        // client_Id: 'upsynk',
                        client_Id: process.env.RAZORPAY_CLIENT_ID,
                        client_key: process.env.RAZORPAY_CLIENT_KEY,
                    }
                })
            }).then((paymentResponse) => {
                console.log(paymentResponse)
                var amount = parseInt(paymentResponse.data.model.amount) * 100;
                console.log(amount)
                var options = {
                    "key": process.env.RAZORPAY_APIKEY,
                    "amount": parseInt(eventDetails.fee) * 100,
                    "currency": "INR",
                    "name": "TradeBuddy",
                    "order_id": paymentResponse.data.model.transactionId,
                    "handler": async function (response) {
                        await axios.post(`${process.env.REACT_APP_UPDATE_TRANSACTION}`, {
                            id: paymentResponse.data.model.transactionId,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            status: "PAYMENT_SUCCESS"
                        }).then((response) => {
                            console.log(response)
                            setShowForm(false)
                            setShowSuccess(true)
                            setShowFailure(false)
                        })

                        await axios.post(`${process.env.REACT_APP_SAVE_EVENT_REGISTRATION}`, {
                            eventId: eventDetails.id,
                            menteeId: currentUser.data.id,
                            paymentStatus: "PAYMENT_SUCCESS",
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            name: name,
                            phoneNumber: mobileNumber,
                            email: email,
                            amount: eventDetails.fee,
                        }, {
                            headers: {
                                Authorization: `Bearer ${currentUser.token}`,
                            }
                        }).then((response) => {
                            console.log(response)
                            setShowForm(false)
                            setShowSuccess(true)
                            setShowFailure(false)
                        }).catch((err) => {
                            if (err.response) {
                                console.log(err.response)
                            }
                        })
                    }
                };
                var rzp1 = new window.Razorpay(options);
                rzp1.open();
                rzp1.on('payment.failed', function (response) {
                    console.log(response)
                    axios.post(`${process.env.REACT_APP_UPDATE_TRANSACTION}`, {
                        id: paymentResponse.data.model.transactionId,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        status: "PAYMENT_FAILURE"
                    }).then((response) => {
                        console.log(response)
                        setShowForm(false)
                        setShowSuccess(false)
                        setShowFailure(true)
                    })
                    axios.post(`${process.env.REACT_APP_SAVE_EVENT_REGISTRATION}`, {
                        eventId: eventDetails.id,
                        menteeId: currentUser.data.id,
                        paymentStatus: "PAYMMENT_PENDING",
                        paymentId: response.razorpay_payment_id,
                        orderId: response.razorpay_order_id,
                        name: name,
                        phoneNumber: mobileNumber,
                        email: email,
                        amount: eventDetails.fee,
                    }, {
                        headers: {
                            Authorization: `Bearer ${currentUser.token}`,
                        }
                    }).then((response) => {
                        console.log(response)
                    }).catch((err) => {
                        if (err.response) {
                            console.log(err.response)
                        }
                    })

                })
            }).catch((err) => {
                if (err.response) {
                    if (err.response.status === 403) {
                        history.push(`/login/events/${eventDetails.id}`)
                    }
                }
            })

        }
        setComponentLoading(false)
    }

    return (
        <div className='registrationFormOuter'>
            <div className='registrationForm'>
                <h1>Registration Form</h1>
                {
                    showForm &&
                    <>
                        <div className='registrationFormInput'>
                            <p>Full Name</p>
                            <input type='text' placeholder='Full Name' value={name} onChange={(e) => {
                                setName(e.target.value)
                            }} />
                        </div>
                        <div className='registrationFormInput'>
                            <p>Email</p>
                            <input disabled readOnly type='email' placeholder='Email' value={email} />
                        </div>
                        <div className='registrationFormInput'>
                            <p>Phone Number</p>
                            <input type='number' placeholder='Phone Number' value={mobileNumber} onChange={(e) => {
                                setMobileNumber(e.target.value)
                            }} />
                        </div>
                        <div className='registrationFormButton'>
                            {componentLoading ? <ComponentLoader /> : <button onClick={registerHandler}>Register</button>}
                        </div>
                    </>
                }
                {
                    showSuccess &&
                    <div className='registrationSuccess'>
                        <img src={success} alt='' />
                    </div>
                }
                {
                    showFailure &&
                    <div className='registrationFailure'>
                        <img src={failure} alt='' />
                        <button onClick={resetToDefault}>Please Try Again</button>
                    </div>
                }
                <div className='registraionButtonClose'>
                    <FaWindowClose onClick={hidePopup} />
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
})
export default connect(mapStateToProps)(RegistrationForm)
