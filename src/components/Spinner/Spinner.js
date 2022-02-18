import React from 'react'

export default function Spinner() {
    return (
        <div className="d-flex justify-content-center spinner-grow-lg" syle={{ height: "10em" }}>
            <div className="spinner-border spinner-grow-lg " style={{ height: '7em', width: '7em', color: "var(--mentor_theme)" }} role="status">
                <span className="visually-hidden text-center"></span>
            </div>
        </div>
    )
}

function SmallSpinner({ text = "Creating Your Event" }) {
    return (
        <div className="d-flex justify-content-center spinner-grow-lg">
            <h3 className="me-3">{text}</h3>
            <div className="spinner-border spinner-grow-lg " style={{ height: '3em', width: '3em' }} role="status">
                <span className="visually-hidden  text-center"></span>
            </div>
        </div>
    )
}
function PaginationLoader() {
    return (
        <div className="d-flex justify-content-center ss spinner-grow-lg">
            <div className="spinner-border spinner-grow-lg " style={{ height: '1.5em', width: '1.5em' }} role="status">
                <span className="visually-hidden text-center"></span>
            </div>
        </div>
    )
}

export { SmallSpinner, PaginationLoader }
