import React, { useState, useEffect } from 'react'
import "./PersonalEvents.css"
import sortTable from '../AdminPortal/Table/DataTable/SortTable/SortTable'
import SearchTable from '../AdminPortal/Table/DataTable/SearchTable/SearchTable'
import { useHistory } from 'react-router-dom'
import axios from "axios"
import Spinner from "../Spinner/Spinner"
import Select from 'react-select'
import pencil from "../../images/Pencil Icon.png"

export default function PersonalEvents({ mentorId, token }) {
    const [personalEvents, setPersonalEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState('')
    const history = useHistory()
    const editPersonalEvent = (id) => {
        history.push(`/edit_personal_event/${id}`)
    }

    useEffect(() => {
        const getPersonalEvents = async () => {
            await axios.get(`${process.env.REACT_APP_GET_PERSONAL_EVENTS}/${mentorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(resp => setPersonalEvents(resp.data.model))
            setLoading(false)
        }
        getPersonalEvents()
    }, [])

    const options = [
        { value: "ID", label: "ID" },
        { value: "Name", label: "Event Title" },
        { value: "startDate", label: "Start Date" },
        { value: "startTime", label: "Start Time" },
        { value: "duration", label: "Duration" },
    ]
    return (
        <div>
            {
                loading ? <div style={{ height: "50vh" }} className="d-flex align-items-center justify-content-center">
                    <Spinner />
                </div>
                    :
                    <>
                        <div className="container-fluid page-body-wrapper">
                            <div className="main-panel">
                                <div className="content-wrappe">
                                    <div className="card">
                                        <div className="card-body">
                                            {/* Create new event */}
                                            <div>
                                                <button onClick={() => history.push(`/edit_personal_event/${'new'}`)} className="btn create_event_button">Create Event</button>
                                            </div>
                                            {/* Search box */}
                                            <div className="d-flex justify-content-end  flex-column flex-sm-row  table_search">

                                                < Select
                                                    options={options}
                                                    onChange={setCategory}
                                                    value={category}
                                                    className="select_box_table"
                                                />
                                                <input readOnly={category !== "" ? false : true} className={`px-3 py-2 ${category !== "" ? null : 'cursor_not_allowed'}`} id="table_search" type="text" placeholder="Search table" onKeyUp={() => SearchTable(category.value, "personalEvent")} />
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="table-responsive">
                                                        <table id="order-listing" className="table">
                                                            <thead>
                                                                {/* Table headers */}
                                                                <tr className="bg_mentor_theme text-white">
                                                                    <th className="cursor-pointer" onClick={() => sortTable(0)} scope="col">EVENT ID</th>
                                                                    <th className="cursor-pointer" onClick={() => sortTable(1)} scope="col">EVENT TITLE</th>
                                                                    <th className="cursor-pointer" onClick={() => sortTable(2)} scope="col">START DATE</th>
                                                                    <th className="cursor-pointer" onClick={() => sortTable(3)} scope="col">START TIME</th>
                                                                    <th className="cursor-pointer" onClick={() => sortTable(4)} scope="col">DURATION</th>
                                                                    <th scope="col">REGISTRATIONS</th>
                                                                    <th scope="col">EDIT</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    personalEvents.length > 0 ?
                                                                        personalEvents.map((personalEvent, index) => {
                                                                            const { id, eventTitle, startDate, startTime, duration } = personalEvent
                                                                            console.log(personalEvent)
                                                                            return <tr key={index}>
                                                                                <td>{id}</td>
                                                                                <td>{eventTitle}</td>
                                                                                <td>{startDate}</td>
                                                                                <td>{startTime}</td>
                                                                                <td>{duration}</td>
                                                                                <td onClick={() => history.push(`/registrations/${id}`)} className="cursor-pointer"><u>View Registrations</u></td>
                                                                                <td onClick={() => editPersonalEvent(id)} className="cursor-pointer "><img src={pencil} style={{ width: "25px", height: "25px" }} alt="edit" /></td>
                                                                            </tr>

                                                                        })
                                                                        :
                                                                        <tr>
                                                                            <td className='pt-3 border-0'>You have not created any events.</td>
                                                                        </tr>
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </>
            }
        </div>
    )
}