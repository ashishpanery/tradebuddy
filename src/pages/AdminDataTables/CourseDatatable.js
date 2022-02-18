import { useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import $ from "jquery"
import { default as Component } from '../../components/AdminPortal/Table/DataTable/CommonDataTable'


function CourseDataTable({ currentUser }) {

    const token = currentUser?.token
    const [courseList, setCourseList] = useState([])
    const [loading, setLoading] = useState(true)
    const [courseData, setCourseData] = useState('')

    // apply active className to the below_nav item
    $(function () {
        $("#belownav_courses_item").addClass("fw-bold text-primary");
        $("#belownav_datatable_toggler").text("Courses");

    });


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
        <Component
            dataType="course"
            options={options}
            filename="course"
            data={courseData}
            setData={setCourseData}
            loading={loading}
            updateData={updateCourse}
            updateDataStatus={updateCourseStatus}
            // for pagination
            url={process.env.REACT_APP_ADMIN_COURSE_LIST}
            dataList={courseList}
            setDataList={setCourseList}
            setLoading={setLoading}
        >
        </Component>
    )
}
const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(CourseDataTable)