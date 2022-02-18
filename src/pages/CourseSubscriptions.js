import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router'
import sortTable from '../components/AdminPortal/Table/DataTable/SortTable/SortTable'
import { sortTableNumerically } from '../components/AdminPortal/Table/DataTable/SortTable/SortTable'
import SearchTable from "../components/AdminPortal/Table/DataTable/SearchTable/SearchTable"
import { Header, PageLoader, Pagination } from '../components'
import Select from "react-select"
import { connect } from 'react-redux'
import { useLocation } from "react-router-dom"
import useRedirect from '../components/Redirect/Redirect'
import { HandleAuthorization } from "../pages"

function CourseSubscriptions({ currentUser }) {
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    if (!currentUser) redirectWithLogin()
    const [registrationData, setRegistrationData] = useState([])
    const { courseID } = useParams()
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pages, setPages] = useState([1])

    const options = [
        { label: "Mentee ID", value: "ID" },
        { label: "Name", value: "name" },
        { label: "e-mail", value: "email" },
        { label: "Ordered Date", value: "orderDate" },
        { label: "Amount", value: "amount" },
        { label: "Payment Status", value: "paymentStatus" },
    ]

    return (
        <div >
            {
                loading ?
                    <>
                        <PageLoader />
                        <div className="w-80 mt-0 pt-0 mx-auto pb-3 bg-white" style={{ maxWidth: "1600px" }} >
                            <Pagination
                                url={`${process.env.REACT_APP_GET_PAGINATED_COURSE_REGISTRATIONS_FOR_MENTOR}/${courseID}`}
                                dataList={registrationData}
                                setDataList={setRegistrationData}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                pages={pages}
                                setPages={setPages}
                                setLoading={setLoading}
                                sort="createTS"
                            />
                        </div>
                    </>
                    :
                    <>
                        <Header />
                        <HandleAuthorization>
                            <div className="container-fluid custom_box_shadow rounded pt-lg-0 pt-default page-body-wrapper admin-table-w content_below_nav mb-5" style={{ maxWidth: "1600px" }}>
                                <div className="main-panel rounded ">
                                    {
                                        loading ?
                                            <PageLoader />
                                            :
                                            <div className="content-wrapper rounded bg-white">
                                                <div className="card-body">
                                                    <h4 className="card-title">Total Registrations: {registrationData.length}</h4>
                                                    {/* Search box */}
                                                    <div className="d-flex justify-content-end  flex-column flex-sm-row table_search">
                                                        <Select
                                                            options={options}
                                                            value={category}
                                                            onChange={setCategory}
                                                            className="select_box_table"
                                                        />
                                                        <input readOnly={category !== "" ? false : true} className={`px-3 py-2 ${category === "" ? 'not-allowed' : null}`} id="table_search" type="text" placeholder="Search table" onKeyUp={() => SearchTable(category.value, "subscriber")} />
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-12">
                                                            <div className="table-responsive">
                                                                <table id="order-listing" className="table">
                                                                    <thead>
                                                                        <tr className="bg_mentor_theme text-white">
                                                                            <th className="cursor-pointer" onClick={() => sortTable(0)}>Mentee ID</th>
                                                                            <th className="cursor-pointer" onClick={() => sortTable(1)}>Mentee Name</th>
                                                                            <th className="cursor-pointer" onClick={() => sortTable(2)}>E-mail</th>
                                                                            <th className="cursor-pointer" onClick={() => sortTableNumerically(3)}>Order Date</th>
                                                                            <th className="cursor-pointer" onClick={() => sortTable(4)}>Amount</th>
                                                                            <th className="cursor-pointer" onClick={() => sortTable(5)}>Payment Status </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            registrationData.length > 0 ?
                                                                                registrationData.map((registrant, index) => {
                                                                                    const { menteeId, menteeName, menteeEmail, orderDate, paymentStatus, amount } = registrant
                                                                                    return <tr key={index}>
                                                                                        <td className="cursor-pointer">{menteeId}</td>
                                                                                        <td className='cursor-pointer' onClick={() => history.push(`/profile/${menteeId}/${menteeName.split(" ").join("-")}`)}>{menteeName ? menteeName : "-"}</td>
                                                                                        <td>{menteeEmail ? menteeEmail : "-"}</td>
                                                                                        <td>{orderDate ? orderDate : "-"}</td>
                                                                                        <td>{amount ? amount : "-"}</td>
                                                                                        <td className={`text-${paymentStatus === "PAYMENT_SUCCESS" ? 'success' : 'danger'}`}>{paymentStatus ? paymentStatus : "-"}</td>
                                                                                    </tr>
                                                                                })
                                                                                :
                                                                                <tr>
                                                                                    <td className='pt-3 border-0'>Table is empty</td>

                                                                                </tr>
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
                            </div>
                            <div className="w-80 mt-0 pt-0 mx-auto pb-3 bg-white" style={{ maxWidth: "1600px" }} >
                                <Pagination
                                    url={`${process.env.REACT_APP_GET_PAGINATED_COURSE_REGISTRATIONS_FOR_MENTOR}/${courseID}`}
                                    dataList={registrationData}
                                    setDataList={setRegistrationData}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    pages={pages}
                                    setPages={setPages}
                                    setLoading={setLoading}
                                    sort="createTS"
                                />
                            </div>
                        </HandleAuthorization>
                    </>

            }
        </div>
    )
}
const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
    userDetails: state
})

export default connect(mapStateToProps)(CourseSubscriptions)