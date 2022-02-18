import { useState, useEffect } from 'react'
import axios from 'axios'
import SearchTable from "../DataTable/SearchTable/SearchTable"
import "./CommonDataTable.css"
import Select from "react-select"
import { connect } from 'react-redux'
import { Header, BelowNav, PageLoader, DownloadCSV, Pagination } from "../../../"
import { useLocation } from "react-router-dom"
import useRedirect from '../../../Redirect/Redirect'
import { HandleAuthorization } from '../../../../pages'
import useHandleError from '../../../Handlers/ErrorHandler/ErrorHandler'
import fetchHeaders from '../../FetchTableData/FetchTableHeaders'
import fetchTableBody from '../../FetchTableData/FetchTableBody'

function MentorDataTable({
    currentUser, dataType, options, filename, data,
    setData,
    loading,
    updateData,
    updateDataStatus,
    // for pagination
    url,
    dataList,
    setDataList,
    setLoading,
    loadByStatus,
    setLoadByStatus }) {
    document.title = `TradeBuddy | ${dataType} datatable | TradeBuddy`
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    if (!currentUser) redirectWithLogin()
    const token = currentUser?.token
    const [CSVData, setCSVData] = useState('')
    const [CSVError, setCSVError] = useState('')
    const { handleError } = useHandleError(location)

    const getCSVData = async () => {
        await axios.get(`${process.env.REACT_APP_ADMIN_DOWNLOAD_FILE}/${dataType}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(resp => {
                console.log(resp)
                setCSVData(resp.data)
            }).catch(err => setCSVError(handleError(err.response.status)))
    }

    // Download CSV
    useEffect(() => {
        getCSVData();
    }, [])

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
                                        {/* <h4 className="card-title text-center">Data table</h4> */}
                                        {/* Download button */}
                                        <div className='my-4 my-md-0 '>
                                            {CSVError ? <p>Download is not available.</p> : < DownloadCSV filename={`${filename}_datatable.csv`} token={token} CSVData={CSVData} />}
                                        </div>
                                        {
                                            dataType === "query" &&
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
                                        }
                                        {/* Search box */}
                                        <div className="d-flex justify-content-end  flex-column flex-sm-row  table_search">
                                            <Select
                                                options={options}
                                                value={data}
                                                onChange={setData}
                                                className="select_box_table"
                                            />
                                            <input readOnly={data !== "" ? false : true} className={`px-3 py-2 ${data === "" ? 'not-allowed' : null}`} id="table_search" type="text" placeholder="Search table" onKeyUp={() => SearchTable(data.value, dataType)} />
                                        </div>
                                        <div className="row border">
                                            <div className="col-12 px-0">
                                                <div className="table-responsive">
                                                    <table id="order-listing" className="table">
                                                        <thead>
                                                            {fetchHeaders(dataType)}
                                                        </thead>
                                                        {fetchTableBody(dataType, dataList, updateData, updateDataStatus)}
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
                            url={url}
                            dataList={dataList}
                            setDataList={setDataList}
                            setLoading={setLoading}
                            loadByStatus={loadByStatus}
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