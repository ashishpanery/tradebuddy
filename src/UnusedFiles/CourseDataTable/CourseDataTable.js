import axios from 'axios'
import { useState, useEffect } from 'react'
import sortTable from '../SortTable/SortTable'
import { sortTableNumerically } from '../SortTable/SortTable'
import SearchTable from '../SearchTable/SearchTable'
import { useHistory } from 'react-router-dom'
import { Header, BelowNav, PageLoader, DownloadCSV, Pagination } from "../../../.."
import Select from 'react-select'
import $ from "jquery"
import { connect } from 'react-redux'
import { useLocation } from "react-router-dom"
import useRedirect from '../../../../Redirect/Redirect'
import { HandleAuthorization } from "../../../../../pages"
import useHandleError from '../../../../Handlers/ErrorHandler/ErrorHandler'

function CourseDataTable({ currentUser }) {
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    if (!currentUser) redirectWithLogin()
    const token = currentUser?.token
    const [courseList, setCourseList] = useState([])
    const [loading, setLoading] = useState(true)
    const [courseListData, setCourseListData] = useState('')
    const history = useHistory()
    const [CSVData, setCSVData] = useState()
    const [CSVError, setCSVError] = useState('')
    const { handleError } = useHandleError(location)

    // apply active className to the below_nav item
    $(function () {
        $("#belownav_courses_item").addClass("fw-bold text-primary");
        $("#belownav_datatable_toggler").text("Courses");

    });

    useEffect(() => {
        const getCSVData = async () => {
            await axios.get(`${process.env.REACT_APP_ADMIN_DOWNLOAD_FILE}/courseList`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(resp => {
                    console.log(resp)
                    setCSVData(resp.data)
                }).catch(err => setCSVError(handleError(err.response.status)))
        }
        currentUser && getCSVData();
    }, [])

    const updateCourseStatus = async (id, status, e, index) => {
        await axios.post(`${process.env.REACT_APP_UPDATE_COURSE_STATUS_BY_ID}`,
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
                    let courseStatus = document.getElementById(`${id}${index}`)

                    if (status === "APPROVED") {
                        document.getElementById(`APPROVED${index}`).classList.add("invisible")
                        document.getElementById(`DECLINED${index}`).classList.remove("invisible")
                    }
                    else {
                        document.getElementById(`APPROVED${index}`).classList.remove("invisible")
                        document.getElementById(`DECLINED${index}`).classList.add("invisible")

                    }
                    courseStatus.innerHTML = status
                    courseStatus.classList = `text-${status === `APPROVED` ? 'success' : status === 'DECLINED' ? 'dark' : 'warning'}`
                }
            })
            .catch(err => console.log(err))
    }
    const updateCourse = async (action, course, e, index) => {
        switch (action) {
            case "approve":
                updateCourseStatus(course.id, "APPROVED", e, index)
                break
            default:
                updateCourseStatus(course.id, "DECLINED", e, index)

        }
    }

    const options = [
        { value: "ID", label: "ID" },
        { value: "name", label: "Course Name" },
        { value: "no_of_lectures", label: "Lectures" },
        { value: "free", label: "Free/Paid" },
        { value: "fee", label: "Fee" },
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
                                            {CSVError ? <p>Download is not available.</p> : < DownloadCSV filename="courseList_data.csv" token={token} CSVData={CSVData} />}
                                        </div>
                                        {/* Search box */}
                                        <div className="d-flex justify-content-end  flex-column flex-sm-row table_search">
                                            <Select options={options}
                                                value={courseListData}
                                                onChange={setCourseListData}
                                                className="select_box_table"
                                            />
                                            <input readOnly={courseListData !== "" ? false : true} className={`px-3 py-2 ${courseListData === "" ? 'cursor-not-allowed' : null}`} id="table_search" type="text" placeholder="Search table" onKeyUp={() => SearchTable(courseListData.value, "personalCourseAdmin")} />
                                        </div>
                                        <div className="row border">
                                            <div className="col-12 px-0">
                                                <div className="table-responsive">
                                                    <table id="order-listing" className="table">
                                                        <thead>
                                                            {/* Table headers */}
                                                            <tr className="bg-primary text-white">
                                                                <th className="cursor-pointer" onClick={() => sortTable(0)}>Mentor ID</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(1)}>Course Name</th>
                                                                <th className="cursor-pointer" onClick={() => sortTableNumerically(2)}>Lectures</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(3)}>Free</th>
                                                                <th className="cursor-pointer" onClick={() => sortTableNumerically(4)}>Fee</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(5)}>Status</th>
                                                                <th className='text-center' >Actions</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                courseList.map((course, index) => {
                                                                    const { id, mentorId, title, lectureList, free, fee, status } = course
                                                                    return <tr>
                                                                        <td className='cursor-pointer' onClick={() => history.push(`/profile/${mentorId}`)}>{mentorId}</td>
                                                                        <td className='cursor-pointer' onClick={() => history.push(`/courses/${id}/${title.split(" ").join("-")}`)}>{title ? title : "-"}</td>
                                                                        <td className='text-center'>{lectureList ? lectureList.length : "-"}</td>
                                                                        <td className='text-center'>{free ? "Yes" : "No"}</td>
                                                                        <td className='text-center'>{free ? "NA" : fee}</td>
                                                                        <td id={`${id}${index}`} className={`${status === "PENDING" ? 'text-warning' : status === "APPROVED" && "text-success"}`} >{status}</td>
                                                                        <td>
                                                                            <div className="d-flex gap-2">
                                                                                <button id={`APPROVED${index}`} onClick={(e) => updateCourse("approve", course, e, index, status)} className={`btn btn-outline-success p-2  ${status === "APPROVED" ? 'invisible' : null}`}>Approve</button>
                                                                                <button id={`DECLINED${index}`} onClick={(e) => updateCourse("decline", course, e, index, status)} className={`btn btn-outline-dark p-2 ${status === "DECLINED" ? "invisible" : null}`} >Decline</button>
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
                            url={process.env.REACT_APP_ADMIN_COURSE_LIST}
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

export default connect(mapStateToProps)(CourseDataTable)