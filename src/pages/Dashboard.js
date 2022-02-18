import { useState, useEffect } from 'react'
import { Header, Footer, PageLoader, SessionRescheduler, SessionCards } from "../components"
import "./Dashboard.css"
import axios from "axios"
import { Bar } from "react-chartjs-2"
import { joinCallDetails } from "../react-redux/reducers/allActions"
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import $ from "jquery"
import { useLocation } from "react-router-dom"
import useRedirect from '../components/Redirect/Redirect'
import { HandleAuthorization } from "../pages"
import useHandleError from '../components/Handlers/ErrorHandler/ErrorHandler'
import { PaginationLoader } from '../components/Spinner/Spinner'

function Dashboard({ currentUser, joinCallDetails }) {
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    const { handleError } = useHandleError(location)
    if (!currentUser) redirectWithLogin()
    const [paymentData, setPaymentData] = useState([])
    const [sessionData, setSessionData] = useState([])
    // const [mentorSessionData, setMentorSessionData] = useState([])
    const [chartMonthlyData, setChartMonthlyData] = useState([])
    const [toDO, setToDo] = useState([])
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [details, setDetails] = useState(1)
    // error states
    const [paymentDataError, setPaymentDataError] = useState('')
    const [mentorSessionAcceptedError, setMentorSessionAcceptedError] = useState('')
    const [mentorSessionStartedError, setMentorSessionStartedError] = useState('')
    const [toDoError, setToDoError] = useState('')
    // loading states
    const [paymentDataLoading, setPaymentDataLoading] = useState(true)
    const [mentorSessionStartedLoading, setMentorSessionStartedLoading] = useState(true)
    const [mentorSessionAcceptedLoading, setMentorSessionAcceptedLoading] = useState(true)
    const [toDoLoading, setToDoLoading] = useState(true)


    $(function () {
        $("#nav_mentorDashboard_item").addClass("nav_item_active");
    });

    // const [chartYearlyData, setChartYearlyData] = useState([])
    // const [chartWeeklyData, setChartWeeklyData] = useState([])
    const monthly = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const weekly = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const yearly = []
    const [sortBy, setSortBy] = useState(monthly)
    const [chartLabel, setChartLabel] = useState('MONTHLY')
    let cardCount = 0
    const history = useHistory()
    // const [chartX, setChartX] = useState(monthly)
    const [newToDo, setNewToDo] = useState('')
    const token = currentUser && currentUser.token

    // api requests
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Chart values for Weekly
                // await axios.get(`process.env.REACT_APP_CHART_VALUES}/${currentUser.data.id}/Weekly`,
                //     {
                //         headers: {
                //             Authorization: `Bearer ${currentUser.token}`
                //         }
                //     })
                //     .then(resp => setChartWeeklyData(resp.data.model))

                // Chart values for Monthly
                // await axios.get(`${process.env.REACT_APP_CHART_VALUES}/${currentUser.data.id}/Monthly`,
                //     {
                //         headers: {
                //             Authorization: `Bearer ${currentUser.token}`
                //         }
                //     })
                //     .then(resp => setChartMonthlyData(resp.data.model))
                //     .catch(err => console.log(err))

                // Chart values for Yearly
                // await axios.get("process.env.REACT_APP_CHART_VALUES}/${currentUser.data.id}/Yearly",
                //     {
                //         headers: {
                //             Authorization: `Bearer ${currentUser.token}`
                //         }
                //     })
                //     .then(resp => setChartYearlyData(resp.data.model))



                // Payment details
                await axios.get(`${process.env.REACT_APP_DASHBOARD_PAYMENT_DETAILS}`, {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                })
                    .then(resp => {
                        setPaymentData(resp.data.model)
                        setPaymentDataLoading(false)
                    })
                    .catch(err => {
                        (currentUser && err.response.status === 401)
                            ?
                            setPaymentDataError(handleError(0, "Couldn't load Payment Data"))
                            :
                            setPaymentDataError(handleError(err.response.status))
                        setPaymentDataLoading(false)
                    })

                //Session data
                await axios.post(`${process.env.REACT_APP_STARTED_SESSIONS}/${currentUser.data.id}/STARTED`,
                    {
                        "pageNo": 1,
                        "pageSize": 5,
                        "sort": "experience"
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${currentUser.token}`
                        }
                    })
                    .then(async startedSessionsResponse => {
                        // setMentorSessionData(startedSessionsResponse.data.model)
                        console.log(startedSessionsResponse.data.model)
                        setMentorSessionStartedLoading(false)

                        if (startedSessionsResponse.length < 5) {
                            await axios.post(`${process.env.REACT_APP_STARTED_SESSIONS}/${currentUser.data.id}/ACCEPTED`,
                                {
                                    "pageNo": 1,
                                    "pageSize": 5,
                                    "sort": "experience"
                                },
                                {
                                    headers: {
                                        Authorization: `Bearer ${currentUser.token}`
                                    }
                                })
                                .then(acceptedSessionsResponse => {
                                    // if (Object.keys(startedSessionsResponse.data.model).length < 5) {
                                    let sessionDataArray = [...startedSessionsResponse.data.model, ...acceptedSessionsResponse.data.model]
                                    setSessionData(sessionDataArray)
                                    setMentorSessionAcceptedLoading(false)
                                })
                                .catch(err => {
                                    setMentorSessionAcceptedError(handleError(err.response.status))
                                    setMentorSessionAcceptedLoading(false)
                                })
                        }
                        else {
                            setSessionData(startedSessionsResponse.data.model)
                        }
                    })
                    .catch(err => {
                        setMentorSessionStartedError(handleError(err.response.status))
                        setMentorSessionStartedLoading(false)
                    })

                // ToDo Data
                await axios.get(`${process.env.REACT_APP_GET_TODO_BY_ID}/${currentUser.data.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${currentUser.token}`
                        }
                    }
                )
                    .then(resp => {
                        setToDo(resp.data.model)
                        setToDoLoading(false)

                    })
                    .catch(err => {
                        setToDoError(handleError(err.response.status))
                        setToDoLoading(false)
                    })

            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])


    // const sortChart = (sortBy) => {
    //     if (sortBy === 'weekly') {
    //         setSortBy(weekly)
    //         setChartLabel('WEEKLY')
    //     }
    //     if (sortBy === 'monthly') {
    //         setSortBy(monthly)
    //         setChartLabel('MONTHLY')
    //         // setChartX(Object.keys(chartMonthlyData))
    //     }
    //     if (sortBy === 'yearly') {
    //         setSortBy(yearly)
    //         setChartLabel('YEARLY')

    //     }
    // }

    const joinCall = async (sessionID) => {
        await axios.get(`${process.env.REACT_APP_GET_CALL_OBJECT}${sessionID}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((getCallObject) => {
            joinCallDetails(getCallObject.data.model)
            history.push(`/join-call/${currentUser.data.id}`)
        })
    }
    const getDateToday = () => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const dateObj = new Date();
        const month = monthNames[dateObj.getMonth()];
        const day = String(dateObj.getDate()).padStart(2, '0');
        const year = dateObj.getFullYear();
        return (month + '\n' + day + ', ' + year);
    }

    const updateSessionStatus = async (status) => {
        await axios.put(`${process.env.REACT_APP_UPDATE_MENTOR_SESSION}/${currentUser.data.id}/${status}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .catch(error => alert(error.response.status, error.response.statusText))
    }

    // if (!currentUser) return <div className="text-center display-6 m-5">Access denied.</div>
    // if (currentUser.isMentor === "false") return <div className="text-center display-6 m-5">Access denied.</div>


    const updateToDo = async (id) => {
        let val
        toDO.map((item) => {
            if (item.id === id) {
                if (item.status === "PENDING") {
                    val = "COMPLETED"
                }
                else {
                    val = "PENDING"

                }
            }
        })
        await axios.post(process.env.REACT_APP_UPDATE_TODO, {
            id: id,
            status: val
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(resp => {
                // console.log(resp.data.model)
                let updatedToDO = resp.data.model
                const newToDO = toDO.map((item) => {
                    if (item.id === id) {
                        item = updatedToDO
                        return { ...item }
                    }
                    return item
                })
                setToDo(newToDO)
            })

    }

    const createToDo = async (newToDo) => {
        // console.log(newToDo)
        if (newToDo === '') return
        let dateObj = new Date()
        await axios.post(process.env.REACT_APP_SAVE_TODO, {
            userId: currentUser.data.id,
            item: newToDo,
            status: "PENDING",
            date: `${dateObj.getDate()}-${dateObj.getMonth()}-${dateObj.getFullYear()}`
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(resp => {
                let temp = [...toDO, resp.data.model]
                setToDo(temp)

            })
            .catch(err => console.log(err))
    }

    const addByKeyboard = (key) => {
        if (key === "Enter") {
            createToDo(newToDo)
        }
    }

    return (
        <>
            <header>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Mentor Dashboard - TradeBuddy  </title>
                </Helmet>
                <Header />
            </header>

            <HandleAuthorization>
                {/*  */}
                <div className="container mx-auto mt-5 pt-default">
                    <div className="content-wrapper">
                        <div className="row">
                            <div className="col-md-12 grid-margin">
                                <div className="row">
                                    <div className="col-12 col-xl-8 mb-4 mb-xl-0">
                                        <h3 className="font-weight-bold text-primary">Welcome Mentor</h3>
                                    </div>
                                    <div className="col-12 col-xl-4">
                                        <div className="justify-content-end d-flex">
                                            <div className="dropdown flex-md-grow-1 flex-xl-grow-0 fs-6">
                                                <i className="mdi mdi-calendar"></i> Today ({getDateToday()})
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 grid-margin transparent">
                                <div className="row" >
                                    <div className="col-md-6 mb-4 stretch-card transparent" >
                                        <div className="card card-light-blue">
                                            <div className="card-body px-5 ">
                                                <div className="fs-5 mb-4 text-center text-center">Total Sessions</div>
                                                <div className="fs-5 mb-4 text-center">420</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-4 stretch-card transparent">
                                        <div className="card card-dark-blue">
                                            <div className="card-body  px-5 ">
                                                <div className="fs-5 mb-4 text-center">Scheduled</div>
                                                <div className="fs-5 mb-4 text-center">42</div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row" >
                                    <div className="col-md-6 mb-4 stretch-card transparent" >
                                        <div className="card card-tale">
                                            <div className="card-body px-5 ">
                                                <div className="fs-5 mb-4 text-center">No. of Registrations</div>
                                                <div className="fs-5 mb-4 text-center">33</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-4 stretch-card transparent">
                                        <div className="card card-light-danger">
                                            <div className="card-body  px-5 ">
                                                <div className="fs-5 mb-4 text-center">Request Pending</div>
                                                <div className="fs-5 mb-4 text-center">12</div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    paymentDataLoading ? <PaginationLoader /> :
                                        paymentDataError ? paymentDataError :
                                            <div className="row">
                                                <div className="col-md-6 mb-4 mb-lg-0 stretch-card transparent">
                                                    <div className="card card-dark-blue">
                                                        <div className="card-body px-5">
                                                            <div className="fs-5 mb-4 text-center">Total Payout</div>
                                                            <div className="fs-5 mb-4 text-center">Rs. {paymentData.total_payout}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 stretch-card transparent">
                                                    <div className="card card-light-blue">
                                                        <div className="card-body px-5 ">
                                                            <div className="fs-5 mb-4 text-center">Payment Pending</div>
                                                            <div className="fs-5 mb-4 text-center">Rs. {paymentData.pending_payout}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                }
                            </div>
                            <div className="col-lg-5 grid-margin stretch-card">
                                {/* TO DO LIST */}
                                <div className="card">
                                    <div className="card-body border rounded">
                                        <h4 className="card-title">To Do List</h4>
                                        <div className=" d-flex flex-column flex-md-row align-items-center  mb-0 mt-2 py-3 gap-2">
                                            <input type="text" className="form-control text_todo h-100" placeholder="Add new task" value={newToDo} onKeyDown={e => addByKeyboard(e.key)} onChange={e => setNewToDo(e.target.value)} />
                                            {
                                                newToDo !== '' &&
                                                <div className='px-3 bg-theme-color border rounded'>
                                                    <svg onClick={() => createToDo(newToDo)} className=' bg-theme-color px-2' fill="#ffffff" viewBox="0 0 50 50" width="50px" height="50px"><path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24 13 L 24 24 L 13 24 L 13 26 L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z" /></svg>

                                                </div>

                                            }
                                        </div>
                                        {
                                            toDoLoading ? <PaginationLoader /> :
                                                toDoError ? toDoError :
                                                    <div className="list-wrapper pt-2 ">
                                                        <ul className="d-flex flex-column todo-list todo-list-custom ">
                                                            {
                                                                toDO.map((item, index) => {
                                                                    return <li key={index}>
                                                                        <div>
                                                                            <div className="to_do_item d-flex justify-content-start align-items-center">
                                                                                <input type="checkbox" checked={item.status === 'COMPLETED' ? true : false} onChange={() => updateToDo(item.id)} />
                                                                                <p className={`${item.status === 'COMPLETED' ? 'completed' : null} m-0`}>{item.item}</p>
                                                                            </div>
                                                                            <div className={`${item.status === 'COMPLETED' ? 'completed' : null} ms-4`}>{item.date}</div>

                                                                        </div>
                                                                        {/* <div className="ms-auto d-none" onClick={() => deleteToDo(item.id)}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-trash" viewBox="0 0 16 16">
                                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                                    </svg>
                                                                </div> */}
                                                                    </li>
                                                                })}
                                                        </ul>
                                                    </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  */}

                    <h6 className="fw-bold fs-4 my-4">Upcoming sessions</h6>
                    {/* Cards */}
                    {

                        mentorSessionStartedLoading && mentorSessionAcceptedLoading ? <PaginationLoader /> :
                            mentorSessionAcceptedError ? mentorSessionAcceptedError :
                                mentorSessionStartedError ? mentorSessionStartedError :
                                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-5 g-2 flex-wrap mb-5 pb-5">
                                        {sessionData.length === 0 ? <div>No data available</div> :
                                            sessionData.map((item, index) => {
                                                cardCount++
                                                return cardCount <= 5 ?
                                                    <div className="col custom-width" key={index}>
                                                        <SessionCards
                                                            item={item}
                                                            setDetails={setDetails}
                                                            details={details}
                                                            joinCall={joinCall}
                                                        />
                                                    </div>
                                                    :
                                                    null
                                            })
                                        }
                                        {/* reshedule session modal */}
                                        <div className="modal fade" id="reScheduleSessionModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="staticBackdropLabel">Reschedule session</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        {
                                                            success ?
                                                                <h4 className='text-success'>Session has been rescheduled.</h4>
                                                                :
                                                                <SessionRescheduler
                                                                    currentUser={currentUser}
                                                                    details={details}
                                                                    setSuccess={setSuccess}
                                                                    saving={saving}
                                                                    setSaving={setSaving}
                                                                />
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* cancel session modal */}
                                        <div className="modal fade" id="cancelSessionModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="staticBackdropLabel">Cancel Session</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        Are you sure you want to cancel this session?
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button onClick={() => updateSessionStatus("CANCELLED")} type="button" className="btn" data-bs-dismiss="modal">Yes</button>
                                                        <button type="button" className="btn" data-bs-dismiss="modal">No</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                    }

                    {/* <h6 className="fw-bold fs-4 my-4">Visualize your sessions</h6>
                    <div className="mt-4 bar-chart">
                        <h4>No of sessions</h4>
                        <Bar
                            height={10}
                            width={30}
                            options={{
                                maintainAspectRatio: true,
                            }}
                            data={{
                                labels: sortBy,
                                barThickness: 0.4,
                                datasets: [{
                                    label: `No. of Sessions (${chartLabel})`,
                                    data: [1, 6, 3, 5, 2, 3],
                                    backgroundColor: [
                                        'rgb(0,124,194)',
                                    ],
                                    borderRadius: '50',
                                }]
                            }
                            }
                        />
                        <div className="my-5 text-end">
                                <button onClick={() => sortChart('weekly')} className="btn chart_sort_button text-center ">Weekly</button>
                                <button onClick={() => sortChart('monthly')} className="btn chart_sort_button text-center ">Monthly</button>
                                <button onClick={() => sortChart('yearly')} className="btn chart_sort_button text-center ">Yearly</button>
                            </div>

                    </div> */}
                </div>
            </HandleAuthorization>
        </>
    )
}

//to sort the keys for chart:
// const ordered = Object.keys(unordered).sort().reduce(
//     (obj, key) => { 
//       obj[key] = unordered[key]; 
//       return obj;
//     }, 
//     {}
//   );
const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
    userDetails: state
})

const mapDispatchToProps = (dispatch) => ({
    joinCallDetails: (details) => dispatch(joinCallDetails(details)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
