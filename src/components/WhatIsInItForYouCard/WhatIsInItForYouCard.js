import React from 'react'
import './WhatIsInItForYouCard.css'

function WhatIsInItForYouCard({ img, title, desc, clickHandler }) {
    const h3Style = {
        // color: "#6D6E8D",
        // color: "white",
        fontSize: "1.35rem"
    }
    const pStyle = {
        // color: "white",
        fontSize: ".9rem",
        width: '100%',
        wordWrap: "break-word",
    }
    const imgStyle = {
        border: "4px solid white",
        borderRadius: "50%"
    }

    return (
        <div className={`whatIsInItForYouCard px-2 px-lg-3 pb-3 ${clickHandler ? 'cursor-pointer' : null}`} onClick={() => clickHandler ? clickHandler() : null}>
            <div className='whatIsInItForYouCardImage '>
                <img loading='lazy' style={clickHandler ? imgStyle : {}} src={img} alt='' />
            </div>
            <div className='whatIsInForYouCardDetails mt-5 px-3 flexible pb-0 d-flex flex-column  justify-content-around'>
                <h3 className="whatsInItForYouHeader" style={clickHandler ? h3Style : {}} >{title}</h3>
                <p className="whatsInItForYouDesc pb-0 mb-0" style={pStyle}>{desc}</p>
            </div>
        </div>
    )
}

export default WhatIsInItForYouCard