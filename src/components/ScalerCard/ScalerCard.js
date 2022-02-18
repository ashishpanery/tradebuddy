import React from 'react'
import './ScalerCard.css'
function ScalerCard({img,title,desc}) {
    return (
        <div className='scalerCard'>
            <h2>Scaler<span>Edge</span></h2>
            <img src={img} alt=''/>
            <h3>{title}</h3>
            <div className='scalerCardPara'>
            <p>{desc}</p>
            </div>
        </div>
    )
}

export default ScalerCard
