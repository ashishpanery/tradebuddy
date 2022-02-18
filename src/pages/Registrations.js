import { useState } from 'react'
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
import { Helmet } from "react-helmet"

function Registrations({ currentUser }) {
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    if (!currentUser) redirectWithLogin()
    const [registrationData, setRegistrationData] = useState([])
    const { eventID } = useParams()
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState('')


    const options = [
        { label: "Mentee ID", value: "ID" },
        { label: "Name", value: "name" },
        { label: "e-mail", value: "email" },
        { label: "Phone", value: "phone" },
        { label: "Payment Status", value: "paymentStatus" },
        { label: "Amount", value: "amount" },
    ]

    return (
        <div >
            {
                loading ?
                    <>
                        <PageLoader />
                        <div className="w-80 mt-0 pt-0 mx-auto pb-3 bg-white" style={{ maxWidth: "1600px" }} >
                            <Pagination
                                url={`${process.env.REACT_APP_GET_EVENT_REGISTRATION_BY_EVENT_ID}/${eventID}`}
                                dataList={registrationData}
                                setDataList={setRegistrationData}
                                setLoading={setLoading}
                                sort="createTS"
                            />
                        </div>
                    </>
                    :
                    <>
                        <header>
                            <Header />
                            <Helmet>
                                <title>Event Registrations - TradeBuddy  </title>
                                <meta name='description' content='Participate in Events and Learn Various New Technologies. Compete in Challenges and Earn Rewards.' charSet="utf-8" />
                            </Helmet>
                        </header>
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
                                                        <input readOnly={category !== "" ? false : true} className={`px-3 py-2 ${category === "" ? 'not-allowed' : null}`} id="table_search" type="text" placeholder="Search table" onKeyUp={() => SearchTable(category.value, "registrant")} />
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
                                                                            <th className="cursor-pointer" onClick={() => sortTableNumerically(3)}>Phone</th>
                                                                            <th className="cursor-pointer" onClick={() => sortTableNumerically(4)}>Amount</th>
                                                                            <th className="cursor-pointer" onClick={() => sortTable(5)}>Payment Status </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            registrationData.length > 0 ?
                                                                                registrationData.map((registrant, index) => {
                                                                                    const { menteeId, name, email, phoneNumber, paymentStatus, amount } = registrant
                                                                                    return <tr key={index}>
                                                                                        <td className="cursor-pointer" >{menteeId}</td>
                                                                                        <td className='cursor-pointer' onClick={() => history.push(`/profile/${menteeId}/${name.split(" ").join("-")}`)}>{name ? name : "-"}</td>
                                                                                        <td>{email ? email : "-"}</td>
                                                                                        <td>{phoneNumber ? phoneNumber : "-"}</td>
                                                                                        <td>{amount ? amount : "-"}</td>
                                                                                        <td className={`${paymentStatus === "PAYMENT_SUCCESS" ? 'text-success' : 'text-danger'}`}>{paymentStatus ? paymentStatus : "-"}</td>
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
                                    url={`${process.env.REACT_APP_GET_EVENT_REGISTRATION_BY_EVENT_ID}/${eventID}`}
                                    dataList={registrationData}
                                    setDataList={setRegistrationData}
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

export default connect(mapStateToProps)(Registrations)