import React from 'react'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import './AboutUs.css'
// import logo from '../images/logo blue.png'
import part1 from '../images/about-us-part-1.png'
import part2 from '../images/about-us-part-2.png'
export default function AboutUs() {
    return (
        <>
            <Header />
            <div className='row container mx-auto mt-5 pt-5 about_us'>
                <div className='row mx-auto'>
                    <div className='row py-4 mb-4'>
                        {/* <img src={logo} alt=''/> */}
                        <div className="col-12">
                            <h1 className=' text-center'>About TradeBuddy</h1>
                        </div>
                        <div className='col-12 py-3 about_us_para mx-auto'>
                            <p>Please do not include any personal information, personally identifiable information or sensitive personal information unless specifically requested by InterviewBit as part of the registration or other applicable processes. If InterviewBit determines that any information you have provided or uploaded violates the terms of this policy, InterviewBit shall have the right, in its absolute discretion, to delete such information without incurring any liability.</p>
                        </div>
                    </div>
                    <div className='row gap-4 gap-md-0 custom_box_shadow rounded p-2 py-md-4 px-2 mx-auto mb-3' style={{ background: "#fdfeff" }}>
                        <div className='col-12 col-md-6 col-lg-3'>
                            <img src={part1} alt='' />
                        </div>
                        <div className='col-12 col-md-6 col-lg-9 d-flex flex-column justify-content-center '>
                            <h2 className='col-12 text-center text-md-end pt-3 pt-md-0' >Vision</h2>
                            <p className='col-12 text-start text-md-end pt-3'>Please do not include any personal information, personally identifiable information or sensitive personal information unless specifically requested by InterviewBit as part of the registration or other applicable processes. If InterviewBit determines that any information you have provided or uploaded violates the terms of this policy, InterviewBit shall have the right, in its absolute discretion, to delete such information without incurring any liability.</p>
                        </div>
                    </div>
                    <div className='row gap-4 flex-row-reverse gap-md-0 custom_box_shadow rounded p-2 py-md-4 px-2 mx-auto' style={{ background: "#fdfeff" }}>
                        <div className='col-12 col-md-6 col-lg-3'>
                            <img src={part2} alt='' />
                        </div>
                        <div className='col-12 col-md-6 col-lg-9 d-flex flex-column justify-content-center '>
                            <h2 className='col-12 text-center text-md-start pt-3 pt-md-0' >Mission</h2>
                            <p className='col-12 text-start pt-3'>Please do not include any personal information, personally identifiable information or sensitive personal information unless specifically requested by InterviewBit as part of the registration or other applicable processes. If InterviewBit determines that any information you have provided or uploaded violates the terms of this policy, InterviewBit shall have the right, in its absolute discretion, to delete such information without incurring any liability.</p>
                        </div>
                    </div>
                    <div className='row py-5'>
                        <h1 className=' col-12 text-center text-dark'>Who are we?</h1>
                        <div className='col-12 about_us_para mx-auto'>
                            <p>Please do not include any personal information, personally identifiable information or sensitive personal information unless specifically requested by InterviewBit as part of the registration or other applicable processes. If InterviewBit determines that any information you have provided or uploaded violates the terms of this policy, InterviewBit shall have the right, in its absolute discretion, to delete such information without incurring any liability.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}