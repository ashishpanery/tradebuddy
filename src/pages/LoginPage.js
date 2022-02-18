import React, { useState, useEffect } from 'react'
import './loginPage.css'
// import loginImage from '../images/Login Image.png'
import Login from '../components/Login/Login'
import Register from '../components/Register/Register'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import RecoverAccount from '../components/RecoverAccount/RecoverAccount'
import { connect } from "react-redux"

function LoginPage({ currentUser }) {
    const [openLogin, setOpenLogin] = useState(true)
    const [openRecovery, setOpenRecovery] = useState(false)
    currentUser && window.location.assign("/")

    const openLoginComponent = () => {
        setOpenLogin(true)
        document.title = "Login Page"

    }
    const closeLoginComponent = () => {
        setOpenLogin(false)
        document.title = "Registeration Page"

    }
    const recoverAccount = () => {
        setOpenRecovery(true)
        document.title = "Account Recovery"

    }
    return (
        <>
            <div className='container'>
                <div className='loginPageHeader'>
                    <Header />
                </div>
                <main>
                    <div className="login-form-area section-padding">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-xl-6 col-lg-7 col-md-10">
                                    {
                                        openLogin === true ?
                                            openRecovery === true ?
                                                <RecoverAccount recoverAccount={recoverAccount} />
                                                :
                                                <div className="login-form">
                                                    <div className="login-heading">
                                                        <span>Login</span>
                                                        <p>Enter Login details to get access</p>
                                                    </div>
                                                    <Login recoverAccount={recoverAccount} />
                                                    <div className="login-footer mt-4 mt-sm-0">
                                                        <p>Don’t have an account? <span className="text-blue cursor-pointer fw-600" onClick={closeLoginComponent}>Sign Up </span>here</p>
                                                    </div>
                                                </div>
                                            :
                                            <div className="login-form">
                                                <div className="login-heading">
                                                    <span>Sign Up</span>
                                                    <p>Create your account by entering below details</p>
                                                </div>
                                                <Register />
                                                <div className="login-footer">
                                                    <p>Already have an account? <span className="text-blue cursor-pointer fw-600" onClick={openLoginComponent}>Login </span>here</p>
                                                </div>
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
            <Footer />
        </>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})


export default connect(mapStateToProps)(LoginPage)
