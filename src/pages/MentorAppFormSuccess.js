import React from 'react'
import { useHistory } from 'react-router-dom'

export default function MentorAppFormSuccess() {
    const history = useHistory()
    return (
        <div style={{ height: '100vh' }} className="d-flex justify-content-center mt-5">
            <div>
                <h2 className="text-success">Form Submitted Successfully.</h2>
                <p className="text-center">We will get back to you shortly.</p>
                <div className="text-center mt-2">
                    <button onClick={() => history.push("/")} className="btn">Back to home page</button>
                </div>
            </div>
        </div>
    )
}
