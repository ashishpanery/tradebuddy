import "./VerifyAccount.css"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { PaginationLoader } from "../Spinner/Spinner"

export default function VerifyAccount() {
    const [verificationSuccessful, setVerificationSuccessful] = useState(false)
    const [loading, setLoading] = useState(true)
    const { code } = useParams()
    useEffect(() => {
        const verifyAccount = async () => {
            await axios.post(`${process.env.REACT_APP_VERIFY_ACCOUNT}/${code}`)
                .then(resp => {
                    if (resp.data === "verify_success") {
                        setVerificationSuccessful(true)
                        setLoading(false)
                    }
                    else {
                        setVerificationSuccessful(false)
                        setLoading(false)
                    }
                })
                .catch(err => {
                    console.log(err)
                    setLoading(false)
                }
                )
        }
        verifyAccount()
    }, [])

    return (
        <>
            {
                loading ?
                    <PaginationLoader />
                    :
                    <div className="password_recovery_container container text-center pt-5" style={{ minHeight: "100vh" }}>
                        <div className="login-form ">
                            {
                                verificationSuccessful ?
                                    <div className="login-heading pb-4">
                                        <span className="text-success">Verification successful!</span>
                                        <p className="fs-6">Your account has been verified. You may now login.</p>
                                        <button className="btn" onClick={() => window.location.assign("/login")}>Login</button>
                                    </div>
                                    :
                                    <div className="login-heading pb-4 text-center">
                                        <p className="text-danger fs-5">Verification failed!</p>
                                        <p className="fs-6">Your account maybe already verified in which case this link as expired. Try logging in first.</p>
                                        <p className="fs-6">If you're unable to login and still see this message, please contact support for assistance.</p>
                                    </div>
                            }
                        </div>
                    </div>
            }
        </>
    )
}
