import { useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import $ from "jquery"
import { default as Component } from '../../components/AdminPortal/Table/DataTable/CommonDataTable'

function BootcampRegistrationTable({ currentUser }) {
    const token = currentUser?.token
    const [registeredBootcampList, setRegisteredBootcampList] = useState([])
    const [loading, setLoading] = useState(true)
    const [registeredBootcampData, setRegisteredBootcampData] = useState('')

    // apply active className to the below_nav item
    $(function () {
        $("#belownav_registeredBootcampList_item").addClass("fw-bold text-primary");
        $("#belownav_datatable_toggler").text("Bootcamp Registrations");
    });

    const updateRegisteredBootcampStatus = async (status, id, e, index) => {
        await axios.post(`${process.env.REACT_APP_UPDATE_BOOTCAMP_STATUS_BY_ID}`,
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
                    let BootcampRegStatus = document.getElementById(`${id}${index}`)
                    // button to hide
                    let actionToHide = document.getElementById(e.target.id)
                    // button to show
                    let actionToShow = document.getElementById(`${BootcampRegStatus.innerHTML}${index}`)

                    actionToHide.classList.toggle("invisible")
                    actionToShow.classList.toggle("invisible")
                    BootcampRegStatus.innerHTML = status
                    BootcampRegStatus.classList = `text-${status === `CLOSED` ? 'success' : status === 'IN_TOUCH' ? 'dark' : 'warning'}`
                }
            })
            .catch(err => console.log(err))
    }

    const options = [
        { value: "programID", label: "Program ID" },
        { value: "Name", label: "Name" },
        { value: "email", label: "E-mail" },
        { value: "phone", label: "Phone" },
        { value: "status", label: "Status" }
    ]

    return (
        <Component
            dataType="bootcampRegistration"
            options={options}
            filename="bootcampRegistration"
            data={registeredBootcampData}
            setData={setRegisteredBootcampData}
            loading={loading}
            updateDataStatus={updateRegisteredBootcampStatus}
            // for pagination
            url={process.env.REACT_APP_GET_PAGINATED_BOOTCAMP_REGISTRATIONS}
            dataList={registeredBootcampList}
            setDataList={setRegisteredBootcampList}
            setLoading={setLoading}
        >
        </Component>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(BootcampRegistrationTable)