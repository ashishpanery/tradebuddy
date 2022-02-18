import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import "./BelowNav.css"
import event_icon from "../../../images/event_icon.png"
import session_icon from "../../../images/session_icon.png"
import mentor_icon from "../../../images/mentor_icon.png"
import mentee_icon from "../../../images/mentee_icon.png"
import dashboard_icon from "../../../images/dashboard_icon.png"
import order_icon from "../../../images/order_icon.png"
import courseList_icon from "../../../images/courseList_icon.png"
import query_icon from "../../../images/query_icon.png"
import menu from "../../../images/menu.png"

export default function BelowNav() {
    const [mediaScreen, setMediaScreen] = useState(window.innerWidth)
    const getScreenWidth = () => {
        console.log("size changed")
        setMediaScreen(window.innerWidth)

    }
    useEffect(() => {
        window.addEventListener("resize", () => getScreenWidth())

        return () => { window.removeEventListener("resize", () => getScreenWidth()) }
    }, [])
    return (
        <>
            <div className="horizontal-menu">
                {
                    mediaScreen > 991 ?
                        <nav className="bottom-navbar below-nav-sticky-top">
                            <div className="container">
                                <ul className="nav gap-2 ">
                                    <li className="nav-item">
                                        <a className="nav-link" href="/portal">
                                            <img style={{ width: "20px", height: "20px" }} src={dashboard_icon} alt="" />
                                            <span id="belownav_dashboard_item" className="menu-title ms-2">Dashboard</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/mentor_datatable" className="nav-link">
                                            <img style={{ width: "20px", height: "20px" }} src={mentor_icon} alt="" />
                                            <span id="belownav_mentors_item" className="menu-title ms-2">Mentors</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/mentee_datatable" className="nav-link">
                                            <img style={{ width: "20px", height: "20px" }} src={mentee_icon} alt="" />
                                            <span id="belownav_mentees_item" className="menu-title ms-2">Mentees</span>
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link to="/event_datatable" className="nav-link">
                                            <img style={{ width: "20px", height: "20px" }} src={event_icon} alt="" />
                                            <span id="belownav_events_item" className="menu-title ms-2">Events</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/session_datatable" className="nav-link">
                                            <img style={{ width: "20px", height: "20px" }} src={session_icon} alt="" />
                                            <span id="belownav_sessions_item" className="menu-title ms-2">Sessions</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/order_datatable" className="nav-link">
                                            <img style={{ width: "20px", height: "20px" }} src={order_icon} alt="" />
                                            <span id="belownav_orders_item" className="menu-title ms-2">Orders</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/course_datatable" className="nav-link">
                                            <img style={{ width: "20px", height: "20px" }} src={courseList_icon} alt="" />
                                            <span id="belownav_courses_item" className="menu-title ms-2">Courses</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/courseList_datatable" className="nav-link">
                                            <img style={{ width: "20px", height: "20px" }} src={courseList_icon} alt="" />
                                            <span id="belownav_course-registrations_item" className="menu-title ms-2">Course Registrations</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/query_datatable" className="nav-link">
                                            <img style={{ width: "20px", height: "20px" }} src={query_icon} alt="" />
                                            <span id="belownav_queries_item" className="menu-title ms-2">Queries</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/registeredBootcampList_datatable" className="nav-link">
                                            <img style={{ width: "20px", height: "20px" }} src={courseList_icon} alt="" />
                                            <span id="belownav_registeredBootcampList_item" className="menu-title ms-2">Registered Bootcamps</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                        :
                        <nav className='mt-5 pt-4' >
                            <div className='  below_nav px-3  mt-2'>
                                <div className=" d-flex flex-row-reverse justify-content-end  align-items-end gap-2 pt-3 pb-2 container ">
                                    <p id="belownav_datatable_toggler" className="fs-5 fw-bold"></p>
                                    <img src={menu} alt="below_nav_toggler" className="navbar-toggler border" style={{ width: "2.25em", filter: "grayscale(70%)" }} data-bs-toggle="offcanvas" href="#offcanvasBelowNavBtn" role="button" aria-controls="offcanvasBelowNavBtn">
                                    </img>
                                </div>
                            </div>
                            <div className="offcanvas offcanvas-start mt-5 pt-5" tabIndex="-1" id="offcanvasBelowNavBtn" aria-labelledby="offcanvasBelowNavBtn">
                                <div className="offcanvas-header">
                                    <h5 className="text-center" >Datatables</h5>
                                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                </div>
                                <div className="offcanvas-body">
                                    <div className="container">
                                        <ul className="">
                                            <li className="nav-item">
                                                <a className="nav-link" href="/portal">
                                                    <img style={{ width: "20px", height: "20px" }} src={dashboard_icon} alt="" />
                                                    <span id="belownav_dashboard_item" className="menu-title ms-2">Dashboard</span>
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/mentor_datatable" className="nav-link">
                                                    <img style={{ width: "20px", height: "20px" }} src={mentor_icon} alt="" />
                                                    <span id="belownav_mentors_item" className="menu-title ms-2">Mentors</span>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/mentee_datatable" className="nav-link">
                                                    <img style={{ width: "20px", height: "20px" }} src={mentee_icon} alt="" />
                                                    <span id="belownav_mentees_item" className="menu-title ms-2">Mentees</span>
                                                </Link>
                                            </li>

                                            <li className="nav-item">
                                                <Link to="/event_datatable" className="nav-link">
                                                    <img style={{ width: "20px", height: "20px" }} src={event_icon} alt="" />
                                                    <span id="belownav_events_item" className="menu-title ms-2">Events</span>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/session_datatable" className="nav-link">
                                                    <img style={{ width: "20px", height: "20px" }} src={session_icon} alt="" />
                                                    <span id="belownav_sessions_item" className="menu-title ms-2">Sessions</span>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/order_datatable" className="nav-link">
                                                    <img style={{ width: "20px", height: "20px" }} src={order_icon} alt="" />
                                                    <span id="belownav_orders_item" className="menu-title ms-2">Orders</span>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/course_datatable" className="nav-link">
                                                    <img style={{ width: "20px", height: "20px" }} src={courseList_icon} alt="" />
                                                    <span id="belownav_courses_item" className="menu-title ms-2">Courses</span>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/courseList_datatable" className="nav-link">
                                                    <img style={{ width: "20px", height: "20px" }} src={courseList_icon} alt="" />
                                                    <span id="belownav_course-registrations_item" className="menu-title ms-2">Course Registrations</span>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/query_datatable" className="nav-link">
                                                    <img style={{ width: "20px", height: "20px" }} src={query_icon} alt="" />
                                                    <span id="belownav_queries_item" className="menu-title ms-2">Queries</span>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/registeredBootcampList_datatable" className="nav-link">
                                                    <img style={{ width: "20px", height: "20px" }} src={courseList_icon} alt="" />
                                                    <span id="belownav_registeredBootcampList_item" className="menu-title ms-2">Registered Bootcamps</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </nav>
                }
            </div>
        </>

    )
}
