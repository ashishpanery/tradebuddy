import React, { useState, useEffect } from 'react'
import axios from "axios"
import { connect } from "react-redux"
import sortTable from '../components/AdminPortal/Table/DataTable/SortTable/SortTable'
import SearchTable from "../components/AdminPortal/Table/DataTable/SearchTable/SearchTable"
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import Select from "react-select"
import { useHistory } from "react-router-dom"
import $ from "jquery"
import { Helmet } from 'react-helmet'
import { useLocation } from "react-router-dom"
import useRedirect from '../components/Redirect/Redirect'
import { PageLoader, Pagination } from "../components"

import { useHandleReq } from "../components"

function Orders({ currentUser }) {
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    if (!currentUser) redirectWithLogin()
    const token = currentUser && currentUser.token
    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState([])
    const [searchCategory, setSearchCategory] = useState('')
    const history = useHistory()
    const [currentPage, setCurrentPage] = useState(1)
    const [pages, setPages] = useState([1])
    // const { getData } = useHandleReq()


    $(function () {
        $("#nav_orderHistory_item").addClass("nav_item_active");
    });
    const options = [
        { value: "OrderID", label: "Order ID" },
        { value: "MenteeID", label: "Mentee ID" },
        { value: "orderType", label: "Order Type" },
        { value: "amount", label: "Amount" },
        { value: "status", label: "Status" },
    ]

    useEffect(() => {
        const getOrders = async () => {
            await axios.post(`${process.env.REACT_APP_PAGINATED_MENTEE_ORDERS}/${currentUser.data.id}`, {
                pageNo: 1,
                pageSize: 10
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                .then(resp => {
                    setOrders(resp.data.model)
                })
                .catch(err => console.log(err))

        }
        currentUser && getOrders()
    }, [])

    console.log({ orders })
    return (
        <>
            <header>
                <Header />
                <Helmet>
                    <title>Order History - TradeBuddy  </title>
                    {/* <meta name='description' content='View Orders ' charSet="utf-8" /> */}
                </Helmet>
            </header>
            {
                loading ?
                    <>
                        <PageLoader />
                        <Pagination
                            url={`${process.env.REACT_APP_PAGINATED_MENTEE_ORDERS}/${currentUser.data.id}`}
                            dataList={orders}
                            setDataList={setOrders}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            pages={pages}
                            setPages={setPages}
                            setLoading={setLoading}
                        />
                    </>
                    :
                    <>

                        <div className="container-fluid rounded pt-lg-0 pt-default page-body-wrapper admin-table-w content_below_nav" style={{ maxWidth: "1600px" }}>
                            <div className="rounded custom_box_shadow">
                                <div className="content-wrapper rounded bg-white">
                                    <div className="card-body">
                                        <h3 className='text-center'>Order History</h3>
                                        <div className="card-body">
                                            {/* Search box */}
                                            <div className="d-flex justify-content-end  flex-column flex-sm-row table_search">
                                                < Select
                                                    options={options}
                                                    value={searchCategory}
                                                    onChange={setSearchCategory}
                                                    className="select_box_table"
                                                    placeholder="Select Search Type"
                                                />
                                                <input readOnly={searchCategory !== "" ? false : true} className={`px-3 py-2 ${searchCategory !== "" ? null : 'cursor_not_allowed disabled'}`} id="table_search" type="text" placeholder="Search table" onKeyUp={() => SearchTable(searchCategory.value, "orders")} />
                                            </div>

                                            <div className="row ">
                                                <div className="col-12">
                                                    <div className="table-responsive">
                                                        <table id="order-listing" className="table">
                                                            <thead>
                                                                <tr className="bg_mentor_theme text-white">
                                                                    <th className="cursor-pointer" onClick={() => sortTable(0)} scope="col">ORDER ID</th>
                                                                    <th className="cursor-pointer" onClick={() => sortTable(1)} scope="col">MENTEE ID</th>
                                                                    <th className="cursor-pointer" onClick={() => sortTable(2)} scope="col">ORDER TYPE</th>
                                                                    <th className="cursor-pointer" onClick={() => sortTable(3)} scope="col">PAYABLE AMOUNT</th>
                                                                    <th className="cursor-pointer" onClick={() => sortTable(4)} scope="col">ORDERED DATE</th>
                                                                    <th className="cursor-pointer" onClick={() => sortTable(5)} scope="col">STATUS</th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    orders.length > 0 ?
                                                                        orders.map((order, index) => {
                                                                            const { orderId, date, menteeId, orderType, amount, status } = order
                                                                            return <tr key={index}>
                                                                                <td>{orderId}</td>
                                                                                <td className='cursor-pointer' onClick={() => history.push(`/profile/${menteeId}`)}>{menteeId}</td>
                                                                                <td>{orderType}</td>
                                                                                <td>{amount}</td>
                                                                                <td>{date}</td>
                                                                                <td className={`fw-bold ${status === "SUCCESS" ? 'text-success' : 'text-danger'}`}>{status}</td>
                                                                            </tr>

                                                                        })
                                                                        :
                                                                        <tr>
                                                                            <td className='pt-3 border-0'>Order list is empty</td>
                                                                        </tr>
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                        <div className="w-80 mt-0 pt-0 mx-auto pb-3 bg-white" style={{ maxWidth: "1600px" }} >
                            <Pagination
                                url={`${process.env.REACT_APP_PAGINATED_MENTEE_ORDERS}/${currentUser.data.id}`}
                                dataList={orders}
                                setDataList={setOrders}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                pages={pages}
                                setPages={setPages}
                                setLoading={setLoading}
                            />
                        </div>
                        <Footer />
                    </>
            }
        </>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(Orders)
