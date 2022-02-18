import React, { useState } from 'react'
import './StarRating.css'
// import starOn from '../../images/starOn.png'
// import starOff from '../../images/starOff.png'
function StarRating({ edit, rating }) {
    const [starCount, setStarCount] = useState(1)
    const changeValue = (value) => () => {
        if (edit) {
            setStarCount(value)
        }
    }
    const saveRating = () => {
        rating(starCount)
    }
    return (
        <div className='starRating' onClick={saveRating}>
            {/* <div onMouseOver={changeValue(1)}>
                {starCount>=1?<img src={starOn} alt=''/>:<img src={starOff} alt=''/>}
            </div>
            <div onMouseOver={changeValue(2)}>
                {starCount>=2?<img src={starOn} alt=''/>:<img src={starOff} alt=''/>}
            </div>
            <div onMouseOver={changeValue(3)}>
                {starCount>=3?<img src={starOn} alt=''/>:<img src={starOff} alt=''/>}
            </div>
            <div onMouseOver={changeValue(4)}>
                {starCount>=4?<img src={starOn} alt=''/>:<img src={starOff} alt=''/>}
            </div>

            <div onMouseOver={changeValue(5)}>
                {starCount>=5?<img src={starOn} alt=''/>:<img src={starOff} alt=''/>}
            </div>
            */}
        </div>
    )
}

export default StarRating
