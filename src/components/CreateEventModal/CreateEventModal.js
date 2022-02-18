import React from 'react'
import { useHistory } from 'react-router'

export default function CreateEventModal() {
    const history = useHistory()

    return (
        <div className="container">
            <button type="button" onClick={() => history.push(`/create_new_event`)} className="btn bg-ss text-white fw-bold">
                Create New Event
            </button>
        </div>
    )
}