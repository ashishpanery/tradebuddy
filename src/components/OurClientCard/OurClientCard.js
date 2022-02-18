import React from 'react'
import './OurClientCard.css'
import { AiOutlineArrowRight } from "react-icons/ai";
export default function OurClientCard({ img, name, desc, index, link }) {

    const decideBackGround = () => {
        var number = (index) % 4;
        // console.log(number)
        switch (number) {
            case 0:
                return 'ourClientCardBg0'
            case 1:
                return 'ourClientCardBg1'
            case 2:
                return 'ourClientCardBg2'
            case 3:
                return 'ourClientCardBg3'
            default:
                return
        }
    }
    const decideBottomColor = () => {
        var number = (index) % 4;
        // console.log(number)
        switch (number) {
            case 0:
                return 'ourClientCardBottom0'
            case 1:
                return 'ourClientCardBottom1'
            case 2:
                return 'ourClientCardBottom2'
            case 3:
                return 'ourClientCardBottom3'
            default:
                return
        }
    }

    return (
        // <div className="clientCardContainer h-100  my-2" style={{ maxWidth: "620px" }}>
        <div className="clientCardContainer h-100 my-2" >
            <div className={`ourClientCard ${decideBackGround()}  h-100`}>
                <div className='ourClientCardTop '>
                    <div className='ourClientCardTopImage '>
                        <img src={img} alt='' />
                    </div>
                    <div className='ourClientCardTopDetails '>
                        <h1>{name}</h1>
                        {/* <p className='d-block text-truncate' style={{ maxHeight: "80px" }}>{desc}</p> */}
                        <p className='overflow-clamp-5'>{desc}</p>
                    </div>
                </div>
                <a href={link} className='ourClientCardLink'>
                    <div className={`ourClientCardBottom ${decideBottomColor()}`}>
                        <p style={{ marginLeft: '10px', color: "rgb(200,200,200)" }}>Read the full story on <strong>linkedIN</strong></p>
                        <AiOutlineArrowRight />
                    </div>
                </a>
            </div>
        </div>
    )
}