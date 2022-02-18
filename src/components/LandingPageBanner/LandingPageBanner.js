import React from 'react'
import './LandingPageBanner.css'
//import img from '../../images/newImageLandingBanner.png'
// import img from '../../images/mentorLandingPage.png'
import img from '../../images/downloadBannerImage.png'
import googleDownloadLogo from '../../images/googleDownloadLogo.png'
import appleDownloadLogo from '../../images/appleDownloadLogo.png'

import { useHistory } from 'react-router-dom'

function LandingPageBanner() {
    const history = useHistory()
    return (
        <>
            <div className='row' >
                <div className='mentorLandingPageBannerLeft col-12 col-lg-6 '>
                    <div className='mentorLandingPageBannerLeftContainer'>
                        <div className='mentorLandingPageBannerLeftHeading mt-lg-5 '>
                            <h1 >Personalized advice from <span>Industry Experts</span></h1>
                        </div>
                        <div className='mentorLandingPageBannerLeftPara '>
                            <p className="py-lg-3 py-0">Ask question and get personalized response from your mentor via video or audio call.</p>
                        </div>
                        <div className=''>
                            <button className="btn btn_get_started" onClick={() => history.push('/mentor-list')}>Get started!</button>
                        </div>
                    </div>
                </div>
                <div className='col-12 col-lg-6 row '>
                    <div className='mentorLandingPageBannerRight'>
                        <img loading='lazy' src={img} alt='' />
                        <div className='mt-3 d-flex gap-3 justify-content-md-end align-items-center mentorLandingPageBannerRightButtons'>
                            <img loading='lazy' src={googleDownloadLogo} alt="google_play_button" onClick={() => window.location.assign('https://play.google.com/store/apps/details?id=com.ashish.dialaway')} />
                            <img loading='lazy' src={appleDownloadLogo} alt="apple_store_button" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LandingPageBanner
