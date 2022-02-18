/* eslint-disable react/jsx-no-target-blank */
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import sortTable from '../SortTable/SortTable'
import { sortTableNumerically } from '../SortTable/SortTable'
import SearchTable from '../SearchTable/SearchTable'
import Select from "react-select"
import { Header, BelowNav, PageLoader, DownloadCSV, Pagination } from "../../../../"
import "./QueryTable.css"
import $ from "jquery"
import { connect } from 'react-redux'
import { useLocation } from "react-router-dom"
import useRedirect from '../../../../Redirect/Redirect'
import { HandleAuthorization } from "../../../../../pages"
import useHandleError from '../../../../Handlers/ErrorHandler/ErrorHandler'

function QueryTable({ currentUser }) {

    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    if (!currentUser) redirectWithLogin()
    const token = currentUser?.token
    const [queryList, setQueryList] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadByStatus, setLoadByStatus] = useState({ value: "ALL", label: "ALL" })
    const [queryData, setQueryData] = useState('')
    const [CSVData, setCSVData] = useState('')
    const [CSVError, setCSVError] = useState('')
    const { handleError } = useHandleError(location)

    // apply active className to the below_nav item
    $(function () {
        $("#belownav_queries_item").addClass("fw-bold text-primary");
        $("#belownav_datatable_toggler").text("Queries");
    });

    useEffect(() => {
        const getCSVData = async () => {
            await axios.get(`${process.env.REACT_APP_ADMIN_DOWNLOAD_FILE}/query`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(resp => {
                    console.log(resp)
                    setCSVData(resp.data)
                })
                .catch(err => setCSVError(handleError(err.response.status)))
        }
        try {
            currentUser && getCSVData();

        } catch (error) {
            alert(error)
        }
    }, [])

    console.log({ CSVData })

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
                                        <div className="d-flex align-items-center gap-3">
                                            <p className="fs-6 ">Showing for: </p>
                                            <Select
                                                options={
                                                    [{ label: "All", value: "ALL" },
                                                    { label: "Open", value: "OPEN" },
                                                    { label: "Closed", value: "CLOSED" }]}
                                                value={loadByStatus}
                                                onChange={setLoadByStatus}
                                                id="filter_status"
                                                placeholder="Filter Status"
                                                className="select_box_table"
                                            />
                                        </div>

                                        {/* Download button */}
                                        <div>
                                            {CSVError ? <p>Download is not available.</p> : < DownloadCSV filename="query_data.csv" token={token} CSVData={CSVData} />}

                                        </div>
                                        {/* Search box */}
                                        {/* select for filters */}
                                        <div className='d-flex justify-content-end  flex-column flex-sm-row  table_search pe-2'>
                                            <Select
                                                options={options}
                                                value={queryData}
                                                onChange={setQueryData}
                                                className="select_box_table"
                                                id="filter_options"

                                            />
                                            {/* input value for filter  */}
                                            <input readOnly={queryData !== "" ? false : true} className={`px-3 py-2 ${queryData === "" ? 'not-allowed' : null}`} id="table_search" type="text" placeholder="Search table" onKeyUp={() => SearchTable(queryData.value, "query")} />

                                        </div>
                                        <div className="row border">
                                            <div className="col-12 px-0">
                                                <div className="table-responsive">
                                                    <table id="order-listing" className="table">
                                                        <thead>
                                                            <tr className="bg-primary text-white">
                                                                {/* <th className="cursor-pointer" onClick={() => sortTable(0)}>ID</th> */}
                                                                <th className="cursor-pointer" onClick={() => sortTable(0)}>Name </th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(1)}>E-mail </th>
                                                                <th className="cursor-pointer" onClick={() => sortTableNumerically(2)}>Phone</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(3)}>Message </th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(4)}>Status </th>
                                                                <th className='text-center'>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                queryList.map((query, index) => {
                                                                    const { id, name, mobile, email, message, status } = query
                                                                    return <tr>
                                                                        <td>{name ? <a style={{ color: "black" }} target="_blank" href={`/profile/${id}`}>{name}</a> : "-"}</td>
                                                                        <td>{email ? email : "-"}</td>
                                                                        <td>{mobile ? mobile : "-"}</td>
                                                                        <td>{message}</td>
                                                                        <td id={`${id}${index}`} className={`text-${status === `CLOSED` ? 'success' : 'warning'}`}>{status}
                                                                        </td>
                                                                        <td>
                                                                            <div className='d-flex gap-2'>
                                                                                <button id={`OPEN${index}`} onClick={(e) => updateQuery("OPEN", query, e, index)} className={`admin_action_btn btn-outline-warning ${status === "OPEN" ? 'invisible' : null}`}>Re-open</button>
                                                                                <button id={`CLOSED${index}`} onClick={(e) => updateQuery("CLOSED", query, e, index)} className={`admin_action_btn btn-outline-success  ${status === "CLOSED" ? "invisible" : null}`} >Close</button>
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
                            url={`${process.env.REACT_APP_ADMIN_SUPPORT_LIST}/${loadByStatus.value}`}
                            dataList={queryList}
                            setDataList={setQueryList}
                            setLoading={setLoading}
                            loadByStatus={loadByStatus.value}
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

export default connect(mapStateToProps)(QueryTable)