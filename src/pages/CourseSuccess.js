import React from 'react'
import "./EventSuccess.css"
import { useParams, useHistory } from 'react-router'
import { Header } from '../components'

export default function CourseSuccess() {
    window.scrollTo(0, 0)
    const history = useHistory()
    const { msg } = useParams()
    return <>
        <Header />
        <main className=" d-flex flex-column justify-content-start align-items-center event_Success mt-5 pt-5">
            {
                msg === "edit_success" ?
                    <h1 className="text-success mt-5 fs-1 px-4 text-center px-lg-0">Changes have been saved</h1>
                    :
                    <h1 className="text-success mt-5 fs-1 px-4 text-center px-lg-0">Your Course has been successfully created.</h1>
            }
            <button className="mt-3 btn" onClick={() => history.push('/my-courses')}>Go back</button>
        </main>
    </>
}
