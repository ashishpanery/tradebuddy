import React, { useEffect, useState } from "react";
import "./Login.css";
import { useHistory } from "react-router-dom";
import { setCurrentUser } from "../../react-redux/reducers/allActions";
import { connect } from "react-redux";
import axios from "axios";
import errorIcon from '../../images/error icon.png'
import { ComponentLoader } from "../";
import GoogleLogin from 'react-google-login';
import Gbutton from "../../images/GButton.jpg"

function Login({ setCurrentUser, recoverAccount, currentUser }) {
  const [email, setEmail] = useState("");
  const [componentLoading, setComponentLoading] = useState(false)
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('')
  const [error, setError] = useState(false)
  const history = useHistory();
  const redirectUrl = history.location.state ? history.location.state.redirectUrl : "/"
  // currentUser && window.location.assign(redirectUrl)
  // console.log({ redirectUrl })

  const getEmail = (e) => {
    setEmail(e.target.value);
  };
  const getPassword = (e) => {
    setPassword(e.target.value);
  };
  const getRememberMe = () => {
    setRememberMe(!rememberMe);
  };


  useEffect(() => {
    window.scrollTo(0, 0);

  }, [])

  const beginLogin = async () => {
    const regex = /^\S+@\S+\.\S+$/i
    if (!regex.test(email) || password.length < 8) {
      setError(true)
      setErrorMessage("Invalid e-mail or password")
      return
    }

    setComponentLoading(true)
    // console.log(email, password, rememberMe);
    await axios.post(`${process.env.REACT_APP_LOGIN_USER}`, {
      email: email,
      password: password
    }).then((response) => {
      console.log({ response })
      if (response.data.code === 200) {
        var userObject = {}
        userObject.token = response.data.model.accessToken
        userObject.data = response.data.model.user
        setCurrentUser(userObject)
        window.location.assign(redirectUrl)
      }
      else {
        setError(true)
        switch (response.data.code) {
          case 401:
            setErrorMessage(response.data.message)
            break
          case 400:
            setErrorMessage("User with this e-mail does not exist")
            break
          case 403:
            setErrorMessage(response.data.message)
            break
          case 404:
            setErrorMessage("E-mail you provided does not exist")
            break
          default: return
        }

      }

    }).catch((err) => {
      if (err.response) {
        if (err.response.status === 401) {
          setError(true)
        }
      }
    })
    setComponentLoading(false)
  };

  const handleLogin = (googleData) => {
    const token = googleData.tokenId;
    const payload = {
      name: googleData.profileObj.name,
      username: googleData.profileObj.email,
      email: googleData.profileObj.email,
      photoUrl: googleData.profileObj.imageUrl,
      issuer: "google",
      providerId: googleData.profileObj.googleId,
      role: [{ name: "mentee" }]
    }
    // console.log(payload) //user details
    axios.post(`${process.env.REACT_APP_SOCIAL_LOGIN}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      console.log("response from google login:", { response })
      var userObject = {}
      userObject.token = response.data.accessToken
      userObject.data = response.data.user

      //  code to be deleted
      const role = [
        {
          id: null, name: "admin", privilege: null
        }, {
          id: null, name: "mentor", privilege: null

        }
      ]
      userObject.data.role = role
      userObject.data.isMentor = true

      // 
      setCurrentUser(userObject)

      window.location.assign(redirectUrl)
    }).catch(err => {
      alert(err)
    })
  }

  return (
    <div className="input-box">
      {
        error &&
        <div className='loginErrorBox mb-2 d-flex align-items-center w-100'>
          <img src={errorIcon} alt='' />
          <h1>{errorMessage}</h1>
        </div>
      }
      <div className="single-input-fields">
        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={getEmail}
        />
      </div>
      <div className="single-input-fields">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={getPassword}
        />
      </div>
      <div className="loginOptions">
        <div className="single-input-fields login-check">
        </div>
        <div className="d-flex align-items-center gap-1 justify-content-start me-auto" onClick={getRememberMe}>
          <input type="checkbox" name="" id="" style={{ width: '15px' }} checked={rememberMe} />
          <label className="fs-6">Keep me logged in</label>
        </div>
        <div style={{ fontSize: ".9rem" }}>
          <p className="text-decoration-none fs-6 cursor-pointer" style={{ color: `var(--mentor_theme)` }} onClick={recoverAccount}>Forgot Password</p>
        </div>
      </div>
      {
        componentLoading ? (<ComponentLoader size={20} />) : (
          <div className="text-center">
            <button className="btn btn_centered" onClick={beginLogin}>Log In</button>
          </div>
        )
      }
      <div className="d-flex justify-content-center">
        <div className="loginBreak ">
          <span></span>
          <p>or</p>
          <span></span>
        </div>
      </div>
      <div className="socialMediaLoginRows">
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText={<img src={Gbutton} alt="google login" style={{ height: '50px' }} className="socialMediaLoginRows" />}
          onSuccess={handleLogin}
          // onFailure={handleLogin}
          cookiePolicy={'single_host_origin'}
        />
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});
const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
