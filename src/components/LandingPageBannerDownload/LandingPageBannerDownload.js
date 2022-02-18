import React from 'react'
import './LandingPageBannerDownload.css'
import img from '../../images/downloadBannerImage.png'
import googleDownloadLogo from '../../images/googleDownloadLogo.png'
import appleDownloadLogo from '../../images/appleDownloadLogo.png'

function LandingPageBannerDownload() {
    return (
        <>

            <div className='row container-fluid container-md mx-auto' >
                <div className='mentorLandingPageBannerLeft col-12 col-lg-6 align-items-start '>
                    <div className='mentorLandingPageBannerLeftContainer'>
                        <div className='mentorLandingPageBannerLeftHeading'>
                            <h1>DOWNLOAD<span className="d-block py-2">OUR APPLICATION</span></h1>
                        </div>

                        <div className='landingPageBannerLeftContainerImage pt-3'>
                            <img src={googleDownloadLogo} alt='' onClick={() => window.location.assign('https://play.google.com/store/apps/details?id=com.ashish.dialaway')} />
                            <img src={appleDownloadLogo} alt='' />
                        </div>
                    </div>
                </div>
                <div className='mentorLandingPageBannerRight col-12 col-lg-6'>
                    <img src={img} alt='' />
                </div>
            </div>
        </>
    )
}

export default LandingPageBannerDownload