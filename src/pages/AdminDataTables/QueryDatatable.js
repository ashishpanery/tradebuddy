import axios from 'axios'
import { useState } from 'react'
import { connect } from 'react-redux'
import $ from "jquery"
import { default as Component } from '../../components/AdminPortal/Table/DataTable/CommonDataTable'

function QueryTable({ currentUser }) {
    const token = currentUser?.token
    const [queryList, setQueryList] = useState([])
    const [loading, setLoading] = useState(true)
    const [queryData, setQueryData] = useState('')
    const [loadByStatus, setLoadByStatus] = useState({ value: "ALL", label: "ALL" })

    // apply active className to the below_nav item
    $(function () {
        $("#belownav_queries_item").addClass("fw-bold text-primary");
        $("#belownav_datatable_toggler").text("Queries");
    });

    const updateQueryStatus = async (id, status, e, index) => {
        await axios.post(`${process.env.REACT_APP_UPDATE_SUPPORT_STATUS_BY_ID}`,
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
                    BootcampRegStatus.classList = `text-${status === `CLOSED` ? 'success' : 'warning'}`
                }
            })
            .catch(err => console.log(err))
    }

    const updateQuery = async (action, query, e, index) => {
        switch (action) {
            case "OPEN":
                updateQueryStatus(query.id, "OPEN", e, index)
                break
            default:
                updateQueryStatus(query.id, "CLOSED", e, index)

        }
    }
    const options = [
        { value: "Name", label: "Name" },
        { value: "email", label: "E-mail" },
        { value: "phone", label: "Phone" },
        { value: "status", label: "Status" }
    ]
    return (
        <Component
            dataType="query"
            options={options}
            filename="query"
            data={queryData}
            setData={setQueryData}
            loading={loading}
            updateData={updateQuery}
            updateDataStatus={updateQueryStatus}
            // for pagination
            url={`${process.env.REACT_APP_ADMIN_SUPPORT_LIST}/${loadByStatus.value}`}
            dataList={queryList}
            setDataList={setQueryList}
            setLoading={setLoading}
            loadByStatus={loadByStatus}
            setLoadByStatus={setLoadByStatus}
        >
        </Component>

    )
}
const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(QueryTable)