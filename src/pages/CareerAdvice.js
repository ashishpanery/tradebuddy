import React, { useEffect, useState } from 'react'
import Header from '../components/Header/Header'
import Navbar from '../components/Navbar/Navbar'
import './Services.css'
import image from '../images/services image.png'
import puzzle from '../images/puzzle.png'
import interviewPrep from '../images/interview-preparation.png'
import addIconForFaq from '../images/addIconForFAQ.png'
import Footer from '../components/Footer/Footer'

function CareerAdvice() {

    const [navbarActive, setNavBarActive] = useState(false)
    const changeHeaderOnScroll = () => {
        if (window.scrollY >= 2) {
            setNavBarActive(true)
        } else {
            setNavBarActive(false)
        }
    }
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    window.addEventListener('scroll', changeHeaderOnScroll)
    return (
        <>
            {navbarActive ? <Header /> : <Navbar />}
            <div className='services'>
                <div className='services-top blueBg'>
                    <img src={image} alt='' />
                </div>
                <div className='services-container'>
                    <div className='services-heading'>
                        <h1><span>What </span>will you get ?</h1>
                    </div>
                    <div className='services-list'>
                        <div className='service-list-column'>
                            <div className='service-list-cards'>
                                <div className='service-list-cards-image blueBg'>
                                    <img src={puzzle} alt='' />
                                </div>
                                <p>Mentor from your chosen company</p>
                            </div>
                            <div className='service-list-cards'>
                                <div className='service-list-cards-image blueBg'>
                                    <img src={puzzle} alt='' />
                                </div>
                                <p>Mentor from your chosen company</p>
                            </div>
                            <div className='service-list-cards'>
                                <div className='service-list-cards-image blueBg'>
                                    <img src={puzzle} alt='' />
                                </div>
                                <p>Mentor from your chosen company</p>
                            </div>
                        </div>
                        <div className='service-list-column'>
                            <div className='service-list-cards'>
                                <div className='service-list-cards-image blueBg'>
                                    <img src={puzzle} alt='' />
                                </div>
                                <p>Mentor from your chosen company</p>
                            </div>
                            <div className='service-list-cards'>
                                <div className='service-list-cards-image blueBg'>
                                    <img src={puzzle} alt='' />
                                </div>
                                <p>Mentor from your chosen company</p>
                            </div>
                            <div className='service-list-cards'>
                                <div className='service-list-cards-image blueBg'>
                                    <img src={puzzle} alt='' />
                                </div>
                                <p>Mentor from your chosen company</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='services-container'>
                    <div className='services-heading'>
                        <h1><span>What </span>can we use this session for ?</h1>
                    </div>
                    <div className='service-session-rows'>
                        <div className='service-sessions'>
                            <div className='service-sessions-image'>
                                <img src={interviewPrep} alt='' />
                            </div>
                            <div className='service-session-details blueBg'>
                                <h2>Resume Review</h2>
                                <p>Get your resume reviewed from top interviewers and make your resume stand out from crowd</p>
                            </div>
                        </div>
                        <div className='service-sessions'>
                            <div className='service-sessions-image'>
                                <img src={interviewPrep} alt='' />
                            </div>
                            <div className='service-session-details blueBg'>
                                <h2>Resume Review</h2>
                                <p>Get your resume reviewed from top interviewers and make your resume stand out from crowd</p>
                            </div>
                        </div>
                        <div className='service-sessions'>
                            <div className='service-sessions-image'>
                                <img src={interviewPrep} alt='' />
                            </div>
                            <div className='service-session-details blueBg'>
                                <h2>Resume Review</h2>
                                <p>Get your resume reviewed from top interviewers and make your resume stand out from crowd</p>
                            </div>
                        </div>
                        <div className='service-sessions'>
                            <div className='service-sessions-image'>
                                <img src={interviewPrep} alt='' />
                            </div>
                            <div className='service-session-details blueBg'>
                                <h2>Resume Review</h2>
                                <p>Get your resume reviewed from top interviewers and make your resume stand out from crowd</p>
                            </div>
                        </div>

                    </div>

                </div>
                <div className='services-container'>
                    <div className='services-heading'>
                        <h1><span>How </span>does this work ?</h1>
                    </div>
                    <div className='service-steps-row'>
                        <div className='service-steps blueBg'>
                            <div className='service-steps-top'>
                                <h1>01</h1>
                            </div>
                            <p>Fill up the form and book a consulting session We understand your requirements, domain and target comapnies to find a perfect industry expert for you.</p>
                        </div>
                        <div className='service-steps blueBg'>
                            <div className='service-steps-top'>
                                <h1>02</h1>
                            </div>
                            <p>We finalise a real-life Interviewer and schedule a session for you We schedule your consulting session over Google Meet with an interviewer from one of your target companies.</p>
                        </div>
                        <div className='service-steps blueBg'>
                            <div className='service-steps-top'>
                                <h1>03</h1>
                            </div>
                            <p>Attend the session to get all your queries resolved Be it interview preparation, resume creation, job finding or deciding your career trajectory, feel free to get honest & quality advice on all of your queries. 4</p>
                        </div>
                        <div className='service-steps blueBg'>
                            <div className='service-steps-top'>
                                <h1>04</h1>
                            </div>
                            <p>Get clarity and acheive greater heights! A clear vision, backed with correct direction can help you go a long way in your career. It will be our privilege to play a small but important part in your career!</p>
                        </div>
                    </div>
                </div>
                <div className='services-container'>
                    <div className='services-heading'>
                        <h1><span>Why </span>get your queries</h1>
                        <h1>directly answered from your interviewers ?</h1>
                    </div>
                    <div className='service-queries-list'>
                        <div className='service-queries-list-column'>
                            <div className='service-queries-list-item'>
                                <p>They are domain experts working at top companies</p>
                            </div>
                            <div className='service-queries-list-item'>
                                <p>They have interviewed and mentored huge number of people</p>
                            </div>
                            <div className='service-queries-list-item'>
                                <p>They know common mistakes people make in an interview</p>
                            </div>
                        </div>
                        <div className='service-queries-list-column'>
                            <div className='service-queries-list-item'>
                                <p>They are domain experts working at top companies</p>
                            </div>
                            <div className='service-queries-list-item'>
                                <p>They are domain experts working at top companies</p>
                            </div>
                            <div className='service-queries-list-item'>
                                <p>They are domain experts working at top companies</p>
                            </div>
                        </div>

                    </div>

                </div>
                <div className='faqSection'>
                    <h1><span>F</span>&Q</h1>
                    <div className='faqBox'>
                        <div className='faqBoxContainer'>
                            <h1>ELIGIBILITY, DURATION AND TIMING</h1>
                            <img src={addIconForFaq} alt='' />
                            {/* <p>+</p> */}
                        </div>
                        <div className='faqBoxContainer'>
                            <h1>CERTIFICATE, CAREERS & TIME COMMITMENTS</h1>
                            <img src={addIconForFaq} alt='' />
                            {/* <p>+</p> */}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default CareerAdvice
