import { useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import $ from "jquery"
import { default as Component } from '../../components/AdminPortal/Table/DataTable/CommonDataTable'

function MenteeDataTable({ currentUser }) {
    const token = currentUser?.token
    const [menteeList, setMenteeList] = useState([])
    const [loading, setLoading] = useState(true)
    const [menteeData, setMenteeData] = useState('')

    // apply active className to the below_nav item
    $(function () {
        $("#belownav_mentees_item").addClass("fw-bold text-primary");
        $("#belownav_datatable_toggler").text("Mentees");

    });


    const options = [
        { value: "Name", label: "Name" },
        { value: "emailAddress", label: "E-mail" },
        { value: "phonenumber", label: "Phone" },
        { value: "currentCompany", label: "Company" },
        { value: "Designation", label: "Designation" },
        { value: "experienceInYears", label: "Experience" },
    ]

    const deleteMentee = async (mentee, index) => {
        await axios.delete(`${process.env.REACT_APP_DELETE_MENTOR_BY_ID}/${mentee.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(resp => {
                if (resp.status === 200) {
                    let mentorObject = document.getElementById(`menteeRow${index}`)
                    mentorObject.classList.add('d-none')
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <Component
            dataType="mentee"
            options={options}
            filename="mentee"
            data={menteeData}
            setData={setMenteeData}
            loading={loading}
            updateData={deleteMentee}
            // for pagination
            url={process.env.REACT_APP_ADMIN_MENTEE_LIST}
            dataList={menteeList}
            setDataList={setMenteeList}
            setLoading={setLoading}
        >
        </Component>


    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(MenteeDataTable)