import "./RegisteredCourses.css"
import { connect } from 'react-redux'
import { useEffect, useState } from "react"
import axios from "axios"
import { CourseCards, PageLoader, Pagination } from ".."


function RegisteredCourses({ currentUser }) {
    const [registeredCourses, setRegisteredCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [pages, setPages] = useState([1])

    // useEffect(() => {
    //     const fetchRegisteredCourses = async () => {
    //         await axios.post(`${process.env.REACT_APP_GET_PAGINATED_COURSE_BY_MENTEE_ID}/${currentUser.data.id}`,
    //             {
    //                 pageNo: 1,
    //                 pageSize: "10"
    //             }, {
    //             headers: {
    //                 Authorization: `Bearer ${currentUser.token}`
    //             }
    //         })
    //             .then(resp => {
    //                 setRegisteredCourses(resp.data.model)
    //                 setLoading(false)
    //             })
    //             .catch(err => {
    //                 console.log(err)
    //                 setLoading(false)
    //             })
    //     }
    //     fetchRegisteredCourses()
    // }, [])
    // console.log({ courses })
    return (
        <>
            {
                loading ?
                    <>

                        <PageLoader />
                        <div className="w-80 mt-0 pt-0 mx-auto pb-3 bg-white" style={{ maxWidth: "1600px" }} >
                            <Pagination
                                url={`${process.env.REACT_APP_GET_PAGINATED_COURSE_BY_MENTEE_ID}/${currentUser.data.id}`}
                                dataList={registeredCourses}
                                setDataList={setRegisteredCourses}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                pages={pages}
                                setPages={setPages}
                                setLoading={setLoading}
                            />
                        </div>
                    </>
                    :
                    registeredCourses.length > 0 ?
                        <>
                            <div className="row p-2">
                                {
                                    registeredCourses.map((course, index) => {
                                        return <div className="col-12 col-md-6 col-xl-3 " key={index}>
                                            <CourseCards courseCard={course} index={index} slider={false} />
                                        </div>
                                    })
                                }
                            </div>
                            <div className="w-80 mt-0 pt-0 mx-auto pb-3 bg-white" style={{ maxWidth: "1600px" }} >
                                <Pagination
                                    url={`${process.env.REACT_APP_GET_PAGINATED_COURSE_BY_MENTEE_ID}/${currentUser.data.id}`}
                                    dataList={registeredCourses}
                                    setDataList={setRegisteredCourses}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    pages={pages}
                                    setPages={setPages}
                                    setLoading={setLoading}
                                />
                            </div>

                        </>
                        :
                        <div className="container" style={{ minHeight: "25em" }}>
                            <div className="row py-4 text-center">
                                <h3>You have not registered to any course yet.</h3>
                            </div>
                        </div>
            }
        </>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})
export default connect(mapStateToProps)(RegisteredCourses)