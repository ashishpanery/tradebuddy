import React from 'react'
import './MentorGetStartedCard.css'
// import img from '../../images/Group 250.png'
import { IoMdCall } from "react-icons/io";
import { useHistory } from 'react-router-dom';
import { Rating } from '@mui/material';

export default function MentorGetStartedCard({ mentor, index }) {
    const history = useHistory()
    const { id, name, photoUrl, designation, currentCompany, experience, currentCity, currentCountry, currency, callRatePerMin, rating } = mentor
    return (
        <div className="h-100 extraPadding cursor-pointer" key={index} style={{ width: "auto" }} >
            <div className='mx-2 p-3 d-flex flex-column  custom_box_shadow align-items-stretch justify-content-between h-100'
                style={{ width: "220px", background: "#E7FDFD" }}
                onClick={() => history.push(`/profile/${id}/${name.split(" ").join("-")}`)}
            >
                <div className="d-flex justify-content-center mt-5 position-relative" >
                    <div style={{ position: "absolute", top: "-8.5em" }}>
                        <img className='card-img-top' src={photoUrl} style={{ width: "120px", aspectRatio: "1", borderRadius: "50%" }} alt="" />
                    </div>
                </div>
                <div className="px-2 pb-2 pt-3 h-100 text-center">
                    <h4 className="fs-5 fw-600 text-black my-0 flexible  " style={{ minHeight: "2em", }}>{name}</h4>
                    <h6 style={{ minHeight: "3em", fontSize: "16px" }} className="text-black my-0 py-2 " >{designation} </h6>
                    <p style={{ fontSize: "14px" }} className='mt-2 text-black' >{currentCompany}</p>
                </div>
                <div className="d-flex justify-content-center">
                    <div className='text-start'>
                        <p className=''>Exp: {experience} years</p>
                        <p >{currentCity}, {currentCountry}</p>
                        <p>{currency} {callRatePerMin}/minute</p>
                    </div>
                </div>
                <p className="mt-1 text-center">
                    <Rating name="half-rating" defaultValue={rating} readOnly precision={0.5} size="small" />
                </p>
                <div className='position-relative ' >
                    <div className='' style={{ borderRadius: "50%", background: "#2EAFB4", padding: ".25em", position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: "-2.5em" }}>
                        <IoMdCall style={{ width: "40px", height: "40px", color: "white" }} />
                    </div>
                </div>
            </div>
        </div>
        // <div
        //     className=" pt-5 mt-5 flex-grow-1 h-100"
        //     onClick={() => history.push(`/profile/${mentor.id}/${newName.join("-")}`)}

        // >
        //     <div className='position-relative red-border ms-4 py-4 px-3 d-flex flex-column landingPageCards custom_box_shadow  align-items-stretch justify-content-between'
        //         style={{ width: "260px", background: "#E7FDFD" }}>
        //         {/* card header */}
        //         <div className='d-flex justify-content-center'>
        //             <img src={mentor.photoUrl} alt="" style={{ borderRadius: "50%", width: "120px", aspectRatio: "1/1", marginTop: "-5em" }} />

        //         </div>
        //         {/* card body */}
        //         <div className="h-100 py-4 text-center">
        //             <div className=''>
        //                 <h3>{mentor.name}</h3>
        //                 <h4>{mentor.designation}</h4>
        //                 <h4 className=''>{mentor.currentCompany}</h4>
        //             </div>
        //         </div>
        //         <div className='text-center'>
        //             <p>Exp : {mentor.experience} yrs</p>
        //             <p>{mentor.currentCity}, {mentor.currentCountry}</p>
        //             <p style={{ color: '#2EAFB4' }}>{mentor.currency} {mentor.callRatePerMin}/minute</p>
        //             <p className="mt-1">
        //                 <Rating name="half-rating" defaultValue={mentor.rating} readOnly precision={0.5} size="small" />
        //             </p>
        //         </div>
        //         <div className='d-flex justify-content-center py-1 ' style={{ marginBottom: "-3em" }}>
        //             <div className='callButton  ' >
        //                 <IoMdCall />
        //             </div>

        //         </div>
        //     </div>
        // </div>
        // <div
        //     className='position-relative cursor-pointer rounded mx-3 pt-5 mt-5'
        //     onClick={() => history.push(`/profile/${mentor.id}/${newName.join("-")}`)}
        //     style={{ background: "#E7FDFD", maxWidth: "320px", minHeight: "25em" }}
        // >
        //     <div className='position-absolute mentorCardImage'>
        //         <img src={mentor.photoUrl} alt='' style={{ borderRadius: "50%", width: "120px", aspectRatio: "1/1" }} />
        //     </div>
        //     <div className="d-flex flex-column h-100">
        //         <div className=' mt-5'>
        //             <div className=''>
        //                 <h3>{mentor.name}</h3>
        //                 <h4>{mentor.designation}</h4>
        //                 <h4 className=''>{mentor.currentCompany}</h4>
        //             </div>
        //             <div className=''>
        //                 <p>Exp : {mentor.experience} yrs</p>
        //                 <p>{mentor.currentCity}, {mentor.currentCountry}</p>
        //                 <p style={{ color: '#2EAFB4' }}>{mentor.currency} {mentor.callRatePerMin}/minute</p>
        //                 <p className="mt-1">
        //                     <Rating name="half-rating" defaultValue={mentor.rating} readOnly precision={0.5} size="small" />
        //                 </p>
        //             </div>
        //         </div>
        //         <div className='callButton ' >
        //             <IoMdCall />
        //         </div>
        //     </div>
        // </div>
    )
}