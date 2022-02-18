import { useState, useEffect } from 'react'
import axios from 'axios'
import sortTable from '../SortTable/SortTable'
import { sortTableNumerically } from '../SortTable/SortTable'
import SearchTable from '../SearchTable/SearchTable'
import Select from 'react-select'
import { connect } from 'react-redux'
import { Header, BelowNav, PageLoader, DownloadCSV, Pagination } from "../../../../"
import $ from "jquery"
import { useLocation } from "react-router-dom"
import useRedirect from '../../../../Redirect/Redirect'
import { HandleAuthorization } from "../../../../../pages"
import useHandleError from '../../../../Handlers/ErrorHandler/ErrorHandler'

function MenteeDataTable({ currentUser }) {
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    if (!currentUser) redirectWithLogin()
    const token = currentUser?.token
    const [menteeList, setMenteeList] = useState([])
    const [loading, setLoading] = useState(true)
    const [menteeData, setMenteeData] = useState('')
    const [CSVData, setCSVData] = useState('')
    const [CSVError, setCSVError] = useState('')
    const { handleError } = useHandleError(location)

    // apply active className to the below_nav item
    $(function () {
        $("#belownav_mentees_item").addClass("fw-bold text-primary");
        $("#belownav_datatable_toggler").text("Mentees");

    });

    useEffect(() => {
        const getCSVData = async () => {
            await axios.get(`${process.env.REACT_APP_ADMIN_DOWNLOAD_FILE}/mentee`, {
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
                Authorization: `Bearer ${currentUser.token}`
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
        <div className={`${!loading && 'bg-primary'}`}>

            <Header />
            <HandleAuthorization user="an admin">
                <>
                    <BelowNav />
                    <div className="container-fluid pt-lg-0 pt-default page-body-wrapper admin-table-w content_below_nav" style={{ maxWidth: "1600px" }}>
                        {
                            loading ? <PageLoader />
                                :
                                <div className="content-wrapper rounded-top bg-white custom_box_shadow">

                                    <div className="card-body">
                                        <h4 className="card-title text-center">Data table</h4>
                                        {/* Download button */}
                                        <div>
                                            {CSVError ? <p>Download is not available.</p> : < DownloadCSV filename="mentee_data.csv" token={token} CSVData={CSVData} />}

                                        </div>
                                        {/* Search box */}
                                        <div className="d-flex justify-content-end  flex-column flex-sm-row table_search">
                                            <Select options={options}
                                                value={menteeData}
                                                onChange={setMenteeData}
                                                className="select_box_table"
                                            />
                                            <input readOnly={menteeData !== "" ? false : true} className={`px-3 py-2 ${menteeData === "" ? 'not-allowed' : null}`} id="table_search" type="text" placeholder="Search table" onKeyUp={() => SearchTable(menteeData.value, "mentee")} />
                                        </div>
                                        <div className="row border">
                                            <div className="col-12 px-0">
                                                <div className="table-responsive">
                                                    <table id="order-listing" className="table">
                                                        <thead>
                                                            <tr className="bg-primary text-white">
                                                                <th className="cursor-pointer" onClick={() => sortTable(0)}>Name</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(1)}>E-mail</th>
                                                                <th className="cursor-pointer" onClick={() => sortTableNumerically(2)}>Phone</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(3)}>Current Company </th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(4)}>Designation</th>
                                                                <th className="cursor-pointer" onClick={() => sortTableNumerically(5)}>Experience (Years) </th>
                                                                <th >LinkedIn</th>
                                                                <th >Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                menteeList.map((mentee, index) => {
                                                                    if (mentee === null) {
                                                                        return <h1>No data avaiable</h1>
                                                                    }
                                                                    const { id,
                                                                        name,
                                                                        phoneNumber,
                                                                        currentCompany,
                                                                        designation,
                                                                        totalExperienceYears,
                                                                        linkedinProfile,
                                                                        emailAddress
                                                                    } = mentee
                                                                    return <tr key={id} id={`menteeRow${index}`}>
                                                                        <td>{name ? <a style={{ color: "black" }} href={`/profile/${id}/${name.split(' ').join("-")}`}>{name}</a> : "-"}</td>
                                                                        <td>{emailAddress ? emailAddress : "-"}</td>
                                                                        <td>{phoneNumber ? phoneNumber : "-"}</td>
                                                                        <td>{currentCompany ? currentCompany : "-"}</td>
                                                                        <td>{designation ? designation : "-"}</td>
                                                                        <td className='text-center'>{totalExperienceYears ? totalExperienceYears : "-"}</td>
                                                                        <td>{linkedinProfile ? <a href={linkedinProfile}>Link</a> : "-"}</td>
                                                                        {/* <button id={`DELETED${index}`} onClick={() => deleteMentee(mentee, index)} className="admin_action_btn btn-outline-danger  mx-2 text-center">Delete</button> */}
                                                                        <button id={`DELETED${index}`} onClick={(e) => deleteMentee(mentee, index)} className="admin_action_btn btn-outline-danger py-2 mt-2 text-center">Delete</button>

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
                            url={process.env.REACT_APP_ADMIN_MENTEE_LIST}
                            dataList={menteeList}
                            setDataList={setMenteeList}
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

export default connect(mapStateToProps)(MenteeDataTable)