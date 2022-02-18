import React, { useState } from 'react'
import { Header, Footer, PageLoader, CourseCards, Pagination } from "../components"
import { Helmet } from 'react-helmet'
import $ from 'jquery'

export default function Courses() {
    const [paginatedCourses, setPaginatedCourses] = useState([])
    const [loading, setLoading] = useState(true)

    //apply active className to the nav item
    $(function () {
        $("#nav_courses_item").addClass("nav_item_active");
    });

    return (
        <div>
            {
                loading ?
                    <>
                        <PageLoader />
                        <div className="w-80 mt-0 pt-0 mx-auto pb-3 bg-white" style={{ maxWidth: "1600px" }} >
                            <Pagination
                                url={process.env.REACT_APP_GET_PAGINATED_COURSE}
                                dataList={paginatedCourses}
                                setDataList={setPaginatedCourses}
                                setLoading={setLoading}
                                AuthRequired={false}
                            />
                        </div>
                    </>
                    :
                    <>
                        <header>
                            <Helmet>
                                <title>Best Courses Tailored For You - TradeBuddy  </title>
                                <meta name='description' content='Learn software engineering with our coding bootcamp online, with the help of passionate instructors and a heartful community of mentors.' charSet="utf-8" />
                            </Helmet>
                            <Header />
                        </header>
                        <main className="py-5 mt-5" style={{ minHeight: "40em" }}>
                            <h2 className='text-center my-5 '>All Courses</h2>
                            <div className="row container mx-auto">
                                {
                                    paginatedCourses.map((course, index) => {
                                        return <div className="col-12 col-md-6 col-xl-3 " key={index}>
                                            <CourseCards courseCard={course} index={index} slider={false} />
                                        </div>
                                    })
                                }
                            </div>
                            <div className="w-80 mt-0 pt-0 mx-auto pb-3 bg-white" style={{ maxWidth: "1600px" }} >
                                <Pagination
                                    url={process.env.REACT_APP_GET_PAGINATED_COURSE}
                                    dataList={paginatedCourses}
                                    setDataList={setPaginatedCourses}
                                    setLoading={setLoading}
                                    AuthRequired={false}
                                />
                            </div>
                        </main>
                        <Footer />
                    </>
            }
        </div>
    )
}