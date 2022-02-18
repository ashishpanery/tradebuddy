import { useState, useEffect } from 'react'
import axios from 'axios'
import sortTable from '../SortTable/SortTable'
import { sortTableNumerically } from '../SortTable/SortTable'
import SearchTable from '../SearchTable/SearchTable'
import { useHistory } from 'react-router-dom'
import { Header, BelowNav, PageLoader, DownloadCSV, Pagination } from "../../../../"
import { connect } from 'react-redux'
import $ from "jquery"
import Select from 'react-select'
import { useLocation } from "react-router-dom"
import useRedirect from '../../../../Redirect/Redirect'
import { HandleAuthorization } from "../../../../../pages"
import useHandleError from '../../../../Handlers/ErrorHandler/ErrorHandler'


function EventDataTable({ currentUser }) {
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    if (!currentUser) redirectWithLogin()
    const token = currentUser?.token
    const [eventList, setEventList] = useState([])
    const [loading, setLoading] = useState(true)
    const [eventData, setEventData] = useState('')
    const [CSVData, setCSVData] = useState('')
    const history = useHistory()
    const [CSVError, setCSVError] = useState('')
    const { handleError } = useHandleError(location)


    // apply active className to the below_nav item
    $(function () {
        $("#belownav_events_item").addClass("fw-bold text-primary");
        $("#belownav_datatable_toggler").text("Events");
    });

    useEffect(() => {
        const getCSVData = async () => {
            await axios.get(`${process.env.REACT_APP_ADMIN_DOWNLOAD_FILE}/event`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(resp => {
                    console.log(resp)
                    setCSVData(resp.data)
                    // done()
                }).catch(err => setCSVError(handleError(err.response.status)))
        }
        currentUser && getCSVData();
    }, [])


    const updateEventStatus = async (id, status, e, index) => {
        await axios.post(`${process.env.REACT_APP_ADMIN_UPDATE_EVENT}`,
            {
                id, status

            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(resp => {
                console.log({ resp })
                if (resp.status === 200) {
                    // status to update
                    let eventStatus = document.getElementById(`${id}${index}`)

                    if (status === "APPROVED") {
                        document.getElementById(`APPROVED${index}`).classList.add("invisible")
                        document.getElementById(`DECLINED${index}`).classList.remove("invisible")
                    }
                    else {
                        document.getElementById(`APPROVED${index}`).classList.remove("invisible")
                        document.getElementById(`DECLINED${index}`).classList.add("invisible")

                    }
                    eventStatus.innerHTML = status
                    eventStatus.classList = `text-${status === `APPROVED` ? 'success' : status === 'DECLINED' ? 'dark' : 'warning'}`
                }
            })
            .catch(err => console.log(err))
    }

    const updateEvent = async (action, event, e, index, status) => {
        switch (action) {
            case "approve":
                updateEventStatus(event.id, "APPROVED", e, index)
                break
            // case "delete":
            //     await axios.delete(`${process.env.REACT_APP_DELETE_EVENT_BY_ID}/${event.id}`, {
            //         headers: {
            //             Authorization: `Bearer ${token}`
            //         }
            //     })
            //         .then(resp => {
            //             if (resp.status === 200) {
            //                 let eventObject = document.getElementById(`eventRow${index}`)
            //                 eventObject.classList.add('d-none')

            //             }
            //         })
            //         .catch(err => console.log(err))
            //     break
            default:
                updateEventStatus(event.id, "DECLINED", e, index)
        }
    }
    const options = [
        { value: "Name", label: "Name" },
        { value: "NoOfLectures", label: "Number of Lectures" },
        { value: "status", label: "Status" }
    ]
    return (
        <div className={`${!loading && 'bg-primary'}`}>
            <Header />
            <HandleAuthorization user="an admin">

                <>
                    <BelowNav />
                    <div className="container-fluid pt-lg-0 pt-default page-body-wrapper admin-table-w content_below_nav" style={{ maxWidth: "1600px" }}>
                        {
                            loading ?
                                <PageLoader />

                                :
                                <div className="content-wrapper rounded-top bg-white">
                                    <div className="card-body">
                                        <h4 className="card-title">Data table</h4>
                                        {/* Download button */}
                                        <div>
                                            {CSVError ? <p>Download is not available.</p> : < DownloadCSV filename="event_data.csv" token={token} CSVData={CSVData} />}

                                        </div>
                                        {/* Search box */}
                                        <div className="d-flex justify-content-end  flex-column flex-sm-row table_search">
                                            <Select options={options}
                                                value={eventData}
                                                onChange={setEventData}
                                                className="select_box_table"
                                            />
                                            <input readOnly={eventData !== "" ? false : true} className={`px-3 py-2 ${eventData === "" ? 'cursor-not-allowed' : null}`} id="table_search" type="text" placeholder="Search table" onKeyUp={() => SearchTable(eventData.value, "event")} />
                                        </div>
                                        <div className="row border">
                                            <div className="col-12 px-0">
                                                <div className="table-responsive">
                                                    <table id="order-listing" className="table">
                                                        <thead>
                                                            {/* Table headers */}
                                                            <tr className="bg-primary text-white">
                                                                <th className="cursor-pointer" onClick={() => sortTable(0)}>Name</th>
                                                                <th className="cursor-pointer" onClick={() => sortTableNumerically(1)}>Number of Lectures</th>
                                                                <th className="cursor-pointer">Explore</th>
                                                                <th className="cursor-pointer">Edit</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(4)}>Status</th>
                                                                <th className="cursor-pointer text-center">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                eventList.map((event, index) => {
                                                                    const { id, eventTitle, lectureList, status } = event
                                                                    return <tr key={id} id={`eventRow${index}`}>
                                                                        <td>{eventTitle ? eventTitle : "-"}</td>
                                                                        <td className='text-center'>{lectureList.length}</td>
                                                                        <td className={`cursor-pointer text-blue`} onClick={() => history.push(`/events/${id}/${eventTitle.split(" ").join("-")}`)}>Open Event Details</td>
                                                                        <td className={`cursor-pointer text-blue`} onClick={() => history.push(`/edit_personal_event/${id}`)}>Modify</td>
                                                                        <td id={`${id}${index}`} className={`text-${status === `APPROVED` ? 'success' : status === 'DECLINED' ? 'dark' : 'warning'}`}>{status}</td>
                                                                        <td>
                                                                            <div>
                                                                                <div>
                                                                                    <button id={`APPROVED${index}`} onClick={(e) => updateEvent("approve", event, e, index, status)} className={`admin_action_btn btn-outline-success  me-auto ${status === "APPROVED" ? 'invisible' : null}`}>Approve</button>
                                                                                    {/* <button id={`DELETED${index}`} onClick={(e) => updateEvent("delete", event, e, index, status)} className="admin_action_btn btn-outline-danger  mx-2 text-center">Delete</button> */}
                                                                                    <button id={`DECLINED${index}`} onClick={(e) => updateEvent("decline", event, e, index, status)} className={`admin_action_btn btn-outline-dark  ms-auto ${status === "DECLINED" ? "invisible" : null}`} >Decline</button>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                    <div className="w-80 mt-0 pt-0 mx-auto pb-3 bg-white" style={{ maxWidth: "1600px" }} >
                        <Pagination
                            url={process.env.REACT_APP_ADMIN_EVENT_LIST}
                            dataList={eventList}
                            setDataList={setEventList}
                            setLoading={setLoading}
                        />
                    </div>
                </>
            </HandleAuthorization>

        </div>

    )
}
const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(EventDataTable)