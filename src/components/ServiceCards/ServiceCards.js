import React from 'react'
import './ServiceCard.css'
function ServiceCards({img,text,clickHandler}) {
    return (
        <div className='serviceCards' onClick={()=>{clickHandler()}}>
            <img src={img} alt=''/>
            <p>{text}</p>
        </div>
    )
}

export default ServiceCards
