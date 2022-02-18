import { useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import $ from "jquery"
import { default as Component } from '../../components/AdminPortal/Table/DataTable/CommonDataTable'

function MentorDatatable({ currentUser }) {
    const token = currentUser?.token
    const [mentorList, setMentorList] = useState([])
    const [loading, setLoading] = useState(true)
    const [mentorData, setMentorData] = useState('')

    // apply active className to the below_nav item
    $(function () {
        $("#belownav_mentors_item").addClass("fw-bold text-primary");
        $("#belownav_datatable_toggler").text("Mentors");

    });

    const updateMentorStatus = async (id, status, e, index) => {
        await axios.post(`${process.env.REACT_APP_UPDATE_MENTOR_STATUS}`,
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
                    let mentorStatus = document.getElementById(`${id}${index}`)
                    if (status === "APPROVED") {
                        document.getElementById(`APPROVED${index}`).classList.add("invisible")
                        document.getElementById(`DECLINED${index}`).classList.remove("invisible")
                    }
                    else {
                        document.getElementById(`APPROVED${index}`).classList.remove("invisible")
                        document.getElementById(`DECLINED${index}`).classList.add("invisible")

                    }
                    mentorStatus.innerHTML = status
                    mentorStatus.classList = `text-${status === `APPROVED` ? 'success' : status === 'DECLINED' ? 'dark' : 'warning'}`
                }
            })
    }
    const updateMentor = async (action, mentor, e, index) => {
        switch (action) {
            case "approve":
                updateMentorStatus(mentor.id, "APPROVED", e, index)
                break
            case "delete":
                await axios.delete(`${process.env.REACT_APP_DELETE_MENTOR_BY_ID}/${mentor.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
                )
                    .then(resp => {
                        if (resp.status === 200) {
                            let mentorObject = document.getElementById(`mentorRow${index}`)
                            mentorObject.classList.add('d-none')

                        }
                    })
                break
            case "decline":
                updateMentorStatus(mentor.id, "DECLINED", e, index)
                break
            default:
                return

        }
    }
    const options = [
        { value: "Name", label: "Name" },
        { value: "email", label: "E-mail" },
        { value: "phone", label: "Phone" },
        { value: "currentCompany", label: "Company" },
        { value: "Designation", label: "Designation" },
        { value: "experienceInYears", label: "Experience" },
        { value: "status", label: "Status" }
    ]
    return (
        <Component
            dataType="mentor"
            options={options}
            filename="mentor"
            data={mentorData}
            setData={setMentorData}
            loading={loading}
            updateData={updateMentor}
            updateDataStatus={updateMentorStatus}
            // for pagination
            url={process.env.REACT_APP_ADMIN_MENTOR_LIST}
            dataList={mentorList}
            setDataList={setMentorList}
            setLoading={setLoading}
        >
        </Component>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(MentorDatatable)