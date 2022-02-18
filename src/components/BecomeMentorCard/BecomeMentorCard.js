import React from 'react'
import './BecomeMentorCard.css'
import ribbon from '../../images/Group 536.png'
export default function BecomeMentorCard({ img, title, desc, step }) {
    return (
        <>
            <div className='becomeMentorCard custom_box_shadow '>
                <div className='becomeMentorCardStep'>
                    <img src={ribbon} alt='' />
                    <h1>STEP {step}</h1>
                </div>
                <img src={img} alt='' />
                <div className='becomeMentorCardDetails'>
                    <h4>{title}</h4>
                    <p>{desc}</p>
                </div>
            </div>
        </>
    )
}