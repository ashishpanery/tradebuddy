import React from 'react'
import './MentorUserRating.css'
// import activeStar from '../../images/starOn.png'
// import inActiveStar from '../../images/starOff.png'

export default function MentorUserRating({ name, rating, review, profilePhoto }) {
    return (
        <div className='mentorUserRating'>
            {/* <div className='mentorUserRatingTop'>
                <div className='mentorUserRatingTopImage'>
                    <img src={profilePhoto} alt='' />
                </div>
                <div className='mentorUserRatingTopDetails'>
                    <h1>{name}</h1>
                    <div className='mentorUserStarRating'>
                        {rating >= 1 ? <img src={activeStar} alt='' /> : <img src={inActiveStar} alt='' />}
                        {rating >= 2 ? <img src={activeStar} alt='' /> : <img src={inActiveStar} alt='' />}
                        {rating >= 3 ? <img src={activeStar} alt='' /> : <img src={inActiveStar} alt='' />}
                        {rating >= 4 ? <img src={activeStar} alt='' /> : <img src={inActiveStar} alt='' />}
                        {rating >= 5 ? <img src={activeStar} alt='' /> : <img src={inActiveStar} alt='' />}
                    </div>
                </div>
            </div> */}
            <div className='mentorUserRatingBottom'>
                <p>{review}</p>
            </div>
        </div>
    )
}

