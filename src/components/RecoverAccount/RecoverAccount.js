import React, { useState } from 'react'
// import OtpField from 'react-otp-field';
import "./RecoverAccount.css"
import axios from 'axios';
import { PaginationLoader } from "../Spinner/Spinner"
// import { connect } from 'react-redux';

export default function RecoverAccount() {
    // const [recoveryMode, setRecoveryMode] = useState('')
    // const [emailMode, setEmailMode] = useState(false)
    // const [phoneMode, setPhoneMode] = useState(false)
    const [recoveryModeValue, setRecoveryModeValue] = useState('')
    // const [OTP, setOTP] = useState('')
    const [resetLinkSent, setResetLinkSent] = useState(false)
    const [resetError, setResetError] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [loading, setLoading] = useState(false)


    const sendEmail = async () => {
        setLoading(true)
        setResetError(false)
        setServerError(false)
        await axios.post(`${process.env.REACT_APP_SEND_RESET_PASSWORD_REQUEST}/${recoveryModeValue}`)
            .then(resp => {
                console.log(resp.data.code)
                resp.data.code === 200 && setResetLinkSent(true)
                resp.data.code === 404 && setResetError(true)
                resp.data.code === 500 && setServerError(true)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setResetError(true)
                setLoading(false)

            })
    }

    const updateRecoveryModeValue = (value) => {
        setRecoveryModeValue(value)
        setResetError(false)
        setServerError(false)
    }

    // const getRecoveryMode = (mode) => {
    //     console.log(recoveryModeValue)
    //     if (mode === "email") {
    //         setEmailMode(true)
    //         // setPhoneMode(false)
    //     }
    //     else {
    //         setPhoneMode(true)
    //         // setEmailMode(false)
    //     }
    // }
    if (resetLinkSent === true) {
        return <div style={{ height: "50vh" }} >
            <div className="login-form ">
                <div className="login-heading pb-4">
                    <span>Recovery Link Sent</span>
                    <p className="fs-6">A reset link has been sent to your email address.</p>
                    <p className="fs-6">Please open the link to reset your password.</p>
                </div>
                <div className="text-center">
                    <a className="btn" href="/login">Login</a>
                </div>
            </div>
        </div>
    }
    // if (phoneMode) {
    //     return <div style={{ height: "50vh" }}>
    //         <div className="login-form ">
    //             <div className="login-heading pb-4">
    //                 <span>OTP Sent</span>
    //                 <p className="fs-6">An OTP (6 Digits) has been sent to your mobile device with the number</p>
    //             </div>
    //             <div>
    //                 <p>Enter your OTP:</p>
    //                 <OtpField
    //                     value={OTP}
    //                     onChange={setOTP}
    //                     numInputs={6}
    //                     onChangeRegex={/^([0-9]{0,})$/}
    //                     autoFocus
    //                     separator={<span> </span>}
    //                     isTypeNumber
    //                     classNames="d-flex my-3 justify-content-center"
    //                     inputProps={{ className: 'otp-field__input', disabled: false }}
    //                 />

    //             </div>
    //             <div className="text-center">
    //                 <button className="btn" onClick={() => console.log(OTP)}>Next</button>
    //             </div>

    //         </div>
    //     </div>
    // }
    return (
        <div className="password_recovery_container container">
            <div className="login-form ">
                <div className="login-heading pb-4">
                    <span>Account Recovery</span>
                    <p className="fs-6">You will get a reset link on the e-mail associated with your account.</p>
                </div>
                <div className="loginOptions flex-column w-100">
                    {/* <div className="d-flex align-items-center gap-1 justify-content-start me-auto ">
                        <input type="radio" value={"email"} onChange={e => setRecoveryMode(e.target.value)} name="recovery_mode" />
                        <label className="fs-6" htmlFor="">Enter my e-mail</label>
                    </div> */}
                    <div className={`me-auto w-100`}>
                        <label htmlFor="email_input">Enter your e-mail address:</label>
                        <input
                            id="email_input"
                            type="email"
                            className="form-control"
                            placeholder="example@example.com"
                            value={recoveryModeValue}
                            onChange={e => updateRecoveryModeValue(e.target.value)}
                        />
                        {loading && <PaginationLoader />}
                        {resetError && <p className="text-danger">No user with given e-mail address exists. Make sure you typed your e-mail correctly.</p>}
                        {serverError && <p className="text-danger">Looks like something went wrong on our end! Please try again.</p>}
                    </div>
                    {/* <div className="d-flex gap-1 align-items-center me-auto" >
                        <input type="radio" value={"phone"} onChange={e => setRecoveryMode(e.target.value)} name="recovery_mode" />
                        <label htmlFor="">Enter my phone number</label>
                    </div>
                    <div className={`me-auto ${recoveryMode === "phone" ? "d-block" : "d-none"}`}>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Enter your phone number"
                            value={recoveryModeValue}
                            onChange={e => setRecoveryModeValue(e.target.value)}
                        />
                    </div> */}
                </div>
                <div className="text-center">
                    <button className="btn" onClick={() => sendEmail()}>Next</button>
                    {/* <button className="btn" onClick={() => getRecoveryMode(recoveryMode)}>Next</button> */}
                </div>

            </div>

        </div>
    )

}


