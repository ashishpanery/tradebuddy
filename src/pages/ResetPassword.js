import React, { useState } from 'react'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import { useLocation } from 'react-router'
import { useForm } from "react-hook-form"
import axios from 'axios'
export default function ResetPassword() {
    const location = useLocation()
    const token = location.search.split("=")[1]
    // const token = '61a1defc93bf7c28d3e2d1b7'
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [passwordError, setPasswordError] = useState(false)
    const [resetSuccess, setResetSuccess] = useState(false)
    const [linkExpired, setLinkExpred] = useState(false)
    const [passwordMatch, setPasswordMatch] = useState(false)

    const onSubmit = (data) => {
        data.password !== data.re_password && setPasswordError(true)
        data.password === data.re_password && setPasswordMatch(true)
        passwordError === false && passwordMatch === true && submitData(data)
    }

    const submitData = async (data) => {
        await axios.post(process.env.REACT_APP_NEW_PASSWORD_REQUEST, {
            id: token,
            password: data.password
        })
            .then(resp => {
                console.log({ resp })
                resp.data.code === 200 && setResetSuccess(true)
                resp.data.code === 400 && setLinkExpred(true)
            })
            .catch(err => console.log(err))
    }

    return (
        <>
            <Header />
            {/*  */}
            <div className="login-form-area section-padding">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-6 col-lg-7 col-md-10">
                            <div style={{ marginBlock: "10em" }} >
                                {
                                    resetSuccess ?
                                        <div className="login-form">
                                            <div className="login-heading pb-4">
                                                <span>Your password has been successfully reset.</span>
                                                <p>You may login with your new password.</p>
                                            </div>
                                            <div className="text-center">
                                                <button className="btn" href="/login">Login</button>
                                            </div>
                                        </div>
                                        :
                                        linkExpired ?
                                            <div className="login-form">
                                                <div className="login-heading pb-4">
                                                    <span>The reset link has expired</span>
                                                </div>
                                                <div className="text-center">
                                                    <button className="btn" href="/login">Login</button>
                                                </div>
                                            </div>
                                            :
                                            <div className="login-form">
                                                <div className="login-heading pb-4">
                                                    <span>Enter new password</span>
                                                </div>
                                                <form onSubmit={handleSubmit(onSubmit)}>
                                                    <label htmlFor="password"></label>
                                                    <input id="password" type="password" placeholder="Minimum 8 characters" className="form-control" {...register("password", { required: true, minLength: 8 })} />
                                                    {errors.password && <p className="text-danger">Password must be at least 8 characters</p>}
                                                    <label htmlFor="password"></label>
                                                    <input id="re_password" type="password" placeholder="Minimum 8 characters" className="form-control" {...register("re_password", { required: true, minLength: 8 })} />
                                                    {errors.re_password && <p className="text-danger">Password must be at least 8 characters</p>}
                                                    {passwordError && <p className="text-danger">Passwords do not match.</p>}
                                                    <div className="text-center mt-3">
                                                        <button type="submit" className="btn">Update Password</button>
                                                    </div>
                                                </form>
                                            </div>
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/*  */}

            <Footer />
        </>
    )
}
