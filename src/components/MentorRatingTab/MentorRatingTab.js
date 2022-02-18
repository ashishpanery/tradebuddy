import React from 'react'
import './MentorRatingTab.css'
import star from '../../images/star.png'
import personIcon from '../../images/personIcon.png'
import ProgressBar from '../ProgressBar/ProgressBar'
export default function MentorRatingTab() {
    return (
        <div className='mentorRatingTab'>
            <h3>Ratings</h3>
            <div className='mentorRatingTabContainer'>
                <div className='mentorRatingContainerLeft'>
                    <h1>4.88</h1>
                    <div className='mentorRatingContainerLeftStar'>
                        <img src={star} alt='' />
                        <img src={star} alt='' />
                        <img src={star} alt='' />
                        <img src={star} alt='' />
                        <img src={star} alt='' />
                    </div>
                    <div className='mentorRatingContainerLeftCount'>
                        <img src={personIcon} alt='' />
                        <p>4492 total</p>
                    </div>

                </div>
                <div className='mentorRatingContainerRight'>
                    <div className='progressBarBox'>
                        <p>5</p>
                        <ProgressBar bgcolor='#03B111' completed='80' />
                        <p>1152</p>
                    </div>
                    <div className='progressBarBox'>
                        <p>4</p>
                        <ProgressBar bgcolor='#03B111' completed='80' />
                        <p>1152</p>
                    </div>
                    <div className='progressBarBox'>
                        <p>3</p>
                        <ProgressBar bgcolor='#03B111' completed='80' />
                        <p>1152</p>
                    </div>
                    <div className='progressBarBox'>
                        <p>2</p>
                        <ProgressBar bgcolor='#03B111' completed='80' />
                        <p>1152</p>
                    </div>
                    <div className='progressBarBox'>
                        <p>1</p>
                        <ProgressBar bgcolor='#03B111' completed='80' />
                        <p>1152</p>
                    </div>

                </div>
            </div>
        </div>
    )
}