import { useEffect, useState } from 'react'
import { Rating } from '@mui/material'
import "./CourseCards.css"
import defaultBanner from "../../images/event card background.png"

export default function CourseCards({ courseCard, index, ps = false, slider = true }) {
    const { id, title, bannerImage, mentorName, ratingMap, fee } = courseCard
    const [totalRating, setTotalRating] = useState(0)
    let new_title = title.split(" ").join("-")

    useEffect(() => {
        const getTotalRating = () => {
            let total = 0
            if (ratingMap) {
                for (let i = 0; i < 6; i++) {
                    if (ratingMap[i])
                        total += ratingMap[i]
                }
                setTotalRating(total)
            }
            else setTotalRating(0)
        }
        getTotalRating()
    }, [])

    const colorArrary = [
        '#0096dc,#07d3ff',
        '#800000,#80000099',
        'black,rgba(0, 0, 0, 0.7)',
        '#f5c71a,#f5c71a99 ',
    ]
    return (
        <>
            <div className={`${ps && 'ps-4'} pb-4 d-flex flex-column align-items-start justify-content-between h-100`} style={{ maxWidth: `${slider && "320px"}` }}>
                <div className={` pb-4 d-flex flex-column custom_box_shadow align-items-stretch justify-content-between h-100`}>
                    {/* card header */}
                    <div>
                        <img loading='lazy' src={bannerImage ? bannerImage : defaultBanner} alt={defaultBanner} style={{ width: "100%", aspectRatio: "3/2" }} />
                    </div>
                    {/* card body */}
                    <div style={{ backgroundImage: `linear-gradient(120deg,${colorArrary[index % colorArrary.length]})` }}
                        className="px-2 text-white d-flex flex-column justify-content-between flexible">
                        <div className=" py-3 d-flex flex-column justify-content-between flexible gap-3 ">
                            <h3 className="fw-bold  text-white card-text-header ">{title}</h3>
                            <h6 className="fs-6 text-white">{mentorName}</h6>
                        </div>
                        <div className=' d-flex flex-column flex-sm-row flex-wrap justify-content-between align-items-start'>
                            <div className="d-flex gap-1">
                                <p style={{ color: "white" }} className='fw-bold fs-5'>{ratingMap ? ratingMap['-1'] : 0}</p>
                                <div className="d-flex flex-column">
                                    {/* average rating */}
                                    <h3 className="text-center">
                                        <Rating name="half-rating" defaultValue={ratingMap['-1']} readOnly precision={0.5} />
                                    </h3>
                                </div>
                                <p className='text-white'>({totalRating})</p>
                            </div>
                            <p className='pb-2 fs-5 fw-bold text-white' style={{ minWidth: "72px" }}>₹ {fee}</p>
                        </div>
                    </div>
                    <div className="col-12 bootcamp_cards_body py-4 text-center">
                        <button onClick={() => window.location.assign(`/courses/${id}/${new_title}`)
                        }
                            className="btn">View Course</button>
                    </div>
                </div>
            </div>
        </>
    )
}