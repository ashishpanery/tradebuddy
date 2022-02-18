import React from 'react'
// import star from '../../images/starOn.png'
// import starOff from '../../images/starOff.png'
function StaticRating(props) {
    const row = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    }

    return (
        <div style={row}>
            <h1>test</h1>
            {/* {props.value >= 1 ? <img style={props.img} src={star} alt='' /> : <img style={props.img} src={starOff} alt='' />}
            {props.value >= 2 ? <img style={props.img} src={star} alt='' /> : <img style={props.img} src={starOff} alt='' />}
            {props.value >= 3 ? <img style={props.img} src={star} alt='' /> : <img style={props.img} src={starOff} alt='' />}
            {props.value >= 4 ? <img style={props.img} src={star} alt='' /> : <img style={props.img} src={starOff} alt='' />}
            {props.value >= 5 ? <img style={props.img} src={star} alt='' /> : <img style={props.img} src={starOff} alt='' />} */}
        </div>
    )
}

export default StaticRating
