import { useState, useEffect } from 'react'
import axios from 'axios'
import sortTable from '../SortTable/SortTable'
import { sortTableNumerically } from '../SortTable/SortTable'
import SearchTable from '../SearchTable/SearchTable'
import Select from "react-select"
import { Header, BelowNav, PageLoader, DownloadCSV, Pagination } from "../../../../"
import { useHistory } from 'react-router-dom'
import $ from "jquery"
import { connect } from 'react-redux'
import { useLocation } from "react-router-dom"
import useRedirect from '../../../../Redirect/Redirect'
import { HandleAuthorization } from "../../../../../pages"
import useHandleError from '../../../../Handlers/ErrorHandler/ErrorHandler'

function SessionDataTable({ currentUser }) {

    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    if (!currentUser) redirectWithLogin()
    const token = currentUser?.token
    const [sessionList, setSessionList] = useState([])
    const [loading, setLoading] = useState(true)
    const [sessionData, setSessionData] = useState('')
    const [CSVData, setCSVData] = useState('')
    const history = useHistory()
    const [CSVError, setCSVError] = useState('')
    const { handleError } = useHandleError(location)

    // apply active className to the below_nav item
    $(function () {
        $("#belownav_sessions_item").addClass("fw-bold text-primary");
        $("#belownav_datatable_toggler").text("Sessions");

    });

    useEffect(() => {
        const getCSVData = async () => {
            await axios.get(`${process.env.REACT_APP_ADMIN_DOWNLOAD_FILE}/session`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(resp => {
                    console.log(resp)
                    setCSVData(resp.data)
                }).catch(err => {
                    setCSVError(handleError(err.response.status))
                })
        }
        // currentUser && getCSVData();
        getCSVData();
    }, [])


    const updateSessionStatus = async (status, id, e, index) => {
        // console.log({ status, id, e, index })
        await axios.post(`${process.env.REACT_APP_UPDATE_SESSION_BY_ID}`,
            {
                id, status

            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(resp => {
                if (resp.status === 200) {
                    // status to update
                    let sessionStatus = document.getElementById(`${id}${index}`)
                    // button to hide
                    let actionToHide = document.getElementById(e.target.id)
                    // button to show
                    let actionToShow = document.getElementById(`${sessionStatus.innerHTML}${index}`)

                    actionToHide.classList.toggle("invisible")
                    actionToShow.classList.toggle("invisible")
                    sessionStatus.innerHTML = status
                    sessionStatus.classList = `text-${status === "REQUEST_PENDING" ?
                        'warning'
                        :
                        status === "ACCEPTED" ?
                            'success'
                            :
                            status === "STARTED" ?
                                'info'
                                :
                                status === "COMPLETED" ?
                                    'success'
                                    :
                                    'danger'
                        }`
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const options = [
        { value: "session_id", label: "Session ID" },
        { value: "mentor_id", label: "Mentor ID" },
        { value: "mentee_id", label: "Mentee ID" },
        { value: "startTime", label: "Start Time" },
        { value: "status", label: "Status" },
        { value: "sessionAmout", label: "Amount" },
    ]
    return (
        <div className={`${!loading && 'bg-primary'}`}>
            <Header />
            <HandleAuthorization user="an admin">

                <>
                    <BelowNav />
                    <div className="container-fluid  pt-lg-0 pt-default page-body-wrapper admin-table-w content_below_nav" style={{ maxWidth: "1600px" }}>
                        {
                            loading ?
                                <PageLoader />

                                :
                                <div className="content-wrapper rounded-top bg-white">
                                    <div className="card-body">
                                        {/* Download button */}
                                        <div>
                                            {CSVError ? <p>Download is not available.</p> : < DownloadCSV filename="session_data.csv" token={token} CSVData={CSVData} />}
                                        </div>
                                        {/* Search box */}
                                        <div className="d-flex justify-content-end  flex-column flex-sm-row table_search">
                                            <Select
                                                options={options}
                                                value={sessionData}
                                                onChange={setSessionData}
                                                className="select_box_table"
                                            />
                                            <input readOnly={sessionData !== "" ? false : true} className={`px-3 py-2 ${sessionData === "" ? 'not-allowed' : null}`} id="table_search" type="text" placeholder="Search table" onKeyUp={() => SearchTable(sessionData.value, "session")} />
                                        </div>
                                        <div className="row border">
                                            <div className="col-12 px-0">
                                                <div className="table-responsive">
                                                    <table id="order-listing" className="table">
                                                        <thead>
                                                            <tr className="bg-primary text-white">
                                                                {/* session id, mentee id, mentor id, start time, status, payment */}
                                                                <th className="cursor-pointer" onClick={() => sortTable(0)}>Session ID</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(1)}>Mentor ID</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(2)}>Mentee ID</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(3)}>Start Time</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(4)}>Status</th>
                                                                <th className="cursor-pointer" onClick={() => sortTableNumerically(5)}>Amount</th>
                                                                <th className="cursor-pointer text-center">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                sessionList.map((session, index) => {
                                                                    if (session === null) {
                                                                        return <h1>No data avaiable</h1>
                                                                    }
                                                                    const { id: session_id, startTime, status, sessionAmout, mentorId, menteeId } = session
                                                                    return <tr>
                                                                        <td>{session_id ? session_id : '-'}</td>
                                                                        <td className='cursor-pointer' onClick={() => history.push(`/profile/${mentorId}`)}>{mentorId ? mentorId : '-'}</td>
                                                                        <td className='cursor-pointer' onClick={() => history.push(`/profile/${menteeId}`)}>{menteeId ? menteeId : '-'}</td>
                                                                        <td>{startTime ? startTime : '-'}</td>
                                                                        <td id={`${session_id}${index}`}
                                                                            className={
                                                                                `text-${status === "REQUEST_PENDING" ?
                                                                                    'warning'
                                                                                    :
                                                                                    status === "ACCEPTED" ?
                                                                                        'success'
                                                                                        :
                                                                                        status === "STARTED" ?
                                                                                            'info'
                                                                                            :
                                                                                            status === "COMPLETED" ?
                                                                                                'success'
                                                                                                :
                                                                                                'danger'
                                                                                }`
                                                                            }>
                                                                            {status ? status : '-'}

                                                                        </td>
                                                                        <td className='text-center'>{sessionAmout ? sessionAmout : "0"}</td>
                                                                        <td>
                                                                            <div className='d-flex gap-2'>
                                                                                <button id={`REQUEST_PENDING${index}`} onClick={(e) => updateSessionStatus("REQUEST_PENDING", session_id, e, index, status)} className={`admin_action_btn btn-outline-warning   ${status === "REQUEST_PENDING" ? 'invisible' : null}`}>Pend</button>
                                                                                <button id={`ACCEPTED${index}`} onClick={(e) => updateSessionStatus("ACCEPTED", session_id, e, index, status)} className={`admin_action_btn btn-outline-success ${status === "ACCEPTED" && "invisible"}`} >Accept</button>
                                                                                <button id={`STARTED${index}`} onClick={(e) => updateSessionStatus("STARTED", session_id, e, index, status)} className={`admin_action_btn btn-outline-info ${status === "STARTED" && "invisible"}`} >Start</button>
                                                                                <button id={`COMPLETED${index}`} onClick={(e) => updateSessionStatus("COMPLETED", session_id, e, index, status)} className={`admin_action_btn btn-outline-success ${status === "COMPLETED" && "invisible"}`} >Complete</button>
                                                                                <button id={`CANCELLED${index}`} onClick={(e) => updateSessionStatus("CANCELLED", session_id, e, index, status)} className={`admin_action_btn btn-outline-danger ${status === "CANCELLED" && "invisible"}`} >Cancel</button>
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
                            url={process.env.REACT_APP_ADMIN_SESSION_LIST}
                            dataList={sessionList}
                            setDataList={setSessionList}
                            setLoading={setLoading}
                        />
                    </div>
                </>
            </HandleAuthorization>

        </div >

    )
}
const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(SessionDataTable)