import React from 'react'
import './MentorLandingPageBanner.css'
//import img from '../../images/mentorLandingPage.png'
import img from '../../images/job-application.png'
import { useHistory, useLocation } from "react-router-dom"
import { connect } from 'react-redux'
import useRedirect from '../Redirect/Redirect'

function MentorLandingPageBanner({ currentUser }) {
    const history = useHistory()
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(`${location}/register_application_form`)
    return (
        <div className='row' >
            <div className='mentorLandingPageBannerLeft col-12 col-lg-6 '>
                <div className='mentorLandingPageBannerLeftContainer'>
                    <div className='mentorLandingPageBannerLeftHeading mt-lg-5'>
                        <h1 >Become a <span>Mentor</span></h1>
                    </div>
                    <div className='mentorLandingPageBannerLeftPara '>
                        <p className="py-lg-3 py-0">This is your chance to give back to the community - help people to unlock their true potential and get monetised for your exclusive knowledge.</p>
                    </div>
                    <div className=''>
                        <button className="btn btn_get_started" onClick={() => currentUser ? history.push('/become-mentor/register_application_form') : redirectWithLogin()}>Apply Now</button>
                    </div>
                </div>
            </div>
            <div className='mentorLandingPageBannerRight col-12 col-lg-6'>
                <img src={img} alt='' />
            </div>
        </div>
    )
}


const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})
export default connect(mapStateToProps)(MentorLandingPageBanner)