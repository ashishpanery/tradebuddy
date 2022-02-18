import React from 'react'
import './MenteeEducationTab.css'
import plus from '../../images/plus icon.png'
import pencil from '../../images/Pencil Icon.png'
import delete_icon from "../../images/bin.png"
import { connect } from 'react-redux'
import moment from 'moment'
import axios from "axios"

function MenteeEducationTab({ currentUser, info, showForm, formMode, updateData, setKey, edit = true }) {
    console.log("Eduacation Tab", info)

    const addNew = () => {
        showForm(true)
        formMode(false)
    }
    const editPrevious = () => {
        showForm(true)
        formMode(true)
    }
    const deleteInfo = async (index) => {
        const updatedData = info.educationProfile.filter(item => {
            return item !== info.educationProfile[index]
        })
        const reqObj = { ...info, educationProfile: updatedData }

        await axios.post(`${process.env.REACT_APP_SAVE_MENTEE_DETAILS}`, {
            ...reqObj
        }, {
            headers: {
                'Authorization': `Bearer ${currentUser.token}`
            }
        }).then((response => {
            // console.log("Adding Successful in FOrm 2", response)
            updateData(response.data.model)
        }))
    }
    return (
        <div className='personalDetailsTab py-4 bg-white'>
            <div className='d-flex justify-content-between align-items-center bg-white'>
                <h3>Education</h3>
                {
                    edit &&
                    <img className='cursor-pointer' src={plus} alt='' onClick={addNew} />
                }
            </div>
            {
                info.educationProfile && info.educationProfile.length > 0 && (
                    info.educationProfile.map((details, index) => {
                        var day1 = new Date(details.startYear);
                        var day2 = new Date(details.endDate);
                        var days = Math.abs(day2 - day1);
                        days = days / (1000 * 3600 * 24)
                        const months = days > 29 && Math.round(days / 30)
                        const years = months > 11 && Math.round(months / 12)
                        const presentlyWorking = moment(details.endDate) > new Date()
                        const startDate = moment(details.startYear).format("MMM YYYY")
                        const endDate = moment(details.endDate).format("MMM YYYY")

                        return <div key={index} className='menteeEducationTabList'>
                            <img src={details.logo === null ? 'https://img.icons8.com/ios-filled/50/000000/education.png' : details.logo} alt='educationProfileLogo' />
                            <div className='menteeEducationTabDetails'>
                                <h2>{details.degree}</h2>
                                <p>{details.school}</p>
                            </div>
                            {/* {
                                edit &&
                                <img src={pencil} alt='' onClick={() => {
                                    setKey(index)
                                    editPrevious()
                                }} />
                            } */}
                            <div className="d-flex flex-column-reverse flex-sm-column gap-2">
                                {
                                    edit && <div className='d-flex gap-2 justify-content-center justify-content-sm-end'>
                                        <div className=" cursor-pointer mb-1" >
                                            <img style={{ width: "25px", height: "25px" }} src={pencil} alt='' onClick={() => {
                                                setKey(index)
                                                editPrevious()
                                            }} />
                                        </div>
                                        <img className='cursor-pointer' src={delete_icon} alt="delete_icon" data-bs-toggle="modal" data-bs-target="#deleteEducationModal" style={{ width: "25px" }} />

                                        <div className="modal fade" id="deleteEducationModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="staticBackdropLabel">Confirm Deletion</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        Are you sure you want to delete?
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button onClick={() => deleteInfo(index)} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Yes</button>
                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                }
                                <div>

                                </div>
                                <div>

                                    <div className='d-flex gap-2'>
                                        <p>{startDate === "Invalid date" ? "Problem showing date" : startDate}</p>
                                        <p>-</p>
                                        {
                                            presentlyWorking ? <p>Present</p> :
                                                <p>{endDate === "Invalid date" ? "Problem showing date" : endDate}</p>
                                        }
                                    </div>
                                    {
                                        presentlyWorking ? null :
                                            <p className='d-flex justify-content-center justify-content-sm-end'>( {isNaN(years) ? '-' : years ? years : isNaN(months) ? "-" : months ? months : isNaN(days) ? "-" : days} {years ? years === 1 ? 'year' : 'years' : months ? months === 1 ? 'month' : 'months' : days ? days === 1 ? 'day' : 'days' : ''} )</p>
                                    }
                                </div>

                            </div>
                        </div>
                    })
                )
            }

        </div>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(MenteeEducationTab)