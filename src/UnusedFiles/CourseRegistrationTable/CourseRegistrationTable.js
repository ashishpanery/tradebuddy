import { useState, useEffect } from 'react'
import axios from 'axios'
import { Header, BelowNav, PageLoader, DownloadCSV, Pagination } from "../../../../"
import sortTable from '../SortTable/SortTable'
import { sortTableNumerically } from '../SortTable/SortTable'
import SearchTable from '../SearchTable/SearchTable'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import $ from "jquery"
import { connect } from 'react-redux'
import { useLocation } from "react-router-dom"
import useRedirect from '../../../../Redirect/Redirect'
import { HandleAuthorization } from "../../../../../pages"
import useHandleError from '../../../../Handlers/ErrorHandler/ErrorHandler'

function CourseRegistrationTable({ currentUser }) {
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    if (!currentUser) redirectWithLogin()
    const token = currentUser?.token
    const [courseList, setCourseList] = useState([])
    const [loading, setLoading] = useState(true)
    const [courseListData, setCourseListData] = useState('')
    const history = useHistory()
    const [CSVData, setCSVData] = useState('')
    const [CSVError, setCSVError] = useState('')
    const { handleError } = useHandleError(location)
    document.title = "Course Registration Table | Admin Portal | TradeBuddy"


    // apply active class to the below_nav item
    $(function () {
        $("#belownav_course-registrations_item").addClass("fw-bold text-primary");
        $("#belownav_datatable_toggler").text("Course Registrations");

    });

    //Download CSV
    useEffect(() => {
        const getCSVData = async () => {
            await axios.get(`${process.env.REACT_APP_ADMIN_DOWNLOAD_FILE}/courseRegistration`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(resp => {
                    console.log(resp)
                    setCSVData(resp.data)
                }).catch(err => setCSVError(handleError(err.response.status)))
        }
        getCSVData();
    }, [token])

    const options = [
        { value: "Name", label: "Name" },
        { value: "email", label: "E-mail" },
        { value: "content_type", label: "Content Type" },
        { value: "ordered_date", label: "Ordered Date" },
        { value: "amount", label: "Amount" },
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
                                        {/* <h4 class="card-title">Data table</h4> */}
                                        {/* Download button */}
                                        <div className='my-4 my-md-0'>
                                            {CSVError ? <p>Download is not available.</p> : < DownloadCSV filename="course_registrations_data.csv" token={token} CSVData={CSVData} />}

                                        </div>
                                        {/* Search box */}
                                        <div className="d-flex justify-content-end  flex-column flex-sm-row table_search">
                                            <Select options={options}
                                                value={courseListData}
                                                onChange={setCourseListData}
                                                className="select_box_table"
                                            />
                                            <input readOnly={courseListData !== "" ? false : true} className={`px-3 py-2 ${courseListData === "" ? 'cursor-not-allowed' : null}`} id="table_search" type="text" placeholder="Search table" onKeyUp={() => SearchTable(courseListData.value, "courseList")} />
                                        </div>
                                        <div class="row border">
                                            <div class="col-12 px-0">
                                                <div class="table-responsive">
                                                    <table id="order-listing" class="table">
                                                        <thead>
                                                            {/* Table headers */}
                                                            <tr className="bg-primary text-white">
                                                                <th className="cursor-pointer" onClick={() => sortTable(0)}>Name</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(1)}>Email</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(2)}>Content Type</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(3)}>Ordered Date</th>
                                                                <th className="cursor-pointer" onClick={() => sortTableNumerically(4)}>Amount</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(5)}>Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                courseList.map((course, index) => {
                                                                    const { menteeId, menteeName, menteeEmail, contentType, orderDate, amount, paymentStatus } = course
                                                                    return <tr>
                                                                        <td className='cursor-pointer' onClick={() => history.push(`/profile/${menteeId}`)}>{menteeName ? menteeName : "-"}</td>
                                                                        <td>{menteeEmail ? menteeEmail : "-"}</td>
                                                                        <td >{contentType}</td>
                                                                        <td >{orderDate ? orderDate : '-'}</td>
                                                                        <td className='text-center' >{amount}</td>
                                                                        <td className={`${paymentStatus === "PAYMENT_PENDING" ? 'text-warning' : paymentStatus === "PAYMENT_SUCCESS" ? "text-success" : "text-danger"}`} >{paymentStatus}</td>
                                                                        {/* <td><label id={id} className={`badge badge-outline-${status === `APPROVED` ? 'success' : status === 'DECLINED' ? 'dark' : 'warning'}`}>{status}</label></td> */}
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
                            url={process.env.REACT_APP_ADMIN_CONTENT_REGISTRATION_LIST}
                            dataList={courseList}
                            setDataList={setCourseList}
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

export default connect(mapStateToProps)(CourseRegistrationTable)