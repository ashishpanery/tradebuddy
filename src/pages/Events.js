import React, { useState } from 'react'
import { Header, Footer, PageLoader, UpcomingEventCard, Pagination } from "../components"
import { Helmet } from 'react-helmet'
import './Events.css'
import $ from "jquery"

export default function Events() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [pages, setPages] = useState([1])
    const [currentPage, setCurrentPage] = useState(1)

    $(function () {
        $("#nav_events_item").addClass("nav_item_active");
    });

    return (
        <>
            {loading ? <PageLoader /> :
                <>
                    <header>
                        <Helmet>
                            <meta charSet="utf-8" />
                            <title>Events | Online Events Conducted By Experienced People - TradeBuddy  </title>
                        </Helmet>
                        <Header />
                    </header>
                    <main className='events pt-default'>
                        <div className="container">
                            <div className="row h-100">
                                {
                                    events.map((event, index) => (
                                        <UpcomingEventCard key={index} eventDetails={event} disabled={true} />
                                    ))
                                }
                            </div>
                        </div>
                    </main>
                </>
            }
            <div className="w-80 mt-0 pt-0 mx-auto pb-3 bg-white" style={{ maxWidth: "1600px" }} >
                <Pagination
                    url={process.env.REACT_APP_EVENT_LIST_PAGINATED}
                    dataList={events}
                    setDataList={setEvents}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pages={pages}
                    setPages={setPages}
                    setLoading={setLoading}
                    AuthRequired={false}
                />
            </div>
            {!loading && <footer>

                <Footer />
            </footer>}
        </>
    )
}