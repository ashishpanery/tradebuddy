import { useState, useEffect } from 'react'
import axios from 'axios'
import sortTable from '../SortTable/SortTable'
import { sortTableNumerically } from '../SortTable/SortTable'
import SearchTable from '../SearchTable/SearchTable'
import Select from "react-select"
import { Header, BelowNav, PageLoader, DownloadCSV, Pagination } from "../../../../"
import $ from "jquery"
import { connect } from 'react-redux'
import { useLocation } from "react-router-dom"
import useRedirect from '../../../../Redirect/Redirect'
import { HandleAuthorization } from "../../../../../pages"

function BootcampRegistrationTable({ currentUser }) {
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    if (!currentUser) redirectWithLogin()
    const token = currentUser?.token
    const [registeredBootcampList, setRegisteredBootcampList] = useState([])
    const [loading, setLoading] = useState(true)
    const [categoryData, setCategoryData] = useState('')
    const [CSVData, setCSVData] = useState()
    const [CSVDownloaded, setCSVDownloaded] = useState(false)

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

    useEffect(() => {
        const getCSVData = async () => {
            await axios.get(`${process.env.REACT_APP_ADMIN_DOWNLOAD_FILE}/bootcampRegistration`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(resp => {
                    console.log(resp)
                    setCSVData(resp.data)
                    setCSVDownloaded(true)
                    // done()
                }).catch(err => console.log(err))
        }
        currentUser && getCSVData();
    }, [])

    const options = [
        { value: "programID", label: "Program ID" },
        { value: "Name", label: "Name" },
        { value: "email", label: "E-mail" },
        { value: "phone", label: "Phone" },
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
                                        {/* Download button */}
                                        <div>
                                            {CSVDownloaded && < DownloadCSV filename="registered_courses_data.csv" token={token} CSVData={CSVData} />}

                                        </div>
                                        {/* Search box */}
                                        <div className='d-flex justify-content-end  flex-column flex-sm-row  table_search pe-2'>
                                            <Select
                                                options={options}
                                                value={categoryData}
                                                onChange={setCategoryData}
                                                className=" select_box_table"
                                            />
                                            {/* input value for filter  */}
                                            <input readOnly={categoryData !== "" ? false : true} className={`px-3 py-2 ${categoryData === "" ? 'not-allowed' : null}`} id="table_search" type="text" placeholder="Search table" onKeyUp={() => SearchTable(categoryData.value, "registeredBootcamps")} />

                                        </div>
                                        <div className="row border">
                                            <div className="col-12 px-0">
                                                <div className="table-responsive">
                                                    <table id="order-listing" className="table">
                                                        <thead>
                                                            <tr className="bg-primary text-white">
                                                                {/* <th className="cursor-pointer" onClick={() => sortTable(0)}>ID</th> */}
                                                                <th className="cursor-pointer" onClick={() => sortTable(0)}>Program ID </th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(1)}>Mentee Name </th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(2)}>E-mail </th>
                                                                <th className="cursor-pointer" onClick={() => sortTableNumerically(3)}>Phone</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(4)}>Status </th>
                                                                <th className='text-center'>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                registeredBootcampList.map((registeredBootcamp, index) => {
                                                                    const { id, menteeId, menteeName, programId, mobile, email, status } = registeredBootcamp
                                                                    console.log({ registeredBootcamp })
                                                                    return <tr>
                                                                        <td>{programId ? programId : "-"}</td>
                                                                        <td>{menteeName ? <a style={{ color: "black", textDecoration: "none" }} target="_blank" rel="noreferrer" href={`/profile/${menteeId}`}>{menteeName}</a> : "-"}</td>
                                                                        <td>{email ? email : "-"}</td>
                                                                        <td>{mobile ? mobile : "-"}</td>
                                                                        <td id={`${id}${index}`} className={`text-${status === `CLOSED` ? 'success' : status === "IN_TOUCH" ? "dark" : 'warning'} `}>{status}
                                                                        </td>
                                                                        <td>
                                                                            <div className='d-flex gap-2'>
                                                                                <button id={`OPEN${index}`} onClick={(e) => updateRegisteredBootcampStatus("OPEN", id, e, index, status)} className={`admin_action_btn btn-outline-warning ${status === "OPEN" ? 'invisible' : null}`}>Re-open</button>
                                                                                <button id={`IN_TOUCH${index}`} onClick={(e) => updateRegisteredBootcampStatus("IN_TOUCH", id, e, index, status)} className={`admin_action_btn btn-outline-dark ${status === "IN_TOUCH" ? 'invisible' : null}`}>In Touch</button>
                                                                                <button id={`CLOSED${index}`} onClick={(e) => updateRegisteredBootcampStatus("CLOSED", id, e, index, status)} className={`admin_action_btn btn-outline-success  ${status === "CLOSED" ? "invisible" : null}`} >Close</button>
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
                            url={process.env.REACT_APP_GET_PAGINATED_BOOTCAMP_REGISTRATIONS}
                            dataList={registeredBootcampList}
                            setDataList={setRegisteredBootcampList}
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

export default connect(mapStateToProps)(BootcampRegistrationTable)