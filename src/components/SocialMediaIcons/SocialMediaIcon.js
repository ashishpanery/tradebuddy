import React from 'react'
import { Link } from 'react-router-dom'
import './SocialMediaIcon.css'
function SocialMediaIcon({icon}) {
   
    return (
        <Link to='#' className='socialMediaIcon'>
            <img src={icon} alt=''/>
        </Link>
    )
}

export default SocialMediaIcon
