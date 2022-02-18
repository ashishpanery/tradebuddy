import { useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import $ from "jquery"
import { default as Component } from '../../components/AdminPortal/Table/DataTable/CommonDataTable'

function EventDataTable({ currentUser }) {
    const token = currentUser?.token
    const [eventList, setEventList] = useState([])
    const [loading, setLoading] = useState(true)
    const [eventData, setEventData] = useState('')

    // apply active className to the below_nav item
    $(function () {
        $("#belownav_events_item").addClass("fw-bold text-primary");
        $("#belownav_datatable_toggler").text("Events");
    });

    const updateEventStatus = async (id, status, e, index) => {
        await axios.post(`${process.env.REACT_APP_ADMIN_UPDATE_EVENT}`,
            {
                id, status

            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(resp => {
                console.log({ resp })
                if (resp.status === 200) {
                    // status to update
                    let eventStatus = document.getElementById(`${id}${index}`)

                    if (status === "APPROVED") {
                        document.getElementById(`APPROVED${index}`).classList.add("invisible")
                        document.getElementById(`DECLINED${index}`).classList.remove("invisible")
                    }
                    else {
                        document.getElementById(`APPROVED${index}`).classList.remove("invisible")
                        document.getElementById(`DECLINED${index}`).classList.add("invisible")

                    }
                    eventStatus.innerHTML = status
                    eventStatus.classList = `text-${status === `APPROVED` ? 'success' : status === 'DECLINED' ? 'dark' : 'warning'}`
                }
            })
            .catch(err => console.log(err))
    }

    const updateEvent = async (action, event, e, index, status) => {
        switch (action) {
            case "approve":
                updateEventStatus(event.id, "APPROVED", e, index)
                break
            // case "delete":
            //     await axios.delete(`${process.env.REACT_APP_DELETE_EVENT_BY_ID}/${event.id}`, {
            //         headers: {
            //             Authorization: `Bearer ${token}`
            //         }
            //     })
            //         .then(resp => {
            //             if (resp.status === 200) {
            //                 let eventObject = document.getElementById(`eventRow${index}`)
            //                 eventObject.classList.add('d-none')

            //             }
            //         })
            //         .catch(err => console.log(err))
            //     break
            default:
                updateEventStatus(event.id, "DECLINED", e, index)
        }
    }
    const options = [
        { value: "Name", label: "Name" },
        { value: "NoOfLectures", label: "Number of Lectures" },
        { value: "status", label: "Status" }
    ]
    return (
        <Component
            dataType="event"
            options={options}
            filename="event"
            data={eventData}
            setData={setEventData}
            loading={loading}
            updateData={updateEvent}
            updateDataStatus={updateEventStatus}
            // for pagination
            url={process.env.REACT_APP_ADMIN_EVENT_LIST}
            dataList={eventList}
            setDataList={setEventList}
            setLoading={setLoading}
        >
        </Component>
    )
}
const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(EventDataTable)