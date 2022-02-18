import React from 'react'
import './MentorAboutMe.css'
export default function MentorAboutMe({ info }) {
    return (
        <div className='mentorAboutMe'>
            <h3>About Me</h3>
            <p>{info}</p>
        </div>
    )
}