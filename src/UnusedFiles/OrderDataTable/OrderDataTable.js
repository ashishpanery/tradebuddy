import { useState, useEffect } from 'react'
import axios from 'axios'
import sortTable from '../SortTable/SortTable'
import { sortTableNumerically } from '../SortTable/SortTable'
import SearchTable from '../SearchTable/SearchTable'
import Select from "react-select"
import { useHistory } from 'react-router-dom'
import { Header, BelowNav, PageLoader, DownloadCSV, Pagination } from "../../../../"
import $ from "jquery"
import { connect } from 'react-redux'
import { useLocation } from "react-router-dom"
import useRedirect from '../../../../Redirect/Redirect'
import { HandleAuthorization } from "../../../../../pages"
import useHandleError from '../../../../Handlers/ErrorHandler/ErrorHandler'


function OrderDataTable({ currentUser }) {
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    if (!currentUser) redirectWithLogin()
    const token = currentUser?.token
    const [orderList, setOrderList] = useState([])
    const [loading, setLoading] = useState(true)
    const [CSVData, setCSVData] = useState('')
    const [CSVError, setCSVError] = useState('')
    const { handleError } = useHandleError(location)


    const [orderData, setOrderData] = useState('')
    // const [buttonClassList, setButtonClassList] = useState()
    const history = useHistory()
    // apply active className to the below_nav item
    $(function () {
        $("#belownav_orders_item").addClass("fw-bold text-primary");
        $("#belownav_datatable_toggler").text("Orders");

    });
    useEffect(() => {
        const getCSVData = async () => {
            await axios.get(`${process.env.REACT_APP_ADMIN_DOWNLOAD_FILE}/order`, {
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
        { value: "OrderID", label: "Order ID" },
        { value: "MenteeID", label: "Event ID" },
        { value: "orderType", label: "Order Type" },
        { value: "amount", label: "Amount" },
        { value: "status", label: "Status" },
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
                                        <h4 className="card-title">Data table</h4>
                                        {/* Download button */}
                                        <div>
                                            {CSVError ? <p>Download is not available.</p> : < DownloadCSV filename="order_data.csv" token={token} CSVData={CSVData} />}


                                        </div>
                                        {/* Search box */}
                                        <div className="d-flex justify-content-end  flex-column flex-sm-row table_search">
                                            <Select
                                                options={options}
                                                value={orderData}
                                                onChange={setOrderData}
                                                className="select_box_table"
                                            />
                                            <input readOnly={orderData !== "" ? false : true} className={`px-3 py-2 ${orderData === "" ? 'not-allowed' : null}`} id="table_search" type="text" placeholder="Search table" onKeyUp={() => SearchTable(orderData.value, "orders")} />
                                        </div>

                                        <div className="row border">
                                            <div className="col-12 px-0">
                                                <div className="table-responsive">
                                                    <table id="order-listing" className="table">
                                                        <thead>
                                                            <tr className="bg-primary text-white">
                                                                <th className="cursor-pointer" onClick={() => sortTable(0)} scope="col">ORDER ID</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(1)} scope="col">MENTEE ID</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(2)} scope="col">ORDER TYPE</th>
                                                                <th className="cursor-pointer" onClick={() => sortTableNumerically(3)} scope="col">PAYABLE AMOUNT</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(3)} scope="col">ORDERED DATE</th>
                                                                <th className="cursor-pointer" onClick={() => sortTable(4)} scope="col">STATUS</th>

                                                            </tr>
                                                        </thead>
                                                        {console.log(orderList.length)}
                                                        <tbody>
                                                            {
                                                                orderList.length > 0 ?
                                                                    orderList.map(order => {
                                                                        const { orderId, menteeId, orderType, amount, date, status } = order
                                                                        return <tr>
                                                                            <td>{orderId}</td>
                                                                            <td className='cursor-pointer' onClick={() => history.push(`/profile/${menteeId}`)}>{menteeId}</td>
                                                                            <td>{orderType}</td>
                                                                            <td className='text-center'>{amount}</td>
                                                                            <td>{date ? date : '-'}</td>
                                                                            <td className={`fw-bold ${status === "SUCCESS" ? 'text-success' : 'text-danger'}`}>{status}</td>
                                                                        </tr>

                                                                    })
                                                                    :
                                                                    <p className='pt-2'>Order list is empty</p>
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
                            url={process.env.REACT_APP_ADMIN_PAGINATED_ORDERS}
                            dataList={orderList}
                            setDataList={setOrderList}
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

export default connect(mapStateToProps)(OrderDataTable)