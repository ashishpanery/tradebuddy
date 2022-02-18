import { useState, useEffect } from 'react'
import axios from 'axios'
import sortTable from '../SortTable/SortTable'
import { sortTableNumerically } from '../SortTable/SortTable'
import SearchTable from '../SearchTable/SearchTable'
import "./DataTable.css"
import Select from "react-select"
import { connect } from 'react-redux'
import { Header, BelowNav, PageLoader, DownloadCSV, Pagination } from "../../../../"
import $ from "jquery"
import { useLocation } from "react-router-dom"
import useRedirect from '../../../../Redirect/Redirect'
import { HandleAuthorization } from "../../../../../pages"
import useHandleError from '../../../../Handlers/ErrorHandler/ErrorHandler'

function MentorDataTable({ currentUser }) {
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    if (!currentUser) redirectWithLogin()
    const token = currentUser?.token
    const [mentorList, setMentorList] = useState([])
    const [loading, setLoading] = useState(true)
    const [mentorData, setMentorData] = useState('')
    const [CSVData, setCSVData] = useState('')
    const [CSVError, setCSVError] = useState('')
    const { handleError } = useHandleError(location)

    // apply active className to the below_nav item
    $(function () {
        $("#belownav_mentors_item").addClass("fw-bold text-primary");
        $("#belownav_datatable_toggler").text("Mentors");

    });

    // Download CSV
    useEffect(() => {
        const getCSVData = async () => {
            await axios.get(`${process.env.REACT_APP_ADMIN_DOWNLOAD_FILE}/mentor`, {
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
        <div className={`${!loading && 'bg-primary'}`}>
            <Header />
            <HandleAuthorization user="an admin">
                <>
                    <BelowNav />
                    <div className="container-fluid rounded pt-lg-0 pt-default page-body-wrapper admin-table-w content_below_nav" style={{ maxWidth: "1600px" }}>
                        {
                            loading ? <PageLoader /> :
                                <div className="content-wrapper rounded-top bg-white">
                                    <div className="card-body">
                                        <h4 className="card-title text-center">Data table</h4>
                                        {/* Download button */}
                                        <div className='my-4 my-md-0 '>
                                            {CSVError ? <p>Download is not available.</p> : < DownloadCSV filename="mentor_data.csv" token={token} CSVData={CSVData} />}
                                        </div>
                                        {/* Search box */}
                                        <div className="d-flex justify-content-end  flex-column flex-sm-row  table_search">
                                            <Select
                                                options={options}
                                                value={mentorData}
                                                onChange={setMentorData}
                                                className="select_box_table"
                                            />
                                            <input readOnly={mentorData !== "" ? false : true} className={`px-3 py-2 ${mentorData === "" ? 'not-allowed' : null}`} id="table_search" type="text" placeholder="Search table" onKeyUp={() => SearchTable(mentorData.value, "mentor")} />
                                        </div>
                                        <div className="row border">
                                            <div className="col-12 px-0">
                                                <div className="table-responsive">
                                                    <table id="order-listing" className="table">
                                                        <thead>
                                                            <tr className="bg-primary text-white">
                                                                <th className="cursor-pointer" onClick={() => sortTable(0)}>Name </th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(1)}>E-mail </th>
                                                                <th className="cursor-pointer" onClick={() => sortTableNumerically(2)}>Phone</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(3)}>Current Company </th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(4)}>Designation</th>
                                                                <th className="cursor-pointer" onClick={() => sortTableNumerically(5)}>Experience (Years) </th>
                                                                <th >LinkedIn</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(6)}>Status </th>
                                                                <th className='text-center'>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                mentorList.map((mentor, index) => {
                                                                    const { id, name, phoneNumber, emailAddress, currentCompany, designation, totalExperienceYears, linkedinProfile, status } = mentor
                                                                    return <tr key={id} id={`mentorRow${index}`}>
                                                                        <td>{name ? <a style={{ color: "black" }} target="_blank" rel="noreferrer" href={`/profile/${id}/${name.split(" ").join("-")}`}>{name}</a> : "-"}</td>
                                                                        <td>{emailAddress ? emailAddress : "-"}</td>
                                                                        <td>{phoneNumber ? phoneNumber : "-"}</td>
                                                                        <td>{currentCompany ? currentCompany : "-"}</td>
                                                                        <td>{designation ? designation : "-"}</td>
                                                                        <td className='text-center'>{totalExperienceYears ? totalExperienceYears : "-"}</td>
                                                                        <td>{linkedinProfile ? <a href={linkedinProfile}>Link</a> : "-"}</td>
                                                                        <td id={`${id}${index}`} className={`text-${status === `APPROVED` ? 'success' : status === 'DECLINED' ? 'dark' : 'warning'}`}>
                                                                            {status}
                                                                        </td>
                                                                        <td>
                                                                            <div>
                                                                                <button id={`APPROVED${index}`} onClick={(e) => updateMentor("approve", mentor, e, index, status)} className={`admin_action_btn btn-outline-success  me-auto ${status === "APPROVED" ? 'invisible' : null}`}>Approve</button>
                                                                                <button id={`DELETED${index}`} onClick={(e) => updateMentor("delete", mentor, e, index, status)} className="admin_action_btn btn-outline-danger  mx-2 text-center">Delete</button>
                                                                                <button id={`DECLINED${index}`} onClick={(e) => updateMentor("decline", mentor, e, index, status)} className={`admin_action_btn btn-outline-dark  ms-auto ${status === "DECLINED" ? "invisible" : null}`} >Decline</button>
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
                            url={process.env.REACT_APP_ADMIN_MENTOR_LIST}
                            dataList={mentorList}
                            setDataList={setMentorList}
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

export default connect(mapStateToProps)(MentorDataTable)