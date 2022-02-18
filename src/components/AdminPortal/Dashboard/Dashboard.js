import { useState, useEffect } from 'react'
import BelowNav from '../BelowNav/BelowNav'
// import Chart from "react-chartjs-2"
import axios from 'axios'
import { PageLoader } from "../../"
import admin_panel from "../../../images/admin_panel.jpg"
import { connect } from 'react-redux'
import $ from "jquery"


function Dashboard({ currentUser }) {
    const [mentorStatusCount, setMentorStatusCount] = useState([])
    const [menteeStatusCount, setMenteeStatusCount] = useState([])
    const [eventStatusCount, setEventStatusCount] = useState([])
    const [sessionStatusCount, setSessionStatusCount] = useState([])
    const [loading, setLoading] = useState(true)

    // apply active className to the below_nav item
    $(function () {
        $("#belownav_dashboard_item").addClass("fw-bold text-primary");
        $("#belownav_datatable_toggler").text("Dashboard");
    });

    useEffect(() => {
        const getStatusData = async () => {
            await axios.get(`${process.env.REACT_APP_GET_ADMIN_DASHBOARD_STATUS}`,
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                }
            ).then(resp => {
                setMentorStatusCount(resp.data.model.mentorStatusCount)
                setMenteeStatusCount(resp.data.model.menteeCount)
                setEventStatusCount(resp.data.model.eventStatusCount)
                setSessionStatusCount(resp.data.model.sessionStatusCount)
            })
                .catch(err => console.log(err))
            setLoading(false)
        }
        getStatusData()
    }, [])

    const getDateToday = () => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const dateObj = new Date();
        const month = monthNames[dateObj.getMonth()];
        const day = String(dateObj.getDate()).padStart(2, '0');
        const year = dateObj.getFullYear();
        return (month + '\n' + day + ', ' + year);
    }

    return (
        <div>
            {
                loading ? <PageLoader /> :
                    <>
                        <BelowNav />
                        <div className="container mx-auto  content_below_nav ">
                            <div className="content-wrapper">
                                <div className="row">
                                    <div className="col-md-12 grid-margin">
                                        <div className="row">
                                            <div className="col-12 col-xl-8 mb-4 mb-xl-0">
                                                <h3 className="font-weight-bold text-primary text-center text-md-start">Welcome Admin</h3>
                                            </div>
                                            <div className="col-12 col-xl-4">
                                                <div className="justify-content-center justify-content-md-end d-flex">
                                                    <p className='fs-6'> Today ({getDateToday()})</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 col-lg-6 grid-margin stretch-card">
                                        <div className="card">
                                            <div className="card-people">
                                                <img src={admin_panel} alt="people" />
                                                {/* <div className="weather-info">
                                                    <div className="d-flex">
                                                        <div>
                                                            <h2 className="mb-0 font-weight-normal"><i className="icon-sun me-2"></i>31<sup>C</sup></h2>
                                                        </div>
                                                        <div className="ms-2">
                                                            <h4 className="location font-weight-normal">New Delhi</h4>
                                                            <h6 className="font-weight-normal">India</h6>
                                                        </div>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-6 grid-margin transparent">
                                        <div className="row" >
                                            {/* Mentor */}
                                            <div className="col-md-6 mb-4 stretch-card transparent" >
                                                <div className="card card-tale">
                                                    <div className="card-body px-5 ">
                                                        <div className="fs-4 mb-4">Mentors</div>
                                                        <div className="fs-6 mb-2 d-flex justify-content-between">
                                                            <span>Approved:</span>
                                                            <span>{mentorStatusCount.approved}</span>
                                                        </div>
                                                        <div className="fs-6 mb-2 d-flex justify-content-between">
                                                            <span>Pending:</span>
                                                            <span>{mentorStatusCount.pending}</span>
                                                        </div>
                                                        <div className="fs-6 mb-2 d-flex justify-content-between">
                                                            <span>Declined:</span>
                                                            <span>{mentorStatusCount.declined}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Mentee */}
                                            <div className="col-md-6 mb-4 stretch-card transparent">
                                                <div className="card card-dark-blue">
                                                    <div className="card-body  px-5 ">
                                                        <div className="fs-4 mb-4">Mentees</div>
                                                        <div className="fs-6 mb-2 d-flex justify-content-between">
                                                            <span>Total Mentees:</span>
                                                            <span>{menteeStatusCount.noOfMentee}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            {/* Events */}
                                            <div className="col-md-6 mb-4 mb-lg-0 stretch-card transparent">
                                                <div className="card card-light-blue">
                                                    <div className="card-body px-5 ">
                                                        <div className="fs-4 mb-4">Events</div>
                                                        <div className="fs-6 mb-2 d-flex justify-content-between">
                                                            <span>Approved:</span>
                                                            <span>{eventStatusCount.approved}</span>
                                                        </div>
                                                        <div className="fs-6 mb-2 d-flex justify-content-between">
                                                            <span>Pending:</span>
                                                            <span>{eventStatusCount.pending}</span>
                                                        </div>
                                                        <div className="fs-6 mb-2 d-flex justify-content-between">
                                                            <span>Closed:</span>
                                                            <span>{eventStatusCount.closed}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Sessions */}
                                            <div className="col-md-6 stretch-card transparent">
                                                <div className="card card-light-danger">
                                                    <div className="card-body px-5">
                                                        <div className="fs-4 mb-4">Sessions</div>
                                                        <div className="fs-6 mb-2 d-flex justify-content-between">
                                                            <span>Started:</span>
                                                            <span>{sessionStatusCount.started}</span>
                                                        </div>
                                                        <div className="fs-6 mb-2 d-flex justify-content-between">
                                                            <span>Pending:</span>
                                                            <span>{sessionStatusCount.requestPending}</span>
                                                        </div>
                                                        <div className="fs-6 mb-2 d-flex justify-content-between">
                                                            <span>Accepted:</span>
                                                            <span>{sessionStatusCount.accepted}</span>
                                                        </div>
                                                        <div className="fs-6 mb-2 d-flex justify-content-between">
                                                            <span>Completed:</span>
                                                            <span>{sessionStatusCount.completed}</span>
                                                        </div>
                                                        <div className="fs-6 mb-2 d-flex justify-content-between">
                                                            <span>Cancelled:</span>
                                                            <span>{sessionStatusCount.cancelled}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    {/* <div className="col-md-6 grid-margin stretch-card">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between">
                                                    <p className="card-title">Income Report</p>
                                                    <a href="#" className="text-info">View all</a>
                                                </div
                                                <p className="font-weight-500">Total Income in INR Per Month</p>
                                                <div id="sales-legend" className="chartjs-legend mt-4 mb-2"></div>
                                                <canvas id="sales-chart"></canvas>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </>}
        </div>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})
export default connect(mapStateToProps)(Dashboard)