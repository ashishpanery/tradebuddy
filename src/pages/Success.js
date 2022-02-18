import React from 'react'

export default function Success() {
    return (
        <div className="container-fluid text-center mt-5">
            <h1 className="display-4 text-success mb-4">We Have Received Your Application</h1>
            <a style={{ textDecoration: "none", color: "black", border: "1px solid grey", padding: ".5em" }} href="/">Explore Further</a>
        </div>
    )
}
