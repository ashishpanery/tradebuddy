import React from 'react'
import './ProfileTab.css'
import officeBag from '../../images/officeBag.png'
import location from '../../images/location.png'
import { useHistory, useParams } from 'react-router-dom'
// import activeStar from '../../images/starOn.png'
export default function ProfileTab({ info }) {
    const history = useHistory()
    let { id } = useParams()
    console.log({ info })
    return (
        <div className='menteeTimeSlotProfileTab '>
            <div className="row position-relative">
                <div className='menteeTimeSlotProfileImage'>
                    <img src={info.photoUrl} alt='' />
                </div>
            </div>
            <div className="row py-4 ">
                <div className='col-12 col-lg-4 d-flex align-items-center justify-content-center'>
                    <button className="btn" onClick={() => { history.push(`/profile/${id}`) }}>See Profile</button>
                </div>
                <div className='col-12 col-lg-4 pt-4 pt-lg-0'>
                    <div className='menteeProfileTabDetailsInfoName'>
                        <h2 className="">{info.name}</h2>
                        <div className="d-flex ">
                            <h2>{info.rating}</h2>
                            {/* <img style={{ width: "35px", height: "35px" }} src={activeStar} alt='' /> */}
                        </div>
                    </div>
                    <h3 className="theme_font_color py-1 text-center menteeProfileTabDetailsInfoName">{info.designation}</h3>
                    <h3 className="theme_font_color menteeProfileTabDetailsInfoName">{info.currentCompany}</h3>
                </div>
                <div className='col-12 col-lg-4'>
                    <div className='companyLogo '>
                        <img src={officeBag} alt='' />
                        <p className="w-50">{info.currentCompany}</p>
                    </div>
                    <div className='placeLogo '>
                        <img src={location} alt='' />
                        <p className="w-50">{info.currentCity},{info.currentCountry}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}