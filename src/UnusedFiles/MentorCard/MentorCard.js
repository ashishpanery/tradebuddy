import React from 'react'
// import { FaThumbsUp } from 'react-icons/fa'
// import { IoMdCall } from "react-icons/io";
import { useHistory } from 'react-router-dom';
// import StaticRating from '../StarRating/StaticRating';
import './MentorCard.css'
export default function MentorCard({ mentor }) {
    console.log(mentor.photoUrl)
    const history = useHistory()
    const cardOnClick = () => {
        history.push(`/mentee-timeslot/${mentor.id}`)
    }
    const checkCompany = () => {
        if (mentor.currentCompanyObject && mentor.currentCompanyObject.logo.length !== 0) {
            return <div className='companyLogoBox'>
                <img className='mentorCompanyLogo' src={mentor.currentCompanyObject.logo} alt='' />
            </div>
        } else {
            return <p>{mentor.designation}<span>{mentor.currentCompany}</span></p>
        }
    }
    const img = {
        width: "15px",
        height: "15px",

    }
    return (
        <div className='mentorCard' onClick={cardOnClick} >
            <div className='mentorCardLeft'>
                <img className='profilePic' src={mentor.photoUrl} alt='' />
                {checkCompany()}
                {/* <StaticRating value={mentor.rating} img={img} /> */}
            </div>
            <div className='mentorCardCenter'>
                <h3>{mentor.name}</h3>
                {/* <p>{mentor.designation}</p> */}
                {/* <p>{mentor.designation} <span>@ {mentor.currentCompany}</span></p> */}
                {/* <p>{mentor.previousCompanies}</p> */}
                <p>Exp:{mentor.experience} yrs</p>
                <p>{mentor.currentCity},{mentor.currentCountry}</p>
                <p>{mentor.currency} {mentor.callRatePerMin} minute</p>
            </div>
            <div style={{ flex: '1' }}>

            </div>
            <div className='mentorCardRight'>
                {/* <div className='thumbsUp'>
                <FaThumbsUp style={{width:'30px',height:'30px',color:'#2EAFB4'}}/><p>55</p>
                </div> */}
                <div className='callIcon'>
                    {/* <IoMdCall style={{width:'30px',height:'30px',color:'#2EAFB4'}}/> */}
                    <button>Call Me</button>
                </div>
            </div>
        </div>
    )
}