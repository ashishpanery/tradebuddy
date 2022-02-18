import './CanIBeMentorCard.css'

export default function CanIBeMentorCard({ img, title, desc }) {
    return (
        <div className='canIBeMentorCard'>
            <img src={img} alt='' />
            <h3>{title}</h3>
            <div className='canIBeMentorCardPara'>
                <p>{desc}</p>
            </div>
        </div>
    )
}