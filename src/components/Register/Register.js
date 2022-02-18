import axios from "axios";
import React, { useState } from "react";
import "./Register.css";
import ComponentLoader from '../ComponentLoader/ComponentLoader'
import { useForm } from "react-hook-form"

export default function Register() {
  const [message, setMessage] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passwordMismatch, setPasswordMismatch] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    // console.log(data.password, data.re_password)
    if (data.password !== data.re_password)
      setPasswordMismatch(true)
    else {
      setPasswordMismatch(false)
      beginRegistration(data)
    }
  }

  const beginRegistration = async ({ email, fullName, password, phoneNumber }) => {
    setLoading(true)
    setMessage('')
    await axios.post(`${process.env.REACT_APP_REGISTER_USER}`, {
      name: fullName,
      email: email,
      password: password,
      phone: phoneNumber
    }).then((response) => {
      if (response.data.code === 200) {
        setRegistrationSuccess(true)
      }
      else {
        switch (response.data.code) {
          case 409:
            setMessage(response.data.message)
            break
          default: return
        }
        return
      }
    }).catch((err) => {
      if (err.response) {
        console.log(err.response)
        setMessage(err.response.data.message)
      }
    })
    setLoading(false)
  };

  const buttonEnableHandler = () => {
    if (registrationSuccess) {
      return <div>
        <p className="text-center fs-6 text-success">Registration Successful!</p>
        <p className="text-center fs-6">A verification link has been sent to your e-mail.</p>
      </div>
    } else {
      if (loading) {
        return <ComponentLoader />
      } else {
        return <div className="text-center">
          <button className="btn" onClick={handleSubmit(onSubmit)}>Register</button>
        </div>
      }
    }
  }
  return (
    <div className="input-box">
      <div className="single-input-fields">
        <label>Full Name</label>
        <input
          style={{ background: "white" }}
          type="text"
          placeholder="Enter first name"
          name="fullName"
          {...register("fullName", { required: true })}
        />
        {errors.fullName && <p className="text-danger">Name is invalid</p>}
      </div>
      <div className="single-input-fields">
        <label>Phone Number</label>
        <input
          type="number"
          placeholder="Enter phone number(10 digits) "
          name="phoneNumber"
          {...register("phoneNumber", { required: true, minLength: 10, maxLength: 10 })}
        />
        {errors.phoneNumber && <p className="text-danger">Phone number is invalid (Must be 10 digits long)</p>}

      </div>
      <div className="single-input-fields">
        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter email address"
          name="email"
          className=""
          {...register("email", { required: true, pattern: /^\S+@\S+\.\S+$/i })}
        />
        {errors.email && <p className="text-danger">Email is invalid</p>}

      </div>
      <div className="single-input-fields">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password (at least 8 characters)"
          name="password"
          {...register("password", { required: true, minLength: 8 })}
        />
        {errors.password && <p className="text-danger">Password is invalid (Minimum 8 characters required)</p>}
      </div>
      <div className="single-input-fields">
        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Retype password"
          name="re_password"
          {...register("re_password", { required: true, minLength: 8 })}
        />
        {errors.re_password && <p className="text-danger">Password is invalid (Minimum 8 characters required)</p>}
      </div>
      <p className="text-danger">{message}</p>
      {passwordMismatch && <p className="text-danger">Passwords do not match</p>}
      {buttonEnableHandler()}
    </div>
  );
}

