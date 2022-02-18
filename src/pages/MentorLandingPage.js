import React, { useEffect, useState } from 'react'
import './MentorLandingPage.css'
import {
    Navbar,
    MentorLandingPageBanner,
    WhatIsInItForYouCard,
    OurClientCard,
    BecomeMentorCard,
    Footer,

} from '../components'
import { PaginationLoader } from '../components/Spinner/Spinner'
import yellowBackground from '../images/yellowBackGround.png'
import img8 from '../images/Group 527.png'
import img9 from '../images/Group 528.png'
import img10 from '../images/Group 530.png'
import img11 from '../images/Group 531.png'
import img12 from '../images/Group 534.png'
import img13 from '../images/Group 533.png'
import img14 from '../images/Group 535.png'
import axios from 'axios'
import Slider from "react-slick";
import $ from "jquery"
import { Helmet } from 'react-helmet'


function MentorLandingPage() {
    const [reviews, setReviews] = useState([])
    const [reviewLoading, setReviewLoading] = useState(true)

    $(function () {
        $("#nav_become-mentor_item").addClass("nav_item_active");
    });

    const settings = {
        infinite: true,
        autoPlay: true,
        slidesPerRow: 2,
        rows: 1,
        slidesToShow: 2,
        speed: 500,
        dots: true,
        slidesToScroll: 2,
        autoplaySpeed: 1000,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1150,
                settings: {
                    slidesPerRow: 1,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    rows: 1,

                }
            }
        ]
    };
    useEffect(() => {
        const fetchDetails = async () => {
            axios.get(`${process.env.REACT_APP_MENTOR_HOME_PAGE_REVIEW}`)
                .then((response) => {
                    console.log("REVIEWS", response)
                    setReviews(response.data.model)
                    setReviewLoading(false)
                })
                .catch(err => {
                    console.log(err)
                    setReviewLoading(false)
                })
        }
        fetchDetails()
    }, [])

    return (
        <>
            <Navbar />
            <Helmet>
                <title>Become Mentor | Mentor Landing Page - TradeBuddy  </title>
                <meta name='description' content='Fill the Mentor Application Form to become a Mentor and Unlock Features Like Creating Your Own Events, Courses and More.' charSet="utf-8" />
            </Helmet>
            <div className=' mt-4' style={{ padding: "30px 30px" }}>
                <div className='container mentorLandingPageTop '>
                    {/* <img src={topBackground} alt='' /> */}
                    <MentorLandingPageBanner />
                </div>
                {/* <div className='mentorLandingPageCardRows'>
                <ScalerCard
                img={img1}
                title='For College Students'
                desc='Mentor them young. Provide monthly guidance to young talent and be their friend, philosopher and guide. Most of the batch would consist of second and third year college students.'
                />
                <ScalerCard
                img={img2}
                title='For College Students'
                desc='Mentor them young. Provide monthly guidance to young talent and be their friend, philosopher and guide. Most of the batch would consist of second and third year college students.'
                />
                <ScalerCard
                img={img3}
                title='For College Students'
                desc='Mentor them young. Provide monthly guidance to young talent and be their friend, philosopher and guide. Most of the batch would consist of second and third year college students.'
                />
            </div> */}
                {/* <div className='canIBeMentor'>
                <h1>can i be a mentor</h1>
                <div className='canIBeMentorRow'>
                    <CanIBeMentorCard
                    img={img4}
                    title='Time is of Great Essence'
                    desc='Mentees expect a personal touch when they select a mentor. Often, mentors are their window into the world out there and so spending time is of utmost importance. You are required to provide 1 to 3 hrs of assistance to each mentee per month.'
                    />
                    <CanIBeMentorCard
                    img={img5}
                    title='Your Experience Matters'
                    desc='Share your experience (both success and failure) with the mentees so they can learn and reach newer heights in their respective careers. Inspiration doesn’t always have to come from a billionaire philanthropist. Your degree, however, is not a criterion.'
                    />
                    <CanIBeMentorCard
                    img={img6}
                    title='Being Open and Empathetic'
                    desc='Students at Scaler come from varying backgrounds and naturally have varying personalities. Empathy goes a long way, and as a mentor, one must have loads of it.'
                    />
                    <CanIBeMentorCard
                    img={img7}
                    title='A Desire to Help Young Minds'
                    desc='Over and above everything, it is that desire to give back that is necessary to be a mentor. You will be required to conduct 1:1 mentorship sessions to inspire and guide them.'
                    />
                </div>
            </div> */}
                <div className='container'>
                    <div className=' Title'>
                        <h1>What's in it for <span>you</span>?</h1>
                        <img src={yellowBackground} alt='' />
                    </div>
                    <div className="row gy-3 mt-5">
                        <div className="col-12 col-md-6  col-lg-3">
                            <div className='h-100 '>
                                <WhatIsInItForYouCard
                                    img={img8}
                                    title='A Matter of Pride'
                                    desc='Opportunity to showcase your ability to help grow someone in their career (Add that your XX mentees got an offer)'
                                />

                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3 px-2 px-lg-3 ">
                            <div className='h-100 '>

                                <WhatIsInItForYouCard
                                    img={img9}
                                    title='Compensation'
                                    desc='Everything is incentivised. You get paid for all the time you dedicate. You get paid if you refer them and they get placed'
                                />
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3 px-2 px-lg-3">
                            <div className='h-100 '>

                                <WhatIsInItForYouCard
                                    img={img10}
                                    title='Endless Learning For You Too'
                                    desc='Learning with your mentees will be a two way process. You help them learn and with their feedback, you learn and grow. We provide timely feedback to help you improve as well.'
                                />
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3 px-2 px-lg-3">
                            <div className='h-100'>

                                <WhatIsInItForYouCard
                                    img={img11}
                                    title='An Ever Growing Network'
                                    desc='Meet professionals from different industries and build a long-lasting network of like-minded, driven individuals.'
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='container existingMentorSay'>
                    <div className='Title'>
                        <h1>What Existing <span>Mentors</span> Have To Say</h1>
                        <img src={yellowBackground} alt='' />
                    </div>
                    {
                        reviewLoading ? <PaginationLoader /> :
                            <div className='ourClientCardsRow '>
                                <Slider {...settings}>
                                    {
                                        reviews.map((review, index) => (
                                            <OurClientCard img={review.photoUrl} name={review.name} desc={review.review} key={index} index={index} link={review.postLink} />
                                        ))
                                    }
                                </Slider>

                            </div>
                    }
                </div>


                <div className='becomeAMentor container '>
                    <div className='Title'>
                        <h1>How To Become a <span>MENTOR</span></h1>
                        <img src={yellowBackground} alt='' />
                    </div>
                    <div className='row  mx-auto gap-4 gap-md-5 gap-lg-0'>
                        <div className="col-12 col-md-5 col-lg-4">
                            <BecomeMentorCard
                                img={img12}
                                title='You Apply'
                                desc='Fill out the application or reach out to us directly if you have any questions.'
                                step='1'
                            />
                        </div>
                        <div className="col-12 col-md-5 col-lg-4">
                            <BecomeMentorCard
                                img={img13}
                                title='Profile-Review Logo'
                                desc='Fill out the application or reach out to us directly if you have any questions.'
                                step='2'
                            />
                        </div>
                        <div className="col-12 col-md-5 col-lg-4">
                            <BecomeMentorCard
                                img={img14}
                                title='You Mentor'
                                desc='Fill out the application or reach out to us directly if you have any questions.'
                                step='3'
                            />
                        </div>
                    </div>
                </div>
                <div className='faqSection'>
                    <h1><span>F</span>&#38;Q</h1>
                    <div className="container pt-4">
                        <div className="accordion  mx-auto" id="accordionExample">
                            <div className="accordion-item ">
                                <h1 className="accordion-header" id="headingOne">
                                    <button className="accordion-button accordion-faq" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                        Will I get paid to be a mentor?
                                    </button>
                                </h1>
                                <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        Becoming a Mentor on TradeBuddy is about giving back to the community looking for guidance. While our mentorship program is focused more on non-commercial, we do provide opportunities for our mentors to build their own personal brand and monetize through paid events & 1-to-1 Mentorship with our users.
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingTwo">
                                    <button className="accordion-button accordion-faq" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                                        What kind of audience comes to TradeBuddy?
                                    </button>
                                </h2>
                                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                    <div className="accordion-body ">
                                        While TradeBuddy is an open platform where anyone can seek guidance and unlock career growth, our focus is on learners who are undergraduate students, postgraduate students, or professionals. Our users are from across various different career domains.
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingThree">
                                    <button className="accordion-button accordion-faq" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="true" aria-controls="collapseTwo">
                                        What are the perks of being a mentor on TradeBuddy?
                                    </button>
                                </h2>
                                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                    <div className="accordion-body ">
                                        A mentor at TradeBuddy would be ensured of personal & profile branding, opportunities to monetize & most importantly a chance to help a big community of student and professionals who seeks guidance to make the right career step.
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingFour">
                                    <button className="accordion-button accordion-faq" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="true" aria-controls="collapseTwo">
                                        I am already a mentor on another platform. Would that be a hindrance?
                                    </button>
                                </h2>
                                <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                    <div className="accordion-body ">
                                        Ideally, that would not be an issue unless we find tampering with TradeBuddy copyright properties.
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingFive">
                                    <button className="accordion-button accordion-faq" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="true" aria-controls="collapseTwo">
                                        I am already working as an employee in a company. Am I allowed to be a mentor at TradeBuddy?
                                    </button>
                                </h2>
                                <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                    <div className="accordion-body ">
                                        Yes. Unless you are not tempering your employers copyright or employment contract. Mentoring at TradeBuddy is more like a career consultant helping people to choose the right path in their career.
                                        Most of the companies support working as a consultant or allow to build your start up under thier moon light policy. You can check more with your HR on that.
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </>
    )
}

export default MentorLandingPage
