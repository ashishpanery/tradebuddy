import { useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import $ from "jquery"
import { default as Component } from '../../components/AdminPortal/Table/DataTable/CommonDataTable'

function CourseRegistrationTable({ currentUser }) {
    const token = currentUser?.token
    const [courseRegistrationList, setCourseRegistrationList] = useState([])
    const [loading, setLoading] = useState(true)
    const [courseRegistrationData, setCourseRegistrationData] = useState('')
    document.title = "Course Registration Table | Admin Portal | TradeBuddy"

    // apply active class to the below_nav item
    $(function () {
        $("#belownav_course-registrations_item").addClass("fw-bold text-primary");
        $("#belownav_datatable_toggler").text("Course Registrations");

    });

    const options = [
        { value: "Name", label: "Name" },
        { value: "email", label: "E-mail" },
        { value: "content_type", label: "Content Type" },
        { value: "ordered_date", label: "Ordered Date" },
        { value: "amount", label: "Amount" },
        { value: "status", label: "Status" }
    ]

    return (
        <Component
            dataType="courseRegistration"
            options={options}
            filename="course_registration"
            data={courseRegistrationData}
            setData={setCourseRegistrationData}
            loading={loading}
            // for pagination
            url={process.env.REACT_APP_ADMIN_CONTENT_REGISTRATION_LIST}
            dataList={courseRegistrationList}
            setDataList={setCourseRegistrationList}
            setLoading={setLoading}
        >
        </Component>
    )
}
const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(CourseRegistrationTable)